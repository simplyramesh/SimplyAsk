import classnames from 'classnames';
import PropTypes from 'prop-types';

import css from './ColumnGroup.module.css';

const MAX_COLUMNS = 6;

const ColumnGroup = ({ children, ...rest }) => {
  return (
    <div
      className={classnames({
        [css.container]: true,
        [css.marginLeft]: true,
      })}
      {...rest}
    >
      { children }
    </div>
  );
};

ColumnGroup.SubHeader = ({
  children, isCollapsed, isLargeMargin, ...rest
}) => {
  return (
    <div
      className={classnames({
        [css.subHeader]: true,
        [css.subHeader_collapse]: isCollapsed,
        [css.marginLeft]: isLargeMargin,
      })}
      {...rest}
    >
      {children}
    </div>
  );
};

ColumnGroup.SubLeft = ({ children, isCollapsed, ...rest }) => {
  return (
    <div
      className={
        classnames({
          [css.subLeft]: true,
          [css.subLeft_collapsed]: isCollapsed,
        })
      }
      {...rest}
    >
      {children}

    </div>
  );
};

ColumnGroup.Left = ({ children, ...rest }) => {
  return (
    <div className={css.left} {...rest}>{children}</div>
  );
};

ColumnGroup.SubRight = ({ children, isCollapsed, ...rest }) => {
  return (
    <div
      className={
        classnames({
          [css.subRight]: true,
          [css.subRight_collapsed]: isCollapsed,
        })
      }
      {...rest}
    >
      {children}

    </div>
  );
};

ColumnGroup.Right = ({ children, ...rest }) => {
  return (
    <div className={css.right} {...rest}>{children}</div>
  );
};

ColumnGroup.Title = ({ children, ...rest }) => {
  return (
    <h2 className={css.group_title} {...rest}>{children}</h2>
  );
};

ColumnGroup.SubGroupTitle = ({ children, ...rest }) => {
  return (
    <p className={css.sub_groupTitle} {...rest}>{children}</p>
  );
};

ColumnGroup.Ratio = ({ subColumnsLength, headerName, ...rest }) => {
  return (
    <p className={css.ratio} {...rest}>
      <span className={css.column_ratio}>{`${subColumnsLength}/${MAX_COLUMNS}`}</span>
      <span className={css.column_name}>{`${headerName} Columns in use`}</span>
    </p>
  );
};

ColumnGroup.SysObjField = ({
  isValid = false, systemName, objectName, fieldName, isCollapsed,
}) => {
  const validText = !isCollapsed
    ? `${systemName} → ${objectName || ''} → ${fieldName || ''}`
    : `${`${systemName} → ${objectName || ''} → ${fieldName || ''}`.slice(0, 3)}...`;

  const invalidText = !isCollapsed ? 'Not Selected Yet' : `${'Not Selected Yet'.slice(0, 6)}...`;

  return (
    <>
      <p className={classnames({
        [css.sysObjField]: true,
        [css.sysObjField_collapsed]: isCollapsed,
      })}
      >
        {isValid ? validText : <span className={css.not_selected}>{invalidText}</span>}
      </p>
    </>
  );
};

ColumnGroup.EditDeleteIcon = ({ children, ...rest }) => {
  return (
    <div className={css.icon} {...rest}>{children}</div>
  );
};

ColumnGroup.Divider = () => {
  return (
    <div className={css.divider}>
      <span className={css.divider_span} />
    </div>
  );
};

export default ColumnGroup;

ColumnGroup.propTypes = {
  children: PropTypes.node,
};
ColumnGroup.SubHeader.propTypes = ColumnGroup.propTypes;
ColumnGroup.Left.propTypes = ColumnGroup.propTypes;
ColumnGroup.SubLeft.propTypes = ColumnGroup.propTypes;
ColumnGroup.Right.propTypes = ColumnGroup.propTypes;
ColumnGroup.SubRight.propTypes = ColumnGroup.propTypes;
ColumnGroup.Title.propTypes = ColumnGroup.propTypes;
ColumnGroup.SubGroupTitle.propTypes = ColumnGroup.propTypes;
ColumnGroup.EditDeleteIcon.propTypes = ColumnGroup.propTypes;
ColumnGroup.Ratio.propTypes = {
  subColumnsLength: PropTypes.number,
  headerName: PropTypes.string,
};
ColumnGroup.SysObjField.propTypes = {
  isValid: PropTypes.bool,
  isCollapsed: PropTypes.bool,
  systemName: PropTypes.string,
  objectName: PropTypes.string,
  fieldName: PropTypes.string,
};
