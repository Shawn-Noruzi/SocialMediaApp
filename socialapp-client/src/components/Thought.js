import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
//Time formatting
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from "prop-types";
import MyButton from "../util/MyButton";
import DeleteThought from "./DeleteThought";

//mui stuff
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
//icons
import ChatIcon from "@material-ui/icons/Chat";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

//redux
import { connect } from "react-redux";
import { likeThought, unlikeThought } from "../redux/actions/dataActions";

const styles = {
  card: {
    position: "relative",
    display: "flex",
    marginBottom: 20
  },
  image: {
    minWidth: 200
  },
  content: {
    padding: 25,
    objectFit: "cover"
  }
};

class Thought extends Component {
  likedThought = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(
        like => like.thoughtId === this.props.thought.thoughtId
      )
    )
      return true;
    else return false;
  };
  likeThought = () => {
    this.props.likeThought(this.props.thought.thoughtId);
  };
  unlikeThought = () => {
    this.props.unlikeThought(this.props.thought.thoughtId);
  };
  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      thought: {
        body,
        createdAt,
        userImage,
        userHandle,
        thoughtId,
        likeCount,
        commentCount
      },
      user: {
        authenticated,
        credentials: { handle }
      }
    } = this.props;
    const likeButton = !authenticated ? (
      <MyButton tip="Like">
        <Link to="/login">
          <FavoriteBorder color="primary" />
        </Link>
      </MyButton>
    ) : this.likedThought() ? (
      <MyButton tip="Undo Like" onClick={this.unlikeThought}>
        <FavoriteIcon color="primary" />
      </MyButton>
    ) : (
      <MyButton tip="Like" onClick={this.likeThought}>
        <FavoriteBorder color="primary" />
      </MyButton>
    );

    const deleteButton =
      authenticated && userHandle === handle ? (
        <DeleteThought thoughtId={thoughtId} />
      ) : null;
    return (
      <Card className={classes.card}>
        <CardMedia
          image={userImage}
          title="Profile Image"
          className={classes.image}
        />
        <CardContent className={classes.content}>
          <Typography
            variant="h5"
            component={Link}
            color="primary"
            to={`/users/${userHandle}`}
          >
            {userHandle}
          </Typography>
          {deleteButton}
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography variant="body1">{body}</Typography>
          {likeButton}
          <span>{likeCount} Likes</span>
          <MyButton tip="comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>{commentCount} comments</span>
        </CardContent>
      </Card>
    );
  }
}

Thought.propTypes = {
  likeThought: PropTypes.func.isRequired,
  unlikeThought: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  thought: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapActionsToProps = {
  likeThought,
  unlikeThought
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Thought));
