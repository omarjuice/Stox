/// <reference path="./schema.d.ts" />
import bcrypt from 'bcryptjs'
import { validate } from 'email-validator'



import db from '../db'
export const userSchema: DBSchema = {
    create: `CREATE TABLE IF NOT EXISTS users(
        id serial PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password CHAR(60) NOT NULL,
        "firstName" VARCHAR(40) NOT NULL,
        "lastName" VARCHAR(40) NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW()
    )`,
    drop: `DROP TABLE IF EXISTS users`
}




export class User implements UserSchema.I {
    id: number
    firstName: string
    lastName: string
    password?: string
    email: string
    createdAt?: Date
    constructor(data: UserSchema.DB) {
        this.id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.password = data.password
        this.email = data.email
        this.createdAt = data.createdAt
    }
    static async findById(id: number): Promise<null | User> {
        const { rows: [user] } = await db.query(`
            SELECT 
                id, "firstName", "lastName", email, "createdAt" 
            FROM users
            WHERE id = $1`, [id])
        if (!user) {
            // throw new Error(`User with id of ${id} not found.`)
            return null
        }
        return new User(user)
    }
    static async create(data: UserSchema.Create): Promise<User> {
        if (!validate(data.email)) throw new Error(`Validation Error: ${data.email} is not a valid email`)
        const password = await bcrypt.hash(data.password, 10)
        const { rows: [newUser] } = await db.query(`
            INSERT INTO 
                users
            ("firstName", "lastName", password, email)
            VALUES ($1, $2, $3, $4)
            RETURNING id, "firstName", "lastName", email, "createdAt"
        `, [data.firstName, data.lastName, password, data.email])


        return new User(newUser)
    }
}