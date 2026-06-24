import mysql, { type QueryOptions } from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'competition_expert',
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true
});

export async function queryRows<T>(sql: string, params: Record<string, unknown> = {}) {
  const [rows] = await pool.execute({ sql, values: params } as QueryOptions);
  return rows as T[];
}
