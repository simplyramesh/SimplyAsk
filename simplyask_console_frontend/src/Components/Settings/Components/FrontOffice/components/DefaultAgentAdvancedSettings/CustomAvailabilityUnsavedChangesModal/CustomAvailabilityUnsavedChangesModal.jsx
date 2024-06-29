import PropTypes from 'prop-types';
import WarningModal from '../../../../../../WorkflowEditor/components/WarningModals/WarningModal';


const CustomAvailabilityUnsavedChangesModal = ({
  isPortalOpen, onDiscard, onStay, hasBgColor, onClose, yellowWarningIcon
}) => {

  return <WarningModal
    isPortalOpen={isPortalOpen}
    clickHandlers={{
      onOutlineBtn: onDiscard,
      onFilledBtn: onStay,
      onClose: onClose,
    }}
    text={{
      title: 'You Have Unsaved Changes',
      message: 'Do you want to save the changes you have made?',
      outlineBtnText: 'Discard Changes',
      filledBtnText: 'Save Changes',
    }}
    hasBgColor={hasBgColor}
    yellowWarningIcon={yellowWarningIcon}
  />;
};

export default CustomAvailabilityUnsavedChangesModal;

CustomAvailabilityUnsavedChangesModal.propTypes = {
  isPortalOpen: PropTypes.bool,
  onDiscard: PropTypes.func,
  onStay: PropTypes.func,
  hasBgColor: PropTypes.bool,
};
