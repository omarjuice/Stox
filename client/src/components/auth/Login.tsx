import React from 'react';
import store from '../../store'
import { observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import AuthContainer from './AuthContainer';




const Login: React.FC<RouteComponentProps> = observer(({ history }) => {
    const { forms } = store
    const { login } = forms
    return (
        <AuthContainer type="login">
            <div className="box">
                <form onSubmit={e => login.submit(e, history)}>
                    <div className="field">
                        <div className="control">
                            <input onChange={(e) => login.set('email', e.target.value)} value={login.email}
                                className="input is-large" type="email" placeholder="Your Email" autoFocus={true} />
                        </div>
                        <p className="help is-danger">{login.errors.email}</p>
                    </div>
                    <div className="field">
                        <div className="control">
                            <input onChange={e => login.set('password', e.target.value)} value={login.password}
                                className="input is-large" type="password" placeholder="Your Password" />
                        </div>
                        <p className="help is-danger">{login.errors.password}</p>
                    </div>
                    <button className={`button is-block is-info is-large is-fullwidth ${login.loading && 'is-loading'}`}>Login</button>
                </form>
            </div>
            <button className={`button is-text`} onClick={() => history.push('/register')}>Sign Up</button>
        </AuthContainer>
    );
})

export default Login;
