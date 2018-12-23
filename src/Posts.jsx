import React, { Component } from "react";
import PropTypes from "prop-types";
import withAuth from "./withAuth";
import "./App.css";
class Posts extends Component {
  state = {
    postForm: {}
  };
  componentWillMount = event => {
    if (this.props.posts.length == 0) {
      this.props.getposts();
    }
  };

  handlePostChange = event => {
    let postForm = { ...this.state.postForm };
    postForm[event.target.id] = event.target.value;
    this.setState({ postForm });
  };
  render() {
    const posttemplate = (
      <table className="py-5 table">
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
          {this.props.posts &&
            this.props.posts.map(post => (
              <tr key={post._id}>
                <td>{post.title}</td>
                <td>
                  <span>{post.content}</span>
                </td>
                <td>{post.date}</td>
                <td>
                  <img style={{ width: 200 }} src={post.image} />
                </td>
                <td>
                  <button
                    onClick={e => this.props.deletePost(post._id)}
                    className="btn btn-outline-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    );

    return (
      <div className="container-fluid">
        <div className="row mt-4">
          <div className="col-md-8">{posttemplate}</div>

          <div className="col-md-4">
            <form
              onSubmit={e =>
                this.props.handlePostSubmit(e, this.state.postForm)
              }
              className="form-signin"
            >
              <h2 className="">Create a Post</h2>

              <div className="form-group">
                <label htmlFor="title" className="sr-only">
                  Title
                </label>
                <input
                  title={this.state.postForm.title}
                  onChange={this.handlePostChange}
                  type="title"
                  id="title"
                  className="form-control"
                  placeholder="Title"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="content" className="sr-only">
                  Image
                </label>
                <input
                  onChange={this.handlePostChange}
                  ref={this.props.postFileInput}
                  type="file"
                  id="image"
                  className="form-control"
                  placeholder="Title"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="content" className="sr-only">
                  Content
                </label>
                <textarea
                  onChange={this.handlePostChange}
                  id="content"
                  className="form-control"
                  placeholder="Content"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="order" className="sr-only">
                  Order
                </label>
                <input
                  onChange={this.handlePostChange}
                  type="number"
                  id="order"
                  className="form-control"
                  placeholder="Order"
                  required
                />
              </div>
              <button className="btn btn-lg btn-primary btn-block">
                Create
              </button>
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
  user: PropTypes.object
};

export default withAuth(Posts);
