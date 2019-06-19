import React from 'react';
import { Route, RouteComponentProps, withRouter } from 'react-router-dom'
import { observer } from 'mobx-react';
import store from './store';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Stocks from './components/Stocks';
import Navbar from './components/Navbar';
import Search from './components/search';

@observer
class App extends React.Component<RouteComponentProps> {
  async componentDidMount() {
    await store.auth.me()
    if (store.auth.authenticated) {

      if (!['/stocks', '/portfolio', 'transactions', '/search'].includes(this.props.location.pathname)) {
        this.props.history.push('/stocks')
      }
    } else {
      if (!['/', '/register'].includes(this.props.location.pathname)) {
        this.props.history.push('/')
      }
    }
  }

  render() {
    return (
      <div className="App">
        <Route component={Navbar} />
        <Route path="/register" exact component={Register} />
        <Route path="/stocks" exact component={Stocks} />
        <Route path="/search" exact component={Search} />
        <Route path="/" exact component={Login} />

      </div>
    );
  }
}

export default withRouter(App);
