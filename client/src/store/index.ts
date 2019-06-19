/// <reference path="../../../types.d.ts" />
import Auth from './auth';
import Forms from './forms';
import { observable } from 'mobx';
import StocksSearch from './search';



export class RootStore {
    @observable auth: Auth
    @observable forms: Forms
    @observable search: StocksSearch
    constructor() {
        this.auth = new Auth(this)
        this.forms = new Forms(this)
        this.search = new StocksSearch(this)


    }
}




export default new RootStore()