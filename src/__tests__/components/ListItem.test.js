import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';
import ListItem from '../../Components/ListItem/ListItem';
import {List} from '../../Components/List/List';
import points from '../../Fixtures/points';
import TestBackend from 'react-dnd-test-backend';
import { DragDropContext } from 'react-dnd';

// Obtain the reference to the component before React DnD wrapping
const OriginalListItem = ListItem.DecoratedComponent;

// Stub the React DnD connector functions with an identity function
const identity = el => el;

// Wraps a component into a DragDropContext that uses the TestBackend.
function wrapInTestContext(DecoratedComponent) {
   return DragDropContext(TestBackend)(
     class TestContextContainer extends Component {
       render() {
         return <DecoratedComponent {...this.props} />;
       }
     }
   );
 }

it('should render List Item correctly', () => {
  const wrapper = shallow(<OriginalListItem item={points[0]}
                                            connectDragSource={identity}
                                            connectDropTarget={identity}/>);
  expect(wrapper).toMatchSnapshot();
 });

it('should show point name as List Item text', () => {
  const wrapper = shallow(<OriginalListItem item={points[0]}
                                            connectDragSource={identity}
                                            connectDropTarget={identity}/>);
  expect(wrapper.find('.list-item__content').text()).toBe(points[0].name);
 });

it('should call removeItem prop when clicking Remove button', () => {
  const onClickSpy = jest.fn();
  const index = 0;
  const wrapper = shallow(<OriginalListItem index={index}
                                            item={points[index]}
                                            connectDragSource={identity}
                                            connectDropTarget={identity}
                                            removeItem={onClickSpy}/>);
  wrapper.find('.list-item__delete-button').simulate('click');
  expect(onClickSpy).toHaveBeenLastCalledWith(0);
});


describe('test drag and drop list items', () => {

  function testDNDItems(sourceIndex, targetIndex, offsetY, isReordered) {
    const onMoveSpy = jest.fn();

    const TestContext = wrapInTestContext(List);

    const root = mount(<TestContext items={points} moveItem={onMoveSpy}/>);
    const manager = root.instance().getManager();
    const backend = manager.getBackend();
    const monitor = manager.getMonitor();
    jest.spyOn(monitor, 'getClientOffset').mockImplementation(() => { return {y: offsetY} });

    const sourceComponent = root.find('DropTarget(DragSource(ListItem))').at(sourceIndex).find('DragSource(ListItem)').instance();
    const targetComponent = root.find('DropTarget(DragSource(ListItem))').at(targetIndex).instance();
    backend.simulateBeginDrag([sourceComponent.getHandlerId()]);
    backend.simulateHover([targetComponent.getHandlerId()]);

    if (isReordered){
      expect(onMoveSpy).toHaveBeenLastCalledWith(sourceIndex, targetIndex);
    } else {
      expect(onMoveSpy).not.toHaveBeenCalled();
    }
  }

  beforeEach(() => {
    jest.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(() => { return { top: 40, bottom: 80 } });
  });

  it('should call moveItem prop when reordering List Items', () => {
    testDNDItems(0, 1, 70, true);
  });

  it('should not call moveItem prop when dragging downwards and the cursor is below less than 50%', () => {
    testDNDItems(0, 1, 45, false);
  });

  it('should not call moveItem prop when dragging upwards and the cursor is above less than 50%', () => {
    testDNDItems(1, 0, 70, false);
  });

  it('should not replace items with themselves', () => {
    testDNDItems(1, 1, 0, false);
  });
});


