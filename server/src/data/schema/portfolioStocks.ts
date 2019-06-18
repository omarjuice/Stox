import db from '../db'
import ApiError from '../../utils/error';


export const portfolioStockSchema: DBSchema = {
    create: `CREATE TABLE IF NOT EXISTS portfolio_stocks(
        "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        symbol VARCHAR(5) NOT NULL,
        quantity INTEGER NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "lastUpdated" TIMESTAMP DEFAULT NULL,
        PRIMARY KEY("userId", symbol)
    )`,
    drop: `DROP TABLE IF EXISTS portfolio_stocks`
}

export class PortfolioStock implements IPortfolioStock {
    userId: number
    symbol: string
    quantity: number
    createdAt: Date
    lastUpdated: Date
    constructor(data: PortfolioStockSchema.DB) {
        this.userId = data.userId
        this.symbol = data.symbol
        this.quantity = data.quantity
        this.createdAt = data.createdAt
        this.userId = data.userId
    }
    static async add(stock: PortfolioStockSchema.Create): Promise<PortfolioStock> {
        const { rows: [portfolioStock] } = await db.query(`
            INSERT INTO portfolio_stocks("userId", symbol, quantity)
            VALUES ($1, $2, $3)
            ON CONFLICT ("userId", symbol)
            DO
                UPDATE 
                    SET 
                        quantity = portfolio_stocks.quantity + $3,
                        "lastUpdated" = NOW()
            RETURNING * 
        `, [stock.userId, stock.symbol, stock.quantity])

        return new PortfolioStock(portfolioStock)
    }

    static async find(userId: number, symbol: string): Promise<PortfolioStock | null> {
        const { rows: [portfolioStock] } = await db.query(`
            SELECT 
                *
            FROM portfolio_stocks
            WHERE "userId" = $1 AND symbol = $2
        `, [userId, symbol]);
        if (!portfolioStock) return null
        return new PortfolioStock(portfolioStock)
    }
    static async findAll(userId: number): Promise<PortfolioStockSchema.DB[]> {
        const { rows: portfolioStocks } = await db.query(`
            SELECT 
                *
            FROM portfolio_stocks
            WHERE "userId" = $1
        `, [userId]);

        return portfolioStocks
    }
    async sell(sellQuantity: number): Promise<PortfolioStock | null> {
        const { rows: [{ quantity }] } = await db.query(`
            UPDATE portfolio_stocks
                SET quantity = CASE
                    WHEN quantity > $3 THEN quantity - $3
                    WHEN quantity <= $3 THEN 0
                    END 
            WHERE "userId" = $1 AND symbol = $2
            RETURNING quantity
        `, [this.userId, this.symbol, sellQuantity])

        return this.quantity = quantity
    }
    async destroy() {
        await db.query(`
            DELETE FROM portfolio_stocks WHERE "userId" = $1 AND symbol = $2
        `)
    }

}