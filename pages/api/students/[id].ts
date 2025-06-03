import { NextApiRequest, NextApiResponse } from 'next';
import { executeQuery } from '@/lib/db'; // Import the executeQuery function

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Ensure the request method is DELETE
    if (req.method !== 'DELETE') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    // Get the student ID from the query parameters
    const { id } = req.query;

    // Validate the student ID
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Valid student ID is required' });
    }

    // Execute the DELETE query using executeQuery
    const result = await executeQuery<{ affectedRows: number }>(
      'DELETE FROM students WHERE id = ?',
      [id]
    );

    // Check if a row was actually deleted
    const affectedRows = result.affectedRows;

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Send a success response (200 OK or 204 No Content)
    res.status(200).json({ message: 'Student deleted successfully' });

  } catch (error: any) {
    console.error('API error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
