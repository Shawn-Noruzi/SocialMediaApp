import {
  SET_THOUGHTS,
  LIKE_THOUGHT,
  UNLIKE_THOUGHT,
  LOADING_DATA,
  DELETE_THOUGHT,
  POST_THOUGHT,
  SET_THOUGHT,
  SUBMIT_COMMENT
} from "../types";

const initialState = {
  thoughts: [],
  thought: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true
      };
    case SET_THOUGHTS:
      return {
        ...state,
        thoughts: action.payload,
        loading: false
      };
    case SET_THOUGHT:
      return {
        ...state,
        thought: action.payload
      };
    case LIKE_THOUGHT:
    case UNLIKE_THOUGHT:
      let index = state.thoughts.findIndex(
        thought => thought.thoughtId === action.payload.thoughtId
      );
      state.thoughts[index] = action.payload;
      if (state.thought.thoughtId === action.payload.thoughtId) {
        state.thought = action.payload;
      }
      return {
        ...state
      };
    case DELETE_THOUGHT:
      index = state.thoughts.findIndex(
        thought => thought.thoughtId === action.payload
      );
      //removes elements of arr starting from __
      state.thoughts.splice(index, 1);
      return {
        ...state
      };
    default:
      return state;
  }
}
