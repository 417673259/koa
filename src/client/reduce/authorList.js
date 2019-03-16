import {
  FETCH_AUTHOR_LIST,
} from '../const';

const defaultState = {
  authorList: [],
};
export default (state = defaultState, action) => {
  const { type, data } = action;
  switch (type) {
    case FETCH_AUTHOR_LIST:
      return {
        ...state,
        authorList: data,
      };
    default:
      return state;
  }
};
