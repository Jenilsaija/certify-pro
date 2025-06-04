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

// You might also want to add POST, PUT, DELETE routes for templates
// For now, let's focus on the GET route to display templates.
