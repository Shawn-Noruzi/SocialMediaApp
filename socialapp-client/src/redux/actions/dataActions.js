import {
  SET_THOUGHTS,
  LOADING_DATA,
  LIKE_THOUGHT,
  UNLIKE_THOUGHT,
  SET_THOUGHT,
  LOADING_UI,
  DELETE_THOUGHT,
  POST_THOUGHT,
  SET_ERRORS,
  CLEAR_ERRORS,
  STOP_LOADING_UI
} from "../types";
import axios from "axios";

//GET all thoughts

export const getThoughts = () => dispatch => {
  dispatch({ type: LOADING_DATA });
  //grab data from the end point, then take the result and dispatch 'set_thoughts' which takes the data and puts it into the state in a 'thoughts' var
  axios
    .get("/showerThoughts")
    .then(res => {
      dispatch({
        type: SET_THOUGHTS,
        payload: res.data
      });
    })
    .catch(err => {
      //if there's no thoughts, just set the state thoughts to be nothing
      dispatch({
        type: SET_THOUGHTS,
        payload: []
      });
    });
};

export const getThought = thoughtId => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/showerThought/${thoughtId}`)
    .then(res => {
      dispatch({ type: SET_THOUGHT, payload: res.data });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch(err => console.log(err));
};

//post a thought
export const postThought = newThought => dispatch => {
  dispatch({
    type: LOADING_UI
  });
  axios
    .post("/showerThought", newThought)
    .then(res => {
      dispatch({
        type: POST_THOUGHT,
        payload: res.data
      });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch(err => {
      dispatch({ type: SET_ERRORS, payload: err.response.data });
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

export const clearErrors = () => dispatch => {
  dispatch({ type: CLEAR_ERRORS });
};
