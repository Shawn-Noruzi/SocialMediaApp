import React, { Component } from "react";
import MyButton from "../util/MyButton";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
//icons

import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

//redux
import { connect } from "react-redux";
import { likeThought, unlikeThought } from "../redux/actions/dataActions";

export class LikeButton extends Component {
  likedThought = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(
        like => like.thoughtId === this.props.thoughtId
      )
    )
      return true;
    else return false;
  };
  likeThought = () => {
    this.props.likeThought(this.props.thoughtId);
  };
  unlikeThought = () => {
    this.props.unlikeThought(this.props.thoughtId);
  };
  render() {
    const { authenticated } = this.props.user;
    const likeButton = !authenticated ? (
      <Link to="/login">
        <MyButton tip="Like">
          <FavoriteBorder color="primary" />
        </MyButton>
      </Link>
    ) : this.likedThought() ? (
      <MyButton tip="Undo Like" onClick={this.unlikeThought}>
        <FavoriteIcon color="primary" />
      </MyButton>
    ) : (
      <MyButton tip="Like" onClick={this.likeThought}>
        <FavoriteBorder color="primary" />
      </MyButton>
    );
    return likeButton;
  }
}

LikeButton.propTypes = {
  user: PropTypes.object.isRequired,
  thoughtId: PropTypes.string.isRequired,
  likeThought: PropTypes.func.isRequired,
  unlikeThought: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapActionsToProps = {
  likeThought,
  unlikeThought
};

export default connect(mapStateToProps, mapActionsToProps)(LikeButton);
