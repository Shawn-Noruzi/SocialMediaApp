import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import MyButton from "../util/MyButton";

//mui
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DeleteOutline from "@material-ui/icons/DeleteOutline";

import { connect } from "react-redux";
import { deleteThought } from "../redux/actions/dataActions";

const styles = {
    deleteButton: {
        position:"absolute",
        left: '90%',
        top: '10%'
    }
};

class DeleteThought extends Component {
  state = {
    open: false
  };
  handleOpen = () => {
    this.setState({
      open: true
    });
  };
  handleClose = () => {
    this.setState({
      open: false
    });
  };

  deleteThought = () => {
    this.props.deleteThought(this.props.thoughtId);
    this.setState({ open: false });
  };
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <MyButton
          tip="Delete Thought"
          onClick={this.handleOpen}
          btnClassName={classes.deleteButton}
        >
          <DeleteOutline color="secondary" />
        </MyButton>
        <Dialog open={this.state.open}
        onClose={this.handleClose}
        fullWidth
        maxWidth="sm">
            <DialogTitle>
                Are you sure you want to delete the Shower Thought?
            </DialogTitle>
            <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={this.deleteThought} color="secondary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

DeleteThought.propTypes = {
  deleteThought: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  thoughtId: PropTypes.string.isRequired
};

//dont need state here
export default connect(null, { deleteThought })(
  withStyles(styles)(DeleteThought)
);
