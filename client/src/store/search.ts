import { observable, computed } from 'mobx';
import { RootStore } from '.';
import axios, { AxiosInstance } from 'axios';
import { AxiosError } from 'axios';
import { action } from 'mobx';


class Trie {
    value: string
    symbol: string
    name: string
    children: { [key: string]: Trie }
    isSymbol: boolean
    constructor(letter = '', symbol: string | null = null, name: string | null = null) {
        this.value = letter;
        this.children = {};
        this.isSymbol = false;
        this.name = name
        this.symbol = symbol
    }

    add(symbol: string, name: string, node: Trie = this) {
        for (const letter of symbol) {
            if (node.children[letter]) {
                node = node.children[letter];
            } else {
                const newNode = new Trie(letter);
                node.children[letter] = newNode;
                node = newNode;
            }
        }

        node.isSymbol = true;
        node.symbol = symbol
        node.name = name
    };
    find(symbol: string, node: Trie = this) {
        let value = ''

        for (const letter of symbol) {
            if (node.children[letter]) {
                node = node.children[letter];
                value += letter;
            }
        }
        return value === symbol ? node : null;
    };
    findStocks(value: string = '', node: Trie | null = this.find(value), stocks: IEX.TickerSymbol[] = []) {
        if (node) {
            if (node.isSymbol) stocks.push({ symbol: node.symbol, name: node.name })
            for (const letter in node.children) {
                const child = node.children[letter]
                child.findStocks(value + child.value, child, stocks);
            };
        }

        return stocks;
    };
}
type ohlc = {
    loading: boolean
    error: string | null
    open?: number
    high?: number
    low?: number
    close?: number
}
type last = {
    loading: boolean
    error: string | null
    price?: number
    time?: number
    size?: number
}

class StockData {
    @observable symbol: string
    @observable name: string
    @observable ohlc: ohlc = {
        loading: true,
        error: null
    }
    @observable last: last = {
        loading: true,
        error: null
    }
    search: StocksSearch
    constructor(symbol: string, name: string, search: StocksSearch) {
        this.symbol = symbol
        this.name = name
        this.search = search

        search.axios.get(`stock/${symbol}/ohlc`)
            .then(res => {
                const data: IEX.OHLC = res.data
                this.ohlc.open = data.open.price
                this.ohlc.close = data.close.price
                this.ohlc.high = data.high
                this.ohlc.low = data.low
                this.ohlc.loading = false
            }).catch((e: AxiosError) => {
                this.ohlc.error = e.response.data
                this.ohlc.loading = false
            })
        search.axios.get(`tops/last?symbols=${symbol}`)
            .then(res => {
                const data: IEX.LAST[] = res.data
                this.last = { ...this.last, ...data[0] }
                this.last.error = null
                this.last.loading = false
            }).catch((e: AxiosError) => {
                this.last.loading = false
                this.last.error = e.response.data
            })
    }

}

class StocksSearch {
    @observable loading: boolean = false
    @observable input: string = ''
    @observable view: StockData
    cache: { [key: string]: StockData } = {}
    axios: AxiosInstance
    trie: Trie = new Trie()
    root: RootStore
    constructor(store: RootStore) {
        this.root = store
        this.loading = true
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
            })
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
}





export default StocksSearch