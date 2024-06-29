import moment from 'moment';
import PropTypes from 'prop-types';
import React, {
  createContext, useContext, useEffect, useState,
} from 'react';

import notifTypes from '../config/notificationTypes';

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [hasUnreadNotif, setHasUnreadNotif] = useState(false);

  useEffect(() => {
    setHasUnreadNotif(false);
    for (let i = 0; i < notifications.length; i++) {
      if (notifications[i].read !== true) {
        setHasUnreadNotif(true);
        break;
      }
    }
  }, [notifications]);

  const addNotification = (notif, type) => {
    let formattedNotif;

    switch (type) {
    case notifTypes.MESSAGE_REQUEST:
      formattedNotif = {
        type,
        title: 'New Message Request',
        message: `${notif.name} would like to send you a message.`, // capitalize each word in name
        timestamp: moment(notif.lastModified).toString(),
        read: false,
      };
      break;
    default:
    }

    setNotifications((prev) => [...prev, formattedNotif]);
  };

  const deleteNotification = (index) => {
    setNotifications(notifications.splice(index, 1));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
        hasUnreadNotif,
        addNotification,
        deleteNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node,
};
