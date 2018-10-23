import React from 'react';
import { shallow } from 'enzyme';
import '../../__mocks__/matchMedia.mock';
import App from '../../App';
import points from '../../Fixtures/points';

it('should render App correctly', () => {
  const wrapper = shallow(<App/>);
  expect(wrapper).toMatchSnapshot();
});

it('should update state wnen new point was added', () => {
  const wrapper = shallow(<App/>);
  const component = wrapper.instance();
  component.setState({points: []});
  const point = {id: component.state.currentId, name: 'My New point', coord: component.state.currentCoord};
  component.addPoint(point.name);
  expect(component.state.points.length).toEqual(1);
  expect(component.state.points[0]).toEqual(point);
});

it('should update state wnen new point was deleted', () => {
  const wrapper = shallow(<App/>);
  const component = wrapper.instance();
  component.setState({points: points});
  const point = points[0];
  component.removePoint(point.id);
  expect(component.state.points.length).toEqual(points.length - 1);
  expect(component.state.points).not.toEqual(expect.arrayContaining([points[0]]));
});

it('should update state wnen reordering points', () => {
  const wrapper = shallow(<App/>);
  const component = wrapper.instance();
  component.setState({points: points});
  component.reorderPoints(1, 0);
  expect(component.state.points.length).toEqual(points.length);
  expect(component.state.points[0]).toEqual(points[1]);
  expect(component.state.points[1]).toEqual(points[0]);
});

it('should update state wnen current coordinates change', () => {
  const wrapper = shallow(<App/>);
  const component = wrapper.instance();
  component.setState({currentCoord: {lat: 0, lng: 0}});
  const coord = {lat: 1, lng: 1};
  component.updateCurrentCoord(coord);
  expect(component.state.currentCoord).toEqual(coord);
});

it('should update state wnen point coordinates change', () => {
  const wrapper = shallow(<App/>);
  const component = wrapper.instance();
  component.setState({points: points});
  const index = 0;
  const coord = {lat: 5, lng: 5};
  component.movePoint(0, coord);
  expect(component.state.points[index].coord).toEqual(coord);
});

it('should update state wnen resizing window', () => {
  const wrapper = shallow(<App/>);
  const component = wrapper.instance();
  component.setState({sidebarOpen: true, sidebarDocked: true});
  component.handleMediaQueryChanged();
  expect(component.state.sidebarOpen).toEqual(false);
  expect(component.state.sidebarDocked).toEqual(false);
});

it('should update state wnen toggling sidebar', () => {
  const wrapper = shallow(<App/>);
  const component = wrapper.instance();
  const isOpen = true;
  component.setState({sidebarOpen: isOpen});
  component.toggleSidebar();
  expect(component.state.sidebarOpen).toEqual(!isOpen);
});

it('should update state wnen script loading error occurs', () => {
  const wrapper = shallow(<App/>);
  const component = wrapper.instance();
  const response = {errored: true};
  component.callAfterScriptLoads(response);
  expect(component.state.scriptError).toEqual(response.errored);
});






