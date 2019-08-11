import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactCalendar from '../react-calendar/react-calendar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './hour-selector.css';

class HourSelector extends Component {
    constructor(props){
        // props.widthLevel: Number    // number of hours available in the scaler window on each side of the pointer, 3+
        // props.defaultDate: Date    // default date selected
        super(props);

        // calendar dom element to be referenced
        this.calendar = null;

        // X position when starting to drag
        this.mouseX = null;

        this.moving = false;
        
        // length of an hour in the scale, including border width of each cell
        this.rulerUnitLength = 44;

        // total number of hours shown on the scale, corresponding to 90 days
        this.showHours = 30 * 3 * 24;
        
        // total length of the scale, including additional 2px for borders on both ends
        this.rulerLength = this.rulerUnitLength * this.showHours + 2;
        
        // the hour value that is pointed initially when selecting a date, that is a middle point of all hours
        this.initialHour = this.showHours / 2;
        
        // width level of the scaler window, number of hours available on each side
        this.widthLevel = (props.widthLevel) || 6;
        if (props.widthLevel < 3) {
            this.widthLevel = 3;
        }

        // the position offset of the div block of the scale relative to the left border of the yellow scale container, 10px for initial offset caused by border and padding
        this.leftInitial = -this.rulerUnitLength * (this.initialHour - this.widthLevel) -10;
        
        // current hours elapsed relative to the leftmost hour
        this.currentHour = this.initialHour;

        this.initialDate = props.defaultDate || new Date();
        
        // reference date corresponding to the leftmost hour, used to calculate the current date as we drag along the scale
        this.refDate = new Date(this.initialDate);
        this.refDate.setDate(this.refDate.getDate() - 45);

        this.state = {
            date: this.initialDate, // current date selected
            dateStr: this.initialDate.toLocaleDateString("en-US"), // formatted date string shown in text field
            showCalendar: false, // whether calendar select is shown
            leftOffset: 0, // offset of the scale as it is dragged horizontally
        }
    }

    toDateString = (date) => {
        return date.toLocaleDateString("en-US");
    }

    showCalendar = () => {
        this.setState({
            showCalendar: true
        });
    }

    hideCalendar = (e) => {
        // when clicking on the date text field, calendar is not hidden
        if (e.target.tagName === "INPUT" || e.target.className === "date-text") {
            return;
        }
        // when clicking on the calendar avatar, calendar is not hidden
        if (e.target.tagName === 'path' || e.target.tagName === "svg" || e.className === "date-picker-svg") {
            return;
        }
        // when clicking on any element of a showing calendar, calendar is not hidden
        const mycalendar = ReactDOM.findDOMNode(this.calendar);
        if (mycalendar && mycalendar.contains(e.target)) {
            return;
        }

        this.setState({
            showCalendar: false
        });
    }

    // when a date is selected from the calendar, calendar is hidden and the position of scale is reset to initial
    selectCalendar = (date) => {
        let hourDiff = this.currentHour % 24;
		if (hourDiff >= 12) {
			hourDiff = hourDiff - 24;
		}
        this.currentHour = this.initialHour + hourDiff;
        const offset = - hourDiff * this.rulerUnitLength;

        this.setState({
            date: date,
            dateStr: date.toLocaleDateString("en-US"),
            showCalendar: false,
            leftOffset: offset
        });
        this.refDate = new Date(date);
        this.refDate.setDate(date.getDate() - 45);

        console.log(`Selected Hour ${(this.currentHour + 12) % 24}:00`, 'on', this.toDateString(date));

    }

    // record the position mouseX when starting dragging
    onMouseDown = (e) => {
        this.mouseX = e.pageX - this.state.leftOffset;
    }

    // calculate in real time the length of distance from mouseX when we dragging
    // then calculate the current date and position offset of the scale
    onMouseMove = (e) => {
        if (!this.mouseX) return;
        this.moving = true;

        let offset = e.pageX - this.mouseX;
        let numUnit = Math.round(offset / this.rulerUnitLength);
        this.currentHour = this.initialHour - numUnit;

        const currentDate = new Date(this.refDate);
        currentDate.setDate(this.refDate.getDate() + Math.round(this.currentHour / 24));
        this.setState({
            leftOffset: offset,
            date: currentDate,
            dateStr: currentDate.toLocaleDateString("en-US")
        });

        console.log(`Selected Hour ${(this.currentHour + 12) % 24}:00`, 'on', this.toDateString(currentDate));
    }

    onMouseUp = (e) => {
        const offset = e.pageX - this.mouseX;
        let numUnit = Math.round(offset / this.rulerUnitLength);
        this.currentHour = this.initialHour - numUnit;

        const currentDate = new Date(this.refDate);
        currentDate.setDate(this.refDate.getDate() + Math.round(this.currentHour / 24));

        // set the offset position to that corresponding to an hour
        this.setState({
            leftOffset: numUnit * this.rulerUnitLength,
            date: currentDate,
            dateStr: currentDate.toLocaleDateString("en-US")
        });

        this.mouseX = null;
    }

    onClick = (e) => {
        if (this.moving) { 
            this.moving = false;
            return; 
        }

        const offset = e.pageX - window.innerWidth / 2;
        let numUnit = -Math.round(offset / this.rulerUnitLength);
        this.currentHour = this.currentHour - numUnit;

        const currentDate = new Date(this.refDate);
        currentDate.setDate(this.refDate.getDate() + Math.round(this.currentHour / 24));

        // set the offset position to that corresponding to an hour
        this.setState({
            leftOffset: this.state.leftOffset + numUnit * this.rulerUnitLength,
            date: currentDate,
            dateStr: currentDate.toLocaleDateString("en-US")
        });

        console.log(`Selected Hour ${(this.currentHour + 12) % 24}:00`, 'on', this.toDateString(currentDate));

        this.mouseX = null;
    }

    // when mouse leaving, set mouseX to null to keep the scale static
    onMouseLeave = () => {
        this.mouseX = null;
    }

    renderRuler(date) {
        const cells = [];
        const totalHours = this.showHours + 12;
        
        // the middle of all hours corresponds to 12
        for(let i = 12; i < totalHours; i++) {
            cells.push(`${String.prototype.padStart.call(i % 24, 2, '0')}`);
        }

        return (
            <table readOnly>
                <tbody>
                    <tr>
                        {cells.map((cell, index) => {
                            return (<td key={index} className="ruler-cell-up">{cell}</td>)
                        })}
                    </tr>
                    <tr>
                        {cells.map((cell, index) => {
                            return (<td key={index} className="ruler-cell-down"></td>)
                        })}
                    </tr>
                </tbody>
            </table>
        );
    }

    render() {
        const currentWidth = `${(this.widthLevel - 6) * 88 + 550}px`;

        return (
            <div className="hour-selector" onClick={this.hideCalendar} style={{width: currentWidth}}>
                <div className="date-picker">
                    <div className="date-text"><input type="text" value={this.state.dateStr} onFocus={this.showCalendar} readOnly /></div>
                    <div className="date-picker-svg" onClick={this.showCalendar}><FontAwesomeIcon icon="calendar-alt" /></div>
                    {this.state.showCalendar && 
                        <ReactCalendar 
                            ref={(self)=>{
                                this.calendar = self;
                            }} 
                            date={this.state.date} 
                            className="my-calendar" 
                            selectCalendar={this.selectCalendar} 
                        />
                    }
                </div>
                <div className="hour-container-hidden">
                    <div 
                        className="hour-mask"
                        // onMouseMove={this.onMouseMove} 
                        // onMouseDown={this.onMouseDown}
                        // onMouseUp={this.onMouseUp} 
                        onMouseLeave={this.onMouseLeave}
                        onClick={this.onClick}
                    ></div>
                    <div 
                        className="hour-container" 
                        style={{left: `calc(${this.leftInitial}px + ${this.state.leftOffset}px)`}} 
                    >
                        {this.renderRuler(this.state.date)}
                    </div>
                    <div 
                        className="hour-picker" 
                        ref={(self)=>{
                            this.pointer = self;
                        }} 
                    ></div>
                </div>
            </div>
        );
    }
}

export default HourSelector;