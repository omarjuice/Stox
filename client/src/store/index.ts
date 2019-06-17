/// <reference path="../../../types.d.ts" />
import Auth from './auth';
import Forms from './forms';
import { observable } from 'mobx';
import Stocks from './stocks';



export class RootStore {
    @observable auth: Auth
    @observable forms: Forms
    @observable stocks: Stocks
    constructor() {
        this.auth = new Auth(this)
        this.forms = new Forms(this)
        this.stocks = new Stocks(this)


    }
}




export default new RootStore()