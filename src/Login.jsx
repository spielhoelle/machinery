import React, { Component } from 'react';
import './App.css';
import logo from './logo.svg';

class Login extends Component {

    render() {
      var loginButton = "";
      if (this.props.alert.error) {
        alert = <div className="alert alert-danger fixed-bottom text-center mb-0">{this.props.alert.error} </div>;
      } else if(this.props.alert.success) {
        alert = <div className="alert alert-success fixed-bottom text-center mb-0">{this.props.alert.success} </div>;
      }
  
      setTimeout(
        function () {
          this.setState({ alert: false });
        }
          .bind(this),
        3000
      );
  
      if (this.props.auth) {
        loginButton = <span className="nav-link active" href="#">Logged in</span>;
      } else {
        loginButton = <span className="nav-link disabled" href="#">Logged out</span>;
      }
      return (
        <div className="h-100">
        {alert}
          <nav className="navbar navbar-expand-lg fixed-top navbar-light bg-light">
            <a className="navbar-brand" href="#">Organice webinterface</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse justify-content-end navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                
                <li className="nav-item">
                  {loginButton} 
                </li>
              </ul>
            </div>
          </nav>
          <div className="App">
  
            <form onSubmit={this.props.onSubmit} className="form-signin">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="h3 my-5 font-weight-normal">Welcome to OrgaNice</h1>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input onChange={this.props.onChange} type="email" id="email" className="form-control" placeholder="Email address" required autoFocus/>
              <label htmlFor="password" className="sr-only">Password</label>
              <input onChange={this.props.onChange} type="password" id="password" className="form-control" placeholder="Password" required/>
              <div className="checkbox mb-3">
                <label>
                  <input type="checkbox" value="remember-me"/> Remember me
                </label>
              </div>
              <button className="btn btn-lg btn-primary btn-block">Sign in</button>
              <p className="mt-5 mb-3 text-muted">&copy; 2017-2018</p>
            </form>
          </div>
        </div>
      );
    }
  }
  
  export default Login;
