import React from 'react';
import store from '../../store';
import { observer } from 'mobx-react';

type Props = {
    type: 'login' | 'register'
}

const AuthContainer: React.FC<Props> = observer(({ children, type }) => {
    const error = store.forms[type].errors.main
    return (
        <section className="hero is-light is-fullheight">
            <div className="hero-body">
                <div className="container has-text-centered">
                    <div className="column is-4 is-offset-4">
                        <p className={`subtitle has-text-${error ? 'danger' : 'grey'}`}>{error ? error : type === 'login' ? 'Please login to proceed.' : 'Register'}</p>
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
})

export default AuthContainer;
