import { combineReducers } from 'redux';
import authorList from './authorList';
import authorDetail from './authorDetail';

export default combineReducers({
  authorList,
  authorDetail,
});
