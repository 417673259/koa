import React from 'react';
import { Link } from 'react-router-dom';
import PropType from 'prop-types';
import Style from './css/List.scss';

export default function List(props) {
  const { list } = props;
  return (
    <ul className={Style.wrap}>
      {
    list.map(item => (
      <li className={`${Style.item} border-scale-b`} key={item.id}>
        <Link
          to={`/zuozhe/${item.id}.html`}
        >
          <h2>
          [
            {item.dynasty}
          ]
            {' '}
            {item.name}
            {' '}
            {
            item.famous.map(tag => (<span className={Style.itemLabels} key={tag}>{tag}</span>))
          }
          </h2>
          <div className={Style.msg}>
            <div className={Style.msgLeft}>
              <p className={`${Style.msgLeftSummary} text-ellipse`}>
                {item.summary}
              </p>
            </div>
            <div className={Style.msgRight}>
              <img src={item.imgUrl} alt="" />
            </div>
          </div>
        </Link>
      </li>
    ))
  }
    </ul>
  );
}
List.propTypes = {
  list: PropType.arrayOf(PropType.object),
};
List.defaultProps = {
  list: [],
};
