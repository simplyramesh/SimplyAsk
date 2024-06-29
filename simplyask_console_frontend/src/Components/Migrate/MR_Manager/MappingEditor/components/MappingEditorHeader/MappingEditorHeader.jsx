/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';

import css from './MappingEditorHeader.module.css';

const MappingEditorHeader = ({ children, ...rest }) => {
  return (
    <header className={css.header} {...rest}>{children}</header>
  );
};

MappingEditorHeader.Left = ({ children, ...rest }) => {
  return <div className={css.left} {...rest}>{children}</div>;
};

MappingEditorHeader.Right = ({ children, ...rest }) => {
  return <div className={css.right} {...rest}>{children}</div>;
};

export default MappingEditorHeader;

MappingEditorHeader.propTypes = {
  children: PropTypes.node,
};

MappingEditorHeader.Left.propTypes = MappingEditorHeader.propTypes;
MappingEditorHeader.Right.propTypes = MappingEditorHeader.propTypes;
