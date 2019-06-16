import React from 'react';
import Login from './components/Login';
import store from './store';
import { observer } from 'mobx-react';
const App: React.FC = observer(() => {
  return (
    <div className="App">
      {store.auth.authenticated && 'AUTHENTICATED'}
      <Login />
    </div>
  );
})

export default App;
