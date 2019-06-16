import db from './db'
import { userSchema } from './schema/user'

export const createTables = async function () {
    await db.query(userSchema.create)
}
export const dropTables = async function () {
    await db.query(userSchema.drop)
}

export * from './schema/user'


export default db