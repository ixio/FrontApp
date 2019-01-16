// @flow
import React, { Component } from 'react';
import request from 'superagent';

import './css/font-awesome-4.7.0.min.css';
import './css/audio-annotator/materialize.min.css';
import './css/audio-annotator/audio-annotator.css';

if (!process.env.REACT_APP_API_URL) throw new Error('REACT_APP_API_URL missing in env');
const API_URL = process.env.REACT_APP_API_URL + '/annotation-task';

function insert_script(script_info, url) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  if (url) {
    script.src = script_info;
  } else {
    script.innerHTML = script_info;
  }
  script.async = false;
  script.defer = true;
  if (!document.body) throw new Error("Unexpectedly missing <body>");
  document.body.appendChild(script);
}
const load_script = script_url => insert_script(script_url, true);
const run_script = script_code => insert_script(script_code, false);

type AudioAnnotatorProps = {
  match: {
    params: {
      annotation_task_id: number
    }
  },
  app_token: string
};

type AudioAnnotatorState = {
  tags: Array<string>,
  chosen_tag: string,
  start_time: integer
};

class AudioAnnotator extends Component<AudioAnnotatorProps, AudioAnnotatorState> {
  state = {
    tags: [],
    chosen_tag: null,
    start_time: new Date().getTime()
  }
  getAnnotationTask = { abort: () => null }
  postAnnotationTask = { abort: () => null }

  componentDidMount() {
    let annotation_task_id = this.props.match.params.annotation_task_id;
    this.postAnnotationTask = request.post(`${API_URL}/${annotation_task_id}/update-results`);
    this.getAnnotationTask = request.get(`${API_URL}/${annotation_task_id}`);
    this.getAnnotationTask.set('Authorization', 'Bearer ' + this.props.app_token).then(res => {
      this.setState({tags: res.body.task.annotationTag})
    }).catch(err => {
      if (err.status && err.status === 401) {
        // Server returned 401 which means token was revoked
        document.cookie = 'token=;max-age=0';
        window.location.reload();
      } else {
        throw err;
      }
    });
    load_script("/audio-annotator/static/js/lib/jquery-2.2.3.min.js");
    load_script("/audio-annotator/static/js/lib/materialize.min.js");
    load_script("/audio-annotator/static/js/lib/wavesurfer.min.js");
    load_script("/audio-annotator/static/js/lib/wavesurfer.spectrogram.min.js");
    load_script("/audio-annotator/static/js/colormap/colormap.min.js");
    load_script("/audio-annotator/static/js/src/message.js");
    load_script("/audio-annotator/static/js/src/wavesurfer.regions.js");
    load_script("/audio-annotator/static/js/src/wavesurfer.drawer.extended.js");
    load_script("/audio-annotator/static/js/src/wavesurfer.labels.js");
    load_script("/audio-annotator/static/js/src/hidden_image.js");
    load_script("/audio-annotator/static/js/src/components.js");
    load_script("/audio-annotator/static/js/src/annotation_stages.js");
    load_script("/audio-annotator/static/js/src/main.js");
    let script = `
      var dataUrl = '${API_URL}/${annotation_task_id}';
      var postUrl = '${API_URL}/${annotation_task_id}/update-results';
      var odeToken = '${this.props.app_token}'
    `;
    run_script(script);
  }

  componentWillUnmount() {
    this.getAnnotationTask.abort();
    this.postAnnotationTask.abort();
  }

  tagClick = (tag: string, event: SyntheticEvent<HTMLInputElement>) => {
    this.setState({chosen_tag: tag})
  }

  handleSubmit = (event: SyntheticEvent<HTMLInputElement>) => {
    let annotation_res = {
      task_start_time: this.state.start_time,
      task_end_time: new Date().getTime(),
      visualization: 'spectrogram',
      annotations: [{
        start: 0,
        end: 0,
        annotation: this.state.chosen_tag
      }],
      deleted_annotations: [],
      annotation_events: [],
      play_events: [],
      final_solution_shown: false
    };
    return this.postAnnotationTask.set('Authorization', 'Bearer ' + this.props.app_token).send(annotation_res)
    .then(res => {
      console.log(res.body)
      if (res.body.next_task === null) {
        this.props.history.push('/annotation_tasks/' + res.body.campaign_id);
      } else {
        this.props.history.push('/audio-annotator/' + res.body.next_task);
        window.location.reload();
      }
    }).catch(err => {
      if (err.status && err.status === 401) {
        // Server returned 401 which means token was revoked
        document.cookie = 'token=;max-age=0';
        window.location.reload();
      } else {
        throw err;
      }
    });
  }

  render() {
    let tags = this.state.tags.map((tag, index) => {
      return (
        <button key={index} className="annotation_tag btn" onClick={e => this.tagClick(tag, e)}>{tag}</button>
      )
    })
    return (
      <div>
        <div id="audio-annotator" className="undisplayed">
          <div className="row header audio-annotator-instructions-outside">
            <div className="col audio-annotator-instructions-outside">
              <div className="right audio-annotator-instructions">
                <a className="waves-effect waves-light modal-trigger right btn" id="trigger" href="#instructions-modal">Instructions</a>
              </div>
            </div>
          </div>
          <div id="instructions-modal" className="modal audio-annotator-modal">
            <div className="modal-footer">
              <a href="#!" className="modal-action modal-close waves-effect waves-red btn-flat">Close</a>
            </div>
            <div className="modal-content">
              <div id="instructions-container"></div>
              <div className="videowrapper">
                <iframe id="tutorial-video" frameBorder="0" scrolling="no" allowFullScreen></iframe>
              </div>
            </div>
          </div>
          <div className="annotation">
            <div className="labels"></div>
            <div className="audio_visual">
              <img className="audio-annotator-legend" src="/audio-annotator/static/img/legend_8k.png" />
            </div>
            <div className="play_bar"></div>
            <div className="hidden_img"></div>
            <div className="creation_stage_container" hidden></div>
            <div className="audio-annotator-tags-container">
              <div className="audio-annotator-tags-label">
                Label:
              </div>
              <div className="audio-annotator-tags">
                {tags}
              </div>
            </div>
            <div className="submit_container" hidden></div>
            <div className="audio-annotator-submit">
              <button className="btn submit" onClick={this.handleSubmit}>SUBMIT &amp; LOAD NEXT RECORDING</button>
            </div>
          </div>
        </div>
        <div id="audio-annotator-loader" className="loader">
          LOADING
        </div>
      </div>
    );
  }
}

export default AudioAnnotator;
