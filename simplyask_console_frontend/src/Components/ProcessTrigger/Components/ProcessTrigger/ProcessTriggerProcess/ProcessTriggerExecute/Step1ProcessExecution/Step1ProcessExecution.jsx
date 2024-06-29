import { InfoOutlined } from '@mui/icons-material';
import Collapse from '@mui/material/Collapse';
import { generatePath } from 'react-router-dom';

import routes from '../../../../../../../config/routes';
import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import OpenIcon from '../../../../../../shared/REDISIGNED/icons/svgIcons/OpenIcon';
import CustomIndicatorArrow from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomSelect from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledTooltip } from '../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import { PROCESS_TRIGGER_MODAL_TYPES } from '../../../../../utils/constants';

const Step1ProcessExecution = ({
  values,
  setFieldValue,
  setUploadFileState,
  setUploadFileStatus,
  setContent,
  step1SelectOptions,
  editModeData,
  isDefaultTriggerFormDirty,
  setIsModalOpen,
  setButtonClickedOn,
  setUploadedFileResponse,
}) => {
  const onStep1Change = (val) => {
    setFieldValue('process', val);
    setUploadFileState([]);
    setUploadFileStatus({ success: false, fail: false });
    setContent([]);
    setIsModalOpen((prev) => ({ ...prev, open: false }));
    setButtonClickedOn({ formEntryState: true, fileUploadState: false });
    setUploadedFileResponse([]);
  };

  const handleStep1DropdownChange = (val) => {
    if (isDefaultTriggerFormDirty) {
      setIsModalOpen({ type: PROCESS_TRIGGER_MODAL_TYPES.STEP_1_CHANGES, open: true, onSuccessCallback: () => onStep1Change(val) });
      return;
    }

    onStep1Change(val);
  };

  const renderViewInProcessEditorButton = () => (
    <StyledButton
      variant="text"
      startIcon={<OpenIcon />}
      onClick={() => {
        const url = generatePath(routes.PROCESS_MANAGER_INFO, { processId: values?.process?.value });
        window.open(url, '_blank');
      }}
    >
      <StyledText weight={600} lh={20} color="inherit" wrap="nowrap">
        View in the Process Editor
      </StyledText>
    </StyledButton>
  );

  const isWorkflowAccessible = editModeData?.workflowAccessible;

  return (
    <StyledFlex>
      <StyledFlex direction="row" alignItems="center" paddingBottom={editModeData ? 0 : '14px'}>
        {editModeData && (
          <StyledFlex direction="row" alignItems="center" gap="6px">
            <StyledText weight={600} size={19}>
              Step 1 - Select Process
            </StyledText>
            <StyledTooltip
              arrow
              placement="top"
              title="You cannot change the process of a scheduled execution"
              maxWidth="auto"
              p="10px 15px"
            >
              <InfoOutlined fontSize="inherit" sx={{ width: '20px', height: '20px', marginLeft: '10px' }} />
            </StyledTooltip>
          </StyledFlex>
        )}
      </StyledFlex>

      {editModeData ? (
        <StyledFlex mb={4} mt={1}>
          <StyledText>{values?.process?.label}</StyledText>

          {isWorkflowAccessible && (
            <Collapse in timeout="auto" unmountOnExit>
              <StyledFlex alignItems="start" mt={1}>
                {renderViewInProcessEditorButton()}
              </StyledFlex>
            </Collapse>
          )}
        </StyledFlex>
      ) : (
        <StyledFlex width="448px" mb={4}>
          <CustomSelect
            placeholder="Select a Process..."
            options={step1SelectOptions}
            value={values.process}
            closeMenuOnSelect
            closeMenuOnScroll
            onChange={handleStep1DropdownChange}
            components={{
              DropdownIndicator: CustomIndicatorArrow,
            }}
            maxHeight={39}
            menuPadding={0}
            form
            menuPlacement="auto"
            withSeparator
            isSearchable
            isClearable
          />
          <Collapse in={!!values?.process?.label?.length} timeout="auto" unmountOnExit>
            <StyledFlex mt={2} alignItems="start">
              {renderViewInProcessEditorButton()}
            </StyledFlex>
          </Collapse>
        </StyledFlex>
      )}
    </StyledFlex>
  );
};

export default Step1ProcessExecution;
