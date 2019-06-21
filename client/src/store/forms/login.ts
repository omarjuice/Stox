import { observable, action } from "mobx";
import Forms from './index';
import { History } from 'history';

export default class Login {
    @observable loading: boolean = false
    @observable email: string = ""
    @observable password: string = ""
    @observable errors: {
        email: string | null,
        password: string | null,
        main: string | null
    } = { email: null, password: null, main: null }
    forms: Forms
    constructor(forms: Forms) {
        this.forms = forms
    }
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
    @action async submit(e: React.FormEvent, history: History) {
        e.preventDefault();

        const { email, password } = this
        if (!email || !password) {
            if (!email.length) this.errors.email = 'Please enter your email'
            if (!password.length) this.errors.password = 'Please enter a password'
            return
        }
        this.forms.root.auth.authenticated = false
        this.loading = true
        await this.forms.root.auth.login(email, password)
        this.loading = false
        if (this.forms.root.auth.authenticated) {
            this.clear()
            history.push('/portfolio')
        } else {
            this.errors.main = this.forms.root.auth.error
        }

    }
}