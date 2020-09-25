import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

class TitleBar extends Component {
  constructor(props) {
    super();
    const { leftLink, leftText, title, rightLink, rightText } = props.titleBarProps || {
      leftLink: '/',
      leftText: 'Home',
      title: 'Title',
      rightLink: '/',
      rightText: 'Right',
      locationState: props.location.state
    };
    this.state = ({
      leftLink, leftText, title, rightLink, rightText
    })
    //props.editTitle({ title: 'Hello' });
  }

  setNewState(props) {
    const { leftLink, leftText, title, rightLink, rightText } = props.titleBarProps || {
      leftLink: '/',
      leftText: 'Home',
      title: 'Title',
      rightLink: '/',
      rightText: 'Right'
    };
    this.setState({
      leftLink: leftLink,
      leftText: leftText,
      title: title,
      rightLink: rightLink,
      rightText: rightText
    })
  }

  shouldComponentUpdate(newProps, oldState) {
    this.setNewState(newProps);
    this.forceUpdate();
    return true;
  }



  render() {
    return <div className='container titleBar' id='titleBar'>
      <div className='leftLink'><Link to={this.state.leftLink} key={this.state.leftKey}>{this.state.leftText}</Link></div>
      <div className="title"><h1 key={this.state.titleKey}>{this.state.title}</h1></div>
      <div className="rightLink"><Link to={this.state.rightLink} key={this.state.rightKey} to={this.state.rightLink}></Link></div>
    </div>
  }
}

export default withRouter(TitleBar);