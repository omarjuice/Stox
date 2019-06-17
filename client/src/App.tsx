import React from 'react';
import Login from './components/Login';
import store from './store';
import { Route, Switch, RouteComponentProps, withRouter } from 'react-router-dom'
import { observer } from 'mobx-react';
import SignUp from './components/Signup';
import Stocks from './components/Stocks';

@observer
class App extends React.Component<RouteComponentProps> {
  async componentDidMount() {
    await store.auth.me()
    if (store.auth.authenticated) {
      if (this.props.location.pathname !== '/stocks') {
        this.props.history.push('/stocks')
      }
    } else {
      if (!['/', '/signup'].includes(this.props.location.pathname)) {
        this.props.history.push('/')
      }
    }
  }

  render() {
    return (
      <div className="App">
        <Switch>
          <Route path="/signup" exact component={SignUp} />
          <Route path="/stocks" exact component={Stocks} />
          <Route path="/" exact component={Login} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
