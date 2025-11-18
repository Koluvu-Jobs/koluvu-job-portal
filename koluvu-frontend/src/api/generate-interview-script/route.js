import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Helper function to get setup details from the database
async function getSetupDetails(setupId) {
  const result = await query('SELECT * FROM mock_interview_setups WHERE id = $1', [setupId]);
  return result.rows[0];
}

export async function POST(req) {
  console.log('--- Generate Script API Start ---');
  try {
    const { setupId } = await req.json();
    console.log(`[API] Processing setupId: ${setupId}`);

    if (!setupId) {
      return NextResponse.json({ error: 'Setup ID is required' }, { status: 400 });
    }

    const setupDetails = await getSetupDetails(setupId);
    if (!setupDetails) {
      console.error(`[API] Setup not found for ID: ${setupId}`);
      return NextResponse.json({ error: 'Setup not found' }, { status: 404 });
    }
    console.log('[API] Fetched setup details from DB.');

    const { name, role, experience, interview_types, skills, language, resume_filename } = setupDetails;    // Format lists for the new prompt
    const interviewTypesList = interview_types ? interview_types.join(', ') : 'Not specified';
    const skillsList = skills ? skills.join(', ') : 'Not specified';
    
    let resumeContent = '';
    if (resume_filename) {
      console.log(`[API] Attempting to read resume file: ${resume_filename}`);
      try {
        const filePath = path.join(process.cwd(), 'public', 'uploads', 'resumes', resume_filename);
        
        // Check if file exists before trying to read it
        try {
          await fs.access(filePath);
        } catch (accessError) {
          console.error(`[API] Resume file does not exist: ${filePath}. Continuing without resume content.`);
          // Set resume_filename to null since file doesn't exist, to prevent future errors
          await query('UPDATE mock_interview_setups SET resume_filename = NULL WHERE id = $1', [setupId]);
          resume_filename = null; // Clear the variable so we don't try to read it again
        }        if (resume_filename) {
          const dataBuffer = await fs.readFile(filePath);
          
          try {
            // Use pdf2json for more reliable PDF parsing
            const PDFParser = (await import('pdf2json')).default;
            
            const pdfParser = new PDFParser();
            
            // Create a promise to handle the async PDF parsing
            const parsePDF = new Promise((resolve, reject) => {
              pdfParser.on('pdfParser_dataReady', (pdfData) => {
                try {
                  let fullText = '';
                  
                  // Extract text from all pages
                  if (pdfData.Pages) {
                    pdfData.Pages.forEach(page => {
                      if (page.Texts) {
                        page.Texts.forEach(text => {
                          if (text.R) {
                            text.R.forEach(textRun => {
                              if (textRun.T) {
                                // Decode URI component and clean up
                                const decodedText = decodeURIComponent(textRun.T);
                                fullText += decodedText + ' ';
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
              
              pdfParser.on('pdfParser_dataError', (error) => {
                reject(error);
              });
            });
            
            // Parse the PDF
            pdfParser.parseBuffer(dataBuffer);
            
            // Wait for parsing to complete
            resumeContent = await parsePDF;
            
            if (resumeContent && resumeContent.length > 0) {
              console.log('[API] ✅ Successfully parsed resume PDF with pdf2json.');
              console.log(`[API] Resume content length: ${resumeContent.length} characters`);
              console.log('[API] First 500 characters of resume:', resumeContent.substring(0, 500));
            } else {
              console.log('[API] ⚠️ PDF parsing completed but no text was extracted');
              resumeContent = '';
            }
            
          } catch (pdfError) {
            console.error('[API] Error parsing PDF with pdf2json:', pdfError.message);
            console.log('[API] Continuing without resume content...');
            resumeContent = '';
          }
        }
      } catch (fileError) {
        console.error(`[API] Error reading or parsing resume file: ${fileError.message}. Continuing without resume content.`);
      }
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let prompt = `You are a seasoned technical interviewer conducting a realistic interview simulation. Your goal is to create questions that mirror actual industry interviews, with heavy emphasis on the candidate's resume, projects, and practical experience.

=====================
🧑‍💼 CANDIDATE PROFILE
=====================
- Name: ${name}
- Target Role: ${role}
- Experience Level: ${experience}
- Interview Types: ${interviewTypesList}
- Key Skills: ${skillsList}
- Language: ${language || 'English'}

=====================
🎯 INTERVIEW SIMULATION OBJECTIVE
=====================
Generate **10 realistic interview questions** that create an authentic interview experience. Focus heavily on:

1. **PROJECT DEEP-DIVES** (40% of questions) - Dig into specific projects from resume
2. **TECHNICAL PROBLEM SOLVING** (30% of questions) - Real-world scenarios
3. **BEHAVIORAL SITUATIONS** (20% of questions) - Experience-based scenarios
4. **ROLE-SPECIFIC CHALLENGES** (10% of questions) - Position-relevant problems

=====================
🧠 QUESTION CRAFTING STRATEGY
=====================

**MANDATORY PROJECT FOCUS:**
- Ask detailed questions about specific projects mentioned in resume
- Question technology choices, architecture decisions, and challenges faced
- Probe for specific implementation details and problem-solving approaches
- Ask about project scope, team dynamics, and your individual contributions
- Inquire about lessons learned, failures, and improvements made

**REALISTIC INTERVIEW PATTERNS:**
- Start with resume walkthrough questions
- Progress to technical depth based on mentioned experience
- Include scenario-based problem solving
- Add pressure/follow-up questions naturally
- Mirror actual interview conversation flow

**DIFFICULTY CALIBRATION:**
- ${experience} level candidates should face appropriate complexity
- Fresher: Focus on fundamentals, projects, learning ability
- Mid-level: System design basics, project leadership, technical trade-offs
- Senior: Architecture decisions, team guidance, complex problem solving

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

=====================
🛠️ QUESTION EXAMPLES BY TYPE
=====================

**PROJECT QUESTIONS (Priority #1):**
- "I see you worked on [specific project from resume]. Can you walk me through the architecture you designed and why you chose that approach?"
- "You mentioned using [technology] in your [project]. What challenges did you face with it and how did you overcome them?"
- "Tell me about the most complex problem you solved in your [project name]. What was your thought process?"

**TECHNICAL SCENARIOS:**
- "How would you design a system to handle [relevant scenario for their role]?"
- "If you had to optimize [specific technology they mentioned] for scale, what would be your approach?"
- "Explain how you would debug a performance issue in [their tech stack]."

**BEHAVIORAL (Experience-based):**
- "Describe a time when you had to make a critical technical decision under tight deadlines."
- "Tell me about a project where you had to learn a new technology quickly."
- "How do you handle conflicts in code reviews or technical discussions?"

=====================
🔥 CRITICAL REQUIREMENTS
=====================
- Questions MUST be personalized based on resume content when available
- Create natural interview flow (start broad, then dive deep)
- Include follow-up pressure points
- Make questions feel conversational, not robotic
- Focus on practical experience over theoretical knowledge
- Ensure questions test both technical skills and thought process
- At least 4-5 questions should directly reference resume/project details when resume is available`;    if (resumeContent) {
      console.log('[API] ✅ RESUME CONTENT FOUND - Adding to prompt');
      console.log(`[API] Resume content preview: ${resumeContent.substring(0, 200)}...`);
      
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
      console.log('[API] ❌ NO RESUME CONTENT - Using generic questions');
      
      prompt += `\n\n=====================\n⚠️ NO RESUME PROVIDED\n=====================\nSince no resume is available, focus on:
1. General project-based questions for their experience level
2. Common technology scenarios for their target role
3. Hypothetical project situations they might have encountered
4. Ask them to describe their best/most challenging project in detail`;
    }

    prompt += `\n\n🔥 **FINAL REMINDER**: If resume content was provided above, you MUST create questions that directly reference specific details from that resume. Do not use generic placeholders - use the actual project names, company names, and technologies mentioned in the candidate's resume.

Generate the questions now in **pure JSON array format**:`;    console.log("--------------------");
    console.log("[API] RESUME DEBUG INFO:");
    console.log(`[API] Resume filename: ${resume_filename}`);
    console.log(`[API] Resume content available: ${resumeContent ? 'YES' : 'NO'}`);
    console.log(`[API] Resume content length: ${resumeContent ? resumeContent.length : 0} characters`);
    console.log("[API] -------- FULL PROMPT BEING SENT TO AI --------");
    console.log(prompt);
    console.log("[API] -------- END OF PROMPT --------");
    console.log("--------------------");

    console.log('[API] Sending prompt to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    const text = await response.text();
    console.log('[API] Received response from Gemini.');

    let generatedScript;
    try {
      // More robust JSON extraction to find the array within the response
      const jsonStart = text.indexOf('[');
      const jsonEnd = text.lastIndexOf(']');

      if (jsonStart === -1 || jsonEnd === -1) {
        console.error("[API] No valid JSON array found in the AI's response. Response was:", text);
        throw new Error("No valid JSON array found in the AI's response.");
      }

      // Extract and parse only the JSON array part of the response
      const jsonString = text.substring(jsonStart, jsonEnd + 1);
      generatedScript = JSON.parse(jsonString);

    } catch (parseError) {
      console.error('[API] CRITICAL: Failed to parse Gemini response as JSON. Response was:', text);
      return NextResponse.json({ error: 'Failed to parse AI response. The response was not valid JSON.', details: text }, { status: 500 });
    }
    
    console.log('[API] Successfully parsed Gemini JSON response.');    const scriptInsertResult = await query(
      'INSERT INTO interview_scripts (setup_id, script_data, questions_count, language) VALUES ($1, $2, $3, $4) RETURNING id',
      [setupId, JSON.stringify(generatedScript), generatedScript.length, language || 'English']
    );
    const scriptId = scriptInsertResult.rows[0].id;
    console.log(`[API] Script saved to DB with ID: ${scriptId}`);
    console.log('--- Generate Script API End ---');

    return NextResponse.json({
      message: 'Interview script generated and saved successfully',
      scriptId: scriptId,
      setupId: setupId,
    });

  } catch (error) {
    console.error('--- CRITICAL ERROR in Generate Script API ---', error);
    return NextResponse.json({ error: 'Failed to generate interview script', details: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const scriptId = searchParams.get('scriptId');
    const sessionId = searchParams.get('sessionId');
    const setupId = searchParams.get('setupId');

    if (scriptId) {
      // Get specific script by ID
      const result = await query(
        'SELECT * FROM interview_scripts WHERE id = $1',
        [scriptId]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Script not found' },
          { status: 404 }
        );
      }

      const script = result.rows[0];
      return NextResponse.json({
        success: true,
        script: {
          id: script.id,
          setupId: script.setup_id,
          sessionId: script.session_id,
          data: script.script_data,
          questionsCount: script.questions_count,
          estimatedDuration: script.estimated_duration,
          language: script.language,
          generatedAt: script.generated_at
        }
      });

    } else if (sessionId) {
      // Get script by session ID
      const result = await query(
        'SELECT * FROM interview_scripts WHERE session_id = $1',
        [sessionId]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'No script found for this session' },
          { status: 404 }
        );
      }

      const script = result.rows[0];
      return NextResponse.json({
        success: true,
        script: {
          id: script.id,
          setupId: script.setup_id,
          sessionId: script.session_id,
          data: script.script_data,
          questionsCount: script.questions_count,
          estimatedDuration: script.estimated_duration,
          language: script.language,
          generatedAt: script.generated_at
        }
      });    } else {
      // Get all scripts (for admin view)
      const result = await query(`
        SELECT 
          s.id,
          s.setup_id,
          s.session_id,
          s.questions_count,
          s.estimated_duration,
          s.language,
          s.generated_at,
          m.name,
          m.role,
          m.experience
        FROM interview_scripts s
        LEFT JOIN mock_interview_setups m ON s.setup_id = m.id
        ORDER BY s.generated_at DESC
        LIMIT 50
      `);

      return NextResponse.json({
        success: true,
        scripts: result.rows.map(row => ({
          id: row.id,
          setupId: row.setup_id,
          sessionId: row.session_id,
          questionsCount: row.questions_count,
          estimatedDuration: row.estimated_duration,
          language: row.language,
          generatedAt: row.generated_at,
          candidate: {
            name: row.name || 'Unknown',
            role: row.role || 'No Role',
            experience: row.experience || 'Not specified'
          }
        }))
      });
    }

  } catch (error) {
    console.error('❌ Error fetching interview scripts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interview scripts', details: error.message },
      { status: 500 }
    );
  }
}
