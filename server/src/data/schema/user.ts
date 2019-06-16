/// <reference path="./schema.d.ts" />
import bcrypt from 'bcryptjs'
import { validate } from 'email-validator'

import ApiError from '../../utils/error';
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
        const missingFields = [!data.email && 'email', !data.password && 'password', !data.firstName && 'firstName', !data.lastName && 'lastName']
            .filter(field => !!field);
        if (missingFields.length) {
            throw new ApiError(`Missing fields ${missingFields.join(', ')}`, 400)
        }
        if (!validate(data.email)) {
            throw new ApiError(`Validation Error: ${data.email} is not a valid email`, 400)
        }
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
    static async authenticate(email: string, password: string): Promise<User> {
        if (!email) throw new ApiError(`Missing field email`, 400)
        if (!password) throw new ApiError(`Missing field password`, 400)
        const { rows: [user] } = await db.query(`
            SELECT 
                email, id, "firstName", "lastName", password, "createdAt"
            FROM users
            WHERE email = $1
        `, [email])
        if (!user) {
            throw new ApiError(`User with email of ${email} not found.`, 404)
        }
        const valid: boolean = await bcrypt.compare(password, user.password)
        if (valid) {
            delete user.password
            return new User(user)
        } else {
            throw new ApiError(`That is not the correct password for ${email}`, 401)

        }
    }
}