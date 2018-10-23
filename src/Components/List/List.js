import React, { Component } from 'react';
import './List.css';
import { DragDropContext } from 'react-dnd';
import MultiBackend, { Preview } from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch';
import ListItem from '../ListItem/ListItem';
import ListItemPreview from '../ListItem/ListItemPreview'

export class List extends Component {

  render() {
    return (
      <div className="list">
        <ul className="list__list">
          {this.props.items.map((item, i) => {
            return (<ListItem key={item.id}
                              index={i}
                              item={item}
                              moveItem={this.props.moveItem}
                              removeItem={this.props.removeItem}
            />)
          })}
        </ul>
        <Preview generator={this.generatePreview} />
      </div>
    );
  }

  generatePreview(type, item, style) {
    Object.assign(style, {width: `${item.width}px`});
    return (<ListItemPreview name={item.name} style={style} />);
  }
}

export default DragDropContext(MultiBackend(HTML5toTouch))(List);