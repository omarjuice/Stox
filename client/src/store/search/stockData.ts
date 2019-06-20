import { observable, when } from 'mobx';
import { AxiosError } from 'axios';

import StocksSearch from '../search/index';


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
                if (!data.open) throw new Error(`Error getting data for ${symbol}`)
                this.ohlc.open = data.open.price
                this.ohlc.close = data.close.price
                this.ohlc.high = data.high
                this.ohlc.low = data.low
                this.ohlc.loading = false
            }).catch((e: AxiosError) => {
                this.ohlc.loading = false
                if (e.response) {
                    this.ohlc.error = e.response.data
                }
            })
        search.axios.get(`tops/last?symbols=${symbol}`)
            .then(res => {
                const data: IEX.LAST[] = res.data
                if (!data[0].price) throw new Error(`Error getting data for ${symbol}`)
                this.last = { ...this.last, ...data[0] }
                this.last.error = null
                this.last.loading = false
            }).catch((e: AxiosError) => {
                this.last.loading = false
                if (e.response) {
                    this.last.error = e.response.data
                }
            })
        when(
            () => search.socketConnected,
            () => search.socket.emit('subscribe', this.symbol)
        )

    }


}
export default StockData