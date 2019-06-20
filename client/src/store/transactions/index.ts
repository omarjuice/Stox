import { observable, when, action } from "mobx";
import axios, { AxiosInstance, AxiosError } from "axios";
import { RootStore } from "..";
import NewTransaction from "./newTransaction";





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