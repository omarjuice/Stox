import { observable, action } from "mobx";
import { nameRegex } from "../../utils";
import Forms from './index';
import { History } from 'history';
export default class Register {
    @observable loading: boolean = false
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
    forms: Forms
    constructor(forms: Forms) {
        this.forms = forms
    }
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
    @action async submit(e: React.FormEvent, history: History) {
        e.preventDefault()

        const { email, password, firstName, lastName, reenter, errors } = this;
        if (!email) return errors.email = 'Please enter an email'
        if (!firstName) return errors.firstName = 'Please enter your first name'
        if (!nameRegex.test(firstName)) return errors.firstName = 'Name must contain letters only'
        if (firstName.length > 40) return errors.firstName = 'Name too long, max 40 characters'
        if (!lastName) return errors.lastName = 'Please enter your last name'
        if (!nameRegex.test(lastName)) return errors.lastName = 'Name must contain letters only'
        if (lastName.length > 40) return errors.lastName = 'Name too long, max 40 characters'
        if (!password) return errors.password = 'Please enter a password'
        if (!reenter) return errors.reenter = 'Please reenter your password'
        if (reenter !== password) return errors.reenter = 'Passwords do not match'
        this.forms.root.auth.authenticated = false;
        this.loading = true
        await this.forms.root.auth.register({ email, password, firstName, lastName })
        this.loading = false
        if (this.forms.root.auth.authenticated) {
            this.clear()
            history.push('/portfolio')
        } else {
            this.errors.main = this.forms.root.auth.error
        }

    }
}
