import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom'
import store from '../../store';
import { compare, zeroPad, round } from '../../utils';
import moment from 'moment';
import BuyForm from '../TransactionForm';

const Box: React.FC<{ color: string }> = ({ children, color }) => (
    <div className={`box has-background-${color}`}>
        <div className="columns is-vcentered">
            {children}
        </div>
    </div>
)

const Item: React.FC<PortfolioStock> = observer(({ symbol, quantity, lastUpdated }) => {
    const { transactions, search } = store
    if (search.loading) {
        return (
            <Box color={'grey'}>
                <div className={`column is-one-third is-size-5 has-text-weight-bold has-text-white`}>
                    {symbol}
                </div>
                <div className={`column is-one-third has-text-weight-bold has-text-white`}>
                    {quantity}
                </div>
                <div className={`column is-one-third has-text-weight-bold has-text-white`}>
                    {lastUpdated}
                </div>
            </Box>
        )
    }

    const data = search.getData(symbol)
    const color = compare(data.last.price, data.ohlc.open)
    const doingTransaction = transactions.pendingTransaction && transactions.pendingTransaction.symbol === symbol
    return (<>
        <Box color={color}>
            <div className={`column is-one-quarter is-size-5`}>
                <Link className="has-text-weight-bold has-text-white" to="/search"
                    onClick={() => { search.addData(symbol, search.trie.find(symbol).name); search.set(symbol) }}>
                    {symbol}
                </Link>
            </div>
            <div className="column is-one-quarter">
                {data.ohlc.error || data.last.error ?
                    <span className="has-text-danger">{(data.ohlc.error || '') + ' ' + (data.last.error || '')}</span>
                    :
                    data.ohlc.loading || data.last.loading ?
                        <span>{quantity} @ <i className="fas fa-circle-notch fa-spin"></i></span> :
                        <>
                            <span className={`has-text-weight-bold is-size-6 has-text-white`}>
                                {quantity}
                                {' '}@{' '}
                                {zeroPad(round(data.last.price))}
                                {' '}={' '}
                                <span className="is-size-5 has-text-weight-bold">{zeroPad(round(quantity * data.last.price))}</span>
                            </span>
                        </>
                }
            </div>
            <div className={`column is-one-quarter has-text-white`}>
                {moment.utc(lastUpdated).local().format('MM/DD/YY h:mm:ssa')}
            </div>
            {!data.last.loading && !data.last.error && !data.ohlc.error && (
                <div className="column is-one quarte has-text-centered">
                    <div className="buttons is-centered">
                        <button
                            onClick={() => transactions.toggleTransaction({ symbol, price: data.last.price, type: 'BUY', quantity: 0 })}
                            className="button is-dark">
                            {doingTransaction && transactions.pendingTransaction.type === 'BUY' ? 'CANCEL' : 'BUY'}
                        </button>
                        <button
                            onClick={() => transactions.toggleTransaction({ symbol, price: data.last.price, type: 'SELL', quantity: 0 })}
                            className="button is-dark">
                            {doingTransaction && transactions.pendingTransaction.type === 'SELL' ? 'CANCEL' : 'SELL'}
                        </button>
                    </div>
                </div>
            )}
        </Box>
        {doingTransaction && (
            <BuyForm size={2} newTransaction={transactions.pendingTransaction} />
        )}
    </>
    )


})


export default Item