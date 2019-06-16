import { Client } from 'pg'
const db = new Client(process.env.DATABASE_URL || `postgres://localhost:5432/${process.env.NODE_ENV === 'test' ? 'stocks_test' : 'stocks'}`);

export default db
