import React, { Component } from 'react';
import io from 'socket.io-client';

let socket = io.connect(window.location.href);

class CounterButton extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this)
    this.state = { count: 0 };
    let self = this;

    socket.on('count', function (data) {
        console.log( data )
        self.setState( data )
    })
  }

  getInitialState() {
    return { count: 0 };
  }

  handleClick(obj) {
    socket.emit( 'increment', { version: this.props.version } );
  }

  render() {
    return (
      <button onClick={this.handleClick} style={{ color: this.props.color }}>
        Count: {this.state.count}
      </button>
    );
  }
}

class Toggler extends Component {
  constructor(props) {
    super(props);
    self = this;
    socket.on('disable_feature', function({feature, version}){
      if(this.props.feature === feature && this.props.version === version){
        self.setState({ enabled: false })
      }
    })
  }

  getInitialState() {
    return { enabled: this.props.enabled };
  }

  render() {
    return (
      <div style={{ display: this.props.enabled ? 'inline' : 'none' }}>
        {this.props.children}
      </div>
    );
  }
}

export class App extends Component {
  render() {
    return (
      <div>

        <Toggler feature="counter_button" version="1" enabled={true}>
          <CounterButton color={'red'} version='1' />
        </Toggler>

        <Toggler  feature="counter_button" version="2" enabled={false}>
          <CounterButton color={'green'} version='2' />
        </Toggler>

      </div>
    );
  }
}
