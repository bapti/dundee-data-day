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
            self.setState(data);
        });
    }

    getInitialState() {
        return {count: 0};
    }

    handleClick() {
        socket.emit('increment', {version: this.props.version});
    }

    render() {
        var buttonStyle = {
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
        socket.on('disable_feature', function (featureData) {
            //console.log("disable_feature TRIGGERED", self.props)
            featureData.forEach(applyFeatureState);
        })

        function applyFeatureState(feature){
            //console.log(feature)
            if (self.props.feature === feature.feature &&
                self.props.version === feature.version) {
                //console.log("setting state ", feature, feature.state);
                self.setState({enabled: feature.state})
                console.log("state value", self.props.state);
            }
        }
    }

    getInitialState() {
        return {enabled: this.props.enabled};
    }

    render() {
        var togglerStyle = {
            display: this.props.enabled ? 'block' : 'none'
        };
        console.log("togglerStyle", togglerStyle, this.props)

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
