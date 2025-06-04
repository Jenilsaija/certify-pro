import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    const rows = await executeQuery<{ id: string; name: string; email: string; courses: string | null; addedAt: Date | null }[]>('SELECT id, name, email, courses, addedAt FROM students');

    const students = rows.map(row => {
      let parsedCourses = [];
      if (row.courses) {
        try {
          parsedCourses = JSON.parse(row.courses);
          // Ensure parsedCourses is an array, default to empty array if not
          if (!Array.isArray(parsedCourses)) {
              parsedCourses = [];
          }
        } catch (parseError) {
          console.error(`Failed to parse courses for student ID ${row.id}:`, parseError);
          // Default to empty array on parse error
          parsedCourses = [];
        }
      }

      let formattedAddedAt = null;
      if (row.addedAt) {
          try {
              const date = new Date(row.addedAt);
              // Check if the date is valid
              if (!isNaN(date.getTime())) {
                  formattedAddedAt = date.toISOString();
              } else {
                  console.error(`Invalid addedAt date for student ID ${row.id}:`, row.addedAt);
              }
          } catch (dateError) {
               console.error(`Failed to process addedAt for student ID ${row.id}:`, dateError);
          }
      }


      return {
        id: row.id.toString(),
        name: row.name,
        email: row.email,
        courses: parsedCourses,
        addedAt: formattedAddedAt,
      };
    });

    return NextResponse.json(students);

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();
    if (!name || !email) {
      return NextResponse.json({ message: 'Name and email are required' }, { status: 400 });
    }

    const result = await executeQuery<{ insertId: number }>(
      'INSERT INTO students (name, email, courses, addedAt) VALUES (?, ?, ?, ?)',
      [name, email, JSON.stringify([]), new Date()]
    );

    const insertId = result.insertId;
    return NextResponse.json({ id: insertId.toString(), name, email, courses: [], addedAt: new Date().toISOString(), message: 'Student created successfully' }, { status: 201 });

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
