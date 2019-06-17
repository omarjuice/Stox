/// <reference path="../../../types.d.ts" />
import Auth from './auth';
import { observable } from 'mobx';
class RootStore {
    auth: Auth
    constructor() {
        this.auth = new Auth()

    }


}


export default new RootStore()