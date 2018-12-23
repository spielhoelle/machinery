import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./App.css";
import withAuth from "./withAuth";

class NavbarUser extends Component {
  render() {
    return (
        this.props.user ? (
          <React.Fragment>
            <li className="nav-item">
              <span className="nav-link text-muted">
                Welcome{" "}
                {this.props.user.name.charAt(0).toUpperCase() +
                  this.props.user.name.slice(1)}
              </span>
            </li>
            <li className="nav-item">
              <span className="nav-link">|</span>
            </li>
          </React.Fragment>
        ) : null
    );
  }
}

export default NavbarUser;
