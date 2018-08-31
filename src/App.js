import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import request from 'superagent';

import Datasets from './Datasets';

import './css/bootstrap-4.1.3.min.css';
import './css/app.css';

const getToken = async () => {
  var res = await request.post(process.env.REACT_APP_API_URL + '/authentication/authenticate').send({username: 'admin@test.ode', password: 'password'});
  return res.body.token;
}

const Navbar = () => (
  <div className="col-sm-3 border rounded">
    <ul>
      <li><Link to="/datasets">Datasets</Link></li>
      <li><Link to="/">Annotation campaigns</Link></li>
    </ul>
  </div>
);

const OdeApp = (props) => (
  <div className="container">
    <div className="row text-center">
      <div className="col-sm-12"><h1>Ocean Data Explorer</h1></div>
    </div>
    <div className="row text-left h-100 main">
      <Navbar />
      <Switch>
        <Route exact path='/' render={() => <Datasets app_token={props.app_token} />} />
        <Route path='/datasets' render={() => <Datasets app_token={props.app_token} />} />
      </Switch>
    </div>
  </div>
);

class App extends Component {
  state = {
    app_token: getToken()
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route render={() => <OdeApp app_token={this.state.app_token} />} />
        </Switch>
      </Router>
    )
  }
}

export default App;
