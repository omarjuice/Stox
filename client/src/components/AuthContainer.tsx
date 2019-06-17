import React from 'react';

type Props = {
    type: 'login' | 'register'
}

const AuthContainer: React.FC<Props> = ({ children, type }) => {
    return (
        <section className="hero is-light is-fullheight">
            <div className="hero-body">
                <div className="container has-text-centered">
                    <div className="column is-4 is-offset-4">
                        <p className="subtitle has-text-grey">{type === 'login' ? 'Please login to proceed.' : 'Register'}</p>
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AuthContainer;
