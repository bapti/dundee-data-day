import React, { Component } from 'react';

class Counter extends Component {
  constructor(props) {
    super(props);
  }

  tick() {
    this.setState({
      counter: this.state.counter + this.props.increment
    });
  }

  componentWillUnmount() {

  }

  render() {
    return (
      <h1>
        Counter ({this.props.increment}): {this.state.counter}
      </h1>
    );
  }
}
