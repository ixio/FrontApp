import React, { Component } from 'react';

import './css/font-awesome-4.7.0.min.css';
import './css/audio-annotator/materialize.min.css';
import './css/audio-annotator/audio-annotator.css';

//function insert_script(script_info, url=true)

function load_script(script_url) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = script_url;
  script.async = false;
  script.defer = true;
  document.body.appendChild(script);
}

function run_script(script_code) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.innerHTML = script_code;
  script.async = false;
  script.defer = true;
  document.body.appendChild(script);
}

class AudioAnnotator extends Component {
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
      var dataUrl = '${process.env.REACT_APP_API_URL}/annotation-task/${annotation_task_id}';
      var postUrl = '${process.env.REACT_APP_API_URL}/annotation-task/${annotation_task_id}/update_results';
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
