import React from 'react';
import store from '../store';
import { RouteComponentProps } from 'react-router';

class Stocks extends React.Component<RouteComponentProps> {
    render() {
        return (
            <div>
                Stocks
            <button onClick={() => store.auth.logout(this.props.history)} className="button is-warning">Logout</button>
            </div>
        );
    }
}

export default Stocks;
