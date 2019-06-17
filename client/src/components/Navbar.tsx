import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import store from '../store';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';

const Navbar: React.FC<RouteComponentProps> = observer(({ history }) => {
    const [active, toggle] = useState(false)
    return (
        <nav className="navbar is-fixed-top" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <Link className="navbar-item" to={store.auth.authenticated ? "/stocks" : "/"} >
                    <img src="http://www.pngmart.com/files/7/Stocks-PNG-File.png" width="50" height="100" alt="stox" />Stox
                </Link>

                <button
                    onClick={() => toggle(!active)}
                    className={`navbar-burger burger ${active && 'is-active'} anchor`}
                    aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </button>
            </div>

            <div id="navbarBasicExample" className={`navbar-menu ${active && 'is-active'}`}>
                {store.auth.authenticated && (
                    <div className="navbar-start">
                        <a className="navbar-item" href="#">
                            Portfolio
                        </a>

                        <a className="navbar-item" href="#">
                            Transactions
                        </a>
                    </div>
                )}
                <div className="navbar-end">
                    <div className="navbar-item">
                        {store.auth.authenticated && (
                            <div className="buttons">
                                <button onClick={() => store.auth.logout(history)} className="button is-warning">Logout</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
})

export default Navbar;
