import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const rows = await executeQuery<any[]>(
      `SELECT c.id, c.certificateId, c.courseName, c.completionDate, c.instructorName, c.certificateData, c.createdAt,
              s.id as studentId, s.name as studentName, s.email as studentEmail,
              t.id as templateId, t.name as templateName
       FROM certificates c
       JOIN students s ON c.studentId = s.id
       JOIN templates t ON c.templateId = t.id`
    );

    const certificates = rows.map(row => {
      let formattedCompletionDate = null;
      let formattedCreatedAt = null;
      
      if (row.completionDate) {
        try {
          const date = new Date(row.completionDate);
          if (!isNaN(date.getTime())) {
            formattedCompletionDate = date.toISOString();
          }
        } catch (dateError) {
          console.error(`Failed to process completionDate for certificate ID ${row.certificateId}:`, dateError);
        }
      }

      if (row.createdAt) {
        try {
          const date = new Date(row.createdAt);
          if (!isNaN(date.getTime())) {
            formattedCreatedAt = date.toISOString();
          }
        } catch (dateError) {
          console.error(`Failed to process createdAt for certificate ID ${row.certificateId}:`, dateError);
        }
      }

      return {
        id: row.id.toString(),
        certificateId: row.certificateId,
        courseName: row.courseName,
        completionDate: formattedCompletionDate,
        instructorName: row.instructorName,
        certificateData: row.certificateData,
        createdAt: formattedCreatedAt,
        student: {
          id: row.studentId.toString(),
          name: row.studentName,
          email: row.studentEmail
        },
        template: {
          id: row.templateId.toString(),
          name: row.templateName
        }
      };
    });

    return NextResponse.json(certificates);
  } catch (error: any) {
    console.error('API error fetching certificates:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { templateId, studentIds, courseName, completionDate, instructorName } = await request.json();

    // Basic validation
    if (!templateId || !studentIds || !Array.isArray(studentIds) || studentIds.length === 0 || !courseName || !completionDate || !instructorName) {
      return NextResponse.json({ 
        message: 'Missing required fields: templateId, studentIds (array), courseName, completionDate, instructorName' 
      }, { status: 400 });
    }

    // Check if template exists
    const templateResults = await executeQuery<any[]>('SELECT id, name, thumbnail, placeholders FROM templates WHERE id = ?', [templateId]);
    if (templateResults.length === 0) {
      return NextResponse.json({ message: 'Template not found' }, { status: 404 });
    }
    const template = templateResults[0];

    // Process each student
    const results = [];
    for (const studentId of studentIds) {
      // Check if student exists
      const studentResults = await executeQuery<any[]>('SELECT id, name, email FROM students WHERE id = ?', [studentId]);
      if (studentResults.length === 0) {
        results.push({ studentId, success: false, message: 'Student not found' });
        continue;
      }
      const student = studentResults[0];

      // Generate a unique certificate ID
      const certificateId = `CERT-${uuidv4().substring(0, 8).toUpperCase()}`;

      // Generate certificate data (in a real app, this would create the actual certificate image)
      // For now, we'll just store the base64 thumbnail from the template
      const certificateData = template.thumbnail;

      // Insert the certificate record
      const insertResult = await executeQuery<{ insertId: number }>(
        'INSERT INTO certificates (certificateId, templateId, studentId, courseName, completionDate, instructorName, certificateData, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
        [certificateId, templateId, studentId, courseName, new Date(completionDate), instructorName, certificateData]
      );

      results.push({
        studentId,
        studentName: student.name,
        studentEmail: student.email,
        certificateId,
        success: true,
        id: insertResult.insertId.toString()
      });
    }

    return NextResponse.json({
      message: 'Certificates generated successfully',
      results
    }, { status: 201 });

  } catch (error: any) {
    console.error('API error generating certificates:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}