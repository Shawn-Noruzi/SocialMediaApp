import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import axios from "axios";

import Thought from "../components/Thought";
import Profile from "../components/Profile";

class home extends Component {
  state = {
    thoughts: null
  };

  //fetch data from backend for thoughts
  componentDidMount() {
    axios
      .get("/showerThoughts")
      .then(res => {
        this.setState({
          thoughts: res.data
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    //if the thought data has been loaded show them -> else show loading
    let recentThoughtsMarkup = this.state.thoughts ? (
      this.state.thoughts.map(thought => (
        <Thought key={thought.thoughtId} thought={thought} />
      ))
    ) : (
      <p>Loading...</p>
    );

    return (
      <Grid container spacing={8}>
        <Grid item sm={8} xs={12}>
          {recentThoughtsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile/>
        </Grid>
      </Grid>
    );
  }
}

export default home;
