import React from 'react';
import { shallow } from 'enzyme';
import Map from '../../Components/Map/Map';
import points from '../../Fixtures/points';
import google from '../../__mocks__/google.mock';

it('should map render correctly', () => {
  const wrapper = shallow(<Map center={{lat: 0, lng: 0}} points={[]}/>);
  expect(wrapper).toMatchSnapshot();
});

it('should show error message when map is unavailable', () => {
  const wrapper = shallow(<Map center={{lat: 0, lng: 0}} points={[]} warning={true}/>);
  expect(wrapper).toMatchSnapshot();
});

it('should init map correctly', () => {
  const wrapper = shallow(<Map center={{lat: 0, lng: 0}} points={[]}/>);
  const component = wrapper.instance();
  expect(component.map).toBeFalsy();
  expect(component.route).toBeFalsy();
  expect(component.infowindow).toBeFalsy();
  wrapper.setProps({google: google});
  expect(google.maps.Map).toHaveBeenCalledTimes(1);
  expect(component.map).toBeTruthy();
  expect(google.maps.Polyline).toHaveBeenCalledTimes(1);
  expect(component.route).toBeTruthy();
  expect(google.maps.InfoWindow).toHaveBeenCalledTimes(1);
  expect(component.infowindow).toBeTruthy();
});

it('should handle map center change', () => {
  const onMapChangeSpy = jest.fn();
  const wrapper = shallow(<Map center={{lat: 0, lng: 0}} points={[]} handleMapChange={onMapChangeSpy}/>);
  wrapper.setProps({google: google});
  const component = wrapper.instance();
  const map = component.map;
  map.trigger('center_changed');
  expect(onMapChangeSpy).toHaveBeenCalledTimes(1);
  expect(map.getCenter).toHaveBeenCalledTimes(1);
});

it('should add map points', () => {
  const wrapper = shallow(<Map center={{lat: 0, lng: 0}} points={[]}/>);
  const component = wrapper.instance();
  wrapper.setProps({google: google, points: [points[0]]});
  expect(component.mapPoints).toHaveLength(1);
});

it('should delete map points', () => {
  const wrapper = shallow(<Map center={{lat: 0, lng: 0}} points={[]}/>);
  const component = wrapper.instance();
  wrapper.setProps({google: google, points: [points[0], points[1]]});
  expect(component.mapPoints).toHaveLength(2);
  wrapper.setProps({google: google, points: [points[0]]});
  expect(component.mapPoints).toHaveLength(1);
});

it('should reorder map points', () => {
  const wrapper = shallow(<Map center={{lat: 0, lng: 0}} points={[]}/>);
  const component = wrapper.instance();
  wrapper.setProps({google: google, points: [points[0], points[1]]});
  expect(component.mapPoints).toHaveLength(2);
  wrapper.setProps({google: google, points: [points[1], points[0]]});
  expect(component.mapPoints).toHaveLength(2);
});

it('should open infowindow when clicking on map point', () => {
  const wrapper = shallow(<Map center={{lat: 0, lng: 0}} points={[]}/>);
  const component = wrapper.instance();
  wrapper.setProps({google: google, points: points});
  component.mapPoints[0].marker.trigger('click');
  expect(component.infowindow.open).toHaveBeenCalledTimes(1);
});

it('should call handlePointMove prop when dragging map point', () => {
  const onDragEndSpy = jest.fn();
  const wrapper = shallow(<Map center={{lat: 0, lng: 0}} points={[]}/>);
  const component = wrapper.instance();
  wrapper.setProps({google: google, points: points, handlePointMove: onDragEndSpy});
  component.mapPoints[0].marker.trigger('drag');
  component.mapPoints[0].marker.trigger('dragend');
  expect(onDragEndSpy).toHaveBeenCalledTimes(1);
});






