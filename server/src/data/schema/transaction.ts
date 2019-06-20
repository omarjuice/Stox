/// <reference path="../schema.d.ts" />
import db from '../db'
import ApiError from '../../utils/error';

export const transactionSchema: DBSchema = {
    create: `CREATE TABLE IF NOT EXISTS transactions(
        id serial PRIMARY KEY,
        "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        symbol VARCHAR (5) NOT NULL,
        price INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        type VARCHAR(4) CHECK (type IN ('BUY', 'SELL')),
        "createdAt" TIMESTAMP DEFAULT NOW()
    )`,
    drop: `DROP TABLE IF EXISTS transactions`
}


export class Transaction implements ITransaction {
    id: number
    userId: number
    symbol: string
    price: number
    quantity: number
    type: transactionType
    createdAt?: Date
    constructor(data: ITransaction) {
        this.id = data.id
        this.userId = data.userId
        this.symbol = data.symbol
        this.price = data.price / 1000
        this.quantity = data.quantity
        this.type = data.type
        this.createdAt = data.createdAt
    }
    static async findById(id: number): Promise<null | Transaction> {
        const { rows: [transaction] } = await db.query(`
            SELECT 
                * 
            FROM transactions
            WHERE id = $1
        `, [id])
        if (!transaction) return null
        return new Transaction(transaction)
    }
    static async create(data: TransactionSchema.Create): Promise<Transaction> {
        const missingFields = [!data.userId && 'userId', !data.symbol && 'symbol', !data.price && 'price', !('quantity' in data) && 'quantity', !data.type && 'type']
            .filter(field => !!field);
        if (missingFields.length) {
            throw new ApiError(`Missing fields ${missingFields.join(', ')}`, 400)
        }
        const { rows: [transaction] } = await db.query(`
            INSERT INTO 
                transactions
            ("userId", symbol, price, quantity, type)
            values ($1, $2, $3, $4, $5)
            RETURNING *
        `, [data.userId, data.symbol, Math.round(data.price * 1000), data.quantity, data.type]).catch(e => {
            console.log(e)
            throw new ApiError('Transaction creation error', 500)
        })
        return new Transaction(transaction)
    }
    static async findByUserId(userId: number): Promise<TransactionSchema.DB[]> {
        const { rows: transactions } = await db.query(`
            SELECT 
                *
            FROM transactions
            WHERE "userId" = $1
            ORDER BY "createdAt" DESC
        `, [userId])
        return transactions.map((transaction: TransactionSchema.DB) => {
            transaction.price = transaction.price / 1000
            return transaction
        })
    }
}

export default Transaction