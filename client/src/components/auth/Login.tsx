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
                <form onSubmit={e => forms.submitLogin(e, history)}>
                    <div className="field">
                        <div className="control">
                            <input onChange={(e) => login.set('email', e.target.value)} value={login.email} className="input is-large" type="email" placeholder="Your Email" autoFocus={true} />
                        </div>
                        <p className="help is-danger">{login.errors.email}</p>
                    </div>
                    <div className="field">
                        <div className="control">
                            <input onChange={e => login.set('password', e.target.value)} value={login.password} className="input is-large" type="password" placeholder="Your Password" />
                        </div>
                        <p className="help is-danger">{login.errors.password}</p>
                    </div>
                    <button className="button is-block is-info is-large is-fullwidth">Login</button>
                </form>
            </div>
            <p className="has-text-grey">
                <button className={`button is-text ${login.loading && 'is-loading'}`} onClick={() => history.push('/register')}>Sign Up</button>
            </p>
        </AuthContainer>
    );
})

export default Login;
