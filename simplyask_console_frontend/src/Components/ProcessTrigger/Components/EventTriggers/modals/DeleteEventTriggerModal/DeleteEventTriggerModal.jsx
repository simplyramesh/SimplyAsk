import ConfirmationModal from '../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';

const DeleteEventTriggerModal = ({ isOpen, onClose, onDelete, eventTrigger }) => {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      successBtnText="Delete"
      alertType="WARNING"
      title={`Delete “${eventTrigger?.name}”?`}
      text="Are you sure you want to delete this Event Trigger? This action cannot be reversed."
      onCloseModal={onClose}
      onSuccessClick={onDelete}
    />
  );
};

export default DeleteEventTriggerModal;
