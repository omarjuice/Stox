import React from 'react';
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react';
import store from '../../store';
import Item from './Item';
import { zeroPad, round } from '../../utils';


const Container: React.FC = ({ children }) => {
    return (
        <div className="container has-text-centered">
            <h1 className="title is-3">Portfolio</h1>
            {children}
        </div>
    )
}

const Portfolio: React.FC = observer(() => {
    const { portfolio } = store
    if (portfolio.loading) {
        return (
            <Container>
                <i className="fas fa-circle-notch fa-spin fa 3x"></i>
            </Container>
        )
    }
    if (portfolio.error) {
        return (
            <Container>
                <p className="notification is-warning">
                    {portfolio.error}
                </p>
            </Container>
        )
    }
    if (!portfolio.stocks.length) {
        return (
            <Container>
                <p className="notification is-grey">
                    You have nothing in your portfolio.
                    <br />
                    <Link to="/search">
                        Purchase some?
                   </Link>
                </p>
            </Container>
        )
    }
    const oneThird = "column is-one-third-desktop is-half-mobile has-text-centered"
    const oneQuarter = "column is-one-quarter-desktop is-half-mobile has-text-centered"
    return (
        <Container>
            <div className="columns is-centered">
                <div className="column is-10 is-paddingless">
                    <div className="columns is-centered is-vcentered is-mobile is-multiline">
                        {store.search.loading ? (
                            <>
                                <div className={oneThird}>
                                    SYMBOL
                                </div>
                                <div className={oneThird}>
                                    QUANTITY
                                </div>
                                <div className={oneThird}>
                                    LAST TRANSACTION
                                </div>
                            </>
                        ) : (
                                <>
                                    <div className={oneQuarter}>
                                        SYMBOL
                                    </div>
                                    <div className={oneQuarter}>
                                        QUANTITY @ MARKET PRICE = CURRENT VALUE
                                    </div>
                                    <div className={oneQuarter}>
                                        LAST
                                        TRANS{store.windowWidth < 375 && '-'}ACTION
                                    </div>
                                    <div className={oneQuarter + " has-text-centered has-text-weight-bold"}>
                                        TOTAL: {zeroPad(round(portfolio.totalValue))}
                                    </div>

                                </>
                            )}
                    </div>
                    {portfolio.stocks.map((stock) => {
                        return <Item key={stock.symbol} {...stock} />
                    })}
                </div>
            </div>
        </Container>
    )
})

export default Portfolio;
