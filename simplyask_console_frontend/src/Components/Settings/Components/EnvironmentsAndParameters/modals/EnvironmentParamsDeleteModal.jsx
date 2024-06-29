import React from 'react';
import ConfirmationModal from '../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StyledText } from '../../../../shared/styles/styled';

const EnvironmentParamsDeleteModal = ({
  open, onClose, onDelete, name
}) => {
  return (
    <ConfirmationModal
      isOpen={open}
      onCloseModal={onClose}
      alertType="WARNING"
      title="Are You Sure?"
      modalIconSize={70}
      successBtnText="Confirm"
      onSuccessClick={onDelete}
    >
      <StyledText as="div" size={14} lh={19} textAlign="center">
        You are about to delete
        <StyledText size={14} lh={19} weight={600} display="inline-block">&nbsp;{name}&nbsp;</StyledText>
        from the table
      </StyledText>
    </ConfirmationModal>
  )};

export default EnvironmentParamsDeleteModal;
