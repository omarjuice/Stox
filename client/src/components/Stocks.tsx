import React from 'react';
import store from '../store';
import { RouteComponentProps } from 'react-router';
import Search from './Search';

class Stocks extends React.Component<RouteComponentProps> {
    render() {
        return (
            <div className="columns">
                <div className="column is-half">
                    <Search />
                </div>
                <div className="column is-half">
                    <button onClick={() => store.auth.logout(this.props.history)} className="button is-warning">Logout</button>
                </div>


            </div>
        );
    }
}

export default Stocks;
