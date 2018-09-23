import React, { Component } from 'react';
import Login from './Login.jsx'
import Posts from './Posts.jsx'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom'

const domain = process.env.REACT_APP_DOMAIN || "http://localhost";
const port = process.env.REACT_APP_BACKENDPORT || 4000;

class App extends Component {
  fileInput = React.createRef();
  state = {
    user: false,
    alert: false,
    postForm: {},
    form: {
      email: "tommy@example.com",
      password: "password123"
    },
    posts: []
  }
  componentWillMount = () => {
    const token = this.getToken()
    this.getposts(token);
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
    fetch(`http://${domain}:${port}/api/posts`, {
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

    fetch(`http://${domain}:${port}/api/posts/${id}/delete`, {
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
      fetch(`http://${domain}:${port}/api/posts/add`, {
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
      reader.readAsDataURL(this.fileInput.current.files[0]);
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
  render() {

    return (
      <Router>
        <div className='h-100'>
          <Route exact path="/admin/" render={() => (
            this.state.user ? (
              <Redirect to={{ pathname: '/admin/posts' }} />
            ) : (
                <Login
                  onChange={this.onChange}
                  onSubmit={this.onSubmit}
                  alert={this.state.alert}
                  user={this.state.user} />
              )
          )} />
          <Route exact path="/admin/posts" render={() => (
            this.state.user ? (
              <div>
                <Posts 
                  fileInput={this.fileInput}
                  handlePostSubmit={this.handlePostSubmit}
                  handlePostChange={this.handlePostChange}
                  posts={this.state.posts}
                  deletePost={this.deletePost}
                  logout={this.logout} 
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
