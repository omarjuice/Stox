import { observable } from "mobx";
import { RootStore } from "..";
import Login from './login';
import Register from "./register";

class Forms {
    @observable login: Login
    @observable register: Register
    root: RootStore
    constructor(store: RootStore) {
        this.root = store
        this.login = new Login(this)
        this.register = new Register(this)
    }
}

export default Forms