import React, {Component} from 'react';
import Icon from 'react-icons-kit';
import {ic_close} from 'react-icons-kit/md/ic_close';

class ListItemPreview extends Component {

  render() {
    return (
      <div className="list-item" style={this.props.style}>
        <div className="list-item__content">{this.props.name}</div>
        <button className="list-item__delete-button">
          <Icon icon={ic_close}/>
        </button>
      </div>)
  }
}

export default ListItemPreview;