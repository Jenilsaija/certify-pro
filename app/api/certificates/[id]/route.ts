import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET(request: Request, context: { params: { id: string } }) {
  try {
    // Get ID from request body instead of URL parameter
    const body = await request.json().catch(() => ({}));
    const id = body.id || context.params.id; // Fallback to URL parameter if body.id is not provided

    if (!id) {
      return NextResponse.json({ message: 'Valid certificate ID is required' }, { status: 400 });
    }

    const results = await executeQuery<any[]>(
      `SELECT c.id, c.certificateId, c.courseName, c.completionDate, c.instructorName, c.certificateData, c.createdAt,
              s.id as studentId, s.name as studentName, s.email as studentEmail,
              t.id as templateId, t.name as templateName
       FROM certificates c
       JOIN students s ON c.studentId = s.id
       JOIN templates t ON c.templateId = t.id
       WHERE c.id = ?`,
      [id]
    );

    if (results.length === 0) {
      return NextResponse.json({ message: 'Certificate not found' }, { status: 404 });
    }

    const certificate = results[0];
    let formattedCompletionDate = null;
    let formattedCreatedAt = null;
    
    if (certificate.completionDate) {
      try {
        const date = new Date(certificate.completionDate);
        if (!isNaN(date.getTime())) {
          formattedCompletionDate = date.toISOString();
        }
      } catch (dateError) {
        console.error(`Failed to process completionDate for certificate ID ${certificate.id}:`, dateError);
      }
    }

    if (certificate.createdAt) {
      try {
        const date = new Date(certificate.createdAt);
        if (!isNaN(date.getTime())) {
          formattedCreatedAt = date.toISOString();
        }
      } catch (dateError) {
        console.error(`Failed to process createdAt for certificate ID ${certificate.id}:`, dateError);
      }
    }

    return NextResponse.json({
      id: certificate.id.toString(),
      certificateId: certificate.certificateId,
      courseName: certificate.courseName,
      completionDate: formattedCompletionDate,
      instructorName: certificate.instructorName,
      certificateData: certificate.certificateData,
      createdAt: formattedCreatedAt,
      student: {
        id: certificate.studentId.toString(),
        name: certificate.studentName,
        email: certificate.studentEmail
      },
      template: {
        id: certificate.templateId.toString(),
        name: certificate.templateName
      }
    });

  } catch (error: any) {
    console.error('API error fetching certificate:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
  try {
    // Get ID from request body instead of URL parameter
    const body = await request.json().catch(() => ({}));
    const id = body.id || context.params.id; // Fallback to URL parameter if body.id is not provided

    if (!id) {
      return NextResponse.json({ message: 'Valid certificate ID is required' }, { status: 400 });
    }

    const result = await executeQuery<{ affectedRows: number }>(
      'DELETE FROM certificates WHERE id = ?',
      [id]
    );

    const affectedRows = result.affectedRows;

    if (affectedRows === 0) {
      return NextResponse.json({ message: 'Certificate not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Certificate deleted successfully' }, { status: 200 });

  } catch (error: any) {
    console.error('API error deleting certificate:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}