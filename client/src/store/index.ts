/// <reference path="../../../types.d.ts" />
import axios from 'axios'
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
        axios.get('https://api.iextrading.com/1.0/ref-data/symbols')
            .then((response) => {
                const data: IEX.TickerSymbol[] = response.data
                for (const stock of data) {
                    if (stock.isEnabled) {
                        this.stocks.trie.add(stock.symbol, stock.name)
                    }
                }
            })

    }
}




export default new RootStore()