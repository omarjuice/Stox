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
export default Trie