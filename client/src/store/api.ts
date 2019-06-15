import { observable } from "mobx";
import axios, { AxiosProxyConfig } from "axios"

class API {
    @observable loading: boolean = false;
    @observable status: number;
    @observable data: string | Object = '';
    @observable error: Error | null = null;
    main: number;

    constructor() {
        if (process.env.NODE_ENV == 'development') {
            axios.defaults.baseURL = 'http://localhost:3001/api'
        }
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
}

export default API