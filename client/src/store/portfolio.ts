import { observable, when } from "mobx";
import axios, { AxiosInstance, AxiosError } from "axios";
import { RootStore } from ".";

class Portfolio {
    @observable stocks: PortfolioStock[]
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
                        this.stocks = res.data
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
}

export default Portfolio