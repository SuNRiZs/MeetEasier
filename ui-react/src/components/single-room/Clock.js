import React, { Component } from 'react';

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date()
    };

    this.tick = this.tick.bind(this);
  }

  tick() {
    this.setState({
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
    const timeOptions = {
      hour12: false,  // Set to false for 24-hour format
      hour: '2-digit',
      minute: '2-digit'
    };

    const dateOptions = {
      month: 'long',
      day: '2-digit'
    };

    return (
      <div id="single-room__clock">
        <div id="single-room__time">
          {this.state.date.toLocaleTimeString([], timeOptions)}
        </div>
        <div id="single-room__date">
          {this.state.date.toLocaleDateString([], dateOptions)}
        </div>
      </div>
    );
  }
}

export default Clock;
