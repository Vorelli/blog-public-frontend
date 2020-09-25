import React, { Component } from 'react';
import ReactDom from 'react-dom';
import ReactRouter from 'react-router';
import { Route, HashRouter, Router, Link, Redirect } from 'react-router-dom'
import { createBrowserHistory } from 'history';
import '../public/index.sass';
import EditTitleBar from './EditTitleBar';
import { v3 } from 'uuid';
import TitleBar from './TitleBar';
import BlogPosts from './BlogPosts';
import PostView from './PostView';
const root = document.getElementById('root');

function GoToPosts() {
  return (
    <Redirect to="/posts" />
  )
}

function Blank() {
  return pug`.container
                h1 Hello
                Link(to='/hello') Blank`
}

function Hello() {
  return pug`.container
                h1 Blank`
}

class Index extends Component {
  constructor(props) {
    super();
    const history = createBrowserHistory();
    const location = history.location;
    location.state = { changeTitle: this.setTitle.bind(this) };

    this.state = {
      location,
      history,
      text: 'hello',
      titleBarProps: this.changeTitle({}),
      redirect: false,
      shouldStopTitleChange: false
    }
  }

  componentDidMount() {
    if (this.state.location.pathname != '/') {
      this.setState({ redirect: true });
      setTimeout(this.afterRedirect.bind(this), 1);
    }
  }

  componentWillUnmount() {
    this.setState({ shouldStopTitleChange: true })
  }

  afterRedirect() {
    this.setState({ redirect: false })
  }

  componentDidUpdate() {
  }

  changeTitle(titleProps) {
    const defaultTitleBarProps = {
      leftLink: '/',
      leftText: 'Home',
      title: 'Title',
      rightLink: '/',
      rightText: 'Right'
    }
    const newTitleBarProps = Object.assign(defaultTitleBarProps, titleProps);
    return newTitleBarProps;
  }

  setTitle(titleProps) {
    if (!this.state.shouldStopTitleChange) {
      const state = this.state;
      state.titleBarProps = this.changeTitle(titleProps);
      this.setState(state);
    }
  }

  render() {
    if (this.state.redirect) {
      return <Router history={this.state.history}>
        <Redirect to="/"></Redirect>
        <TitleBar titleBarProps={this.state.titleBarProps} />
      </Router>
    } else {
      return <Router history={this.state.history}>
        <TitleBar titleBarProps={this.state.titleBarProps} />
        <div className="content">
          <Route exact={true} path="/" component={() => <GoToPosts />} />
          <Route exact={true} path="/posts" render={() => <BlogPosts changeTitle={this.setTitle.bind(this)}></BlogPosts>}></Route>
          <Route exact={true} path="/posts/:postId" render={() => <PostView changeTitle={this.setTitle.bind(this)} />}></Route>
        </div>
      </Router >
    }
  }
}

ReactDom.render(<Index />, root);