import classnames from 'classnames';
import PropTypes from 'prop-types';
import { useState } from 'react';

import CloseIcon from '../../../../../../Assets/Icons/closeIcon.svg?component';
import ReactPortal from '../../../../ReactPortal/ReactPortal';
import { Heading } from '../../../../sub';
import css from './ExpandedEditor.module.css';

const ExpandedEditor = ({ isPortalOpen, onClose, onChange, name, value, placeholder, error }) => {
  const [expandedValues, setExpandedValues] = useState(value);

  const handleExpandedChange = (e) => {
    setExpandedValues(e.target.value);
  };

  const handleExpanded = (e) => {
    if (e.target.id === 'expandedEditorClose') {
      onClose();
    }

    if (e.target.id === 'expandedEditorConfirm') {
      if (typeof onChange === 'function') onChange(e);
      onClose();
    }
  };

  return (
    <ReactPortal wrapperId="root">
      {isPortalOpen && (
        <div className={css.portal_wrapper}>
          <div className={css.modal}>
            <header className={css.header}>
              <Heading size="large">Expanded Editor</Heading>
              <span id="expandedEditorClose" className={css.close_icon} onClick={handleExpanded}>
                <CloseIcon />
              </span>
            </header>
            <div className={css.content}>
              <textarea
                type="text"
                name={name}
                value={expandedValues || ''}
                placeholder={placeholder}
                onChange={handleExpandedChange}
                className={classnames({ [css.textarea]: true, [css.error]: !!error })}
              />
              {/* {error && <div className={css.error_message}>{error}</div>} */}
              <div className={css.footer}>
                <button
                  type="button"
                  id="expandedEditorConfirm"
                  name="expandedEditorConfirm"
                  value={expandedValues}
                  className={css.button}
                  onClick={handleExpanded}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ReactPortal>
  );
};

export default ExpandedEditor;

ExpandedEditor.propTypes = {
  isPortalOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
  name: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.shape({
    type: PropTypes.string,
    message: PropTypes.string,
  }),
  // onConfirmClick: PropTypes.func,
};
