import { useTheme } from '@emotion/react';
import Collapse from '@mui/material/Collapse';

import routes from '../../../../../../config/routes';
import { ORCHESTRATOR_DETAILS_TABS } from '../../../../../Managers/OrchestrationManager/ProcessOrchestratorDetails/constants/core';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import OpenIcon from '../../../../../shared/REDISIGNED/icons/svgIcons/OpenIcon';
import CustomIndicatorArrow from '../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomSelect from '../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../shared/styles/styled';

const ProcessTriggerOrchestrationStep1 = ({
  values,
  setFieldValue,
  step1SelectOptions,
}) => {
  const { colors } = useTheme();

  return (
    <>
      <StyledFlex marginTop="14px">
        <StyledFlex width="448px" mb={4}>
          <CustomSelect
            placeholder="Select an Orchestration..."
            options={step1SelectOptions}
            value={values.orchestrationName}
            closeMenuOnSelect
            closeMenuOnScroll
            onChange={(val) => {
              setFieldValue('orchestrationName', val);
            }}
            components={{
              DropdownIndicator: CustomIndicatorArrow,
            }}
            isClearable
            maxHeight={39}
            menuPadding={0}
            form
            menuPlacement="auto"
            withSeparator
            isSearchable
          />
          <Collapse in={!!values?.orchestrationName?.label?.length} timeout="auto" unmountOnExit>
            <StyledFlex mt={2} alignItems="start">
              <StyledButton
                variant="text"
                startIcon={<OpenIcon />}
                onClick={() => {
                  const id = values.orchestrationName.value;
                  const url = `${routes.PROCESS_ORCHESTRATION}/${id}?tab=${ORCHESTRATOR_DETAILS_TABS.DETAILS}`;
                  window.open(url, '_blank');
                }}
              >
                <StyledText weight={600} lh={20} color="inherit" wrap="nowrap">View in Process Orchestrator</StyledText>
              </StyledButton>
            </StyledFlex>
          </Collapse>
        </StyledFlex>
      </StyledFlex>
      <StyledFlex mb={4}>
        <StyledDivider borderWidth={2} color={colors.geyser} flexItem />
      </StyledFlex>
    </>
  );
};

export default ProcessTriggerOrchestrationStep1;
