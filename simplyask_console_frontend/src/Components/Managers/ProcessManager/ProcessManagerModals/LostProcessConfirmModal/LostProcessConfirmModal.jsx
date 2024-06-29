import ConfirmationModal from '../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';

const LostProcessConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onCloseModal={onClose}
      onSuccessClick={onConfirm}
      alertType="WARNING"
      title="You Did Not Add Yourself to the Visibility"
      text="Are you sure you want to save these changes without adding yourself? Doing so will mean you won’t have access to the process."
    />
  );
};

export default LostProcessConfirmModal;
