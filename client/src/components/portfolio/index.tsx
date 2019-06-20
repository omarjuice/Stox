import React from 'react';
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react';
import store from '../../store';
import Item from './Item';
import { zeroPad, round } from '../../utils';


const Container: React.FC = ({ children }) => {
    return (
        <div className="container portfolio has-text-centered">
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
    return (
        <Container>
            <div className="columns is-vcentered">
                {store.search.loading ? (
                    <>
                        <div className="column is-one-third has-text-centered">
                            SYMBOL
                        </div>
                        <div className="column is-one-third has-text-centered">
                            QUANTITY
                        </div>
                        <div className="column is-one-third has-text-centered">
                            LAST TRANSACTION
                        </div>
                    </>
                ) : (
                        <>
                            <div className="column is-one-quarter has-text-centered">
                                SYMBOL
                            </div>
                            <div className="column is-one-quarter has-text-centered">
                                QUANTITY X MARKET PRICE = CURRENT VALUE
                            </div>
                            <div className="column is-one-quarter has-text-centered">
                                LAST TRANSACTION
                            </div>
                            <div className="column is-one-quarter has-text-centered has-text-weight-bold">
                                TOTAL: {zeroPad(round(portfolio.totalValue))}
                            </div>

                        </>
                    )}
            </div>
            {portfolio.stocks.map((stock) => {
                return <Item key={stock.symbol} {...stock} />
            })}
        </Container>
    )
})

export default Portfolio;
