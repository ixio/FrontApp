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
  match?: {
    params: {
      annotation_task_id: number
    }
  },
  task?: {
    dataUrl: string,
    postUrl: string
  },
  app_token: string
};

class AudioAnnotator extends Component<AudioAnnotatorProps> {
  componentDidMount() {
    let dataUrl = '';
    let postUrl = '';
    if (this.props.task) {
      dataUrl = this.props.task.dataUrl;
      postUrl = this.props.task.postUrl;
    } else if (this.props.match.params.annotation_task_id) {
      let annotation_task_id = this.props.match.params.annotation_task_id.toString();
      dataUrl = API_URL + '/' + annotation_task_id;
      postUrl = API_URL + '/' + annotation_task_id + '/update_results';
    } else {
      throw new Error('Missing correct props');
    }
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
      var dataUrl = '${dataUrl}';
      var postUrl = '${postUrl}';
      var odeToken = '${this.props.app_token}'
    `;
    run_script(script);
  }

  render() {
    return (
      <div>
        <div className="annotation">
            <div className="labels"></div>
            <div className="audio_visual"></div>
            <div className="play_bar"></div>
            <div className="hidden_img"></div>
            <div className="creation_stage_container"></div>
            <div className="submit_container"></div>
        </div>
      </div>
    );
  }
}

export default AudioAnnotator;
