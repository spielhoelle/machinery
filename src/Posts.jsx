import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "./App.css"
class Posts extends Component {
  render() {

    const posttemplate =
      (<table className="py-5 table">
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Content</th>
            <th scope="col">Date</th>
            <th scope="col">Image</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {this.props.posts && this.props.posts.map(post => (
            <tr key={post._id}>
              <td>{post.title}</td>
              <td><span>{post.content}</span></td>
              <td>{post.date}</td>
              <td><img style={{width: 200}} src={post.image}/></td>
              <td><button onClick={(e) => this.props.deletePost(post._id)} className="btn btn-outline-danger">Delete</button></td>
            </tr>
            ))
          }
        </tbody>
      </table>)

    return (
      <div className="py-5">

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

        <div className="row mt-4">

          <div className="col-md-8">
            <h2>Hey {this.props.user.name.charAt(0).toUpperCase() + this.props.user.name.slice(1)}, this are your posts:</h2>
            {posttemplate}
          </div>
        
          <div className="col-md-4">
            <form onSubmit={this.props.handlePostSubmit} className="form-signin">
              <h2 className="">Create a Post</h2>

              <div class="form-group">
                  <label htmlFor="title" className="sr-only">Title</label>
                  <input onChange={this.props.handlePostChange} type="title" id="title" className="form-control" placeholder="Title" required autoFocus/>
              </div>
              <div class="form-group">
                  <label htmlFor="content" className="sr-only">Image</label>
                  <input onChange={this.props.handlePostChange}  ref={this.props.fileInput} type="file" id="image" className="form-control" placeholder="Title" required autoFocus/>
              </div>
              <div class="form-group">
                  <label htmlFor="content" className="sr-only">Content</label>
                  <textarea onChange={this.props.handlePostChange} id="content" className="form-control" placeholder="Content" required></textarea>
              </div>
              <div class="form-group">
                  <label htmlFor="order" className="sr-only">Order</label>
                  <input onChange={this.props.handlePostChange} type="number" id="order" className="form-control" placeholder="Order" required/>
              </div>
              <button className="btn btn-lg btn-primary btn-block">Create</button>
              </form>
            </div>

        </div>
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
