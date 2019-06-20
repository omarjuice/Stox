import React from 'react';
import { observer } from 'mobx-react';




const Item: React.FC<PortfolioStock> = observer(({ symbol, quantity, lastUpdated }) => {
    return <div className="box">
        <div className="columns">
            <div className="column is-one-quarter">
                {symbol}
            </div>
            <div className="column is-one-quarter">
                {quantity}
            </div>
            <div className="column is-one-quarter">
                {lastUpdated}
            </div>

        </div>
    </div>
})


export default Item