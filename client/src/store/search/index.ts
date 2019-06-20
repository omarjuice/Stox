import { observable, computed } from 'mobx';
import { RootStore } from '..';
import axios, { AxiosInstance } from 'axios';
import { AxiosError } from 'axios';
import { action } from 'mobx';
import io from 'socket.io-client'
import Trie from './trie'
import StockData from './stockData';




class StocksSearch {
    @observable loading: boolean = true
    @observable input: string = ''
    @observable view: StockData
    @observable socketConnected: boolean = false
    @observable cache: { [key: string]: StockData } = {}
    @observable error: string | null = null
    socket = io('https://ws-api.iextrading.com/1.0/tops')
    axios: AxiosInstance
    trie: Trie = new Trie()
    root: RootStore
    constructor(store: RootStore) {
        this.root = store
        this.axios = axios.create({
            baseURL: 'https://api.iextrading.com/1.0/'
        })
        this.axios.get('ref-data/symbols')
            .then((response) => {
                const data: IEX.TickerSymbol[] = response.data
                for (const stock of data) {
                    if (stock.isEnabled && stock.name) {
                        this.trie.add(stock.symbol, stock.name)
                    }
                }
                this.loading = false
            }).catch((e: AxiosError) => {
                if (e.response) {
                    this.error = e.response.data
                }
                this.loading = false
            })



        this.socket.on('connect', () => {
            this.socketConnected = true

        })
        this.socket.on('message', (message: string) => {
            const data: IEX.TOPS = JSON.parse(message)
            const stockData: StockData = this.cache[data.symbol];
            if (data.lastSalePrice) {
                stockData.last.price = data.lastSalePrice
                stockData.last.time = data.lastSaleTime
                stockData.last.size = data.lastSaleSize
            }

        })
    }
    @action set(val: string) {
        this.input = val.toUpperCase()
    }
    @computed get list() {
        if (this.input.length) return this.trie.findStocks(this.input)
        else return []
    }
    @action addData(symbol: string, name: string, reset: boolean = false) {
        if (!this.cache[symbol] || reset) {
            this.cache[symbol] = new StockData(symbol, name, this)
        }
        this.view = this.cache[symbol]
    }
    @action getData(symbol: string) {
        if (!this.cache[symbol]) {
            const { name } = this.trie.find(symbol)
            this.cache[symbol] = new StockData(symbol, name, this)
        }
        return this.cache[symbol]
    }

}





export default StocksSearch