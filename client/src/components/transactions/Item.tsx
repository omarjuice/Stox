import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom'
import store from '../../store';

interface Props {
    i: number
    transaction: Transaction
}

const Item: React.FC<Props> = ({ transaction, i }) => {
    const { search } = store
    const { symbol, quantity, price, type, createdAt } = transaction
    const isEven = i % 2 === 0
    const oneQuarter = "column is-one-quarter-desktop is-half-mobile"
    return (
        <div className={`box has-text-weight-bold has-background-${isEven ? 'link' : 'light'} has-text-${isEven ? 'white' : 'primary'}`}>
            <div className="columns is-centered is-vcentered is-mobile is-multiline">
                <div className={oneQuarter}>
                    {type}
                </div>
                <div className={oneQuarter}>
                    <Link className={`has-text-${isEven ? 'white' : 'primary'}`} to="/search"
                        onClick={() => { search.addData(symbol, search.trie.find(symbol).name); search.set(symbol) }}>
                        {symbol}
                    </Link>
                </div>
                <div className={oneQuarter}>
                    {quantity} @ {price}
                </div>
                <div className={oneQuarter}>
                    {moment.utc(createdAt).local().format('MM/DD/YY h:mm:ssa')}
                </div>

            </div>
        </div>
    )
}

export default Item