import React from 'react';

import ConfirmationModal from '../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';

const BulkDeleteModal = ({
  open, onClose, onDelete, selectedTickets, tableType,
}) => (
  <ConfirmationModal
    isOpen={open}
    onCloseModal={onClose}
    actionConfirmationText={`delete ${tableType}`}
    alertType="DANGER"
    title={`Delete ${selectedTickets?.length} ${tableType}?`}
    modalIcon="BIN"
    modalIconSize={76}
    successBtnDanger
    onSuccessClick={onDelete}
  >
    <StyledFlex gap="17px 0">
      <StyledText display="inline" size={16} lh={16} weight={600}>
        <StyledText as="div" size={14} lh={19} textAlign="center">
          {`All data related to these ${tableType} will be`}
          {' '}
          <b>lost</b>
          {' '}
          and is
          {' '}
          <b>not recoverable</b>
          . Are you sure?
        </StyledText>
      </StyledText>
    </StyledFlex>
  </ConfirmationModal>
);

export default BulkDeleteModal;
