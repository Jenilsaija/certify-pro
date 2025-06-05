import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    // Assuming a 'templates' table with similar structure to 'students' table
    const rows = await executeQuery<{ id: string; name: string; thumbnail: string | null; createdAt: Date | null }[]>('SELECT id, name, thumbnail, createdAt FROM templates');

    const templates = rows.map(row => {
      let formattedCreatedAt = null;
      if (row.createdAt) {
          try {
              const date = new Date(row.createdAt);
              if (!isNaN(date.getTime())) {
                  formattedCreatedAt = date.toISOString();
              } else {
                  console.error(`Invalid createdAt date for template ID ${row.id}:`, row.createdAt);
              }
          } catch (dateError) {
               console.error(`Failed to process createdAt for template ID ${row.id}:`, dateError);
          }
      }

      return {
        id: row.id.toString(),
        name: row.name,
        thumbnail: row.thumbnail,
        createdAt: formattedCreatedAt,
      };
    });

    return NextResponse.json(templates);

  } catch (error: any) {
    console.error('API error fetching templates:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, thumbnail, placeholders } = await request.json();

    // Basic validation
    if (!name) {
      return NextResponse.json({ message: 'Template name is required' }, { status: 400 });
    }

    // Serialize placeholders to JSON string if provided
    const placeholdersJson = placeholders ? JSON.stringify(placeholders) : null;

    // Insert the new template
    const result = await executeQuery<{ insertId: number }>(
      'INSERT INTO templates (name, thumbnail, placeholders, createdAt) VALUES (?, ?, ?, NOW())',
      [name, thumbnail, placeholdersJson]
    );

    return NextResponse.json({
      message: 'Template created successfully',
      id: result.insertId.toString()
    }, { status: 201 });

  } catch (error: any) {
    console.error('API error creating template:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
