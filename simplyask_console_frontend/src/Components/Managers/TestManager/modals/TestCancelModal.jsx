import React from 'react';

import ConfirmationModal from '../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StyledFlex, StyledText } from '../../../shared/styles/styled';

import { getNameLabel, getTypeLabel } from './TestDeleteModal';

const TestCancelModal = ({
  open, onClose, onCancel, rows = [], fromTestCaseBody = false,
}) => {
  const getExecutionId = () => {
    if (rows.length === 1 && rows[0] !== null && rows[0] !== undefined) {
      const { id } = rows[0];
      return id;
    }

    return '-';
  };

  return (
    <ConfirmationModal
      isOpen={open}
      onCloseModal={onClose}
      alertType="WARNING"
      title="Are You Sure?"
      modalIconSize={76}
      onSuccessClick={() => onCancel(rows[0]?.executedOnEnvironment)}
    >
      <StyledFlex direction="column">
        <StyledText as="div" size={14} lh={19} textAlign="center" mb={10}>
          {`You are about to cancel ${fromTestCaseBody ? 'Test Case' : getTypeLabel(rows)} Execution. 
          This action cannot be undone. Are you sure you want to proceed?`}
        </StyledText>
        {rows.length === 1
        && (
          <>
            <StyledText size={14} textAlign="center" mb={10}>
              <b>&nbsp;Execution Name: &nbsp;</b>
              {fromTestCaseBody ? rows[0]?.displayName : getNameLabel(rows)}
            </StyledText>
            <StyledText size={14} textAlign="center">
              <b>&nbsp;Execution ID: &nbsp;</b>
              {fromTestCaseBody ? rows[0]?.testCaseExecutionId : getExecutionId()}
            </StyledText>
          </>
        ) }
      </StyledFlex>
    </ConfirmationModal>
  );
};

export default TestCancelModal;
