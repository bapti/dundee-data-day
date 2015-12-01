import React, { Component } from 'react';
import io from 'socket.io-client';

let socket = io.connect(window.location.href);

class Counter extends Component {
    constructor(props) {
        super(props);
        this.state = {counter: 0};
        this.interval = setInterval(() => this.tick(), 1000);
    }

    tick() {
        this.setState({
            counter: this.state.counter + this.props.increment
        });
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <h1 style={{ color: this.props.color }}>
                Counter ({this.props.increment}): {this.state.counter}
            </h1>
        );
    }
}

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
        return {count: 0};
    }

    handleClick(obj, data) {
        socket.emit('increment', data);
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
                <Counter increment={1} color={'pink'}/>
                <Counter increment={5} color={'blue'}/>
                <CounterButton increment={1} color={'red'}/>
                <CounterButton increment={1} color={'green'}/>
                <CounterButton increment={1} color={'purple'}/>
            </div>
        );
    }
}
