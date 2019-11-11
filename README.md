This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Live Demo
http://react.scientrans.com:3000/

### Steps to run the app

## Switch to root folder
cd react_hour_selector

## Install react environment and modules
npm install create-react-app
npm install

## Run the app
npm start

## Check browser
http://localhost:3000/


### Component Specification
- react-calendar
Props
    date: Date   // default date selected
    selectCalendar(date: Date): void    // callback when a date is selected
State
    date: Date   // current date selected

- hour-selector
Props
    defaultDate: Date    // default date selected
    widthLevel: Number    // number of hours available in the scaler window on each side of the pointer, 3+
State
    date: Date    // current date selected
    dateStr: String // formatted date string corresponding to date selected
    showCalendar: boolean // whether calendar select is shown
    leftOffset: Number // offset of the scale as it is dragged horizontally


### App Implementation

## Environment Establishment
We use create-react-app module to establish the running environment of this app. We use font-awesome for the avatar of calendar picker. 

## Calendar Selection
There are a lot of date time picker node modules for react available on the web. I've tried several of these modules, such as react-datepicker, react-date-picker, and react-datetime-picker. None of them are perfect for our use case. Since their implementations are all based on react-calendar, in this app, we implement our own customized date selector. Some usability problems are handled: when clicking on the background, or when a date is selected, the calendar body is hidden. By focusing on the text field for date, or clicking on avatar, the calendar body is shown.

## Scaler Implementation
The scaler for hours is implemented by setting border color of two adjacent rows of cells of a table, that is, the border-bottom of the upper row and the border-top of the lower row, as well as left and right border of both upper and lower rows, are set to black. Width of each cell is set to a fixed pixel value, so that we are able to calculate hours based on position offset when dragging. Since there will be about 2000 hours in the scaler, the table should be overflowed. We set overflow property to hidden, to make a visible scaler window within the div block for the app.

- Dragging (Function Removed due to Adjustment)
As we drag horizontally within the scaler window, the position offset by the mouse can be detected by calculating the difference between its current pageX value to the one when a mouse down event occurs. With the position offset, we can dynamically set the absolute left offset of the ruler table, by setting react state to a new value. Then the ruler re-renders as we drag along the way.
The actual offset as we stop dragging is handled as if we are always staying at an hour value exactly, instead of at any space between two hours. This is realized by rounding the number of hours moved.

- Clicking an Hour
When clicking on an hour on the scaler, the clicked hour is moved to the center of the scaler, that is where the pointer points at. The offset relative to the pointer is calculated to obtain the actual hour to be centered.

- Select a Date
When selecting a date from the calendar, the hour value centered is kept constant, while only date changes.

- Current Hour
The initial hour selected is set to 12. The scaler extends to 45 * 24 hours on both ends. A reference date is defined to be the date corresponding to the left most hour in the scaler. When a new date is selected, the reference date is updated, and will keep constant as we drag the scaler. Therefore, the current hour can be calculated based on reference date and the current offset.  

- Date Update As Current Hour Change
When dragging by more than 24 hours, the current date will necessarily change. Therefore, it's necessary to set date state to reflect the current date, and bind the state to our date text field.

