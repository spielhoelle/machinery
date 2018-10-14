import React, { Component } from 'react';
import './App.css';
import logo from './logo.svg';
import PropTypes from 'prop-types';
import AuthSingleton from "./AuthService";
const Auth = AuthSingleton.getInstance();

export default class Login extends Component {
  state = {
    form: {
      email: "",
      password: ""
    }
  }
  handleFormSubmit = (e) => {
    e.preventDefault();
    Auth.login(this.state.form.email, this.state.form.password)
      .then((response) => {
        console.log(response);
        this.props.history.replace('/admin');
      })
      .catch((err) => {
        console.log('#####', err);
        this.setState({showError: true});
      });
  }
  componentDidMount() {
      if (Auth.loggedIn())
          this.props.history.replace('/admin');
  }
  handleChange = (event) => {
    let form = { ...this.state.form }
    form[event.target.id] = event.target.value
    this.setState({ form })
  }
  render() {
    return (
      <div className="h-100">
        <div className="App">
          <form onSubmit={this.handleFormSubmit} className="form-signin">
            {/*<img src={logo} className="App-logo" alt="logo" />*/}
            <h1 className="h3 my-5 font-weight-normal">Welcome to Nanostatic</h1>
            <label htmlFor="email" className="sr-only">Email address</label>
            <input onChange={this.handleChange} type="email" id="email" className="form-control" placeholder="Email address" required/>
            <label htmlFor="password" className="sr-only">Password</label>
            <input onChange={this.handleChange} type="password" id="password" className="form-control" placeholder="Password" required/>
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
  
Login.propTypes = {
  history: PropTypes.any.isRequired,
};
