import {
  SET_THOUGHTS,
  LOADING_DATA,
  LIKE_THOUGHT,
  UNLIKE_THOUGHT,
  SET_THOUGHT,
  DELETE_THOUGHT
} from "../types";
import axios from "axios";

//GET all thoughts

export const getThoughts = () => dispatch => {
  dispatch({ type: LOADING_DATA });
  axios
    .get("/showerThoughts")
    .then(res => {
      dispatch({
        type: SET_THOUGHTS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: SET_THOUGHTS,
        payload: []
      });
    });
};

// Like a thought
export const likeThought = thoughtId => dispatch => {
  axios
    .get(`/showerThought/${thoughtId}/like`)
    .then(res => {
      dispatch({
        type: LIKE_THOUGHT,
        payload: res.data
      });
    })
    .catch(err => {
      console.log(err);
    });
};

//Unlike a thought

export const unlikeThought = thoughtId => dispatch => {
  axios
    .get(`/showerThought/${thoughtId}/unlike`)
    .then(res => {
      dispatch({
        type: UNLIKE_THOUGHT,
        payload: res.data
      });
    })
    .catch(err => {
      console.log(err);
    });
};

export const deleteThought = thoughtId => dispatch => {
  axios
    .delete(`/showerThought/${thoughtId}`)
    .then(() => {
      dispatch({
        type: DELETE_THOUGHT,
        payload: thoughtId
      });
    })
    .catch(err => console.log(err));
};
