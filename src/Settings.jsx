import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {url} from './api'
import withAuth from './withAuth'
import "./App.css"
class Settings extends Component {
  render() {
    return (
      <div className="">
        <div className="row">
          <div className="col-md-4 offset-md-4">
            <form onSubmit={this.props.handleSettingSubmit} className="form-signin">
              <div className="form-group">
                  <label htmlFor="title" >Website Title</label>
                  <input onChange={this.props.handleSettingChange} defaultValue={this.props.settingForm.title} type="title" id="title" className="form-control" placeholder="Title"/>
              </div>
              <div className="form-group">
                  <label htmlFor="content" >Website Logo</label>
                  <input onChange={this.props.handleSettingChange} ref={this.props.settingFileInput} type="file" id="image" className="form-control" placeholder="Title"/>
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

export default withAuth(Settings);
