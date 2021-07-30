import React from 'react';
import './index.css';
import './App.css';
import SearchBox from './components/searchBox';

class App extends React.Component {
  constructor(props) { 
    super(props);
    this.props = props
    console.log(`loaded base class`)
   }
  
  render() {
    return (<div className="App">
    <header className="App-header">
       <SearchBox placeholder="Type a ID and hit Enter" id="primary"/>
       </header>
    </div>)
  }
}

export default App;

