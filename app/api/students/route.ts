import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    const rows = await executeQuery<{ id: string; name: string; email: string; courses: string; addedAt: Date }[]>('SELECT id, name, email, courses, addedAt FROM students');

    const students = rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      email: row.email,
      courses: row.courses ? JSON.parse(row.courses) : [],
      addedAt: row.addedAt ? new Date(row.addedAt).toISOString() : null,
    }));
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
