import React from 'react';
import { shallow } from 'enzyme';
import List from '../../Components/List/List';
import points from '../../Fixtures/points';
import ListItemPreview from '../../Components/ListItem/ListItemPreview';

// Obtain the reference to the component before React DnD wrapping
const OriginalList = List.DecoratedComponent;

it('should render List correctly', () => {
  const wrapper = shallow(<OriginalList items={points} />);
  expect(wrapper).toMatchSnapshot();
});

it('should render empty List', () => {
  const wrapper = shallow(<OriginalList items={[]} />);
  expect(wrapper).toMatchSnapshot();
});

it('should generate ListItemPreview', () => {
  const wrapper = shallow(<OriginalList items={[]} />);
  const type = {};
  const item = {name: 'Test', width: 300};
  const style = {};
  const preview = shallow(wrapper.instance().generatePreview(type, item, style));
  expect(preview).toMatchSnapshot();
});