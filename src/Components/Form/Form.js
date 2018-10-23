import React, { Component } from 'react';
import './Form.css';
import update from 'immutability-helper';

class CreateItemForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      itemName: '',
      touched: false
    };

    this.handleNameChange = this.handleNameChange.bind(this);
    // this.handleBlur = this.handleBlur.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  render() {
    const error = this.validate();
    return (
      <form onSubmit={this.onSubmit}>
        <input value={this.state.itemName}
               type="text"
               onChange={this.handleNameChange}
               className={"form__field " + (error && this.state.touched ? 'form__field--error' : '')}
               autoComplete="off"
               placeholder={'Новая точка маршрута'}/>
      </form>
    )
  }

  validate() {
    return this.state.itemName === '';
  }

  onSubmit(e) {
    e.preventDefault();

    if (this.validate()) {
      this.setTouched(true);
    } else {
      this.props.onSubmit(this.state.itemName );
      this.resetForm();
    }
  }

  handleNameChange(e) {
    const itemName = e.target.value;
    this.setState(() => ({ itemName }));
  };

  // handleBlur() {
  //   this.setTouched(true);
  // };

  setTouched(isTouched) {
    this.setState(update(this.state, {
      touched: {
        $set: isTouched
      }
    }));
  }

  resetForm() {
    this.setState(update(this.state, {
      itemName: {
        $set: ''
      },
      touched: {
        $set: false
      }
    }));
  }
}

export default CreateItemForm;