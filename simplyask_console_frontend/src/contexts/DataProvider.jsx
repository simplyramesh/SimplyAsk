import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import { promiseUserOptionsDefault } from '../Components/shared/REDISIGNED/selectMenus/UserAutocomplete/helpers';
import { defaultUsers } from '../store';

const DataProvider = ({ children }) => {
  const setUsers = useSetRecoilState(defaultUsers);

  useEffect(() => {
    promiseUserOptionsDefault().then((users) => setUsers(users));
  }, []);

  return (
    <>{children}</>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node,
};

export default DataProvider;
