import React, { Component } from 'react';
import io from 'socket.io-client';

let socket = io.connect(window.location.href);

class CounterButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
          count: 0
        }
        this.handleClick = this.handleClick.bind(this)

        let self = this;
        socket.on('count', function (data) {
            self.setState(data);
        });
    }

    handleClick() {
        socket.emit('increment', {version: this.props.version});
        this.setState({
          count: this.state.count + 1
        })
    }

    render() {
        let buttonStyle = {
            color: this.props.color,
            "font-size": "xx-large",
            cursor: "pointer"
        };

        return (
            <button onClick={this.handleClick} style={buttonStyle}>
                Count: {this.state.count}
            </button>
        );
    }
}

class Toggler extends Component {
    constructor(props) {
        super(props);
        let self = this;

        this.state = {
          enabled: this.props.enabled
        }

        let applyFeatureState = (feature) => {
            if (self.props.feature === feature.feature &&
                self.props.version === feature.version) {
                console.log("before:state value", self.state, feature.version);
                self.setState( {
                  enabled: feature.enabled
                })

                console.log("after:state value", self.state, feature.version);
            }
        }

        socket.on('disable_feature', function (featureData) {
            featureData.forEach(applyFeatureState);
        })
    }

    render() {
        let togglerStyle = {
            display: this.state.enabled ? 'block' : 'none'
        };

        console.log(this.props.version, togglerStyle);
        return (
            <div style={togglerStyle}>
                {this.props.children}
            </div>
        );
    }
}

export class App extends Component {
    render() {
        return (
            <center height="100%">
                <div>

                    <Toggler feature='counter_button' version='1' enabled={true}>
                        <CounterButton color={'red'} version='1'/>
                    </Toggler>

                    <Toggler feature='counter_button' version='2' enabled={false}>
                        <CounterButton color={'green'} version='2'/>
                    </Toggler>

                </div>
            </center>
        );
    }
}
