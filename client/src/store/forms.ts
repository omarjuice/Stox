import { observable, action } from "mobx";
import { RootStore } from ".";
import { History } from 'history';

class Login {
    @observable email: string = ""
    @observable password: string = ""
    @observable errors: { email: string | null, password: string | null } = { email: null, password: null }
    @action clear() {
        this.email = ""
        this.password = ""
        this.errors = { email: null, password: null }
    }
    @action set(type: 'password' | 'email', value: string) {
        this[type] = value
        this.errors[type] = null
    }
}
class Register {
    @observable email: string = ""
    @observable password: string = ""
    @observable reenter: string = ""
    @observable firstName: string = ""
    @observable lastName: string = ""
    @observable errors: {
        email: string | null,
        password: string | null
        firstName: string | null
        lastName: string | null
        reenter: string | null
    } = { email: null, password: null, firstName: null, lastName: null, reenter: null }
    @action clear() {
        this.email = ""
        this.password = ""
        this.firstName = ""
        this.lastName = ""
        this.reenter = ""
        this.errors = { email: null, password: null, firstName: null, lastName: null, reenter: null }
    }
    @action set(type: 'password' | 'email' | 'firstName' | 'lastName' | 'reenter', value: string) {
        this[type] = value
        this.errors[type] = null
    }
}

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
            this.login.errors.email = this.root.auth.error
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
            this.register.errors.email = this.root.auth.error
        }
    }
}

export default Forms