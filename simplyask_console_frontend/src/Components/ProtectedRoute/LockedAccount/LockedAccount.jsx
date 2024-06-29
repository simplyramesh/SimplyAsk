import PropTypes from 'prop-types';

import lockedAccount from '../../../Assets/images/lockedAccount.svg';
import { accountDisabledKeys } from '../../../config/routes';
import classes from '../ProtectedRoutes.module.css';

const LockedAccount = ({ isAccountDisabledText }) => {
  return (
    <div className={classes.parentRoot}>
      <div className={classes.fullScreen}>
        <div className={`${classes.card}`}>
          <div className={classes.lockedAccountImageParent}>
            <img src={lockedAccount} alt="lockedAccount" className={classes.lockedAccountImage} />
          </div>

          <div className={classes.lockedAccountFirstTextParent}>
            <div className={classes.lockedAccountFirstText}>Oh No!</div>
          </div>

          <div className={classes.lockedAccountSecondTextParent}>
            <div className={classes.lockedAccountSecondText}>
              {`Your account has been disabled due ${isAccountDisabledText ? accountDisabledKeys[isAccountDisabledText] : 'to unknown reasons'}`}
            </div>
          </div>

          <div className={classes.lockedAccountSecondTextParent}>
            <div className={classes.lockedAccountThirdText}>Please contact the Symphona team for more information</div>
          </div>

          <div className={classes.lockedAccountLastTextParent}>
            <div className={classes.lockedAccountFourthText}>info@symphona.ai</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockedAccount;

LockedAccount.propTypes = {
  isAccountDisabledText: PropTypes.string,
};
