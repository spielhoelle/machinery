import React, { Component } from 'react';
import Login from './Login.jsx'
import Posts from './Posts.jsx'
import Settings from './Settings.jsx'
import Navbar from './Navbar.jsx'
import {url} from './api'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom'

const domain = process.env.REACT_APP_DOMAIN || "http://localhost";
const port = process.env.REACT_APP_BACKENDPORT || 4000;

class App extends Component {
  postFileInput = React.createRef();
  settingFileInput = React.createRef();
  state = {
    user: false,
    alert: false,
    postForm: {},
    settingForm: {},
    form: {
      email: "",
      password: ""
    },
    posts: []
  }
  componentWillMount = () => {
    const token = this.getToken()
    this.getposts(token);
    this.getSettings(token);
  }
  getSettings = async (token) => {
    fetch(`${url}/api/setting`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        this.setState({
          settingForm: data.setting
        })
      })
      .catch(err => {
        console.log("fetch in posts.jsx failed: ", err)
      })
      .catch(err => {
        console.log("fetch in posts.jsx failed: ", err)
      })
  }
  getToken = () => {
    const user = localStorage.getItem("user")
    if (user) {
      this.setState({ user: { name: JSON.parse(localStorage.getItem("user")).name, token: JSON.parse(localStorage.getItem("user")).token } })
      return JSON.parse(localStorage.getItem("user")).token
    }
  }
  onChange = (event) => {
    let form = { ...this.state.form }
    form[event.target.id] = event.target.value
    this.setState({ form })
  }
  handlePostChange = (event) => {
    let postForm = { ...this.state.postForm }
    postForm[event.target.id] = event.target.value
    this.setState({ postForm })
  }
  logout = () => {
    localStorage.removeItem("user")
    this.setState({ user: null })
    window.history.pushState(null, null, '/')
  }

  getposts = async token => {
    fetch(`${url}/api/posts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        this.setState({ posts: data.posts })
      })
      .catch(err => {
        console.log("fetch in posts.jsx failed: ", err)
      })
  };

  deletePost = (id) => {
    const token = this.getToken();

    fetch(`${url}/api/posts/${id}/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        let posts = [...this.state.posts]
        posts = posts.filter(p => p._id !== id)
        this.setState({ posts: posts })
      })
      .catch(err => {
        console.log("fetch in posts.jsx failed: ", err)
      })
  }
  handlePostSubmit = (event) => {
    event.preventDefault();
    console.log("test");
    const token = this.getToken();
    const reader = new FileReader();
    reader.onload = (event) => {
      console.log(this.state);
      const formData = {
        'image': reader.result,
        "title": this.state.postForm.title,
        "content": this.state.postForm.content,      
        "order": this.state.postForm.order,
      }
      fetch(`${url}/api/posts/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          let posts = [ ...this.state.posts ]
          posts.push(data.post)
          this.setState({ posts })
        })
        .catch(err => {
          console.log("fetch in posts.jsx failed: ", err)
        })
      };
      reader.readAsDataURL(this.postFileInput.current.files[0]);
  }
  onLoginSubmit = (event) => {
    event.preventDefault();
    fetch(`${url}/api/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: this.state.form.email.toLowerCase(),
        password: this.state.form.password,
      }),
    })
    .then(res => res.json())
    .then(data => {
      if (data.user.token) {
        localStorage.setItem("user", JSON.stringify({ name: data.user.name, token: data.user.token }))
        this.setState({ user: { name: data.user.name, token: data.user.token } }, () => {
          window.history.pushState(null, null, '/posts')
        })
      } else if (data.code === 401) {
        this.setState({ user: false, alert: { "error": data.message } })
      }
    })
    .catch(err => {
      console.log(err)
    })
  }
  handleSettingChange = (event) => {
    let settingForm = { ...this.state.settingForm }
    if(event.target.id === 'image'){
      const reader = new FileReader();
      reader.onload = (event) => {
        settingForm['image'] = reader.result
        this.setState({ settingForm })
      };
      reader.readAsDataURL(this.settingFileInput.current.files[0]);
    } else {
      settingForm[event.target.id] = event.target.value
      this.setState({ settingForm })
    }
  }

  handleSettingSubmit = (event) => {
    event.preventDefault();
    this.submitSetting()
  }

  submitSetting = () => {
    fetch(`${url}/api/setting`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      },
      body: JSON.stringify(this.state.settingForm)
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log("post fetch in Settings failed: ", err)
      })
  }
  render() {
    return (
      <Router>
        <div className='h-100'>
          <Navbar
            logout={this.logout} 
            settingForm={this.state.settingForm}
          />
          <Route exact path="/admin/" render={() => (
            this.state.user ? (
              <Redirect to={{ pathname: '/admin/posts' }} />
            ) : (
                <Login
                  onChange={this.onChange}
                  onLoginSubmit={this.onLoginSubmit}
                  alert={this.state.alert}
                  user={this.state.user} />
              )
          )} />
          <Route exact path="/admin/posts" render={() => (
            this.state.user ? (
              <div>
                <Settings
                  settingFileInput={this.settingFileInput}
                  handleSettingSubmit={this.handleSettingSubmit}
                  handleSettingChange={this.handleSettingChange}
                  settingForm={this.state.settingForm}
                />
                <Posts 
                  postFileInput={this.postFileInput}
                  handlePostSubmit={this.handlePostSubmit}
                  handlePostChange={this.handlePostChange}
                  posts={this.state.posts}
                  deletePost={this.deletePost}
                  user={this.state.user}
                />
              </div>
            ) : (
                <Redirect to={{ pathname: '/admin' }} />
              )
          )} />
        </div>
      </Router>
    )
  }
}
export default App;
