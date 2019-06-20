import React from 'react';
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react';
import store from '../../store';
import Item from './Item';

const Container: React.FC = ({ children }) => {
    return (
        <div className="container transactions has-text-centered">
            {children}
        </div>
    )
}

const Transactions: React.FC = observer(() => {
    if (store.transactions.loading) {
        return (
            <Container>
                <i className="fas fa-circle-notch fa-spin fa 3x"></i>
            </Container>
        )
    }
    if (store.transactions.error) {
        return (
            <Container>
                <p className="notification is-warning">
                    {store.transactions.error}
                </p>
            </Container>
        )
    }
    if (!store.transactions.history.length) {
        return (
            <Container>
                <p className="notification is-grey">
                    You have no transaction history.
                    <br />
                    <Link to="/search">
                        Make some?
                   </Link>
                </p>
            </Container>
        )
    }
    return (
        <Container>
            <div className="columns">
                <div className="column is-one-quarter">
                    Type
                </div>
                <div className="column is-one-quarter">
                    Symbol
                </div>
                <div className="column is-one-quarter">
                    Amount
                </div>
                <div className="column is-one-quarter">
                    Date
                </div>
            </div>
            {store.transactions.history.map(transaction => <Item {...transaction} />)}
        </Container>
    )
})

export default Transactions