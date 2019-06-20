import React from 'react';
import { observer } from 'mobx-react';
import store from '../../store';
import { compare, zeroPad } from '../../utils';

const Box: React.FC = ({ children }) => <div className="box"> <div className="columns">{children}</div></div>

const Item: React.FC<PortfolioStock> = observer(({ symbol, quantity, lastUpdated }) => {

    const portfolioData = (color: string, size: 'third' | 'quarter' = 'third') => (
        <>
            <div className={`column is-one-${size} is-size-5 has-text-weight-bold has-text-${color}`}>
                {symbol}
            </div>
            <div className={`column is-one-${size}`}>
                {quantity}
            </div>
            <div className={`column is-one-${size}`}>
                {lastUpdated}
            </div>
        </>
    )
    if (store.search.loading) {
        return (
            <Box>
                {portfolioData('grey')}
            </Box>
        )
    }

    const data = store.search.getData(symbol)
    const color = compare(data.last.price, data.ohlc.open)
    return (
        <Box>
            {portfolioData(color, 'quarter')}
            <div className="column is-one-quarter">
                {data.ohlc.loading || data.last.loading ?
                    <i className="fas fa-circle-notch fa-spin"></i> :
                    <span className={`has-text-weight-bold is-size-6 has-text-${color}`}>
                        {zeroPad(data.last.price)}
                    </span>
                }
            </div>
        </Box>
    )


})


export default Item