import React, { PureComponent, Fragment } from 'react';
import { hot } from 'react-hot-loader';
import { autobind } from 'core-decorators';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import Header from '../component/comm/Header';

import {
  fetchAuthorDetail,
} from '../action/authorDetail';
import S from './AuthorDetail.scss';


@hot(module)
@connect(state => state.authorDetail)
@autobind()
export default class AuthorDetail extends PureComponent {
  static propTypes = {
    detail: PropType.arrayOf(PropType.object),
  }

  static defaultProps = {
    detail: {},
  }

  static async fetchInitialProps({
    dispatch,
    params,
  }) {
    const { id } = params;
    await dispatch(fetchAuthorDetail({ id }));
  }

  componentDidMount() {
    const { dispatch, match, detail } = this.props;
    if (detail && detail.id !== +match.params.id) {
      dispatch(fetchAuthorDetail({ id: match.params.id }));
    }
  }

  render() {
    const {
      detail: {
        summary, imgUrl, name, dynasty, alias, famous = [],
      },
    } = this.props;
    return (
      <Fragment>
        <Header />
        <div className={S.header}>
          <div className={S.img}>
            <img src={imgUrl} alt="" />
          </div>
          <div>
            <h2>
              {name}
              <span>
【
                {dynasty}
】
              </span>
            </h2>
            {
              alias && (
                <p className={S.alias}>
              号称：
                  {'    '}
                  { alias }
                </p>
              )
            }
            {
              famous.length > 0 && (
                <p className={S.famous}>
              合称：
                  {
                famous.map(item => (
                  <span key={item}>{item}</span>
                ))
              }
                </p>
              )
            }
          </div>
        </div>

        <div className={S.content}>
          {
          summary
          }
        </div>
      </Fragment>
    );
  }
}
