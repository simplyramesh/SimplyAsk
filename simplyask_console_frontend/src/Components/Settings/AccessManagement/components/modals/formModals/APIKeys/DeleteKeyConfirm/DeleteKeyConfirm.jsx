import ConfirmationModal from '../../../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StyledText } from '../../../../../../../shared/styles/styled';

const DeleteKeyConfirmModal = ({ open, onClose, onSuccess }) => {
  return (
    <ConfirmationModal
      isOpen={open}
      onCloseModal={onClose}
      onSuccessClick={onSuccess}
      successBtnText="Confirm"
      alertType="DANGER"
      modalIcon="BIN"
      title="Delete API Key?"
      actionConfirmationText="delete API key"
    >
      <StyledText as="span" size={14} textAlign="center">
        Completing this actions will delete this API Key, meaning it will be&nbsp;
        <StyledText as="strong" display="inline-block" size={14} weight={600}>permanently lost</StyledText>
            &nbsp;and&nbsp;
        <StyledText as="strong" display="inline-block" size={14} weight={600}>not recoverable.</StyledText>
            &nbsp;Are you sure?
      </StyledText>
    </ConfirmationModal>
  );
};

export default DeleteKeyConfirmModal;
