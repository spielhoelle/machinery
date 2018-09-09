
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "./App.css"
import logo from './logo.svg';
class Posts extends Component {
  render() {
    const posttemplate =
      (<table className="py-5 table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Title</th>
            <th scope="col">Content</th>
            <th scope="col">Date</th>
          </tr>
        </thead>
        <tbody>
          {this.props.posts && this.props.posts.map(post => (
            <tr key={post._id}>
              <th>{post._id}</th>
              <td>{post.title}</td>
              <td className=""><span>{post.content}</span></td>
              <td>{post.date}</td>
              <td><img src={`data:image/jpg;base64,${post.image}`}/></td>
              <td><button onClick={(e) => this.props.deletePost(post._id)} className="btn btn-outline-danger">Delete</button></td>
            </tr>
            ))
          }
        </tbody>
      </table>)

    return (
      <div className="container py-5">
        <nav className="navbar navbar-expand-lg fixed-top navbar-light bg-light">
          <a className="navbar-brand" href="/admin">Nanostatic webinterface</a>
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
        <div className="text-center">
          <img src={logo} className="my-5 App-logo" alt="logo" />
        </div>
        <h2>Hey {this.props.user.name.charAt(0).toUpperCase() + this.props.user.name.slice(1)}, this are your posts:</h2>
        {posttemplate}
      </div>
    );
  }
}

Posts.propTypes = {
  posts: PropTypes.array,
  deletePost: PropTypes.func,
  user: PropTypes.object,
};

export default Posts;
