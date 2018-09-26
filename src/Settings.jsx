import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {url} from './api'
import "./App.css"
class Settings extends Component {
  render() {
    return (
      <div className="py-5">
        <div className="row mt-4">
          <div className="col-md-4">
            <form onSubmit={this.props.handleSettingSubmit} className="form-signin">
              <h2 className="">Website settings</h2>

              <div className="form-group">
                  <label htmlFor="title" className="sr-only">Website Title</label>
                  <input onChange={this.props.handleSettingChange} defaultValue={this.props.settingForm.title} type="title" id="title" className="form-control" placeholder="Title"/>
              </div>
              <div className="form-group">
                  <label htmlFor="content" className="sr-only">Website Logo</label>
                  <input onChange={this.props.handleSettingChange} defaultValue={this.props.settingForm.image} ref={this.props.settingFileInput} type="file" id="image" className="form-control" placeholder="Title"/>
              </div>

              <img className="w-100 pb-2" src={this.props.settingForm.image}/>
              <button className="btn btn-lg btn-primary btn-block">Update</button>
              </form>
            </div>

        </div>
      </div>
    );
  }
}

Settings.propTypes = {
};

export default Settings;
