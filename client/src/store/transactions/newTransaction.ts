import { observable, when, action, computed } from "mobx";
import axios, { AxiosInstance, AxiosError } from "axios";
import { RootStore } from "..";
import { round } from "../../utils";



export class NewTransaction implements ITransaction {
    @observable quantity: number = 0
    @observable loading: boolean = false
    @observable type: transactionType
    symbol: string
    _price: number
    error: string | null = null
    axios: AxiosInstance
    root: RootStore
    constructor(symbol: string, price: number, type: transactionType, store: RootStore) {
        this.symbol = symbol
        this._price = price
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
            this.root.portfolio.set(this.root.portfolio.stocks.filter(stock => stock.symbol !== data.portfolio.symbol))
            this.root.portfolio.add(data.portfolio)
            this.root.auth.user.balance = round(data.balance)
            this.loading = false
        } catch (e) {
            if (e.response) {
                this.error = e.response.data
            }
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
            this.root.portfolio.set(this.root.portfolio.stocks.filter(stock => stock.symbol !== data.portfolio.symbol))
            if (data.portfolio.quantity > 0) this.root.portfolio.add(data.portfolio)
            this.root.auth.user.balance = round(data.balance)
            this.loading = false
        } catch (e) {
            if (e.response) {
                this.error = e.response.data
            }
            this.loading = false
        }
    }
    @action set(value: number) {
        if (value <= this.maxQuantity) {
            this.quantity = value
        } else {
            this.quantity = this.maxQuantity
        }
        this.error = null
    }
    @computed get price() {
        try {
            return this.root.search.cache[this.symbol].last.price || this._price
        } catch (e) {
            return this._price
        }
    }
    @computed get maxQuantity(): number {
        if (this.type === 'BUY') {
            return Math.floor(this.root.auth.user.balance / this.price)
        } else {
            return this.root.portfolio.quantities[this.symbol] || Infinity
        }
    }

}
export default NewTransaction