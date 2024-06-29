import 'react-datasheet-grid/dist/style.css';

import { useFormik } from 'formik';
import { MultiDirectedGraph } from 'graphology';
import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
import {
  DynamicDataSheetGrid,
} from 'react-datasheet-grid';
import { useRecoilValue } from 'recoil';

import { generateUUID } from '../../../../../Settings/AccessManagement/utils/helpers';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomTableIcons from '../../../../../shared/REDISIGNED/icons/CustomTableIcons';
import ConfirmationModal from '../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StyledTooltip } from '../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import {
  StyledFlex, StyledText,
} from '../../../../../shared/styles/styled';
import { initialWorkflowState } from '../../../../store/selectors';
import { initialCols } from '../../utils/data';
import RevertChanges from './RevertChanges';
import ShortcutsSidebar from './ShortcutsSidebar';
import {
  StyledSpreadsheet, StyledSpreadsheetHead, StyledSpreadsheetQuestionIcon, StyledSpreadsheetTable,
} from './StyledSpreadsheet';

const Spreadsheet = ({
  param, onSave, onClose, step,
}) => {
  const { workflowGraph } = useRecoilValue(initialWorkflowState);
  const graph = useMemo(() => new MultiDirectedGraph().import(workflowGraph), [workflowGraph]);
  const sheetRef = useRef(null);
  const {
    values, submitForm, setFieldValue,
  } = useFormik({
    initialValues: {
      data: param?.currentValue,
    },
    onSubmit: (values) => onSave(values.data),
    enableReinitialize: true,
  });
  const [sidebarOpened, setSidebarOpened] = useState(false);
  const [valueToRevert, setValueToRevert] = useState(null);
  const createRow = useCallback(() => ({ id: generateUUID() }), []);
  const columns = useMemo(() => initialCols, []);

  const name = param.stepSettingTemplate.displayName;

  const handleRevert = () => {
    const inputParam = graph.getNodeAttribute(step.stepId, 'stepInputParameters')
      .find((p) => p.stepSettingTemplate.promptText === param.stepSettingTemplate.promptText);

    setValueToRevert(inputParam?.currentValue);
  };
  const handleRevertConfirmed = () => {
    setFieldValue('data', valueToRevert);
    setValueToRevert(null);
  };

  return (
    <>
      <StyledSpreadsheet>
        <StyledSpreadsheetHead>
          <StyledFlex width="100%" direction="row" alignItems="center" justifyContent="space-between">
            <StyledFlex direction="row" alignItems="center" gap="20px">
              <CustomTableIcons
                icon="CLOSE"
                width={20}
                onClick={onClose}
              />
              <StyledTooltip
                title="Keyboard Shortcuts"
                arrow
                placement="top"
              >
                <StyledSpreadsheetQuestionIcon onClick={() => setSidebarOpened(true)} />
              </StyledTooltip>
              <StyledText weight={600} size={19} lh={24}>
                {name}
              </StyledText>
            </StyledFlex>
            <StyledFlex direction="row" gap="20px">
              <RevertChanges onRevert={handleRevert} step={step} />
              <StyledButton
                primary
                variant="contained"
                onClick={submitForm}
                weight={600}
              >
                Save Changes
              </StyledButton>
            </StyledFlex>
          </StyledFlex>
        </StyledSpreadsheetHead>
        <StyledSpreadsheetTable>
          <DynamicDataSheetGrid
            onChange={(data) => setFieldValue('data', data)}
            ref={sheetRef}
            gutterColumn={{
              title: '',
              basis: 90,
            }}
            addRowsComponent={null}
            value={values.data}
            columns={columns}
            rowHeight={38}
            createRow={createRow}
            autoAddRow
          />
        </StyledSpreadsheetTable>
      </StyledSpreadsheet>

      <ShortcutsSidebar sidebarOpened={sidebarOpened} setSidebarOpened={setSidebarOpened} />

      <ConfirmationModal
        isOpen={!!valueToRevert}
        onCloseModal={() => setValueToRevert(null)}
        onSuccessClick={handleRevertConfirmed}
        successBtnText="Revert"
        alertType="DANGER"
        title="Are You Sure?"
        text={`You are about to revert to the last published version of "${name}". All changes you have made since will be permanently lost.`}
      />
    </>
  );
};

export default Spreadsheet;
