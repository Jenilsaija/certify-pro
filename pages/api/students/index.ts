import { NextApiRequest, NextApiResponse } from 'next';
import { executeQuery } from '@/lib/db'; // Import the executeQuery function

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        // Fetch all students using executeQuery
        const rows = await executeQuery<{ id: string; name: string; email: string; courses: string; addedAt: Date }[]>('SELECT id, name, email, courses, addedAt FROM students');
        
        // Assuming 'courses' is stored as a JSON string or similar, parse it if necessary
        // Ensure id is string for consistency with frontend Student interface
        const students = rows.map(row => ({
          id: row.id.toString(), 
          name: row.name,
          email: row.email,
          courses: row.courses ? JSON.parse(row.courses) : [], // Adjust based on how courses are stored
          addedAt: row.addedAt ? new Date(row.addedAt).toISOString() : null, // Ensure date is in a consistent format
        }));
        res.status(200).json(students);
        break;

      case 'POST':
        // Create a new student using executeQuery
        const { name, email } = req.body;
        if (!name || !email) {
          return res.status(400).json({ message: 'Name and email are required' });
        }
        
        // Assuming 'courses' is an empty array for new students, and 'addedAt' is current timestamp
        const result = await executeQuery<{ insertId: number }>(
          'INSERT INTO students (name, email, courses, addedAt) VALUES (?, ?, ?, ?)',
          [name, email, JSON.stringify([]), new Date()]
        );
        
        const insertId = result.insertId;
        res.status(201).json({ id: insertId.toString(), name, email, courses: [], addedAt: new Date().toISOString(), message: 'Student created successfully' });
        break;

      default:
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('API error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
