import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json({ message: 'Valid student ID is required' }, { status: 400 });
    }

    const results = await executeQuery<any[]>(
      'SELECT id, name, email, courses FROM students WHERE id = ?',
      [id]
    );

    if (results.length === 0) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    // Assuming only one student is returned for a given ID
    const student = results[0];

    return NextResponse.json(student, { status: 200 });

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}


export async function DELETE(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json({ message: 'Valid student ID is required' }, { status: 400 });
    }

    const result = await executeQuery<{ affectedRows: number }>(
      'DELETE FROM students WHERE id = ?',
      [id]
    );

    const affectedRows = result.affectedRows;

    if (affectedRows === 0) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Student deleted successfully' }, { status: 200 });

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const { name, email, courses } = await request.json();

    if (!id) {
      return NextResponse.json({ message: 'Valid student ID is required' }, { status: 400 });
    }

    // Basic validation
    if (!name || !email) {
        return NextResponse.json({ message: 'Name and email are required' }, { status: 400 });
    }

    const result = await executeQuery<{ affectedRows: number }>(
      'UPDATE students SET name = ?, email = ?, courses = ? WHERE id = ?',
      [name, email, courses, id]
    );

    const affectedRows = result.affectedRows;

    if (affectedRows === 0) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Student updated successfully' }, { status: 200 });

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
