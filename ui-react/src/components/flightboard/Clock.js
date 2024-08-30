import React, { Component } from 'react';

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date()
    }

    this.tick = this.tick.bind(this);
  }

  tick() {
    this.setState ({
      date: new Date()
    });
  }

  componentDidMount() {
    this.timerID = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    const options = {
      hour12: false // Set to true for 12-hour format, false for 24-hour format
    };

    return (
      <span id="clock">
        {this.state.date.toLocaleTimeString([], options)}
      </span>
    );
  }
}

export default Clock;
