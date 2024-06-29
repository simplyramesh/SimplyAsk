import classnames from 'classnames';
import PropTypes from 'prop-types';

import forbidden from '../../Assets/images/forbidden.png';
import LockedAccount from './LockedAccount/LockedAccount';
import classes from './ProtectedRoutes.module.css';

const ProtectedRoutes = ({
  component: Component,
  alternativeComponent: AlternativeComponent,
  visible,
  readOnly,
  isAccountDisabled,
  isAccountDisabledText,
  isManagerRouteActivated = false,
  ...otherProps
}) => {
  const isVisible = !isAccountDisabled && visible;
  const isAlt = !isAccountDisabled && !isVisible && !!AlternativeComponent;
  const isBlockedWithNoAlt = !isAccountDisabled && !isVisible && !AlternativeComponent;

  return (
    <>
      {isAccountDisabled && <LockedAccount isAccountDisabledText={isAccountDisabledText} />}
      {isAlt && <AlternativeComponent readOnly={readOnly} {...otherProps} />}
      {isBlockedWithNoAlt && (
        <img
          alt="Not Authorized"
          src={forbidden}
          className={classes.notAuthorized}
          ref={ref}
        />
      )}
      {isVisible && (
        <div className={classnames({
          [classes.parentRoot]: true,
          [classes.isManagerRouteActivated]: isManagerRouteActivated,
        })}

        >
          <div
            className={classnames({
              [classes.readOnly]: readOnly,
              [classes.root]: !readOnly,
              [classes.isManagerRouteActivatedRoot]: isManagerRouteActivated,
            })}

          >
            <Component readOnly={readOnly} {...otherProps} />
          </div>
        </div>
      )}
    </>
  );
};

export default ProtectedRoutes;

ProtectedRoutes.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  alternativeComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  visible: PropTypes.bool,
  readOnly: PropTypes.bool,
  isAccountDisabled: PropTypes.bool,
  isAccountDisabledText: PropTypes.string,
  isManagerRouteActivated: PropTypes.bool,
};
