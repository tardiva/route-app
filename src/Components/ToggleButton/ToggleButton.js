import React, { Component } from 'react';
import './ToggleButton.css';
import Icon from 'react-icons-kit';
import {ic_keyboard_arrow_right} from 'react-icons-kit/md/ic_keyboard_arrow_right';

class ToggleButton extends Component {

  render() {
    return (
      <button className="toggle-button" onClick={this.props.handleClick}>
        <Icon icon={ic_keyboard_arrow_right} size="24"/>
      </button>
    );
  }
}

export default ToggleButton;