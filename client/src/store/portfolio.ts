import { observable, when, action } from "mobx";
import axios, { AxiosInstance, AxiosError } from "axios";
import { RootStore } from ".";

class Portfolio {
    @observable stocks: PortfolioStock[]
    @observable quantities: { [key: string]: number } = {}
    @observable error: string | null
    @observable loading: boolean = true
    axios: AxiosInstance
    root: RootStore
    constructor(store: RootStore) {
        this.axios = axios.create({
            baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3001/api/portfolio' : '/api/portfolio',
            withCredentials: true
        })
        this.root = store
        when(
            () => this.root.auth.authenticated,
            () => {
                this.axios.get('/')
                    .then(res => {
                        this.set(res.data)
                        this.loading = false
                        this.error = null
                    }).catch((e: AxiosError) => {
                        if (e.response) {
                            this.error = e.response.data
                            this.loading = false
                        }
                    })
            }
        )
    }
    @action set(stocks: PortfolioStock[]) {
        this.stocks = stocks
        for (const stock of stocks) {
            this.quantities[stock.symbol] = stock.quantity
        }
    }
    @action add(stock: PortfolioStock) {
        this.stocks.unshift(stock)
        this.quantities[stock.symbol] = stock.quantity
    }
}

export default Portfolio