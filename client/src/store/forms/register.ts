import { observable, action } from "mobx";

export default class Register {
    @observable email: string = ""
    @observable password: string = ""
    @observable reenter: string = ""
    @observable firstName: string = ""
    @observable lastName: string = ""
    @observable errors: {
        email: string | null
        password: string | null
        firstName: string | null
        lastName: string | null
        reenter: string | null
        main: string | null
    } = { email: null, password: null, firstName: null, lastName: null, reenter: null, main: null }
    @action clear() {
        this.email = ""
        this.password = ""
        this.firstName = ""
        this.lastName = ""
        this.reenter = ""
        this.errors = { email: null, password: null, firstName: null, lastName: null, reenter: null, main: null }
    }
    @action set(type: 'password' | 'email' | 'firstName' | 'lastName' | 'reenter', value: string) {
        this[type] = value
        this.errors[type] = null
        this.errors.main = null
    }
}
