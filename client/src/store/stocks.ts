import { observable, computed } from 'mobx';
import { RootStore } from '.';
import axios from 'axios';


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

class Stocks {
    @observable loading: boolean = false
    @observable input: string = ''
    trie: Trie = new Trie()
    root: RootStore
    constructor(store: RootStore) {
        this.root = store
        this.loading = true
        axios.get('https://api.iextrading.com/1.0/ref-data/symbols')
            .then((response) => {
                const data: IEX.TickerSymbol[] = response.data
                for (const stock of data) {
                    if (stock.isEnabled) {
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
}





export default Stocks