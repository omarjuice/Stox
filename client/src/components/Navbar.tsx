import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import store from '../store';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';

const Navbar: React.FC<RouteComponentProps> = observer(({ history }) => {
    const [active, toggle] = useState(false)
    const { auth } = store
    return (
        <nav className="navbar is-fixed-top" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <Link className="navbar-item" to={auth.authenticated ? "/portfolio" : "/"} >
                    <div className="vertical">
                        <img src="http://www.pngmart.com/files/7/Stocks-PNG-File.png" width="50" height="100" alt="stox" />
                        <span>Stox</span>
                    </div>
                </Link>
                {
                    auth.authenticated && (
                        <div className="vertical">
                            <p className="navbar-item ">Hi, {auth.user.firstName}</p>
                            <p className="navbar-item is-paddingless ">${auth.user.balance}</p>
                        </div>
                    )
                }
                {auth.authenticated && (
                    <Link className="navbar-item" to="/search">
                        <i className="fas fa-search fa-lg"></i>
                    </Link>
                )}

                <a role="button"
                    href="#/"
                    onClick={() => toggle(!active)}
                    className={`navbar-burger burger ${active && 'is-active'} anchor`}
                    aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarBasicExample" className={`navbar-menu ${active && 'is-active'}`}>

                <div className="navbar-end">
                    {auth.authenticated && (
                        <>
                            <Link className="navbar-item" to="/portfolio" onClick={() => toggle(false)}>
                                Portfolio
                            </Link>

                            <Link className="navbar-item" to="/transactions" onClick={() => toggle(false)}>
                                Transactions
                        </Link>
                        </>
                    )}
                    <div className="navbar-item">
                        {auth.authenticated && (
                            <>
                                <div className="buttons">
                                    <button onClick={() => { auth.logout(history); toggle(false) }} className="button is-warning">Logout</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
})

export default Navbar;
