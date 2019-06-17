declare interface User {
    id?: number
    firstName: string
    lastName: string
    email: string
    password?: string
    createdAt?: Date
}

declare namespace IEX {
    interface TickerSymbol {
        symbol: string
        name: string
        date?: string
        isEnabled?: boolean
        type?: string
        iexId?: string
    }
}