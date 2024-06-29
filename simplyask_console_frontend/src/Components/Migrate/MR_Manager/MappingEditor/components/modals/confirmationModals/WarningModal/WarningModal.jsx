import React from 'react';
import { Portal } from 'react-portal';
import MappingEditorIcons from '../../../icons/MappingEditorIcons';
import css from './WarningModal.module.css';

const DeleteConfirmModal = ({
  isPortalOpen, onClose, children, message,
}) => {
  return (
    <Portal node={document?.getElementById('root')}>
      {isPortalOpen && (
        <div className={css.portal_wrapper}>
          <div className={css.delete_confirm}>
            <div className={css.left}>
              <span className={css.warningIcon}><MappingEditorIcons icon="WARNING" /></span>
              <h2 className={css.title}>Are You Sure?</h2>
              <p className={css.text}>
                {message}
              </p>
              <div className={css.btns}>
                {children}
              </div>
            </div>
            <div className={css.action}>
              <span id="closeModal" name="closeModal" className={css.close_icon} onClick={onClose}><MappingEditorIcons icon="CLOSE" /></span>
            </div>
          </div>
        </div>
      )}
    </Portal>
  );
};

export default DeleteConfirmModal;

DeleteConfirmModal.propTypes = {
  isPortalOpen: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node,
  message: PropTypes.string,
};
