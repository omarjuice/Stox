/// <reference path="../../../types.d.ts" />
import Auth from './auth';
class RootStore {
    auth: Auth
    constructor() {
        this.auth = new Auth()
        this.auth.me()
    }
}


export default new RootStore()