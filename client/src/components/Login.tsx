import React from 'react';
import store from '../store'
import { observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import AuthContainer from './AuthContainer';



@observer
class Login extends React.Component<RouteComponentProps> {
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
    handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { email, password } = this.state
        await store.auth.login(email, password)
        if (store.auth.authenticated) {
            this.props.history.push('/stocks')
        }
    }
    render() {
        return (
            <AuthContainer type="login">
                <div className="box">
                    <form onSubmit={this.handleSubmit}>
                        <div className="field">
                            <div className="control">
                                <input onChange={this.handleChange('email')} value={this.state.email} className="input is-large" type="email" placeholder="Your Email" autoFocus={true} />
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <input onChange={this.handleChange('password')} value={this.state.password} className="input is-large" type="password" placeholder="Your Password" />
                            </div>
                        </div>
                        <button className="button is-block is-info is-large is-fullwidth">Login</button>
                    </form>
                </div>
                <p className="has-text-grey">
                    <button className="button is-text" onClick={() => this.props.history.push('/signup')}>Sign Up</button>
                </p>
            </AuthContainer>
        );
    }
}

export default Login;
