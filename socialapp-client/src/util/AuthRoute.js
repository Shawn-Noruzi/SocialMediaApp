import React from "react";
import { Route, Redirect } from "react-router-dom";


//redirect user to login if authentication passes - if they're authenticated token is not expired
//redirect them to home page 
const AuthRoute = ({ component: Component, authenticated, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      authenticated === true ? <Redirect to='/' /> : <Component {...props} />
    }
  />
);

export default AuthRoute;
