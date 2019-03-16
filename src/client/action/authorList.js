import axios from '../../lib/axios';
import {
  FETCH_AUTHOR_LIST,
} from '../const';

export function fetchAuthorList(params) {
  return async (dispatch, getState) => {
    const list = await axios.get('/api/fetchAuthorList', {
      params,
    });
    const { authorList } = getState().authorList;
    dispatch({
      type: FETCH_AUTHOR_LIST,
      data: [...authorList, ...list],
    });
    return list;
  };
}

export function cs() {}
