import * as actions from "./action_types";
//import axios from "axios";

function reducer(
  state = {
    data: [],
    user: {
      username: null,
      email: null,
      user_id: null,
      user_type: null,
    },
  },
  action
) {
  switch (action.type) {
    case actions.SET_DATA:
      return { ...state, data: action.payload.data };
    case actions.SIGN_IN_USER:
      return { ...state, user: { ...action.payload.data } };
    case actions.SIGN_OUT_USER:
      return {
        ...state,
        user: {
          username: null,
          email: null,
          user_id: null,
          user_type: null,
        },
      };

    default:
      return state;
  }
}

export default reducer;
