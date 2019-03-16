import React from 'react';
import { autobind } from 'core-decorators';


@autobind()
export default class Cs extends React.Component {
  state = {
    list: [
      {
        id: 1,
        name: 11,
      },
      {
        id: 1,
        name: 111,
      },
      {
        id: 2,
        name: 22,
      },
      {
        id: 2,
        name: 222,
      },
      {
        id: 3,
        name: 33,
      },
      {
        id: 3,
        name: 333,
      },
      {
        id: 4,
        name: 4444,
      },
    ],
  }

  change() {
    this.setState({
      list: [
        { name: '2223', id: 999 },
      ],
    });
  }

  render() {
    const { list } = this.state;
    return (
      <div>
        {
          list.map(item => <li key={item.id}>{item.name}</li>)
        }
        <button type="button" onClick={this.change}>mm</button>
      </div>
    );
  }
}
