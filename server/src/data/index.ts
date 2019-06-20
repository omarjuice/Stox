/// <reference path="./schema.d.ts" />

import db from './db'
import { userSchema } from './schema/user'
import { transactionSchema } from './schema/transaction';
import { portfolioStockSchema } from './schema/portfolioStocks';


export const createTables = async function () {
    await db.query(userSchema.create)
    await db.query(transactionSchema.create)
    await db.query(portfolioStockSchema.create)
    await db.query('CREATE INDEX "idx_transactions_userId" ON transactions("userId")')

}
export const dropTables = async function () {
    await db.query('ALTER TABLE transactions DISABLE TRIGGER ALL')
    await db.query('ALTER TABLE portfolio_stocks DISABLE TRIGGER ALL')
    await db.query(transactionSchema.drop)
    await db.query(portfolioStockSchema.drop)
    await db.query(userSchema.drop)
}

export * from './schema/user'
export * from './schema/transaction'
export * from './schema/portfolioStocks'


export default db