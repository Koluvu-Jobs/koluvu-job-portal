import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Helper function to get setup details from the database
async function getSetupDetails(setupId) {
  const result = await query(
    "SELECT * FROM mock_interview_setups WHERE id = $1",
    [setupId]
  );
  return result.rows[0];
}

export async function POST(req) {
  console.log("--- Generate Script API Start ---");
  try {
    const { setupId } = await req.json();
    console.log(`[API] Processing setupId: ${setupId}`);

    if (!setupId) {
      return NextResponse.json(
        { error: "Setup ID is required" },
        { status: 400 }
      );
    }

    const setupDetails = await getSetupDetails(setupId);
    if (!setupDetails) {
      console.error(`[API] Setup not found for ID: ${setupId}`);
      return NextResponse.json({ error: "Setup not found" }, { status: 404 });
    }
    console.log("[API] Fetched setup details from DB.");

    const {
      name,
      role,
      experience,
      interview_types,
      skills,
      language,
      resume_filename,
    } = setupDetails;
    // Format lists for the new prompt
    const interviewTypesList = interview_types
      ? interview_types.join(", ")
      : "Not specified";
    const skillsList = skills ? skills.join(", ") : "Not specified";

    let resumeContent = "";
    if (resume_filename) {
      console.log(`[API] Attempting to read resume file: ${resume_filename}`);
      try {
        const filePath = path.join(
          process.cwd(),
          "public",
          "uploads",
          "resumes",
          resume_filename
        );

        // Check if file exists before trying to read it
        try {
          await fs.access(filePath);
        } catch (accessError) {
          console.error(
            `[API] Resume file does not exist: ${filePath}. Continuing without resume content.`
          );
          // Set resume_filename to null since file doesn't exist, to prevent future errors
          await query(
            "UPDATE mock_interview_setups SET resume_filename = NULL WHERE id = $1",
            [setupId]
          );
          resume_filename = null; // Clear the variable so we don't try to read it again
        }

        if (resume_filename) {
          const dataBuffer = await fs.readFile(filePath);

          try {
            // Use pdf2json for more reliable PDF parsing
            const PDFParser = (await import("pdf2json")).default;

            const pdfParser = new PDFParser();

            // Create a promise to handle the async PDF parsing
            const parsePDF = new Promise((resolve, reject) => {
              pdfParser.on("pdfParser_dataReady", (pdfData) => {
                try {
                  let fullText = "";

                  // Extract text from all pages
                  if (pdfData.Pages) {
                    pdfData.Pages.forEach((page) => {
                      if (page.Texts) {
                        page.Texts.forEach((text) => {
                          if (text.R) {
                            text.R.forEach((textRun) => {
                              if (textRun.T) {
                                // Decode URI component and clean up
                                const decodedText = decodeURIComponent(
                                  textRun.T
                                );
                                fullText += decodedText + " ";
                              }
                            });
                          }
                        });
                      }
                    });
                  }

                  resolve(fullText.trim());
                } catch (extractError) {
                  reject(extractError);
                }
              });

              pdfParser.on("pdfParser_dataError", (error) => {
                reject(error);
              });
            });

            // Parse the PDF
            pdfParser.parseBuffer(dataBuffer);

            // Wait for parsing to complete
            resumeContent = await parsePDF;

            if (resumeContent && resumeContent.length > 0) {
              console.log(
                "[API] ✅ Successfully parsed resume PDF with pdf2json."
              );
              console.log(
                `[API] Resume content length: ${resumeContent.length} characters`
              );
              console.log(
                "[API] First 500 characters of resume:",
                resumeContent.substring(0, 500)
              );
            } else {
              console.log(
                "[API] ⚠️ PDF parsing completed but no text was extracted"
              );
              resumeContent = "";
            }
          } catch (pdfError) {
            console.error(
              "[API] Error parsing PDF with pdf2json:",
              pdfError.message
            );
            console.log("[API] Continuing without resume content...");
            resumeContent = "";
          }
        }
      } catch (fileError) {
        console.error(
          `[API] Error reading or parsing resume file: ${fileError.message}. Continuing without resume content.`
        );
      }
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = `You are a seasoned technical interviewer conducting a realistic interview simulation. Your goal is to create questions that mirror actual industry interviews, with heavy emphasis on the candidate's resume, projects, and practical experience.

=====================
🧑‍💼 CANDIDATE PROFILE
=====================
- Name: ${name}
- Target Role: ${role}
- Experience Level: ${experience}
- Interview Types: ${interviewTypesList}
- Key Skills: ${skillsList}
- Language: ${language || "English"}

=====================
🎯 INTERVIEW SIMULATION OBJECTIVE
=====================
Generate **10 realistic interview questions** that create an authentic interview experience. Focus heavily on:

1. **PROJECT DEEP-DIVES** (40% of questions) - Dig into specific projects from resume
2. **TECHNICAL PROBLEM SOLVING** (30% of questions) - Real-world scenarios
3. **BEHAVIORAL SITUATIONS** (20% of questions) - Experience-based scenarios
4. **ROLE-SPECIFIC CHALLENGES** (10% of questions) - Position-relevant problems

=====================
📤 OUTPUT FORMAT - STRICT JSON
=====================
Return ONLY a valid JSON array starting with [ and ending with ]. No explanations or markdown.

Structure:
[
  {
    "id": 1,
    "type": "project | technical | behavioral | hr",
    "question": "Natural, conversational question as a real interviewer would ask",
    "difficulty": "easy | medium | hard",
    "expectedDuration": 180,
    "skills": ["relevant", "technical", "skills"],
    "category": "resume_analysis | problem_solving | experience_based | role_specific"
  }
]

Generate the questions now in **pure JSON array format**:`;

    if (resumeContent) {
      console.log("[API] ✅ RESUME CONTENT FOUND - Adding to prompt");
      console.log(
        `[API] Resume content preview: ${resumeContent.substring(0, 200)}...`
      );

      prompt += `\n\n=====================\n📄 CANDIDATE'S ACTUAL RESUME CONTENT\n=====================\n${resumeContent}\n\n=====================\n🚨 MANDATORY RESUME-BASED REQUIREMENTS\n=====================\n
**YOU MUST ANALYZE THE RESUME ABOVE AND:**

1. **IDENTIFY SPECIFIC PROJECTS**: Find actual project names, technologies, and companies mentioned
2. **EXTRACT CONCRETE DETAILS**: Look for specific achievements, metrics, technologies used
3. **REFERENCE ACTUAL EXPERIENCE**: Use real company names, project names, and technologies from the resume

**REQUIRED QUESTION TYPES (MUST INCLUDE):**
- "I see from your resume that you worked on [EXACT PROJECT NAME]. Can you explain [SPECIFIC TECHNICAL DETAIL FROM RESUME]?"
- "You mentioned [SPECIFIC TECHNOLOGY/FRAMEWORK] in your [SPECIFIC PROJECT]. What challenges did you face?"
- "During your time at [EXACT COMPANY NAME], you [SPECIFIC ACHIEVEMENT FROM RESUME]. How did you accomplish this?"
- "Your resume shows you have experience with [SPECIFIC TECH STACK]. Can you walk me through how you used it in [SPECIFIC PROJECT]?"

**CRITICAL INSTRUCTIONS:**
- Replace ALL bracketed placeholders with ACTUAL information from the resume above
- At least 6 out of 10 questions MUST directly quote or reference specific resume content
- Do NOT use generic project names - use the actual project names from the resume
- Do NOT use placeholder company names - use the actual companies mentioned
- Quote specific technologies, frameworks, and achievements exactly as written in the resume

**If you cannot find specific project details in the resume, then:**
- Ask about the most recent work experience mentioned
- Reference specific job titles and companies from the resume
- Ask about technologies listed in the skills section with context from their work history`;
    } else {
      console.log("[API] ❌ NO RESUME CONTENT - Using generic questions");

      prompt += `\n\n=====================\n⚠️ NO RESUME PROVIDED\n=====================\nSince no resume is available, focus on:
1. General project-based questions for their experience level
2. Common technology scenarios for their target role
3. Hypothetical project situations they might have encountered
4. Ask them to describe their best/most challenging project in detail`;
    }

    prompt += `\n\n🔥 **FINAL REMINDER**: If resume content was provided above, you MUST create questions that directly reference specific details from that resume. Do not use generic placeholders - use the actual project names, company names, and technologies mentioned in the candidate's resume.

Generate the questions now in **pure JSON array format**:`;

    console.log("--------------------");
    console.log("[API] RESUME DEBUG INFO:");
    console.log(`[API] Resume filename: ${resume_filename}`);
    console.log(
      `[API] Resume content available: ${resumeContent ? "YES" : "NO"}`
    );
    console.log(
      `[API] Resume content length: ${
        resumeContent ? resumeContent.length : 0
      } characters`
    );
    console.log("--------------------");

    console.log("[API] Sending prompt to Gemini...");
    const result = await model.generateContent(prompt);
    const response = await result.response;

    const text = await response.text();
    console.log("[API] Received response from Gemini.");

    let generatedScript;
    try {
      // More robust JSON extraction to find the array within the response
      const jsonStart = text.indexOf("[");
      const jsonEnd = text.lastIndexOf("]");

      if (jsonStart === -1 || jsonEnd === -1) {
        console.error(
          "[API] No valid JSON array found in the AI's response. Response was:",
          text
        );
        throw new Error("No valid JSON array found in the AI's response.");
      }

      // Extract and parse only the JSON array part of the response
      const jsonString = text.substring(jsonStart, jsonEnd + 1);
      generatedScript = JSON.parse(jsonString);
    } catch (parseError) {
      console.error(
        "[API] CRITICAL: Failed to parse Gemini response as JSON. Response was:",
        text
      );
      return NextResponse.json(
        {
          error:
            "Failed to parse AI response. The response was not valid JSON.",
          details: text,
        },
        { status: 500 }
      );
    }

    console.log("[API] Successfully parsed Gemini JSON response.");

    // Store the generated script in the database
    const scriptInsertResult = await query(
      "INSERT INTO interview_scripts (setup_id, questions_data) VALUES ($1, $2) RETURNING id",
      [setupId, JSON.stringify(generatedScript)]
    );

    console.log(
      "[API] Script stored in database with ID:",
      scriptInsertResult.rows[0].id
    );
    console.log("--- Generate Script API End ---");

    return NextResponse.json({
      success: true,
      script: generatedScript,
      scriptId: scriptInsertResult.rows[0].id,
    });
  } catch (error) {
    console.error("[API] ERROR in generate-interview-script:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
