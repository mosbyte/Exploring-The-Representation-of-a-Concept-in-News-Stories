import React, { Component } from 'react';
import './App.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import Navbar from './components/navbar';
import Home from './components/home'
//Chant imports
import Categorise from './categorise';
import Visualise from './visualise';
import Database from './database';
import Edit from './edit'


class App extends Component {
  render() {
    return (
      <Router>
        <div className="App bg-light">
        <Navbar/>
        <div className="mycontainer">
            <Switch>
                  <Route exact path='/' component={ Home } />

                  <Route path='/:id/categorise' component={ Categorise } />
                  <Route path='/:which/edit/:id' component= {Edit } />                 
                  <Route path='/:id/visualise' component={ Visualise } />
                  <Route path='/:id/database' component={ Database } />
            </Switch>
        </div>
          
        </div>
      </Router>
      
    );
  }
}

export default App;
