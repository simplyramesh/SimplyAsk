import React from 'react';

import ConfirmationModal from '../../../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StyledFlex, StyledText } from '../../../../../../../shared/styles/styled';

const DeleteModalFormEntryTable = ({
  deleteExecutionDetailRowModalOpen,
  deleteExecutionDetailRowModalOnClose,
  onSuccessClickDeleteRow,
  isDeleteModalLoading,
  clickedDeleteTableRow,
}) => (
  <ConfirmationModal
    isOpen={!!deleteExecutionDetailRowModalOpen}
    onCloseModal={deleteExecutionDetailRowModalOnClose}
    alertType="WARNING"
    title="Are You Sure?"
    modalIconSize={70}
    successBtnText="Delete"
    onSuccessClick={onSuccessClickDeleteRow}
    isLoading={isDeleteModalLoading}
    titleTextAlign="center"
    thumbWidth="0px"
  >
    <StyledFlex gap="17px 0">
      <StyledText display="inline" size={16} lh={16} weight={600} textAlign="center">
        <StyledText as="span" display="inline" size={14} lh={19}>
          You are about to delete row
          {' '}
          <StyledText as="span" display="inline" weight={600} size={14} lh={19}>{clickedDeleteTableRow?.index + 1 || 0}</StyledText>
        </StyledText>
      </StyledText>
    </StyledFlex>
  </ConfirmationModal>
);

export default DeleteModalFormEntryTable;
