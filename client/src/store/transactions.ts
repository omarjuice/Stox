import { observable, when, action } from "mobx";
import axios, { AxiosInstance, AxiosError } from "axios";
import { RootStore } from ".";
import { round } from "../utils";



export class NewTransaction implements ITransaction {
    @observable symbol: string
    @observable price: number
    @observable quantity: number = 0
    @observable error: string | null = null
    @observable loading: boolean = false
    @observable axios: AxiosInstance
    type: transactionType
    root: RootStore
    constructor(symbol: string, price: number, type: transactionType, store: RootStore) {
        this.symbol = symbol
        this.price = price
        this.type = type
        this.root = store
        this.axios = axios.create({
            baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3001/api/transactions' : '/api/transactions',
            withCredentials: true
        })
    }
    @action async submit(e: React.FormEvent) {
        e.preventDefault()
        if (this.loading) return
        if (this.quantity < 1) {
            return this.error = 'Quantity must be greater than 0'
        }
        if (this.type === 'BUY') {
            await this.buy()
        }
        if (this.type === 'SELL') {
            await this.sell()
        }
        this.root.transactions.toggleTransaction({ ...this })
    }
    @action async buy() {
        this.loading = true
        const transaction: Transaction = {
            symbol: this.symbol,
            price: this.price,
            quantity: this.quantity,
            type: 'BUY'
        }
        try {
            const res = await this.axios.post('/buy', transaction)
            const data: TransactionResponse = res.data
            this.root.transactions.history.unshift(data.transaction)
            this.root.portfolio.stocks = this.root.portfolio.stocks.filter(stock => stock.symbol !== data.portfolio.symbol)
            this.root.portfolio.stocks.unshift(data.portfolio)
            this.root.auth.user.balance = round(data.balance)
            this.loading = false
        } catch (e) {
            this.error = e.response.data
            this.loading = false
        }
    }
    @action async sell() {
        this.loading = true
        try {
            const transaction: Transaction = {
                symbol: this.symbol,
                price: this.price,
                quantity: this.quantity,
                type: 'SELL'
            }
            const res = await this.axios.post('/sell', transaction)
            const data: TransactionResponse = res.data
            this.root.transactions.history.unshift(data.transaction)
            this.root.portfolio.stocks = this.root.portfolio.stocks.filter(stock => stock.symbol !== data.portfolio.symbol)
            if (data.portfolio.quantity > 0) this.root.portfolio.stocks.unshift(data.portfolio)
            this.root.auth.user.balance = round(data.balance)
            this.loading = false
        } catch (e) {
            this.error = e.response.data
            this.loading = false
        }
    }
    @action set(value: number) {
        this.quantity = value
        this.error = null
    }

}


class Transactions {
    @observable history: Transaction[] = []
    @observable loading: boolean = true
    @observable error: string | null
    @observable pendingTransaction: NewTransaction | null
    axios: AxiosInstance
    root: RootStore
    constructor(store: RootStore) {
        this.root = store
        this.axios = axios.create({
            baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3001/api/transactions' : '/api/transactions',
            withCredentials: true
        })
        when(() => this.root.auth.authenticated,
            () => {
                this.axios.get('/history')
                    .then(res => {
                        this.history = res.data
                        this.loading = false
                        this.error = null
                    }).catch((e: AxiosError) => {
                        this.error = e.response.data
                        this.loading = false
                        return null
                    })
            }
        )
    }
    @action toggleTransaction(transaction: Transaction) {
        if (!this.pendingTransaction || this.pendingTransaction.symbol !== transaction.symbol || this.pendingTransaction.type !== transaction.type) {
            this.pendingTransaction = new NewTransaction(transaction.symbol, transaction.price, transaction.type, this.root)
        } else {
            this.pendingTransaction = null
        }

        return this.pendingTransaction
    }

}

export default Transactions