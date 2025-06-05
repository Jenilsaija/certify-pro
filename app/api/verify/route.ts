import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { certificateId } = await request.json();

    // Basic validation
    if (!certificateId) {
      return NextResponse.json({ message: 'Certificate ID is required' }, { status: 400 });
    }

    // Query the database for the certificate
    const certificateResults = await executeQuery<any[]>(
      `SELECT c.id, c.certificateId, c.courseName, c.completionDate, c.instructorName, 
              s.name as studentName, s.email as studentEmail, 
              t.name as templateName
       FROM certificates c
       JOIN students s ON c.studentId = s.id
       JOIN templates t ON c.templateId = t.id
       WHERE c.certificateId = ?`,
      [certificateId]
    );

    if (certificateResults.length === 0) {
      return NextResponse.json({ 
        isValid: false,
        message: 'Certificate not found' 
      }, { status: 200 });
    }

    const certificate = certificateResults[0];
    let formattedCompletionDate = null;
    
    if (certificate.completionDate) {
      try {
        const date = new Date(certificate.completionDate);
        if (!isNaN(date.getTime())) {
          formattedCompletionDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format
        }
      } catch (dateError) {
        console.error(`Failed to process completionDate for certificate ID ${certificate.certificateId}:`, dateError);
      }
    }

    return NextResponse.json({
      isValid: true,
      certificateId: certificate.certificateId,
      studentName: certificate.studentName,
      studentEmail: certificate.studentEmail,
      courseName: certificate.courseName,
      completionDate: formattedCompletionDate,
      issueDate: formattedCompletionDate, // For compatibility with the frontend
      instructorName: certificate.instructorName,
      templateName: certificate.templateName
    }, { status: 200 });

  } catch (error: any) {
    console.error('API error verifying certificate:', error);
    return NextResponse.json({ 
      isValid: false,
      message: 'Internal server error', 
      error: error.message 
    }, { status: 500 });
  }
}