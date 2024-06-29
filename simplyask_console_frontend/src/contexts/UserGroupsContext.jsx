import PropTypes from 'prop-types';
import React, { createContext, useEffect, useState } from 'react';

import { getGroupsById } from '../Services/axios/agentGroupAxios';

const UserGroupContext = createContext();

const _getFormattedGroups = async (groupId) => {
  try {
    const response = await getGroupsById(groupId);
    if (response) {
      return response.data;
    }
  } catch (err) {
    return [];
  }
};

export const UserProvider = ({ children }) => {
  const [userGroups, setUserState] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApi = async () => {
      const res = await _getFormattedGroups();

      if (res) {
        setUserState(res);
        setLoading(false);
      }
    };
    fetchApi();
  }, []);

  return <UserGroupContext.Provider value={{ userGroups, loading }}>{children}</UserGroupContext.Provider>;
};

UserProvider.propTypes = {
  children: PropTypes.node,
};
