import React from 'react';

import css from '../diagram.module.css';

const GroupEnd = ({ name }) => {
  return <main className={css.EndOfLoop}>{name}</main>;
};

export default GroupEnd;
