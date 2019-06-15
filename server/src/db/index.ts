import { Client } from 'pg'
const db = new Client(process.env.DATABASE_URL || `postgres://localhost:5432/stocks`);

export default db