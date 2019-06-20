/// <reference path="../../../types.d.ts" />
import Auth from './auth';
import Forms from './forms';
import { observable, action } from 'mobx';
import StocksSearch from './search';
import Portfolio from './portfolio';
import Transactions from './transactions'




export class RootStore {
    @observable auth: Auth
    @observable forms: Forms
    @observable search: StocksSearch
    @observable portfolio: Portfolio
    @observable transactions: Transactions
    @observable windowWidth: number = window.innerWidth
    constructor() {
        this.initialize()
        window.onresize = this.onResize.bind(this)
    }
    @action initialize() {
        this.auth = new Auth(this)
        this.forms = new Forms(this)
        this.search = new StocksSearch(this)
        this.portfolio = new Portfolio(this)
        this.transactions = new Transactions(this)
    }
    @action onResize() {
        this.windowWidth = window.innerWidth
        console.log(this.windowWidth);
    }

}




export default new RootStore()