import React, { PureComponent } from 'react';
import Style from './Header.scss';


export default class Header extends PureComponent {
  state = {
    number: 0,
  }

  componentDidMount() {

  }

  click = () => {
    this.setState({
      number: 1,
    });
    console.log(this.state.number);
  }

  render() {
    return (
      <div className={Style.wrap}>
        <h1 onClick={this.click}>古诗词大全</h1>
      </div>
    );
  }
}
