import mysql from 'mysql2/promise';

// Configure database connection pool (use environment variables)
const dbConfig = {
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT || '3306', 10),
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

/**
 * Executes a SQL query using the connection pool.
 * @param query The SQL query string.
 * @param values Optional values to escape in the query.
 * @returns The result of the query execution.
 */
export async function executeQuery<T>(query: string, values: any[] = []): Promise<T> {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(query, values);
    return rows as T;
  } catch (error) {
    console.error('Database query error:', error);
    throw error; // Re-throw the error to be handled by the API route
  } finally {
    if (connection) {
      connection.release(); // Release the connection back to the pool
    }
  }
}
