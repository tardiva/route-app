import React from 'react';
import { shallow } from 'enzyme';
import ToggleButton from '../../Components/ToggleButton/ToggleButton';

it('should render ToggleButton correctly', () => {
  const wrapper = shallow(<ToggleButton />);
  expect(wrapper).toMatchSnapshot();
});

it('should call handleClick prop', () => {
  const onClickSpy = jest.fn();
  const wrapper = shallow(<ToggleButton handleClick={onClickSpy}/>);
  const button = wrapper.find('.toggle-button');
  button.simulate('click');
  expect(onClickSpy).toHaveBeenCalledTimes(1);
});