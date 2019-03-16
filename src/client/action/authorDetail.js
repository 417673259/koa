import axios from '../../lib/axios';
import {
  FETCH_AUTHOR_DETAIL,
} from '../const';

export function fetchAuthorDetail(params) {
  return async (dispatch) => {
    const data = await axios.get('/api/fetchAuthorDetail', {
      params,
    });
    dispatch({
      type: FETCH_AUTHOR_DETAIL,
      data,
    });
    return data;
  };
}

export function cs() {}
