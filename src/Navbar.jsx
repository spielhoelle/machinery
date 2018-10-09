import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import "./App.css"
import AuthSingleton from "./AuthService";
const Auth = AuthSingleton.getInstance();

class Navbar extends Component {
  render() {
    if (this.props.settingForm !== undefined){
      var image = this.props.settingForm.image
      var title = this.props.settingForm.title
    } else {
      var image = ""
      var title = ""
      
    }
    return (

      <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <a className="navbar-brand" href="/admin">
          <img className="" style={{width: 100}} src={image}/>
          {title}
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse justify-content-end navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">

            <li className="nav-item">
              <Link className="nav-link" to="/admin">Posts</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/admin/settings">Settings</Link>
            </li>

            <li className="nav-item">
              <button className="border-0 bg-transparent nav-item nav-link active" href="#" onClick={this.props.logout}>Logout</button>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}
export default Navbar;
