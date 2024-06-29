import ConfirmationModal from '../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import ConfirmModalTextContent from './ConfirmModalTextContent';

const ConfirmCancelExecutionsModal = ({
  isOpen,
  onClose,
  onConfirm,
  executions,
  isBulkCancel,
  inProgressCount,
  completed,
  isLoading,
}) => {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onCloseModal={onClose}
      onSuccessClick={onConfirm}
      title="Are You Sure?"
      alertType="WARNING"
      isLoading={isLoading}
    >
      <ConfirmModalTextContent
        executions={executions}
        isBulkCancel={isBulkCancel}
        inProgressCount={inProgressCount}
        completed={completed}
      />
    </ConfirmationModal>
  );
};

export default ConfirmCancelExecutionsModal;
