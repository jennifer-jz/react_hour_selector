import React, { Component } from 'react';
import './App.css';
import HourSelector from './components/hour-selector/hour-selector';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

library.add(faCalendarAlt);

class App extends Component {
  render() {
    let date = new Date();
    date.setDate(date.getDate() - 4);
    return (
      <div className="App">
        <header className="App-header">
          
        </header>
        <HourSelector widthLevel={6}/>
      </div>
    );
  }
}

export default App;
