import React, { Component } from 'react';
import Calendar from 'react-calendar';
import './react-calendar.css';

class ReactCalendar extends Component {

  //  props.date: Date   // default date selected
  //  props.selectCalendar(date: Date): void    // callback when a date is selected

  state = {
    date: new Date()    // current date selected
  };

  onChange = (date) => {
    this.setState({
      date: date
    });
  }

  onClickDay = (date) => {
    this.props.selectCalendar && this.props.selectCalendar(date);
  }

  componentWillMount() {
    this.setState({
      date: this.props.date
    });
  }

  render() {
    return (
      <div className={`calendar ${this.props.className || ''}`}>
        <Calendar onChange={this.onChange} value={this.state.date} onClickDay={this.onClickDay}
        />
      </div>
    );
  }
}

export default ReactCalendar;
