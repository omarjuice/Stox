import React from 'react';
import { RouteComponentProps } from 'react-router';
import store from '../store';

const Navbar: React.FC<RouteComponentProps> = ({ history }) => {
    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">
            Stocks
        </nav>
    );
}

export default Navbar;
