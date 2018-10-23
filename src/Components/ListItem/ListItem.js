import React, { Component } from 'react';
import { findDOMNode } from 'react-dom'
import { DragSource, DropTarget } from 'react-dnd';
import './ListItem.css';
import Icon from 'react-icons-kit';
import {ic_close} from 'react-icons-kit/md/ic_close';

const itemSource = {
  beginDrag(props, monitor, component) {

    const offsetWidth = (findDOMNode(component)).offsetWidth;

    return {
      id: props.item.id,
      index: props.index,
      name: props.item.name,
      width: offsetWidth
    }
  },
};

const itemTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return
    }

    // Determine rectangle on screen
    const hoverBoundingRect = (findDOMNode(component)).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return
    }

    // Time to actually perform the action
    props.moveItem(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex
  }
};

class ListItem extends Component {

  constructor(props) {
    super(props);
    this.handleRemove = this.handleRemove.bind(this);
  }

  render() {
    const {
      item,
      isDragging,
      connectDragSource,
      connectDropTarget,
    } = this.props;
    const opacity = isDragging ? 0 : 1;
    return (
      connectDragSource &&
      connectDropTarget &&
      connectDragSource(
        connectDropTarget(
          <li className="list-item" style={{opacity}}>
            <div className="list-item__content">{item.name}</div>
            <button className="list-item__delete-button" onClick={this.handleRemove}>
              <Icon icon={ic_close}/>
            </button>
          </li>)
      )
    );
  }

  handleRemove() {
    this.props.removeItem(this.props.index);
  }
}

export default DropTarget('listItem', itemTarget, (connect) => ({
  connectDropTarget: connect.dropTarget(),
}))(DragSource('listItem', itemSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(ListItem));