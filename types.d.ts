declare interface IUser {
    id?: number
    firstName: string
    lastName: string
    email: string
    password?: string
    createdAt?: Date
    balance?: number
}
declare type User = IUser

declare namespace IEX {
    interface TickerSymbol {
        symbol: string
        name: string
        date?: string
        isEnabled?: boolean
        type?: string
        iexId?: string
    }
    type OHLC = {
        open: {
            price: number
            time: number
        }
        close: {
            price: number
            time: number
        }
        high: number
        low: number
    }
    type LAST = {
        symbol: string
        price: number
        size: number
        time: number
    }
    type TOPS = {
        symbol: string
        lastSalePrice: number
        lastSaleSize: number
        lastSaleTime: number
    }
}
declare type transactionType = 'BUY' | 'SELL'

declare interface ITransaction {
    id?: number
    userId?: number
    symbol: string
    price: number
    quantity: number
    type: transactionType
    createdAt?: Date
}

declare interface IPortfolioStock {
    userId: number
    symbol: string
    quantity: number
    lastUpdated: Date
}
declare type Transaction = ITransaction
declare type PortfolioStock = IPortfolioStock


declare type TransactionResponse = {
    portfolio: PortfolioStock,
    balance: number,
    transaction: Transaction
}

declare type Purchase = {
    symbol: string
    quantity: number
    price: number
}