import React from 'react';
import { Route, RouteComponentProps, withRouter } from 'react-router-dom'
import { observer } from 'mobx-react';
import store from './store';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Navbar from './components/Navbar';
import Search from './components/search';
import Portfolio from './components/portfolio';
import Transactions from './components/transactions';

@observer
class App extends React.Component<RouteComponentProps> {
  async componentDidMount() {
    await store.auth.me()
    if (store.auth.authenticated) {

      if (!['/portfolio', '/transactions', '/search'].includes(this.props.location.pathname)) {
        this.props.history.push('/portfolio')
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
        <Route path="/search" exact component={Search} />
        <Route path="/portfolio" exact component={Portfolio} />
        <Route path="/transactions" exact component={Transactions} />
        <Route path="/" exact component={Login} />
      </div>
    );
  }
}

export default withRouter(App);
