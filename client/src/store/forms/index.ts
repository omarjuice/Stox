import { observable, action } from "mobx";
import { RootStore } from "..";
import { History } from 'history';
import Login from './login';
import Register from "./register";


class Forms {
    @observable login: Login
    @observable register: Register
    root: RootStore
    constructor(store: RootStore) {
        this.root = store
        this.login = new Login()
        this.register = new Register()
    }
    @action async submitLogin(e: React.FormEvent, history: History) {
        e.preventDefault();
        const { email, password } = this.login
        if (!email || !password) {
            if (!email.length) this.login.errors.email = 'Please enter your email'
            if (!password.length) this.login.errors.password = 'Please enter a password'
            return
        }
        this.root.auth.authenticated = false
        await this.root.auth.login(email, password)
        if (this.root.auth.authenticated) {
            this.login.clear()
            history.push('/stocks')
        } else {
            this.login.errors.main = this.root.auth.error
        }
    }
    @action async submitRegister(e: React.FormEvent, history: History) {
        e.preventDefault()
        const { email, password, firstName, lastName, reenter, errors } = this.register;
        if (!email) return errors.email = 'Please enter an email'
        if (!firstName) return errors.firstName = 'Please enter your first name'
        if (!lastName) return errors.lastName = 'Please enter your last name'
        if (!password) return errors.password = 'Please enter a password'
        if (!reenter) return errors.reenter = 'Please reenter your password'
        if (reenter !== password) return errors.reenter = 'Passwords do not match'

        this.root.auth.authenticated = false;
        await this.root.auth.register({ email, password, firstName, lastName })
        if (this.root.auth.authenticated) {
            this.register.clear()
            history.push('/stocks')
        } else {
            this.register.errors.main = this.root.auth.error
        }
    }
}

export default Forms