import React from 'react';
import store from '../store'
import { observer } from 'mobx-react';

@observer
class Login extends React.Component {
    state = {
        email: "",
        password: ""
    }
    handleChange = (type: string) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({
                [type]: e.target.value
            })
        }
    }
    handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { email, password } = this.state
        store.auth.login(email, password)
    }
    render() {
        return (
            <section className="hero is-light is-fullheight">
                <div className="hero-body">
                    <div className="container has-text-centered">
                        <div className="column is-4 is-offset-4">
                            <h3 className="title has-text-grey">Stocks</h3>
                            <p className="subtitle has-text-grey">Please login to proceed.</p>
                            <div className="box">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="field">
                                        <div className="control">
                                            <input onChange={this.handleChange('email')} className="input is-large" type="email" placeholder="Your Email" autoFocus={true} />
                                        </div>
                                    </div>

                                    <div className="field">
                                        <div className="control">
                                            <input onChange={this.handleChange('password')} className="input is-large" type="password" placeholder="Your Password" />
                                        </div>
                                    </div>
                                    <button className="button is-block is-info is-large is-fullwidth">Login</button>
                                </form>
                            </div>
                            <p className="has-text-grey">
                                <button className="button is-text">Sign Up</button>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default Login;
