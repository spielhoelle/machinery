import React, { Component } from 'react';
import Login from './Login.jsx'
import Scans from './Scans.jsx'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom'

const domain = process.env.REACT_APP_DOMAIN || "http://localhost";
const port = process.env.REACT_APP_BACKENDPORT || 4000;
class App extends Component {
  state = {
    user: false,
    alert: false,
    form: {
      email: "tommy@example.com",
      password: "password123"
    }
  }
  componentWillMount = () => {
    const user = localStorage.getItem("user")
    if (user) {
      console.log(user)
      this.setState({ user: { name: JSON.parse(localStorage.getItem("user")).name, token: JSON.parse(localStorage.getItem("user")).token } })
    }
  }
  onChange = (event) => {
    let form = { ...this.state.form }
    form[event.target.id] = event.target.value
    this.setState({ form })
  }
  logout = () => {
    console.log('loggedout');

    localStorage.removeItem("user")
    this.setState({ user: null })
    window.history.pushState(null, null, '/')
  }
  onSubmit = (event) => {
    event.preventDefault();
    fetch(`http://${domain}:${port}/api/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: this.state.form.email.toLowerCase(),
        password: this.state.form.password,
      }),
    })
      .then(res => res.json())
      .then(data => {
        console.log('data', data);

        if (data.user.token) {
          localStorage.setItem("user", JSON.stringify({ name: data.user.name, token: data.user.token }))
          this.setState({ user: { name: data.user.name, token: data.user.token } }, () => {
            window.history.pushState(null, null, '/scans')
          })


        } else if (data.code === 401) {
          this.setState({ user: false, alert: { "error": data.message } })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
  render() {

    return (
      <Router>
        <div className='h-100'>
          <Route exact path="/admin/" render={() => (
            this.state.user ? (
              <Redirect to={{ pathname: '/scans' }} />
            ) : (
                <Login
                  onChange={this.onChange}
                  onSubmit={this.onSubmit}
                  alert={this.state.alert}
                  user={this.state.user} />
              )
          )} />
          <Route exact path="/admin/scans" render={() => (
            this.state.user ? (
              <div>
                <Scans logout={this.logout} user={this.state.user} />
              </div>
            ) : (
                <Redirect to={{ pathname: '/' }} />
              )
          )} />
        </div>
      </Router>
    )
  }
}
export default App;
