import React, { Component } from 'react';
import Counter from './counter';

export class App extends Component {
  render() {
    return (
      <div>
        <Counter increment={1} />
      </div>
    );
  }
}
