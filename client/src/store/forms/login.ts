import { observable, action } from "mobx";

export default class Login {
    @observable loading: boolean = false
    @observable email: string = ""
    @observable password: string = ""
    @observable errors: {
        email: string | null,
        password: string | null,
        main: string | null
    } = { email: null, password: null, main: null }
    @action clear() {
        this.email = ""
        this.password = ""
        this.errors = { email: null, password: null, main: null }
    }
    @action set(type: 'password' | 'email', value: string) {
        this[type] = value
        this.errors[type] = null
        this.errors.main = null
    }
}