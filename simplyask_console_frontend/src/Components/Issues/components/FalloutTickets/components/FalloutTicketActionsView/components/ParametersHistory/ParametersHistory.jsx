import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';

import { StyledButton } from '../../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import ConfirmationModal from '../../../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import PageableTable from '../../../../../../../shared/REDISIGNED/table/PageableTable';
import { StyledFlex, StyledText } from '../../../../../../../shared/styles/styled';
import { PARAMETERS_HISTORY_COLUMNS } from './utils/formatters';

const ParametersHistory = ({ history, revertItem, revertAll }) => {
  const [revertSingleParameterModal, setRevertSingleParameterModal] = useState(false);
  const [revertAllParametersModal, setRevertAllParametersModal] = useState(false);

  const [selectedItem, setSelectedItem] = useState();

  const tableRef = useRef(null);
  const revertItemConfirm = (item) => {
    setSelectedItem(item);
    setRevertSingleParameterModal(true);
  };

  const handleCancelRevertItemConfirm = () => {
    setRevertSingleParameterModal(false);
    setSelectedItem(null);
  };

  const handleRevertItem = () => {
    revertItem(selectedItem);
    setRevertSingleParameterModal(false);
    setSelectedItem(null);
  };

  const handleRevertAll = () => {
    setRevertAllParametersModal(false);
    revertAll();
  };

  return (
    <>
      <StyledFlex flex="1 1 auto" p="0 24px">
        <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="18px" w="100%">
          <StyledText size={19} lh={25} weight={600}>Parameters History</StyledText>
          {(history && !!history.length) && (
            <StyledButton variant="text" onClick={() => setRevertAllParametersModal(true)}>
              Revert All Modifications
            </StyledButton>
          )}
        </StyledFlex>

        <PageableTable
          data={{ content: history }}
          columns={PARAMETERS_HISTORY_COLUMNS}
          tableName="Parameters History"
          tableRef={tableRef}
          muiTableBodyCellProps={{
            sx: {
              verticalAlign: 'top',
              textOverflow: 'clip',
            },
          }}
          disableTableFooter
          meta={{
            onRevert: (item) => revertItemConfirm(item),
          }}
          getSortedRowModel={(table) => table.options.data.sort((a, b) => a?.title.localeCompare(b?.title))}
        />
      </StyledFlex>

      {/* Confirmation Revert Single Item of Execution Parameters Modal */}
      <ConfirmationModal
        isOpen={revertSingleParameterModal}
        onCloseModal={handleCancelRevertItemConfirm}
        onSuccessClick={handleRevertItem}
        successBtnText="Revert"
        alertType="WARNING"
        title="Revert To Initial Value?"
        text={`You are about to revert ${selectedItem?.title}’s value. This action cannot be reversed.`}
      />

      {/* Confirmation Revert All Execution Parameters Modal */}
      <ConfirmationModal
        isOpen={revertAllParametersModal}
        onCloseModal={() => setRevertAllParametersModal(false)}
        onSuccessClick={handleRevertAll}
        successBtnText="Revert"
        alertType="WARNING"
        title="Revert All Modifications?"
        text="You are about to revert all modified values to initial values. This action cannot be reversed."
      />
    </>
  );
};

export default ParametersHistory;

ParametersHistory.propTypes = {
  history: PropTypes.array,
  revertItem: PropTypes.func,
  revertAll: PropTypes.func,
};
