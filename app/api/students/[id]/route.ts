import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

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
