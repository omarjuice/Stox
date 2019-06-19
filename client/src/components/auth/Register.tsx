import React from 'react';
import store from '../../store'
import { observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import AuthContainer from './AuthContainer';



const Register: React.FC<RouteComponentProps> = observer(({ history }) => {
    const { forms } = store
    const { register } = forms

    return (
        <AuthContainer type="register">
            <div className="box">
                <form onSubmit={e => forms.submitRegister(e, history)}>
                    <div className="field">
                        <div className="control">
                            <input onChange={e => register.set('email', e.target.value)} value={register.email} className="input is-large" type="email" placeholder="Your Email" autoFocus={true} />
                        </div>
                        <p className="help is-danger">{register.errors.email}</p>
                    </div>
                    <div className="field">
                        <div className="control">
                            <input onChange={e => register.set('firstName', e.target.value)} value={register.firstName} className="input is-large" type="text" placeholder="Your First Name" />
                        </div>
                        <p className="help is-danger">{register.errors.firstName}</p>
                    </div>
                    <div className="field">
                        <div className="control">
                            <input onChange={e => register.set('lastName', e.target.value)} value={register.lastName} className="input is-large" type="text" placeholder="Your Last Name" />
                        </div>
                        <p className="help is-danger">{register.errors.lastName}</p>
                    </div>
                    <div className="field">
                        <div className="control">
                            <input onChange={e => register.set('password', e.target.value)} value={register.password} className="input is-large" type="password" placeholder="Your Password" />
                        </div>
                        <p className="help is-danger">{register.errors.password}</p>
                    </div>
                    <div className="field">
                        <div className="control">
                            <input onChange={e => register.set('reenter', e.target.value)} value={register.reenter} className="input is-large" type="password" placeholder="Reenter you password" />
                        </div>
                        <p className="help is-danger">{register.errors.reenter}</p>
                    </div>
                    <button className="button is-block is-info is-large is-fullwidth">Register</button>
                </form>
            </div>
            <p className="has-text-grey">
                <button className="button is-text" onClick={() => history.push('/')}>Login</button>
            </p>
        </AuthContainer>
    );

})

export default Register;
