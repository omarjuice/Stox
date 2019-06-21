import React from 'react';
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react';
import store from '../../store';
import Item from './Item';

const Container: React.FC = ({ children }) => {
    return (
        <div className="container transactions has-text-centered">
            <h1 className="title is-3">Transactions</h1>
            {children}
        </div>
    )
}

const Transactions: React.FC = observer(() => {
    const { transactions } = store
    if (transactions.loading) {
        return (
            <Container>
                <i className="fas fa-circle-notch fa-spin fa 3x"></i>
            </Container>
        )
    }
    if (transactions.error) {
        return (
            <Container>
                <p className="notification is-warning">
                    {transactions.error}
                </p>
            </Container>
        )
    }
    if (!transactions.history.length) {
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
    const oneQuarter = "column is-one-quarter-desktop is-half-mobile"
    return (
        <Container>
            <div className="columns is-centered">
                <div className="column is-10">
                    <div className="columns is-centered is-vcentered is-mobile is-multiline">
                        <div className={oneQuarter}>
                            Type
                        </div>
                        <div className={oneQuarter}>
                            Symbol
                        </div>
                        <div className={oneQuarter}>
                            Amount
                        </div>
                        <div className={oneQuarter}>
                            Date
                        </div>
                    </div>
                    {transactions.history.map((transaction, i) => <Item key={transaction.id} i={i} transaction={transaction} />)}
                </div>
            </div>
        </Container>
    )
})

export default Transactions