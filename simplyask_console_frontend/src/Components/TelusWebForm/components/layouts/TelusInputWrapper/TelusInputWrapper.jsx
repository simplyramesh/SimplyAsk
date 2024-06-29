import { Children } from 'react';

import css from './TelusInputWrapper.module.css';

const TelusInputWrapper = ({ children }) => {
  const childrenArr = Children.toArray(children);

  const cssStyles = childrenArr.length > 1
    ? css.inputs_group_wrapper
    : css.wrapper;

  return (
    <div className={cssStyles}>{children}</div>
  );
};

export default TelusInputWrapper;
