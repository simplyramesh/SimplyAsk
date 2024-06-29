// import PropTypes from 'prop-types';
import { memo } from 'react';

import SearchIcon from '../../../../../Assets/Icons/searchIcon.svg?component';
import css from './SearchBar.module.css';

const SearchBar = ({ ...props }) => {
  return (
    <div className={css.container}>
      <input {...props} type="text" className={css.input} />
      <span className={css.icon}>
        <SearchIcon />
      </span>
    </div>
  );
};

export default memo(SearchBar);
