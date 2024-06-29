import React from 'react';

import ConfirmationModal from '../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';

const ParametersDeleteModal = ({
  open, onClose, onDelete, parameterSet,
}) => (
  <ConfirmationModal
    isOpen={open}
    onCloseModal={onClose}
    actionConfirmationText={`delete ${parameterSet?.name}`}
    alertType="DANGER"
    title="Are You Sure?"
    modalIcon="BIN"
    modalIconSize={76}
    successBtnDanger
    onSuccessClick={onDelete}
  >
    <StyledFlex gap="17px 0">
      <StyledText display="inline" size={16} lh={16} weight={600} textAlign="center">
        <StyledText as="div" size={14} lh={19} textAlign="center" mb={8}>
          {`You are about to delete ${parameterSet?.name}. Completing this action will`}
          {' '}
          <b>permanently delete</b>
          {' '}
          the Parameter Set and its configurations
        </StyledText>
        <StyledText display="inline" size={14} lh={19} textAlign="center">
          <StyledText size={14} weight={600} display="inline" as="span" color="red" textAlign="center">Warning:</StyledText>
          {' '}
          This Parameter Set will be removed from any Process it is currently assigned to.
          This may break the Process and cause disruptions.
        </StyledText>
      </StyledText>
    </StyledFlex>
  </ConfirmationModal>
);

export default ParametersDeleteModal;
