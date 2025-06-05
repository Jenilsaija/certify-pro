import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json({ message: 'Valid template ID is required' }, { status: 400 });
    }

    const results = await executeQuery<any[]>(
      'SELECT id, name, thumbnail, createdAt, placeholders FROM templates WHERE id = ?',
      [id]
    );

    if (results.length === 0) {
      return NextResponse.json({ message: 'Template not found' }, { status: 404 });
    }

    const template = results[0];
    let placeholders = [];
    
    // Parse placeholders if they exist
    if (template.placeholders) {
      try {
        placeholders = JSON.parse(template.placeholders);
      } catch (error) {
        console.error('Error parsing placeholders:', error);
      }
    }

    let formattedCreatedAt = null;
    if (template.createdAt) {
      try {
        const date = new Date(template.createdAt);
        if (!isNaN(date.getTime())) {
          formattedCreatedAt = date.toISOString();
        }
      } catch (error) {
        console.error('Error formatting date:', error);
      }
    }

    return NextResponse.json({
      id: template.id.toString(),
      name: template.name,
      thumbnail: template.thumbnail,
      createdAt: formattedCreatedAt,
      placeholders: placeholders
    });

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const { name, placeholders } = await request.json();

    if (!id) {
      return NextResponse.json({ message: 'Valid template ID is required' }, { status: 400 });
    }

    // Basic validation
    if (!name) {
      return NextResponse.json({ message: 'Template name is required' }, { status: 400 });
    }

    // Check if template exists
    const checkResults = await executeQuery<any[]>('SELECT id FROM templates WHERE id = ?', [id]);
    if (checkResults.length === 0) {
      return NextResponse.json({ message: 'Template not found' }, { status: 404 });
    }

    // Serialize placeholders to JSON string
    const placeholdersJson = placeholders ? JSON.stringify(placeholders) : null;

    // Update the template
    await executeQuery(
      'UPDATE templates SET name = ?, placeholders = ?, updatedAt = NOW() WHERE id = ?',
      [name, placeholdersJson, id]
    );

    return NextResponse.json({ message: 'Template updated successfully' });

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json({ message: 'Valid template ID is required' }, { status: 400 });
    }

    const result = await executeQuery<{ affectedRows: number }>(
      'DELETE FROM templates WHERE id = ?',
      [id]
    );

    const affectedRows = result.affectedRows;

    if (affectedRows === 0) {
      return NextResponse.json({ message: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Template deleted successfully' }, { status: 200 });

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}