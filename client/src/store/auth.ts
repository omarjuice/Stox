import { observable } from "mobx";
import axios from "axios"

class Auth {
    @observable loading: boolean = false;
    @observable status: number;
    @observable data: string | Object = '';
    @observable error: Error | null = null;
    @observable user: null | User
    @observable authenticated: boolean = false
    main: number;

    constructor() {
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
    async login(email: string, password: string) {
        try {
            const response = await axios.post('/auth/login', { email, password })
            const user: User = response.data;
            this.status = response.status
            if (!user || !user.id) {
                this.user = null
                this.authenticated = false
            } else {
                this.user = user
                this.authenticated = true
            }
        } catch (e) {
            this.error = e
        }
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