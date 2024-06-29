import React from 'react';

import { capitalizeFirstLetterOfRegion } from '../../../../utils/helperFunctions';
import ConfirmationModal from '../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StyledFlex, StyledText } from '../../../shared/styles/styled';
import { TEST_MANAGER_LABELS } from '../constants/constants';

export const getTypeLabel = (rows) => {
  if (rows.length === 1 && rows[0] !== null && rows[0] !== undefined) {
    const { type } = rows[0];
    return TEST_MANAGER_LABELS[type];
  }

  return `${rows.length} Records`;
};

export const getNameLabel = (rows) => {
  if (rows.length === 1 && rows[0] !== null && rows[0] !== undefined) {
    const { displayName, executionName } = rows[0];
    return displayName || executionName || 'a record';
  }

  return `${rows.length} Records`;
};

const TestDeleteModal = ({
  open, onClose, onDelete, rows = [], fromTestManagerDetailsView = false, typeParam,
}) => (
  <ConfirmationModal
    isOpen={open}
    onCloseModal={onClose}
    actionConfirmationText={`delete ${fromTestManagerDetailsView ? rows[0]?.displayName : getTypeLabel(rows).toLowerCase()}`}
    alertType="DANGER"
    title={`Delete ${fromTestManagerDetailsView ? `Test ${capitalizeFirstLetterOfRegion(typeParam)}` : getTypeLabel(rows)}?`}
    modalIcon="BIN"
    modalIconSize={76}
    successBtnDanger
    onSuccessClick={onDelete}
  >
    <StyledFlex>
      <StyledText as="div" size={14} lh={19} textAlign="center">
        {`You are about to delete ${fromTestManagerDetailsView ? rows[0]?.displayName : getNameLabel(rows)}. 
              Completing this action will result in the ${fromTestManagerDetailsView ? rows[0]?.displayName : getTypeLabel(rows).toLowerCase()} being`}
        <b>&nbsp;permanently deleted&nbsp;</b>
        and
        <b>&nbsp;not recoverable</b>
        .
      </StyledText>
    </StyledFlex>
  </ConfirmationModal>
);

export default TestDeleteModal;
