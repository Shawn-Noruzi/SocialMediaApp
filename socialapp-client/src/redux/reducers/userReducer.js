import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED
} from "../types";

//userState
const initialState = {
  autheticated: false,
  credentials: {},
  likes: [],
  notifications: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        autheticated: true
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return {
        autheticated: true,
        ...action.payload
      };
    default:
      return state;
  }
}
