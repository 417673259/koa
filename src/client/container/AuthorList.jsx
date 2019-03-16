import React, { PureComponent, Fragment } from 'react';
import { hot } from 'react-hot-loader';
import { autobind } from 'core-decorators';
import PropType from 'prop-types';
import { parse } from 'querystring';
import { connect } from 'react-redux';

import Header from '../component/comm/Header';
import List from '../component/authorList/List';
import ScrollList from '../component/comm/ScrollList';

import {
  fetchAuthorList,
} from '../action/authorList';


@connect(state => ({
  authorList: state.authorList,
}))
@hot(module)
@autobind()
export default class App extends React.PureComponent {
  static propTypes = {
    location: PropType.shape(),
    authorList: PropType.arrayOf(PropType.object),
  }

  static defaultProps = {
    location: {},
    authorList: [],
  }

  static async fetchInitialProps({
    dispatch,
    query,
  }) {
    const { pageNo = 1 } = query;
    await Promise.all([
      dispatch(fetchAuthorList({
        pageSize: 20,
        pageNo,
      })),
    ]);
  }

  state = {
    count: 2,
  }

  componentDidMount() {
    const { authorList: { authorList }, location, dispatch } = this.props;
    const { pageNo = 1 } = parse(location.search.replace('?', ''));
    if (!authorList.length) {
      dispatch(fetchAuthorList({
        pageSize: 20,
        pageNo,
      }));
    }
  }

  getPageNo() {
    const { location, authorList: { authorList } } = this.props;
    if (this.pageNo) {
      return this.pageNo;
    }
    if (authorList.length > 0) {
      this.pageNo = authorList / 20;
    }
    const { pageNo = 1 } = parse(location.search.replace('?', ''));
    this.pageNo = pageNo;
    return +this.pageNo;
  }

  fetch(pageNo) {
    console.log(pageNo);
    const { dispatch } = this.props;
    return dispatch(fetchAuthorList({
      pageSize: 20,
      pageNo,
    }));
  }


  render() {
    const { location: { search }, authorList: { authorList } } = this.props;
    const { pageNo = 1 } = parse(search.replace('?', ''));
    return (
      <Fragment>
        <Header />
        <ScrollList
          pullUp={this.fetch}
          pageNo={this.getPageNo()}
          seoUrl={`zuozhe/pageNo=${pageNo + 1}`}
        >
          <List list={authorList} />
        </ScrollList>
      </Fragment>
    );
  }
}
