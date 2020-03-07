import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
//Time formatting
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import PropTypes from "prop-types";
import MyButton from "../../util/MyButton";
import DeleteThought from "./DeleteThought";
import ThoughtDialog from "./ThoughtDialog";
import LikeButton from "./LikeButton";

//mui stuff
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import ChatIcon from "@material-ui/icons/Chat";

//redux
import { connect } from "react-redux";

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
          <LikeButton thoughtId={thoughtId} />
          <span>{likeCount} Likes</span>
          <MyButton tip="comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>{commentCount} comments</span>
          <ThoughtDialog thoughtId={thoughtId} userHandle={userHandle} openDialog = {this.props.openDialog}/>
        </CardContent>
      </Card>
    );
  }
}

Thought.propTypes = {
  user: PropTypes.object.isRequired,
  thought: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  openDialog: PropTypes.bool
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Thought));
