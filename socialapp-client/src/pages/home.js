import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";

import Thought from "../components/thought/Thought";
import Profile from "../components/profile/Profile";
import ThoughtSkeleton from "../util/ThoughtSkeleton"


import { connect } from "react-redux";
import { getThoughts } from "../redux/actions/dataActions";

class home extends Component {
  //fetch data from backend for thoughts
  componentDidMount() {
    this.props.getThoughts();
  }

  render() {
    const { thoughts, loading } = this.props.data;
    //if the thought data has been loaded show them -> else show loading
    let recentThoughtsMarkup = !loading ? (
      thoughts.map(thought => (
        <Thought key={thought.thoughtId} thought={thought} />
      ))
    ) : (
      <ThoughtSkeleton />
    );

    return (
      <Grid container spacing={8}>
        <Grid item sm={8} xs={12}>
          {recentThoughtsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    );
  }
}

home.propTypes = {
  getThoughts: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  data: state.data
});

export default connect(mapStateToProps, { getThoughts })(home);
