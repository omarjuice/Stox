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
        balance INTEGER NOT NULL DEFAULT 5000000,
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
    balance?: number
    constructor(data: UserSchema.DB) {
        this.id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.password = data.password
        this.email = data.email
        this.createdAt = data.createdAt
        this.balance = data.balance / 1000
    }
    static async findById(id: number): Promise<null | User> {
        const { rows: [user] } = await db.query(`
            SELECT 
                id, "firstName", "lastName", email, "createdAt", balance 
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
            RETURNING id, "firstName", "lastName", email, "createdAt", balance
        `, [data.firstName, data.lastName, password, data.email]).catch(() => {
            throw new ApiError(`A user with the email ${data.email} already exists.`, 400)
        })


        return new User(newUser)
    }
    static async authenticate(email: string, password: string): Promise<User> {
        if (!email) throw new ApiError(`Missing field email`, 400)
        if (!password) throw new ApiError(`Missing field password`, 400)
        const { rows: [user] } = await db.query(`
            SELECT 
                email, id, "firstName", "lastName", password, "createdAt", balance
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
    static async updateBalance(id: number, updateAmount: number, type: transactionType): Promise<User | null> {
        if (type !== 'BUY' && type !== 'SELL') throw new ApiError(`type must be "BUY" or "SELL"`, 400)
        const { rows: [user] } = await db.query(`
            UPDATE users
                SET balance = balance + $2
            WHERE id = $1 AND balance > $2
            RETURNING id, "firstName", "lastName", email, "createdAt", balance
        `, [id, updateAmount * (type === 'BUY' ? -1000 : 1000)])
        if (!user) return null
        return new User(user)
    }
    async updateBalance(updateAmount: number, type: transactionType): Promise<number> {
        if (type !== 'BUY' && type !== 'SELL') throw new ApiError(`type must be "BUY" or "SELL"`, 400)
        const { rows: [{ balance }] } = await db.query(`
            UPDATE users
                SET balance = balance + $2
            WHERE id = $1
            RETURNING balance
        `, [this.id, updateAmount * (type === 'BUY' ? -1000 : 1000)])
        return this.balance = balance / 1000
    }
}