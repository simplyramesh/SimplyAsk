import ConfirmationModal from '../../modals/ConfirmationModal/ConfirmationModal';
import BlockNavigate from '../BlockNavigate';

const LeavePageBlockerModal = ({ navBlocker, isBlocked }) => {
  return (
    <BlockNavigate blocker={navBlocker} isBlocked={isBlocked}>
      {({ isDialogOpen, handleSuccessClick, handleCancelClick }) => (
        <ConfirmationModal
          isOpen={isDialogOpen}
          onCloseModal={handleSuccessClick}
          onSuccessClick={handleSuccessClick}
          onCancelClick={handleCancelClick}
          successBtnText="Stay On Page"
          cancelBtnText="Leave Page"
          alertType="WARNING"
          title="Are You Sure?"
          text="You have unsaved changes and are about to exit out of the page. If you leave, all your progress will be lost."
        />
      )}
    </BlockNavigate>
  );
};

export default LeavePageBlockerModal;
