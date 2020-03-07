import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
//Time formatting
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import PropTypes from "prop-types";

//mui
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";

//Icons
import NotificationsIcon from "@material-ui/icons/Notifications";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ChatIcon from "@material-ui/icons/Chat";

//redux
import { connect } from "react-redux";
import { markNotificationsRead } from "../../redux/actions/userActions";

class Notifications extends Component {
  state = {
    anchorEl: null
  };
  handleOpen = event => {
    this.setState({
      anchorEl: event.target
    });
  };
  handleClose = () => {
    this.setState({
      anchorEl: null
    });
  };

  onMenuOpened = () => {
    //return array of notifications that havent been read
    let unreadNotificationsIds = this.props.notifications
      .filter(note => !note.read)
      .map(note => note.notificationId);
    this.props.markNotificationsRead(unreadNotificationsIds);
  };

  render() {
    const notifications = this.props.notifications;
    const anchorEl = this.state.anchorEl;

    dayjs.extend(relativeTime);

    let notificationIcon;
    if (notifications && notifications.length > 0) {
      //returns notifications that arent read
      //# of notes that are unread > 0?
      notifications.filter(note => note.read === false).length > 0
        ? (notificationIcon = (
            <Badge
              badgeContent={
                notifications.filter(note => note.read === false).length
              }
              color="secondary"
            >
              <NotificationsIcon />
            </Badge>
          ))
        : (notificationIcon = <NotificationsIcon />);
    } else {
      notificationIcon = <NotificationsIcon />;
    }
    let notificationsMarkup =
      notifications && notifications.length > 0 ? (
        notifications.map(note => {
          const verb = note.type === "like" ? "liked" : "commented on";
          const time = dayjs(note.createdAt).fromNow();
          const iconColor = note.read ? "primary" : "secondary";
          const icon =
            note.type === "like" ? (
              <FavoriteIcon color={iconColor} style={{ marginRight: 10 }} />
            ) : (
              <ChatIcon color={iconColor} style={{ marginRight: 10 }} />
            );

          return (
            <MenuItem key={note.createdAt} onClick={this.handleClose}>
              {icon}
              <Typography
                component={Link}
                color="default"
                variant="body1"
                to={`/users/${note.recipient}/thought/${note.thoughtId}`}
              >
                {note.sender} {verb} your thought {time}
              </Typography>
            </MenuItem>
          );
        })
      ) : (
        <MenuItem onClick={this.handleClose}>
          You have no notifications yet.
        </MenuItem>
      );

    return (
      <Fragment>
        <Tooltip placement="top" title="Notifications">
          <IconButton
            aria-owns={anchorEl ? "simple-menu" : undefined}
            aria-haspopup="true"
            onClick={this.handleOpen}
          >
            {notificationIcon}
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          onEntered={this.onMenuOpened}
        >
          {notificationsMarkup}
        </Menu>
      </Fragment>
    );
  }
}

Notifications.propTypes = {
  markNotificationsRead: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  notifications: state.user.notifications
});

export default connect(mapStateToProps, { markNotificationsRead })(
  Notifications
);
