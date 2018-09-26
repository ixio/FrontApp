// @flow
import React, { Component } from 'react';
import request from 'superagent';
import * as utils from './utils';

import AudioAnnotator from './AudioAnnotator';
import { ShowAnnotationSet } from './CreateAnnotationCampaign';
import { Navbar } from './App'

if (!process.env.REACT_APP_API_URL) throw new Error('REACT_APP_API_URL missing in env');
const GET_ANNOTATION_SETS_API_URL = process.env.REACT_APP_API_URL + '/annotation-set/list';
const POST_API_URL = process.env.REACT_APP_API_URL + '/annotation-task/local';

class LocalAudioAnnotator extends Component {
  state = {
    annotation_set: null,
    annotation_set_choices: {},
    file: null,
    task: null
  }
  getAnnotationSets = request.get(GET_ANNOTATION_SETS_API_URL)

  componentDidMount() {
    return this.getAnnotationSets.set('Authorization', 'Bearer ' + this.props.app_token).then(req => {
      this.setState({
        annotation_set_choices: utils.arrayToObject(req.body, 'id')
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

  handleAnnotationSetChange = (event: SyntheticEvent<HTMLInputElement>) => {
    this.setState({annotation_set: parseInt(event.currentTarget.value, 10)});
  }

  handleFileChange = (event: SyntheticEvent<HTMLInputElement>) => {
    this.setState({ file: event.target.files[0] });
  }

  handleSubmit = (event: SyntheticEvent<HTMLInputElement>) => {
    event.preventDefault();
    var odeTask = {
        feedback: 'none',
        visualization: 'spectrogram',
        proximityTag: [],
        annotationTag: this.state.annotation_set_choices[this.state.annotation_set].tags,
        alwaysShowTags: true,
        url: URL.createObjectURL(this.state.file)
    };
    let blob = new Blob([JSON.stringify({ task: odeTask })], {type : 'application/json'});
    this.setState({
      task: {
        dataUrl: URL.createObjectURL(blob),
        postUrl: encodeURI(POST_API_URL + '/' + this.state.file.name + '/update_results')
      }
    });
  }

  render() {
    if (this.state.task) {
      return (
        <AudioAnnotator app_token={this.props.app_token} task={this.state.task} />
      );
    } else {
      return (
        <div className="container">
          <div className="row text-center">
            <div className="col-sm-12"><h1></h1></div>
          </div>
          <div className="row text-left h-100 main">
            <Navbar logout={this.props.logout}/>
            <div className="col-sm-9 border rounded">
              <h1 className="text-center">Test Annotation on local file</h1>
              <br />
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <ShowAnnotationSet annotation_sets={this.state.annotation_set_choices} onChange={this.handleAnnotationSetChange} />
                </div>
                <br />
                <div className="form-group custom-file">
                  <div className="text-center">
                    <input type="file" accept="audio/x-wav" onChange={this.handleFileChange}/>
                  </div>
                </div>
                <br />
                <br />
                <div className="text-center">
                  <input className="btn btn-primary" type="submit" value="Annotate File" />
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default LocalAudioAnnotator;
