import React from 'react';
import { shallow } from 'enzyme';
import MapWrapper from '../../Components/Map/MapWrapper';

it('should render MapWrapper correctly', () => {
  const wrapper = shallow(<MapWrapper />);
  expect(wrapper).toMatchSnapshot();
});