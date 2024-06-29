import classNames from 'classnames';
import PropTypes from 'prop-types';

import CloseIcon from '../../Assets/Icons/closeIcon.svg?component';
import WarnCircleIcon from '../../Assets/Icons/errorCircle.svg?component';
import ReactPortal from '../sideMenu/ReactPortal/ReactPortal';
import css from './WarningModal.module.css';

const WarningModal = ({ isPortalOpen, clickHandlers, text, hasBgColor = true, yellowWarningIcon = false }) => {
  const { onOutlineBtn, onFilledBtn, onClose } = clickHandlers;
  const { title, message, outlineBtnText, filledBtnText } = text;

  return (
    <ReactPortal wrapperId="root">
      {isPortalOpen && (
        <div className={classNames({ [css.backdrop]: true, [css.bgColor]: hasBgColor })}>
          <div className={css.modal}>
            <div className={css.left}>
              <span
                className={classNames({
                  [css.yellowWarningIcon]: yellowWarningIcon,
                  [css.warningIcon]: !yellowWarningIcon,
                })}
              >
                <WarnCircleIcon />
              </span>
              <div className={css.text}>
                <h2 className={css.title}>{title}</h2>
                <p className={css.message}>{message}</p>
              </div>
              <div className={css.btns}>
                <button id="outlineBtn" name="outlineBtn" onClick={onOutlineBtn} className={css.outlineBtn}>
                  {outlineBtnText}
                </button>
                <button id="filledBtn" name="filledBtn" onClick={onFilledBtn} className={css.filledBtn}>
                  {filledBtnText}
                </button>
              </div>
            </div>
            <div className={css.action}>
              <span id="closeModal" name="closeModal" className={css.close_icon} onClick={onClose}>
                <CloseIcon />
              </span>
            </div>
          </div>
        </div>
      )}
    </ReactPortal>
  );
};

export default WarningModal;

WarningModal.propTypes = {
  isPortalOpen: PropTypes.bool,
  clickHandlers: PropTypes.shape({
    onOutlineBtn: PropTypes.func,
    onFilledBtn: PropTypes.func,
    onClose: PropTypes.func,
  }),
  text: PropTypes.shape({
    title: PropTypes.string,
    message: PropTypes.string,
    outlineBtnText: PropTypes.string,
    filledBtnText: PropTypes.string,
  }),
  hasBgColor: PropTypes.bool,
};
