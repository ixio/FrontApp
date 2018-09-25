// @flow
import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

import Login from './Login';
import DatasetList from './DatasetList';
import AnnotationCampaignList from './AnnotationCampaignList';
import AnnotationCampaignDetail from './AnnotationCampaignDetail';
import CreateAnnotationCampaign from './CreateAnnotationCampaign';
import AnnotationTaskList from './AnnotationTaskList';
import AudioAnnotator from './AudioAnnotator';
import LocalAudioAnnotator from './LocalAudioAnnotator';

import './css/bootstrap-4.1.3.min.css';
import './css/app.css';

const Navbar = (props) => (
  <div className="col-sm-3 border rounded">
    <ul>
      <li><Link to="/datasets">Datasets</Link></li>
      <li><Link to="/annotation-campaigns">Annotation campaigns</Link></li>
      <li><Link to="/local-annotation">Test local annotation</Link></li>
      <br />
      <li><button className="btn btn-secondary" onClick={props.logout}>Logout</button></li>
    </ul>
  </div>
);

type OdeAppProps = {
  app_token: string
};
const OdeApp = (props: OdeAppProps) => (
  <div className="container">
    <div className="row text-center">
      <div className="col-sm-12"><h1>Ocean Data Explorer</h1></div>
    </div>
    <div className="row text-left h-100 main">
      <Navbar logout={props.logout}/>
      <Switch>
        <Route exact path='/' render={() => <DatasetList app_token={props.app_token} />} />
        <Route path='/datasets' render={() => <DatasetList app_token={props.app_token} />} />
        <Route path='/annotation-campaigns' render={() => <AnnotationCampaignList app_token={props.app_token} />} />
        <Route path='/create-annotation-campaign' render={route_props => <CreateAnnotationCampaign app_token={props.app_token} {...route_props} />} />
        <Route path='/annotation_tasks/:campaign_id' render={route_props => <AnnotationTaskList app_token={props.app_token} {...route_props} />} />
        <Route path='/annotation_campaign/:campaign_id' render={route_props => <AnnotationCampaignDetail app_token={props.app_token} {...route_props} />} />
      </Switch>
    </div>
  </div>
);

type AppState = {
  app_token: string
};
class App extends Component<void, AppState> {
  state = {
    app_token: ''
  }

  componentDidMount() {
    if (document.cookie) {
      let tokenItem = document.cookie.split(';').filter((item) => item.includes('token='))[0];
      if (tokenItem) {
        this.setState({
          app_token: tokenItem.split('=').pop()
        })
      }
    }
  }

  handleToken = (token: string) => {
    this.setState({
      app_token: token
    });
    // Cookie is set to expire after 30 days
    document.cookie = 'token=' + token + ';max-age=2592000';
  }

  logout = (history) => {
    document.cookie = 'token=;max-age=0';
    this.setState({
      app_token: ''
    });
    history.push('/');
  }

  render() {
    if (this.state.app_token) {
      return (
        <Router>
          <Switch>
            <Route path='/audio-annotator/:annotation_task_id' render={route_props => <AudioAnnotator app_token={this.state.app_token} {...route_props} />} />
            <Route path='/annotation_tasks/0' render={() => <Redirect to="/local-annotation" /> } />
            <Route path='/local-annotation' render={route_props => <LocalAudioAnnotator app_token={this.state.app_token} logout={() => this.logout(route_props.history)} />} />
            <Route render={route_props => <OdeApp app_token={this.state.app_token} logout={() => this.logout(route_props.history)} />} />
          </Switch>
        </Router>
      )
    } else {
      return (
        <Login handleToken={this.handleToken} />
      )
    }
  }
}

export default App;
export { Navbar };
