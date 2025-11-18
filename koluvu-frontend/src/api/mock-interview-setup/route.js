import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const data = await req.formData();

    // --- Get all form fields ---
    const name = data.get("name");
    const role = data.get("role");
    const experience = data.get("experience");
    const interviewTypes = data.getAll("interview_types[]");
    const skills = data.getAll("skills[]");
    const language = data.get("language");
    const resumeFile = data.get("resume");

    let resumeFilename = null;

    // --- Handle File Upload ---
    if (resumeFile && resumeFile.size > 0) {
      // 1. Define the directory to save resumes
      const uploadsDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        "resumes"
      );

      // 2. Ensure the directory exists
      await fs.mkdir(uploadsDir, { recursive: true });

      // 3. Create a unique filename to prevent overwrites
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      resumeFilename = `${uniqueSuffix}-${resumeFile.name.replace(
        /\s+/g,
        "_"
      )}`;
      const filePath = path.join(uploadsDir, resumeFilename);

      // 4. Save the file
      const buffer = Buffer.from(await resumeFile.arrayBuffer());
      await fs.writeFile(filePath, buffer);
      console.log(`[API Setup] Successfully saved resume to ${filePath}`);
    } // --- Insert into Database ---
    const setupResult = await query(
      `INSERT INTO mock_interview_setups 
        (name, role, experience, interview_types, skills, language, resume_filename, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
       RETURNING id`,
      [
        name,
        role,
        experience,
        JSON.stringify(interviewTypes), // Convert array to JSON string
        JSON.stringify(skills), // Convert array to JSON string
        language,
        resumeFilename,
      ]
    );

    const setupId = setupResult.rows[0].id;
    console.log(`[API Setup] Successfully created setup with ID: ${setupId}`);

    // Create a corresponding interview session
    const sessionResult = await query(
      `INSERT INTO mock_interview_sessions (setup_id, session_status)
       VALUES ($1, 'pending')
       RETURNING id`,
      [setupId]
    );

    const sessionId = sessionResult.rows[0].id;
    console.log(
      `[API Setup] Successfully created session with ID: ${sessionId}`
    );

    return NextResponse.json(
      {
        message: "Setup completed successfully!",
        setupId: setupId,
        sessionId: sessionId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("--- CRITICAL ERROR in Setup API ---", error);
    return NextResponse.json(
      { error: "Failed to complete setup.", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const setupId = searchParams.get("id");

    if (setupId) {
      // Get specific setup
      const result = await query(
        "SELECT * FROM mock_interview_setups WHERE id = $1",
        [setupId]
      );

      if (result.rows.length === 0) {
        return NextResponse.json({ error: "Setup not found" }, { status: 404 });
      }

      return NextResponse.json(result.rows[0]);
    } else {
      // Get all setups (you might want to add pagination)
      const result = await query(
        "SELECT id, name, role, experience, resume_filename, resume_original_name, created_at FROM mock_interview_setups ORDER BY created_at DESC LIMIT 50"
      );

      return NextResponse.json(result.rows);
    }
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch interview setups", details: error.message },
      { status: 500 }
    );
  }
}
