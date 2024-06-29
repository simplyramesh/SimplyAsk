import { Close, Remove } from '@mui/icons-material';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { toast } from 'react-toastify';
import { Card } from 'simplexiar_react_components';

import ChatIcon from '../../Assets/icons/chat.svg?component';
import { useNotification } from '../../contexts/NotificationContext';
import classes from './NotificationsModalView.module.css';

const NotificationsModalView = ({ closeModal }) => {
  const { notifications, setNotifications, deleteNotification, clearNotifications } = useNotification();

  return (
    <div className={classes.root}>
      <Card className={classes.topMenu}>
        <div className={classes.titleContainer}>
          <Close className={classes.closeIcon} onClick={closeModal} />
          <p>Notifications</p>
          <p
            className={classes.clearButton}
            onClick={() => {
              clearNotifications();
              toast.success('Cleared all notifications');
            }}
          >
            Clear All
          </p>
        </div>
      </Card>
      <Scrollbars className={classes.notificationsScrollbar} autoHide>
        <div className={classes.notificationsContainer}>
          {notifications.map((notification, index) => (
            <div
              className={classes.notificationContainer}
              key={index}
              onClick={() => {
                const index = notifications.indexOf(notification);
                const newNotifications = notifications.slice();
                newNotifications[index] = { ...notification, read: true };
                setNotifications(newNotifications);
              }}
            >
              {notification.read === true ? (
                <div className={`${classes.unread} ${classes.read}`} />
              ) : (
                <div className={classes.unread} />
              )}
              <div className={classes.icon}>
                <ChatIcon
                  style={{
                    marginLeft: '2px',
                  }}
                />
              </div>
              <div className={classes.content}>
                <p>{notification.title}</p>
                <p>{notification.message}</p>
              </div>
              <div className={classes.right}>
                <Remove
                  className={classes.closeNotifIcon}
                  onClick={() => {
                    const index = notifications.indexOf(notification);
                    deleteNotification(index);
                  }}
                />
                <p className={classes.timestamp}>
                  {(() => {
                    let timestamp = moment(moment().diff(moment(notification.timestamp)));
                    const timeDiff = moment.duration(moment().diff(moment(notification.timestamp))).asSeconds();

                    if (timeDiff >= 31536000) {
                      timestamp = timestamp.format('y[y]');
                    } else if (timeDiff >= 2628000) {
                      timestamp = timestamp.format('M[M]');
                    } else if (timeDiff >= 604800) {
                      timestamp = timestamp.format('w[w]');
                    } else if (timeDiff >= 86400) {
                      timestamp = timestamp.format('d[d]');
                    } else if (timeDiff >= 3600) {
                      timestamp = timestamp.format('h[h]');
                    } else if (timeDiff >= 60) {
                      timestamp = timestamp.format('m[m]');
                    } else {
                      timestamp = 'now';
                    }

                    return timestamp;
                  })()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Scrollbars>
    </div>
  );
};

export default NotificationsModalView;

NotificationsModalView.propTypes = {
  closeModal: PropTypes.func,
};
