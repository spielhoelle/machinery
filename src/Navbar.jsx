import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import "./App.css"
import withAuth from './withAuth'

class Navbar extends Component {
  render() {
    console.log(this.props);
    if (this.props.settingForm !== undefined){
      var image = this.props.settingForm.image
      var title = this.props.settingForm.title
    } else {
      var image = ""
      var title = ""
      
    }
    return (

      <nav className="navbar navbar-expand-sm navbar-light">
        <a className="navbar-brand" href="/admin">
          <img className="" style={{width: 100}} src={image}/>
          <h2 className="ml-md-3 d-inline-block">{title}</h2>
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse justify-content-end navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">

            {this.props.user && ( 
              <React.Fragment>
                <li className="nav-item">
                  <span className="nav-link text-muted">Welcome {this.props.user.name.charAt(0).toUpperCase() + this.props.user.name.slice(1)}</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link">|</span>
                </li>
              </React.Fragment>
            )}
            <li className="nav-item">
              <a className={`nav-link`} href='/' target='_blank'>Static frontend</a>
            </li>
            <li className="nav-item">
              <a className={`nav-link`} href='#'onClick={this.props.generateStaticPages}>Generate</a>
            </li>
            <li className="nav-item">
              <span className="nav-link">|</span>
            </li>

            <li className="nav-item">
              <Link className={`nav-link ${this.props.location.pathname == "/admin" ? " active" : ""}`} to="/admin">Posts</Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link ${this.props.location.pathname == "/admin/settings" ? " active" : ""}`} to="/admin/settings">Settings</Link>
            </li>

            <li className="nav-item">
              <button className="border-0 bg-transparent nav-item nav-link" href="#" onClick={this.props.logout}>Logout</button>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
};

export default withAuth(Navbar);
