/// <reference path="../../../types.d.ts" />
import Auth from './auth';
import Forms from './forms';
import { observable } from 'mobx';
export class RootStore {
    @observable auth: Auth
    @observable forms: Forms
    constructor() {
        this.auth = new Auth(this)
        this.forms = new Forms(this)
    }


}


export default new RootStore()