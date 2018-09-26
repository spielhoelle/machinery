import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "./App.css"
class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg fixed-top navbar-light bg-light">
        <a className="navbar-brand" href="/admin">
          <img className="" style={{width: 100}} src={this.props.settingForm.image}/>
          {this.props.settingForm.title}
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse justify-content-end navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">

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
