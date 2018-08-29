import React from 'react';

import Datasets from './Datasets'

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import './css/bootstrap-4.1.3.min.css';
import './css/app.css';

const Navbar = () => (
  <div className="col-sm-3 border rounded">
    <h1>Navbar</h1>
    <ul>
      <li><Link to="/datasets">Datasets</Link></li>
      <li><Link to="/">Annotation campaigns</Link></li>
    </ul>
  </div>
);

const OdeApp = () => (
  <div className="container">
    <div className="row text-center">
      <div className="col-sm-12"><h1>ODE FrontManager</h1></div>
    </div>
    <div className="row text-center h-100 main">
      <Navbar />
      <Switch>
        <Route exact path='/' component={Datasets} />
        <Route path='/datasets' component={Datasets} />
      </Switch>
    </div>
  </div>
);

const App = () => (
  <Router>
    <Switch>
      <Route component={OdeApp} />
    </Switch>
  </Router>
);

export default App;
