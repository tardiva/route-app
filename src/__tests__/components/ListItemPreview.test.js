import React from 'react';
import { shallow } from 'enzyme';
import ListItemPreview from '../../Components/ListItem/ListItemPreview';

it('should render List Item Preview correctly', () => {
  const wrapper = shallow(<ListItemPreview name="Test" style={{width: '300px'}} />);
  expect(wrapper).toMatchSnapshot();
});