import React, { Component } from "react";
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment';
import makeCancellable from "./makeCancellable";

class BlogPosts extends Component {
  constructor(props) {
    super();
    const titleChangeWhenOver = makeCancellable(new Promise(r => setTimeout(r, 10)));
    const theFetchWhenOver = makeCancellable(new Promise(r => setTimeout(r, 10)));
    this.state = {
      posts: null,
      err: null,
      changeTitle: props.changeTitle,
      theFetch: theFetchWhenOver,
      titleChange: titleChangeWhenOver
    }
    titleChangeWhenOver.promise.then(() => this.changeTitle.call(this)).catch(err => { })
    theFetchWhenOver.promise.then((() => this.loadPosts.call(this)).bind(this)).catch(err => { });
  }

  changeTitle() {
    if (this.state && this.state.changeTitle && !this.state.theTitleChangeShouldStop) {
      this.state.changeTitle({ title: 'Posts', leftText: '' })
    } else {
      const titleChangeWhenOver = makeCancellable(new Promise(r => setTimeout(r, 100)));
      this.setState({
        titleChange: titleChangeWhenOver
      });
      titleChangeWhenOver.promise.then(() => this.changeTitle.bind(this)).catch()
    };
  }

  shouldComponentUpdate(newProps, oldState, third) {
    if (!this.state.theTitleChangeShouldStop) {
      oldState.changeTitle = newProps.changeTitle;
      this.setState(oldState)
      this.forceUpdate();
      return true;
    }
    else return false;
  }

  componentWillUnmount() {
    if (this.state.theFetch) this.state.theFetch.cancel();
    if (this.state.titleChange) this.state.titleChange.cancel();
    this.state.theFetch.promise.catch(err => { })
    this.state.titleChange.promise.catch(err => { })
  }

  loadPosts() {
    const theFetch = makeCancellable(fetch('http://localhost:3000/frontend/posts'));
    if (this.state.theFetch) this.setState({ theFetch });

    theFetch.promise.then(response => response.json())
      .then(response => {
        if (response.message == 'Successfully retrieved!') {
          this.setState({ posts: response.messages });
        } else {
          throw new Error('failed to retrieve!');
        }
      })
    theFetch.promise.catch()
  }

  render() {
    if (!this.state.posts && !this.state.err) {
      return <div className="container"><h1>Loading...</h1></div>
    } else if (this.state.err) {
      return [<div className="container">Failed to load... Try again.</div>,
      <div className="container">{this.state.err}</div>]
    } else {
      return (
        this.state.posts.map(post => {
          return (
            <Link to={{ pathname: 'posts/' + post.message_id, state: { message_id: post.message_id } }} key={post.message_id} className="container">
              <div className="post">
                <div className="date">{moment(post.date).format("YYYY-MM-DD")}</div>
                <div className="title">{post.title}</div>
                <div className="author">{post.first_name} {post.last_name}</div>
              </div>
            </Link>
          )
        })
      )
    }
  }
}

export default withRouter(BlogPosts);
