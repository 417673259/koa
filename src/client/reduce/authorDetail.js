import {
  FETCH_AUTHOR_DETAIL,
} from '../const';

const defaultState = {
  detail: {},
};

export default (state = defaultState, action) => {
  const { type, data } = action;
  switch (type) {
    case FETCH_AUTHOR_DETAIL:
      return {
        ...state,
        detail: data,
      };
    default:
      return state;
  }
};
