import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

//components
import Navbar from "./component/Navbar";

//pages
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#5ddef4",
      main: "#00acc1",
      dark: "#007c91",
      contrastText: "#fff"
    },
    secondary: {
      light: "#5ddef4",
      main: "#00acc1",
      dark: "#007c91",
      contrastText: "#fff"
    }
  },
  spreadThis: {
    form: {
      textAlign: "center"
    },
    loginImage: {
      margin: "20px auto 20px auto",
      maxWidth: 110
    },
    pageTitle: {
      margin: "10px auto 10px auto"
    },
    textField: {
      margin: "10px auto 10px auto"
    },
    button: {
      marginTop: 20,
      position: "relative"
    },
    customError: {
      color: "#fff",
      fontSize: "0.8rem",
      marginTop: 10
    },
    progress: {
      position: "absolute"
    }
  }
});

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <div className="App">
          <Router>
            <Navbar />
            <div className="container">
              <Switch>
                <Route exact path="/" component={home} />
                <Route path="/login" component={login} />
                <Route path="/signup" component={signup} />
              </Switch>
            </div>
          </Router>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
