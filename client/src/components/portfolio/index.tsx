import React from 'react';
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react';
import store from '../../store';
import Item from './Item';


const Container: React.FC = ({ children }) => {
    return (
        <div className="container portfolio has-text-centered">
            {children}
        </div>
    )
}

const Portfolio: React.FC = observer(() => {
    if (store.portfolio.loading) {
        return (
            <Container>
                <i className="fas fa-circle-notch fa-spin fa 3x"></i>
            </Container>
        )
    }
    if (store.portfolio.error) {
        return (
            <Container>
                <p className="notification is-warning">
                    {store.portfolio.error}
                </p>
            </Container>
        )
    }
    if (!store.portfolio.stocks.length) {
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
            {store.portfolio.stocks.map(stock => {
                return <Item {...stock} />
            })}
        </Container>
    )
})

export default Portfolio;
