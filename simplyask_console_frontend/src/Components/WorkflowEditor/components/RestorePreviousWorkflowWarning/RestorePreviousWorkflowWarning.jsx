import PropTypes from 'prop-types';

import WarningModal from '../WarningModals/WarningModal';

const TITLE = 'Are You Sure?';
const OUTLINE_BUTTON_TEXT = 'Cancel';
const FILLED_BUTTON_TEXT = 'Restore Workflow';

const RestorePreviousWorkflowWarning = ({
  isPortalOpen, workflowName, onCancel, onReset,
}) => {
  const restoreWorkflowMessage = `You are about to restore the last published version of ${workflowName}. All changes you have made will be permanently lost.`;

  const MODAL_TEXT = {
    title: TITLE,
    message: restoreWorkflowMessage,
    outlineBtnText: OUTLINE_BUTTON_TEXT,
    filledBtnText: FILLED_BUTTON_TEXT,
  };

  const ON_CLICK = {
    onOutlineBtn: onCancel,
    onFilledBtn: onReset,
    onClose: onCancel,
  };

  return <WarningModal isPortalOpen={isPortalOpen} clickHandlers={ON_CLICK} text={MODAL_TEXT} />;
};

export default RestorePreviousWorkflowWarning;

RestorePreviousWorkflowWarning.propTypes = {
  isPortalOpen: PropTypes.bool,
  workflowName: PropTypes.string,
  onCancel: PropTypes.func,
  onReset: PropTypes.func,
};
