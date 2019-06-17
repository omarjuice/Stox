import React from 'react';
import Login from './components/Login';
import store from './store';
import { Route, RouteComponentProps, withRouter } from 'react-router-dom'
import { observer } from 'mobx-react';
import Register from './components/Register';
import Stocks from './components/Stocks';
import Navbar from './components/Navbar';

@observer
class App extends React.Component<RouteComponentProps> {
  async componentDidMount() {
    await store.auth.me()
    if (store.auth.authenticated) {
      if (this.props.location.pathname !== '/stocks') {
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
        <Route path="/" exact component={Login} />

      </div>
    );
  }
}

export default withRouter(App);
