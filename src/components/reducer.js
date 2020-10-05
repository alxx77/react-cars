import * as actions from "./action_types";
//import axios from "axios";

function reducer(
  state = {
    data: [],
    offset: 0,
    numberPerPage: 4,
    pageCount: 0,
    currentData: [],
    username: null,
    email: null,
    user_id: null,
    user_type: null,
  },
  action
) {
  switch (action.type) {
    case actions.SET_DATA:
      return { ...state, data: action.payload.data };
    case actions.SIGN_IN_USER:
      const new_state = { ...state, ...action.payload.data };

      return new_state;
    case actions.SIGN_OUT_USER:
      return {
        ...state,
        username: null,
        email: null,
        user_id: null,
        user_type: null,
      };

    default:
      return state;
  }
}

export default reducer;
