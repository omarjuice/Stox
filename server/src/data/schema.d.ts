/// <reference path="../../../types.d.ts" />


interface DBSchema {
    create: string
    drop: string
}


declare namespace UserSchema {
    interface I extends IUser {
        [key: string]: any
    }
    interface Create extends I {
        password: string
    }
    interface DB extends I {
        id: number
        createdAt: Date
        password?: string
    }
}

declare namespace TransactionSchema {
    interface I extends ITransaction {
        [key: string]: any
    }
    interface Create {
        userId: number
        symbol: string
        price: number
        quantity: number
        type: transactionType
    }
    interface DB extends Create {
        id: number
        createdAt: Date
    }
}

declare namespace PortfolioStockSchema {
    interface I extends IPortfolioStock {
        [key: string]: any
    }
    interface Create {
        userId: number
        symbol: string
        quantity: number
    }
    interface DB extends Create {
        createdAt: Date
        lastUpdated: Date
    }
}