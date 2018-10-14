import React, { Component } from 'react';
import Login from './Login.jsx'
import Posts from './Posts.jsx'
import Settings from './Settings.jsx'
import Navbar from './Navbar.jsx'
import withAuth from './withAuth'
import AuthService from './AuthService'
const Auth = AuthService.getInstance();

import {url} from './api'
import { BrowserRouter, Switch, Route, Redirect, } from 'react-router-dom'

class App extends Component {
  settingsRef = React.createRef();
  postFileInput = React.createRef();
  settingFileInput = React.createRef();

  state = {
    user: false,
    alert: false,
    settingForm: {},
    posts: []
  };

  componentWillMount = () => {
    this.getposts();
    this.getSettings();
  };

  getSettings = async () => {
    Auth.fetch(`${url}/api/setting`)
    .then(data => {
      this.setState({
        settingForm: data.setting
      })
    })
  };

  logout = () => {
    Auth.logOut()
  };

  generateStaticPages = () => {
    confirm("This will generate the static html pages.")
    Auth.fetch(`${url}/api/generate`, {
      method: 'POST',
    })
    .then(data => {
      this.showFlash(`${data.message}`, `success`)
      console.log('#####', 'successfull generated');
    })
  };

  getposts = async token => {
    Auth.fetch(`${url}/api/posts`)
    .then(data => {
      this.setState({ posts: data.posts })
    })
  };

  deletePost = (id) => {
    Auth.fetch(`${url}/api/posts/${id}/delete`, {
      method: 'POST',
    })
    .then(data => {
      let posts = [...this.state.posts]
      posts = posts.filter(p => p._id !== id)
      this.setState({ posts: posts })
      this.showFlash(`${data.message}`, `success`)
    })
  }
  handlePostSubmit = (event, post) => {
    event.preventDefault();
    const reader = new FileReader();
    reader.onload = (event) => {
      const formData = {
        'image': reader.result,
        "title": post.title,
        "content": post.content,      
        "order": post.order,
      }
      Auth.fetch(`${url}/api/posts/add`, {
          method: 'POST',
          body: JSON.stringify(formData)
      })
      .then(data => {
        let posts = [ ...this.state.posts ]
        posts.push(data.post)
        this.setState({ posts })

        this.showFlash(`${data.message}`, `success`)
      })
    };
    reader.readAsDataURL(this.postFileInput.current.files[0]);
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
    Auth.fetch(`${url}/api/setting`, {
        method: 'POST',
        body: JSON.stringify(this.state.settingForm)
    })
    .then(data => {
      this.showFlash(`${data.message}`, `success`)
      console.log('submit:', data);
    })
  }
  showFlash = (text, color) => {
    this.setState({alert: {text: text, color: color}})
    setTimeout(()=> {
      this.setState({alert: false})
    }, 3000)
  }

  render() {
    var settingComponent = (props) => {
       return <Settings
          settingFileInput={this.settingFileInput}
          handleSettingSubmit={this.handleSettingSubmit}
          handleSettingChange={this.handleSettingChange}
          settingForm={this.state.settingForm}
          {...props}
        />
      }
     var postComponent = (props) => {
       return <Posts 
            postFileInput={this.postFileInput}
            handlePostSubmit={this.handlePostSubmit}
            posts={this.state.posts}
            deletePost={this.deletePost}
            {...props}
          />
       }

     var loginComponent = (props) => {
      return <Login
          alert={this.state.alert}
          user={this.state.user}
          {...props}
          />
        }
    return (
      <BrowserRouter>
        <Switch>
          <div className='h-100'>
            {this.state.alert && ( 
              <div className={`fixed-bottom m-3 mb-0 alert alert-${this.state.alert.color}`}>{this.state.alert.text}</div>
            )}
            <Navbar
              generateStaticPages={this.generateStaticPages}
              logout={this.logout} 
              settingForm={this.state.settingForm}
            />
            <Route path="/login" component={loginComponent} />
            <Route exact path="/admin" component={postComponent} />
            <Route path="/admin/settings" render={settingComponent}/>
          </div>
        </Switch>
      </BrowserRouter>
    )
  }
}
export default App;
