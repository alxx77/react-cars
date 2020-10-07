import * as actions from "./action_types";

export function setData(data) {
  return {
    type: actions.SET_DATA,
    payload: {
      data,
    },
  };
}

export function signInUser(data) {
  return {
    type: actions.SIGN_IN_USER,
    payload: {
      data,
    },
  };
}

export function signOutUser() {
  return {
    type: actions.SIGN_OUT_USER,
    payload: {

    },
  };
}