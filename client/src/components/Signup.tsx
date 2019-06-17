import React from 'react';
import store from '../store'
import { observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import AuthContainer from './AuthContainer';



@observer
class SignUp extends React.Component<RouteComponentProps> {
    state = {
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        reenter: ""
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
        const { email, password, reenter, firstName, lastName } = this.state
        if (reenter !== password) return
        await store.auth.signup({ email, password, firstName, lastName })
        if (store.auth.authenticated) {
            this.props.history.push('/stocks')
        }
    }
    render() {
        return (
            <AuthContainer type="signup">
                <div className="box">
                    <form onSubmit={this.handleSubmit}>
                        <div className="field">
                            <div className="control">
                                <input onChange={this.handleChange('email')} value={this.state.email} className="input is-large" type="email" placeholder="Your Email" autoFocus={true} />
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <input onChange={this.handleChange('firstName')} value={this.state.firstName} className="input is-large" type="text" placeholder="Your First Name" />
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <input onChange={this.handleChange('lastName')} value={this.state.lastName} className="input is-large" type="text" placeholder="Your Last Name" />
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <input onChange={this.handleChange('password')} value={this.state.password} className="input is-large" type="password" placeholder="Your Password" />
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <input onChange={this.handleChange('reenter')} value={this.state.reenter} className="input is-large" type="password" placeholder="Reenter you password" />
                            </div>
                        </div>
                        <button className="button is-block is-info is-large is-fullwidth">Signup</button>
                    </form>
                </div>
                <p className="has-text-grey">
                    <button className="button is-text" onClick={() => this.props.history.push('/')}>Login</button>
                </p>
            </AuthContainer>
        );
    }
}

export default SignUp;
