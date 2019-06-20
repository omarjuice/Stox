import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom'
import store from '../../store';


const Item: React.FC<Transaction> = ({ symbol, quantity, price, type, createdAt }) => {
    const { search } = store
    return (
        <div className="box">
            <div className="columns">
                <div className="column is-one-quarter">
                    {type}
                </div>
                <div className="column is-one-quarter">
                    <Link className="has-text-weight-bold" to="/search"
                        onClick={() => { search.addData(symbol, search.trie.find(symbol).name); search.set(symbol) }}>
                        {symbol}
                    </Link>
                </div>
                <div className="column is-one-quarter">
                    {quantity} @ {price}
                </div>
                <div className="column is-one-quarter">
                    {moment.utc(createdAt).local().format('MM/DD/YY h:mm:ssa')}
                </div>

            </div>
        </div>
    )
}

export default Item