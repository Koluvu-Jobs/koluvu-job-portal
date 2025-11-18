import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { filename } = params;
    
    // Verify the file exists in the database (security check)
    const dbResult = await query(
      'SELECT resume_original_name, resume_size FROM mock_interview_setups WHERE resume_filename = $1',
      [filename]
    );

    if (dbResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'File not found or unauthorized' },
        { status: 404 }
      );
    }

    // Get file path
    const filePath = path.join(process.cwd(), 'uploads', 'resumes', filename);
    
    // Check if file exists on disk
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'File not found on disk' },
        { status: 404 }
      );
    }

    // Read file
    const fileBuffer = fs.readFileSync(filePath);
    const originalName = dbResult.rows[0].resume_original_name;

    // Return file with proper headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${originalName}"`,
        'Cache-Control': 'private, max-age=0',
      },
    });

  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json(
      { error: 'Failed to serve file', details: error.message },
      { status: 500 }
    );
  }
}
