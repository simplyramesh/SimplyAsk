import ConfirmationModal from '../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StyledText } from '../../../../shared/styles/styled';

const DeleteOrchestrationModal = ({
  isOpen, onClose, isBulkDelete, orchestrationJobToDelete, onDelete,
}) => {
  const nameOrIds = isBulkDelete ? orchestrationJobToDelete?.length : orchestrationJobToDelete?.name;
  const bulkOrSingleText = isBulkDelete ? ' Orchestrations.' : '.';

  return (
    <ConfirmationModal
      isOpen={isOpen}
      alertType="DANGER"
      successBtnText="Confirm"
      modalIcon="BIN"
      title="Delete Orchestration?"
      actionConfirmationText="delete orchestration"
      onCloseModal={onClose}
      onSuccessClick={onDelete}
    >
      <StyledText as="p" size={14} lh={20}>
        {'You are about to delete '}
        <StyledText display="inline" size={14} lh={20} weight={700}>{nameOrIds}</StyledText>
        {`${bulkOrSingleText} Completing this action will result in the Orchestration being `}
        <StyledText display="inline" size={14} lh={20} weight={700}>permanently deleted</StyledText>
        {' and '}
        <StyledText display="inline" size={14} lh={20} weight={700}>not recoverable</StyledText>
      </StyledText>
    </ConfirmationModal>
  );
};

export default DeleteOrchestrationModal;
