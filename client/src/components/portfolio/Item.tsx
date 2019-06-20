import React from 'react';
import { observer } from 'mobx-react';
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

    if (store.search.loading) {
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

    const data = store.search.getData(symbol)
    const color = compare(data.last.price, data.ohlc.open)
    const doingTransaction = store.transactions.pendingTransaction && store.transactions.pendingTransaction.symbol === symbol
    return (<>
        <Box color={color}>
            <div className={`column is-one-quarter is-size-5 has-text-weight-bold has-text-white`}>
                {symbol}
            </div>
            <div className="column is-one-quarter">
                {data.ohlc.error || data.last.error ?
                    <span className="has-text-danger">{(data.ohlc.error || '') + ' ' + (data.last.error || '')}</span>
                    :
                    data.ohlc.loading || data.last.loading ?
                        <span>{quantity} X <i className="fas fa-circle-notch fa-spin"></i></span> :
                        <>

                            <span className={`has-text-weight-bold is-size-6 has-text-white`}>
                                {quantity}
                                {' '}X{' '}
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
            {!data.last.loading && !data.last.error && (
                <div className="column is-one quarte has-text-centered">
                    <div className="buttons is-centered">
                        <button
                            onClick={() => store.transactions.toggleTransaction({ symbol, price: data.last.price, type: 'BUY', quantity: 0 })}
                            className="button is-dark">
                            {doingTransaction && store.transactions.pendingTransaction.type === 'BUY' ? 'CANCEL' : 'BUY'}
                        </button>
                        <button
                            onClick={() => store.transactions.toggleTransaction({ symbol, price: data.last.price, type: 'SELL', quantity: 0 })}
                            className="button is-dark">
                            {doingTransaction && store.transactions.pendingTransaction.type === 'SELL' ? 'CANCEL' : 'SELL'}
                        </button>
                    </div>
                </div>
            )}
        </Box>
        {doingTransaction && (
            <BuyForm size={1} newTransaction={store.transactions.pendingTransaction} />
        )}
    </>
    )


})


export default Item