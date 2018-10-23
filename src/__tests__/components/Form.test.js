import React from 'react';
import { shallow } from 'enzyme';
import Form from '../../Components/Form/Form';

it('should render Form correctly', () => {
  const wrapper = shallow(<Form />);
  expect(wrapper).toMatchSnapshot();
});

it('should set item name on input change', () => {
  const value = 'New Valid Point';
  const wrapper = shallow(<Form />);
  const input = wrapper.find('input').at(0);
  input.simulate('change', {
    target: { value }
  });
  expect(wrapper.state('itemName')).toBe(value);
});

// it('should set touched on input blur', () => {
//   const wrapper = shallow(<Form />);
//   const input = wrapper.find('input').at(0);
//   input.simulate('blur');
//   expect(wrapper.state('touched')).toEqual(true);
// });

it('should call onSubmit prop for valid form submission', () => {
  const value = 'New Valid Point';
  const onSubmitSpy = jest.fn();
  const wrapper = shallow(<Form onSubmit={onSubmitSpy} />);
  wrapper.setState({itemName: value});
  wrapper.find('form').simulate('submit', {
    preventDefault: () => { }
  });
  expect(onSubmitSpy).toHaveBeenLastCalledWith(value);
});

it('should not call onSubmit prop for invalid form submission', () => {
  const value = '';
  const onSubmitSpy = jest.fn();
  const wrapper = shallow(<Form onSubmit={onSubmitSpy} />);

  wrapper.setState({itemName: value});
  wrapper.find('form').simulate('submit', {
    preventDefault: () => { }
  });
  const input = wrapper.find('input').at(0);
  expect(input.hasClass('form__field--error')).toEqual(true);
  expect(onSubmitSpy).not.toHaveBeenCalled();
});