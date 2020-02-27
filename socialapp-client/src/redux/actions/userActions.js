import { SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI, SET_UNAUTHENTICATED } from "../types";
import axios from "axios";

export const loginUser = (userData, history) => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/login", userData)
    .then(res => {

      setAuthorizationHeader(res.data.token)
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });

      //redirect to home page
      history.push("/");
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

//sets authenticated to false, clears credentials 
export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('FBIdToken');
  delete axios.defaults.headers.common['Authorization'];
  dispatch({ type: SET_UNAUTHENTICATED })
}

export const signupUser = (newUserData, history) => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/signup", newUserData)
    .then(res => {
      setAuthorizationHeader(res.data.token)
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });

      //redirect to home page
      history.push("/");
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};


export const getUserData = () => (dispatch) => {

    axios
      .get('/user')
      .then((res) => {
        dispatch({
          type: SET_USER,
          payload: res.data
        });
      })
      .catch((err) => console.log(err));
  };

  const setAuthorizationHeader = (token) => {
    const FBIdToken = `Bearer ${token}`;
    //storing auth token locally so if they refresh/close its still accessible
    localStorage.setItem("FBIdToken", FBIdToken);

    //each time we send request - header will have authorization value of FBIdToken
    axios.defaults.headers.common["Authorization"] = FBIdToken;
  }