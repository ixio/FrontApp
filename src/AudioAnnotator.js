// @flow
import React, { Component } from 'react';

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

class AudioAnnotator extends Component<AudioAnnotatorProps> {
  componentDidMount() {
    let annotation_task_id = this.props.match.params.annotation_task_id;
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

  render() {
    return (
      <div>
        <div id="audio-annotator" className="undisplayed">
          <div className="row header">
              <div className="col s12">
                  <div className="divider"></div>
              </div>
              <div className="col s6">
              </div>
              <div className="col s6 ">
                  <div className="right audio-annotator-instructions">
                      <a className="waves-effect waves-light modal-trigger right btn" id="trigger" href="#instructions-modal">Instructions</a>
                  </div>
              </div>
          </div>
          <div id="instructions-modal" className="modal">
              <div className="modal-footer">
                  <a href="#!" className="modal-action modal-close waves-effect waves-red btn-flat">Close</a>
              </div>
              <div className="modal-content">
                  <div id="instructions-container"></div>
                  <div className="videowrapper">
                      <iframe id="tutorial-video" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
                  </div>
              </div>
          </div>
          <div className="annotation">
              <div className="labels"></div>
              <div className="audio_visual"></div>
              <div className="play_bar"></div>
              <div className="hidden_img"></div>
              <div className="creation_stage_container"></div>
              <div className="submit_container"></div>
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
