import React, { PureComponent, createRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import Style from './ScrollList.scss';

@autobind()
export default class ScrollList extends PureComponent {
  static computed(offset) {
    const wH = window.innerHeight;
    const mH = document.documentElement.scrollHeight || document.body.scrollHeight;
    const now = window.pageYOffset;
    return now + wH + offset >= mH;
  }

  max = 45

  isLast = false;

  isDownLast = false;

  static propTypes = {
    offset: PropTypes.number,
    children: PropTypes.shape(),
    pullUp: PropTypes.func,
    pageNo: PropTypes.number,
    seoUrl: PropTypes.string,
    pullDown: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  }

  static defaultProps = {
    offset: 600,
    pullDown: false,
    pullUp() {},
    children() {},
    pageNo: 1,
    seoUrl: '',
  }


  constructor(props) {
    super(props);
    this.wrap = createRef();
    this.pageNo = props.pageNo + 1;
  }

  state = {
    newData: 0,
    upStatus: false,
  }

  componentDidMount() {
    window.removeEventListener('scroll', this.pullUp);
    window.addEventListener('scroll', this.pullUp, false);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.pullUp);
    this.unBind();
  }

  unBind() {
    document.removeEventListener('touchstart', this.touchStart);
    document.removeEventListener('touchmove', this.touchMove);
    document.removeEventListener('touchend', this.touchEnd);
  }

  async pullUp() {
    const { offset, pullUp } = this.props;
    const { pageNo, isLast } = this;
    if (ScrollList.computed(offset)) {
      window.removeEventListener('scroll', this.pullUp);
      try {
        this.setState({
          upStatus: true,
        });
        const list = await pullUp(pageNo);
        if (!list.length) {
          this.isLast = true;
        }
        this.pageNo += 1;
      } catch (err) { console.log(err); }
      this.setState({
        upStatus: false,
      });
      if (!isLast) {
        setTimeout(() => {
          window.addEventListener('scroll', this.pullUp, false);
        }, 50);
      }
    }
  }

  render() {
    const { children, pullDown, seoUrl } = this.props;
    const { newData, upStatus } = this.state;
    const { pageNo } = this;
    if (typeof pullDown === 'function') {
      return (
        <section className={Style.scrollWrap} ref={this.wrap}>
          {
          newData !== 0 ? (
            <div className={Style.tip}>
            有
              {newData}
              条新鲜的资讯来咯
            </div>
          ) : null
        }

          {children}
          <div className={Style.scrollLoading}>
            正在加载中
            <span className={Style.icon} />
          </div>
        </section>
      );
    }
    return (
      <Fragment>
        {children}
        {
          upStatus ? (
            <p className={Style.loadingButtom}>
          正在努力加载
              <span className={Style.loading} />
            </p>
          ) : null
        }

        {
          seoUrl ? (
            <a href={`/${seoUrl}?pageNo=${pageNo}`} className={Style.pageNext}>下一页</a>
          ) : null
        }
      </Fragment>
    );
  }
}
