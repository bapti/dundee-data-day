import React, { Component } from 'react';
import io from 'socket.io-client';

let socket = io.connect(window.location.href);

class CounterButton extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this)
        this.state = {count: 0};
        let self = this;

        socket.on('count', function (data) {
            console.log(data);
            self.setState({count: data.count})
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

export class App extends Component {
  render() {
    return (
      <div>
        <CounterButton color={'red'} version='1' />
        <CounterButton color={'green'} version='2' />
      </div>
    );
  }
}
