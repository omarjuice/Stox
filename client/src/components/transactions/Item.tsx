import React from 'react';
import moment from 'moment';


const Item: React.FC<Transaction> = ({ symbol, quantity, price, type, createdAt }) => {
    return (
        <div className="box">
            <div className="columns">
                <div className="column is-one-quarter">
                    {type}
                </div>
                <div className="column is-one-quarter">
                    {symbol}
                </div>
                <div className="column is-one-quarter">
                    {quantity} X {price}
                </div>
                <div className="column is-one-quarter">
                    {moment.utc(createdAt).local().format('MM/DD/YY h:mm:ssa')}
                </div>

            </div>
        </div>
    )
}

export default Item