import React from 'react';
import ConfirmationModal from '../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';

const EnvironmentDeleteModal = ({
  open, onClose, onDelete, name
}) => {
  return (
    <ConfirmationModal
      isOpen={open}
      onCloseModal={onClose}
      alertType="DANGER"
      title="Are You Sure?"
      modalIconSize={70}
      successBtnText="Delete"
      onSuccessClick={onDelete}
    >
      <StyledFlex>
        <StyledText as="div" size={14} lh={19} textAlign="center">
          You are about to delete {name}.
          This will permanently remove it, and it cannot be restored
        </StyledText>
      </StyledFlex>
    </ConfirmationModal>
  )};

export default EnvironmentDeleteModal;
