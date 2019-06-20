import { observable } from "mobx";
import axios, { AxiosError, AxiosInstance } from "axios"
import { History } from "history";
import { RootStore } from ".";
import { round } from "../utils";

class Auth {
    @observable loading: boolean = false;
    @observable status: number;
    @observable data: string | Object = '';
    @observable error: string | null = null;
    @observable user: null | User
    @observable authenticated: boolean = false
    axios: AxiosInstance
    main: number;
    root: RootStore
    constructor(store: RootStore) {
        this.root = store

        this.axios = axios.create({
            baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3001/api/auth' : '/api/auth',
            withCredentials: true
        })

    }
    async register(details: User) {
        const response = await this.axios.post('/register', details)
            .catch((e: AxiosError) => {
                if (e.response) {
                    this.error = e.response.data
                }
                return { data: null, status: e.response.status }
            })
        this.user = response.data;
        this.status = response.status;
        if (!this.user) {
            this.authenticated = false
        } else {
            response.data.balance = round(response.data.balance)
            this.authenticated = true
        }
    }
    async login(email: string, password: string) {
        const response = await this.axios.post('/login', { email, password })
            .catch((e: AxiosError) => {
                this.error = e.response.data
                return { data: null, status: e.response.status }
            })
        this.user = response.data;
        this.status = response.status
        if (!this.user) {
            this.authenticated = false
        } else {
            response.data.balance = round(response.data.balance)
            this.authenticated = true
        }

    }
    async logout(history: History) {
        await this.axios.post('/logout')
        this.authenticated = false
        this.user = null
        history.push('/')
        this.root.initialize()
    }
    async me() {
        const response = await this.axios.get('/me')
        const user: User = response.data
        if (user && user.id) {
            this.user = user
            this.user.balance = round(this.user.balance)
            this.authenticated = true
        } else {
            this.user = null
            this.authenticated = false
        }
    }
}

export default Auth