import AuthorList from './container/AuthorList';
import NoMatch from './container/NoMatch';
import AuthorDetail from './container/AuthorDetail';

export default [
  {
    path: '/zuozhe/',
    exact: true,
    component: AuthorList,
  },
  {
    path: '/zuozhe/:id(\\d+).html',
    exact: true,
    component: AuthorDetail,
  },
  {
    path: '',
    component: NoMatch,
  },
];
