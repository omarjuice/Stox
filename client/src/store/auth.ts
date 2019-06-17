import { observable } from "mobx";
import axios, { AxiosError } from "axios"
import { History } from "history";
import { RootStore } from ".";

class Auth {
    @observable loading: boolean = false;
    @observable status: number;
    @observable data: string | Object = '';
    @observable error: string | null = null;
    @observable user: null | User
    @observable authenticated: boolean = false
    main: number;
    root: RootStore
    constructor(store: RootStore) {
        this.root = store
        if (process.env.NODE_ENV === 'development') {
            axios.defaults.baseURL = 'http://localhost:3001/api'
        }
        axios.defaults.withCredentials = true;
        this.loading = true;
        axios.get('/')
            .then(res => {
                this.status = res.status;
                this.data = res.data;
                this.loading = false
            })
            .catch(e => {
                this.error = e;
                this.loading = false
            })
    }
    async register(details: User) {
        const response = await axios.post('/auth/register', details)
            .catch((e: AxiosError) => {
                this.error = e.response.data
                return { data: null, status: e.response.status }
            })
        this.user = response.data;
        this.status = response.status;
        if (!this.user) {
            this.authenticated = false
        } else {
            this.authenticated = true
        }
    }
    async login(email: string, password: string) {
        const response = await axios.post('/auth/login', { email, password })
            .catch((e: AxiosError) => {
                this.error = e.response.data
                return { data: null, status: e.response.status }
            })
        this.user = response.data;
        this.status = response.status
        if (!this.user) {
            this.authenticated = false
        } else {
            this.authenticated = true
        }

    }
    async logout(history: History) {
        await axios.post('/auth/logout')
        this.authenticated = false
        this.user = null
        history.push('/')
    }
    async me() {
        const response = await axios.get('/auth/me')
        const user: User = response.data
        if (user && user.id) {
            this.user = user
            this.authenticated = true
        } else {
            this.user = null
            this.authenticated = false
        }
    }
}

export default Auth