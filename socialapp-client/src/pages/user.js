import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Thought from '../components/thought/Thought';
import StaticProfile from '../components/profile/StaticProfile';
import Grid from '@material-ui/core/Grid';

import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';

class user extends Component {
  state = {
    profile: null
  };
  componentDidMount() {
    const handle = this.props.match.params.handle;
    this.props.getUserData(handle);
    axios
      .get(`/user/${handle}`)
      .then((res) => {
        this.setState({
          profile: res.data.user
        })
      })
      .catch((err) => console.log(err));
  }
  render() {
    const { thoughts, loading } = this.props.data;

    const screamsMarkup = loading ? (
      <p>Loading data...</p>
    ) : thoughts === null ? (
      <p>No Thoughts from this user</p>
    ) : (
      thoughts.map((thought) => <Thought key={thought.thoughtId} thought={thought} />)
    );

    return (
      <Grid container spacing={16}>
        <Grid item sm={8} xs={12}>
          {screamsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          {this.state.profile === null ? (
            <p>Loading profile...</p>
          ) : (
            <StaticProfile profile={this.state.profile} />
          )}
        </Grid>
      </Grid>
    );
  }
}

user.propTypes = {
  getUserData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  data: state.data
});

export default connect(
  mapStateToProps,
  { getUserData }
)(user);