import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const globalForDb = globalThis as typeof globalThis & {
  __mysqlPool?: ReturnType<typeof mysql.createPool>;
};

export const pool =
  globalForDb.__mysqlPool ??
  mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__mysqlPool = pool;
}

export const db = drizzle(pool);
