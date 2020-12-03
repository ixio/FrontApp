// @flow
import React, { Component } from 'react';
import request from 'superagent';

// API constants
if (!process.env.REACT_APP_API_URL) throw new Error('REACT_APP_API_URL missing in env');
const POST_ADD_TAG_API_URL = process.env.REACT_APP_API_URL + '/annotation-set/';

type AnnotationTagAdderProps = {
  app_token: string,
  annotationSetId: number,
  onTagCreation: (string) => void,
};

type AnnotationTagAdderState = {
  error: ?string,
  tagName: string,
};

class AnnotationTagAdder extends Component<AnnotationTagAdderProps, AnnotationTagAdderState> {
  state = {
    error: undefined,
    tagName: '',
  }
  postAnnotationTag = { abort: () => null }

  componentWillUnmount() {
    this.postAnnotationTag.abort();
  }

  handleNameChange = (event: SyntheticEvent<HTMLInputElement>) => {
    this.setState({tagName: event.currentTarget.value});
  }

  handleSubmit = (event: SyntheticEvent<HTMLInputElement>) => {
    event.preventDefault();
    this.setState({error: null});
    let tagName = this.state.tagName.trim();
    if (tagName) {
      let res = {
        tag_name: this.state.tagName.trim(),
      };
      this.postAnnotationTag = request.post(POST_ADD_TAG_API_URL + this.props.annotationSetId + "/add-tag");
      return this.postAnnotationTag.set('Authorization', 'Bearer ' + this.props.app_token).send(res)
      .then(() => {
        this.props.onTagCreation(tagName);
        this.setState({tagName: ''});
      }).catch(err => {
        if (err.status && err.status === 401) {
          // Server returned 401 which means token was revoked
          document.cookie = 'token=;max-age=0';
          window.location.reload();
        }
        else if (err.status && err.response) {
          this.setState({
            error: err
          });
        } else {
          throw err;
        }
      });  
    }
  }

  render() {
    return (
      <form className="form-inline" onSubmit={this.handleSubmit}>
        <input id="cac-name" className="form-control mb-2" type="text" value={this.state.tagName} onChange={this.handleNameChange} placeholder="New tag" />
        <input className="btn btn-primary mb-2" type="submit" value="Add tag" />
      </form>
    );
  }
}

export default AnnotationTagAdder;
