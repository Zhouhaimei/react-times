import React, { PropTypes } from 'react';
import {
  TWELVE_HOURS,
  MINUTES,
  POINTER_RADIUS,
  PICKER_RADIUS,
  MAX_ABSOLUTE_POSITION,
  MIN_ABSOLUTE_POSITION
} from '../../utils/const_value.js';
import language from '../../utils/language';

const propTypes = {
  language: PropTypes.object,
  hour: PropTypes.string,
  minute: PropTypes.string,
  handleHourChange: PropTypes.func,
  handleMinuteChange: PropTypes.func
};

const defaultProps = {
  language: language.get(),
  hour: '00',
  minute: '00',
  handleHourChange: () => {},
  handleMinuteChange: () => {}
};

import Button from '../Common/Button';
import PickerDargHandler from '../Picker/PickerDargHandler';
import pickerPointGenerator from '../Picker/PickerPointGenerator';

class TwelveHoursMode extends React.PureComponent {
  constructor(props) {
    super(props);
    const hourPointerRotate = this.resetHourDegree();
    const minutePointerRotate = this.resetMinuteDegree();
    this.state = {
      hourPointerRotate,
      minutePointerRotate
    };
    this.handleHourChange = this.handleHourChange.bind(this);
    this.handleMinuteChange = this.handleMinuteChange.bind(this);
    this.handleDegreeChange = this.handleDegreeChange.bind(this);
    this.handleHourPointerClick = this.handleHourPointerClick.bind(this);
    this.handleMinutePointerClick = this.handleMinutePointerClick.bind(this);
  }

  resetHourDegree() {
    const hour = parseInt(this.props.hour);
    let pointerRotate = 0;
    TWELVE_HOURS.map((h, index) => {
      if (hour === index + 1) {
        pointerRotate = 360 * (index + 1) / 12;
      }
    });
    return pointerRotate
  }

  resetMinuteDegree() {
    const minute = parseInt(this.props.minute);
    let pointerRotate = 0;
    MINUTES.map((m, index) => {
      if (minute === index) {
        pointerRotate = 360 * index / 60;
      }
    });
    return pointerRotate;
  }

  getHourTopAndHeight() {
    const height = MIN_ABSOLUTE_POSITION - POINTER_RADIUS;
    const top = PICKER_RADIUS - MIN_ABSOLUTE_POSITION + POINTER_RADIUS;
    return [top, height];
  }

  getMinuteTopAndHeight() {
    const height = MAX_ABSOLUTE_POSITION - POINTER_RADIUS;
    const top = PICKER_RADIUS - MAX_ABSOLUTE_POSITION + POINTER_RADIUS;
    return [top, height];
  }

  handleTimeQuantumChange(timeQuantum) {
    if (timeQuantum !== this.props.timeQuantum) {
      const { handleTimeQuantumChange } = this.props;
      handleTimeQuantumChange && handleTimeQuantumChange(timeQuantum);
    }
  }

  handleHourPointerClick(time, hourPointerRotate) {
    this.handleHourChange(time);
    this.handleDegreeChange({ hourPointerRotate });
  }

  handleMinutePointerClick(time, minutePointerRotate) {
    this.handleMinuteChange(time);
    this.handleDegreeChange({ minutePointerRotate });
  }

  handleDegreeChange(pointerRotate) {
    this.setState(pointerRotate);
  }

  handleHourChange(time) {
    const hour = parseInt(time);
    const { handleHourChange } = this.props;
    handleHourChange && handleHourChange(hour);
  }

  handleMinuteChange(time) {
    const minute = parseInt(time);
    const { handleMinuteChange } = this.props;
    handleMinuteChange && handleMinuteChange(minute);
  }

  render() {
    const {
      hour,
      minute,
      language,
      dragable,
      clearFoucs,
      timeQuantum
    } = this.props;

    const { hourPointerRotate, minutePointerRotate } = this.state;

    const [top, height] = this.getHourTopAndHeight();
    const hourRotateState = {
      top,
      height,
      pointerRotate: hourPointerRotate
    };
    const [minuteTop, minuteHeight] = this.getMinuteTopAndHeight()
    const minuteRotateState = {
      top: minuteTop,
      height: minuteHeight,
      pointerRotate: minutePointerRotate
    };

    const HourPickerPointGenerator = pickerPointGenerator('hour', 12);
    const MinutePickerPointGenerator = pickerPointGenerator('minute', 12);

    const handleQuantumChange = this.handleTimeQuantumChange.bind(
      this,
      timeQuantum === 'AM' ? 'PM' : 'AM'
    );

    return (
      <div className='time_picker_modal_container'>
        <div className='time_picker_modal_header'>
          <span
            className='time_picker_header active'>{hour}:{minute}</span>&nbsp;
          <span
            onClick={handleQuantumChange}
            className='time_picker_header quantum'>{timeQuantum}</span>
        </div>
        <div className='picker_container'>
          <HourPickerPointGenerator
            handleTimePointerClick={this.handleHourPointerClick}
          />
          <MinutePickerPointGenerator
            handleTimePointerClick={this.handleMinutePointerClick}
          />
          <PickerDargHandler
            step={0}
            rotateState={hourRotateState}
            time={parseInt(hour)}
            maxLength={MIN_ABSOLUTE_POSITION}
            dragable={dragable}
            handleTimePointerClick={this.handleHourPointerClick} />
          <PickerDargHandler
            step={1}
            rotateState={minuteRotateState}
            time={parseInt(minute)}
            minLength={MAX_ABSOLUTE_POSITION}
            handleTimePointerClick={this.handleMinutePointerClick} />
        </div>
        <div className='buttons_wrapper'>
          <Button
            onClick={clearFoucs}
            text={language.close}
          />
        </div>
      </div>
    );
  }
}

TwelveHoursMode.propTypes = propTypes;
TwelveHoursMode.defaultProps = defaultProps;

export default TwelveHoursMode;
