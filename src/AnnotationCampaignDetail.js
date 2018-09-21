// @flow
import React, { Component } from 'react';
import request from 'superagent';

if (!process.env.REACT_APP_API_URL) throw new Error('REACT_APP_API_URL missing in env');
const API_URL = process.env.REACT_APP_API_URL + '/annotation-campaign/';
const USER_API_URL = process.env.REACT_APP_API_URL + '/user/list';
const REPORT_API_URL = process.env.REACT_APP_API_URL + '/annotation-campaign/report/';

type ACDProps = {
  match: {
    params: {
      campaign_id: number
    }
  },
  app_token: string
};
type ACDState = {
  campaign: ?{
    id: number,
    name: string,
    desc: string,
    start: string,
    end: string,
    annotation_set_id: number,
    owner_id: number
  },
  tasks: Array<{
    annotator_id: number,
    annotator_name: string,
    progress: string
  }>,
  error: ?{
    status: number,
    message: string
  }
};
class AnnotationCampaignDetail extends Component<ACDProps, ACDState> {
  state = {
    campaign: null,
    tasks: [],
    error: null
  }
  getData = request.get(API_URL + this.props.match.params.campaign_id)
  getUsers = request.get(USER_API_URL)

  componentDidMount() {
    return Promise.all([
      this.getData.set('Authorization', 'Bearer ' + this.props.app_token),
      this.getUsers.set('Authorization', 'Bearer ' + this.props.app_token)
    ]).then(([req_data, req_users]) => {
      let users = {};
      req_users.body.forEach(user => {
        users[user.id] = user.email;
      })
      let tmp_tasks = {};
      req_data.body.tasks.forEach(task => {
        if (!tmp_tasks[task.annotator_id]) {
          tmp_tasks[task.annotator_id] = {};
        }
        tmp_tasks[task.annotator_id][task.status] = task.count;
      })
      let tasks = [];
      Object.keys(tmp_tasks).forEach(key => {
        let val = tmp_tasks[key];
        let total = Object.values(val).map(v => { return parseInt(v, 10); }).reduce((a, b) => a + b, 0);
        let progress = (val[2] || 0).toString() + '/' + total.toString();
        tasks.push({ annotator_id: parseInt(key, 10), annotator_name: users[key], progress: progress });
      });
      this.setState({
        campaign: req_data.body.campaign,
        tasks: tasks
      });
    }).catch(err => {
      if (err.status && err.status === 401) {
        // Server returned 401 which means token was revoked
        document.cookie = 'token=;max-age=0';
        window.location.reload();
      }
      this.setState({
        error: err
      });
    });
  }

  componentWillUnmount() {
    this.getData.abort();
    this.getUsers.abort();
  }

  render() {
    let annotation_tasks = this.state.tasks.map(task => {
      return (
        <tr key={task.annotator_id}>
          <td>{task.annotator_name}</td>
          <td>{task.progress}</td>
        </tr>
      );
    });

    if (this.state.error) {
      return (
        <div className="col-sm-9 border rounded">
          <h1>Annotation Campaign</h1>
          <p className="error-message">{this.state.error.message}</p>
        </div>
      )
    }

    if (!this.state.campaign) {
      return (
        <div className="col-sm-9 border rounded">
          <h6>Loading Annotation Campaign ...</h6>
        </div>
      )
    }

    return (
      <div className="col-sm-9 border rounded">
        <h1 className="text-center">{this.state.campaign.name}</h1>
        <div className="row">
          <div className="col-sm-4"><b>Annotation set:</b> #{this.state.campaign.annotation_set_id}</div>
          <div className="col-sm-4"><b>Start:</b> {new Date(this.state.campaign.start).toLocaleDateString()}</div>
        {this.state.campaign  && this.state.campaign.end && // This is needed for Flow which doesn't make much sense
          <div className="col-sm-4"><b>End:</b> {new Date(this.state.campaign.end).toLocaleDateString()}</div>
        }
        </div>
        <div className="col-sm-12 border rounder">
          <center><h3>Description</h3></center>
          {this.state.campaign && this.state.campaign.desc && // This is needed for Flow which doesn't make much sense
            this.state.campaign.desc
          }
        </div>
        <br />
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Annotator</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
          {annotation_tasks}
          </tbody>
        </table>
        <p className="text-center"><a href={REPORT_API_URL + this.props.match.params.campaign_id} className="btn btn-primary">Download CSV results</a></p>
      </div>
    )
  }
}

export default AnnotationCampaignDetail;
