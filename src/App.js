import React, { useState } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import User from './views/User';

const App = () => {
  const [userIdValue, setUserIdValue] = useState(``);
  const history = useHistory();
  const submitHandler = e => {
    e.preventDefault();
    history.push(`/${userIdValue}`)
  }
  return (
    <div className='App'>
        <header className='App-header'>
          <form onSubmit={submitHandler}>
            <input 
              value={userIdValue}
              placeholder='Type a ID and hit Enter' 
              id='primary'
              onChange={e => setUserIdValue(e.target.value)}
            />
          </form>
        </header>
        <Switch>
          <Route path='/:userId'>
            <User />
          </Route>
        </Switch>
    </div>
  )
}

export default App;

