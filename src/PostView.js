import React, { Component } from 'react';
import { useLocation, withRouter } from 'react-router-dom';
import makeCancellable from './makeCancellable';
import moment from 'moment';

class PostView extends Component {
  constructor(props) {
    super();
    const theFetchWhenOver = makeCancellable(new Promise(r => setTimeout(r, 10)));
    const theTitleChangeWhenOver = makeCancellable(new Promise(r => setTimeout(r, 10)));

    this.state = {
      message_id: props.location.state.message_id,
      post: null,
      comments: null,
      err: null,
      theFetch: theFetchWhenOver,
      changeTitle: props.changeTitle,
      theTitleChange: theTitleChangeWhenOver,
      commentToBePosted: { name: '', body: '' },
      theCommentSubmitFetch: null,
      commentCreateErr: null
    }
    theTitleChangeWhenOver.promise.then(() => this.changeTitle.call(this)).catch(err => { });
    theFetchWhenOver.promise.then(() => this.loadPost.call(this)).catch(err => { });
  }

  changeTitle() {
    if (this.state && this.state.changeTitle) {
      this.state.changeTitle({ title: 'Post', leftText: 'Home' })
    } else {
      const titleChangeWhenOver = makeCancellable(new Promise(r => setTimeout(r, 100)));
      this.setState({
        titleChange: titleChangeWhenOver
      });
      titleChangeWhenOver.promise.then(() => this.changeTitle.bind(this)).catch(err => { })
    };
  }

  async loadPost() {
    if (this.state.theFetch) {
      const theFetch = makeCancellable(fetch('http://localhost:3000/frontend/posts/' + await this.state.message_id))
      this.setState({ theFetch });
      theFetch.promise.then(response => response.json())
        .then(response => {
          if (response.message) this.setState({ post: response.post, comments: response.comments });
          else throw new Error('Failure to get post. Try again...')
        })
      theFetch.promise.catch(err => { if (!err.isCanceled) this.setState({ err }) })
    }
  }

  componentWillUnmount() {
    if (this.state.theFetch) {
      this.state.theFetch.cancel();
      this.state.theFetch.promise.catch(err => { });
    }
    if (this.state.theTitleChange) {
      this.state.theTitleChange.cancel();
      this.state.theTitleChange.promise.catch(err => { });
    }
    if (this.state.theCommentSubmitFetch) {
      this.state.theCommentSubmitFetch.cancel();
      this.state.theCommentSubmitFetch.promise.catch(err => { });
    }
  }

  submitCommentForm(event) {
    event.preventDefault();
    const body = JSON.stringify(this.state.commentToBePosted);

    const theCommentSubmitFetch = makeCancellable(
      fetch('http://localhost:3000/frontend/posts/' + this.state.message_id, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      }));
    this.setState({ theCommentSubmitFetch })

    theCommentSubmitFetch.promise
      .then(response => response.json())
      .then(response => {
        if (response.message == 'Created comment successfully!') {
          this.setState({ theCommentSubmitFetch: null, commentToBePosted: { name: '', body: '' } })
          this.loadPost();
        } else {
          this.setState({ commentCreateErr: response.errors, theCommentSubmitFetch: null });
        }
      }).catch(err => {
        console.log(err);
      })
  }

  commentFormOnChange(event) {
    const state = this.state;
    switch (event.target.name) {
      case 'name':
        state.commentToBePosted.name = event.target.value
        break;
      case 'body':
        state.commentToBePosted.body = event.target.value
        break;
    }
    this.setState(state);
    event.preventDefault();
  }

  render() {
    if (!this.state.err && !this.state.post) {
      return (
        <div className="container">Loading...</div>
      )
    } else if (this.state.err) {
      return (
        <div className="container">{this.state.err}</div>
      )
    } else {

      const commentFormErrors = this.state.commentCreateErr ? (<ul> {this.state.commentCreateErr.map(value => { return (<li className="commentError" key={value.msg}>{value.msg}</li>) })} </ul>) : null;

      const commentForm = !this.state.theCommentSubmitFetch ? (<form method="POST" onSubmit={this.submitCommentForm.bind(this)} action="/">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input onChange={this.commentFormOnChange.bind(this)} value={this.state.commentToBePosted.name} className="form-control" placeholder="Name" type="text" name="name" id="name" />
        </div>
        <div className="form-group">
          <label htmlFor="body">Comment:</label>
          <input onChange={this.commentFormOnChange.bind(this)} value={this.state.commentToBePosted.body} className="form-control" placeholder="Comment" type="text" name="body" id="comment" />
        </div>
        <button className="btn btn-primary">Post Comment</button>
      </form>) : (<div className="creatingComment">
        Submitting comment!
      </div>);

      return (
        <div className="container theSinglePost">
          <div className="container singlePost">
            <div className="date">{moment(this.state.post.date).format("YYYY-MM-DD")}</div>
            <div className="title">{this.state.post.title}</div>
            <div className="author">{this.state.post.first_name + ' ' + this.state.post.last_name}</div>
            <div className="body">{this.state.post.body}</div>
          </div>
          <div className="container commentForm">
            {commentForm}
            {commentFormErrors}
          </div>
          <ul className="container comments">
            {this.state.comments.map(value => {
              return (<li key={value.comment_id} className="comment">
                <div className="name">{value.name}</div>
                <div className="date">{moment(value.date).format("YYYY-MM-DD")}</div>
                <div className="body">{value.body}</div>
              </li>)
            })}
          </ul>
        </div>
      )
    }
  }
}

export default withRouter(PostView);
