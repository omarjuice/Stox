import React from 'react';
// import store from '../store';
import { RouteComponentProps } from 'react-router';
import Search from './Search';

const Stocks: React.FC<RouteComponentProps> = () => {
    return (
        <div className="columns">
            <div className="column is-half">
                <Search />
            </div>
            <div className="column is-half">

            </div>


        </div>
    );

}

export default Stocks;
