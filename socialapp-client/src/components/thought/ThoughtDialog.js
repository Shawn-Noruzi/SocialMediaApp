import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from "../../util/MyButton";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import LikeButton from "./LikeButton";
import Comments from "./Comments";
import CommentForm from "./CommentForm";
//mui stuff
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
//icons
import CloseIcon from "@material-ui/icons/Close";
import UnfoldMore from "@material-ui/icons/UnfoldMore";
import ChatIcon from "@material-ui/icons/Chat";
//redux
import { connect } from "react-redux";
import { getThought, clearErrors } from "../../redux/actions/dataActions";

const styles = theme => ({
  ...theme.spreadThis
});

class ThoughtDialog extends Component {
  state = {
    open: false,
    oldPath: null,
    newPath: null
  };

  componentDidMount() {
    if (this.props.openDialog) {
      this.handleOpen();
    }
  }

  handleOpen = () => {
    //twitter functionality when a thought dialog is open
    let oldPath = window.location.pathname;
    console.log("window.location.pathname", oldPath);
    const { userHandle, thoughtId } = this.props;
    const newPath = `/users/${userHandle}/thought/${thoughtId}`;

    //edge case -> if user starts on a thought url/user url -> the old url is = to startUrl so it wont work as intended. 
    if (oldPath === newPath) {
      oldPath = `/users/${userHandle}`;
    }

    window.history.pushState(null, null, newPath);

    this.setState({ open: true, oldPath, newPath });
    //when a user opens a thought -> the url changes to be newPath. pushState just changes URL
    this.props.getThought(this.props.thoughtId);

  
  };

  handleClose = () => {
    window.history.pushState(null,null, this.state.oldPath)
    this.setState({ open: false });
    this.props.clearErrors();
  };
  render() {
    const {
      classes,
      thought: {
        thoughtId,
        body,
        createdAt,
        likeCount,
        commentCount,
        userImage,
        userHandle,
        comments
      },
      UI: { loading }
    } = this.props;

    const dialogMarkup = loading ? (
      <div className={classes.spinnerDiv}>
        <CircularProgress size={200} thickness={2} />
      </div>
    ) : (
      <Grid container spacing={16}>
        <Grid item sm={5}>
          <img src={userImage} alt="Profile" className={classes.profileImage} />
        </Grid>
        <Grid item sm={7}>
          <Typography
            component={Link}
            color="primary"
            variant="h5"
            to={`/users/${userHandle}`}
          >
            @{userHandle}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          <Typography variant="body1">{body}</Typography>
          <LikeButton thoughtId={thoughtId} />
          <span>{likeCount} likes</span>
          <MyButton tip="comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>{commentCount} comments</span>
        </Grid>
        <hr className={classes.visibleSeparator} />
        <CommentForm thoughtId={thoughtId} />
        <Comments comments={comments} />
      </Grid>
    );

    return (
      <Fragment>
        <MyButton
          onClick={this.handleOpen}
          tip="Expand thought"
          tipClassName={classes.expandButton}
        >
          <UnfoldMore color="primary" />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <MyButton
            tip="Close"
            onClick={this.handleClose}
            tipClassName={classes.closeButtonRight}
          >
            <CloseIcon />
          </MyButton>
          <DialogContent className={classes.DialogContent}>
            {dialogMarkup}
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

ThoughtDialog.propTypes = {
  getThought: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  thoughtId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  thought: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  thought: state.data.thought,
  UI: state.UI
});

const mapActionsToProps = {
  getThought,
  clearErrors
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(ThoughtDialog));
