import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';
import React, {
  createContext, useContext, useEffect, useState,
} from 'react';

import { setDefaultHeader } from '../Services/axios/AxiosInstance';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState();
  const [loading, setLoading] = useState(true);
  const [isAccountDisabled, setIsAccountDisabledState] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
    const checkAccountDisabled = localStorage.getItem('isAccountDisabled');

    if (checkAccountDisabled) {
      setIsAccountDisabledState(true);
    }
    setUser(token);
    setLoading(false);
  }, []);

  const setUser = (token) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, token);
      setDefaultHeader(token);
      setUserState(JSON.parse(jwtDecode(token).sub));
    } catch {
      // no user
    }
  };

  const updateUser = (data) => setUserState(data);
  const setIsAccountDisabled = (isDisabled = false) => {
    if (isDisabled) {
      localStorage.setItem('isAccountDisabled', true);
      setIsAccountDisabledState(true);
    } else {
      localStorage.removeItem('isAccountDisabled');
      setIsAccountDisabledState(false);
    }
  };

  return (
    <UserContext.Provider value={{
      user, updateUser, setUser, isAccountDisabled, setIsAccountDisabled, loading,
    }}
    >
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node,
};
