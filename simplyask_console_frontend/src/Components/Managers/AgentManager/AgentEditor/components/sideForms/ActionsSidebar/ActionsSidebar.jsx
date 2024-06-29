import { InfoOutlined } from '@mui/icons-material';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { useProcesses } from '../../../../../../../hooks/process/useProcesses';
import { useProcessFields } from '../../../../../../../hooks/process/useProcessFields';
import {
  StyledSwitchHolder,
  StyledSwitchLabel,
} from '../../../../../../MySummary/MyActivity/MyActivitySection/StyledMyActivitySection';
import InputLabel from '../../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import CustomIndicatorArrow from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import { IconOption } from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/options/IconOption';
import CustomSelect from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledTooltip } from '../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { setIn } from '../../../../../../shared/REDISIGNED/utils/helpers';
import Spinner from '../../../../../../shared/Spinner/Spinner';
import { StyledDivider, StyledFlex } from '../../../../../../shared/styles/styled';
import Switch from '../../../../../../SwitchWithText/Switch';
import { getErrors } from '../../../../../shared/utils/validation';
import useAgentActions from '../../../hooks/useAgentActions';
import { useUpdateSteps } from '../../../hooks/useUpdateSteps';
import { agentEditorStepItem } from '../../../store';
import { actionSchema } from '../../../utils/validationSchemas';
import ActionDynamicControls from './ActionDynamicControls/ActionDynamicControls';

const ActionsSidebar = ({ stepItem }) => {
  const stepItemOpened = useRecoilValue(agentEditorStepItem);
  const { updateStep } = useUpdateSteps();
  const { agentActions, isAgentActionsLoading } = useAgentActions();
  const { processes } = useProcesses({ params: { pageSize: 10000 }, options: { select: (data) => data?.content } });
  const processId = processes?.find(({ workflowId }) => workflowId?.includes(stepItem.data.processId))?.deploymentId;

  const handleChange = useCallback(
    (value, key) => {
      updateStep(stepItemOpened?.stepId, (prev) =>
        setIn(
          prev,
          'data.stepItems',
          prev.data.stepItems.map((item) => {
            if (item.id === stepItem.id) {
              const errors = getErrors({
                schema: actionSchema,
                data: { ...item.data, [key]: value },
              });

              return {
                ...item,
                data: {
                  ...item.data,
                  [key]: value,
                  errors,
                },
              };
            }
            return item;
          })
        )
      );
    },
    [stepItemOpened?.stepId, stepItem.id, updateStep]
  );

  const handleActionTypeChange = useCallback(
    ({ value }) => {
      const validationType = agentActions?.find(({ displayName }) => displayName === value)?.validationType;
      handleChange(value, 'actionType');
      handleChange(validationType, 'validationType');
    },
    [agentActions?.length, handleChange]
  );

  const { allFields, isSuccess } = useProcessFields({
    processId,
    stepItemId: stepItem.id,
    enabled: !!processId && stepItem.data.params.length === 0,
  });

  useEffect(() => {
    if (isSuccess && allFields) {
      const mappedParams = allFields?.map(({ fieldCriteria, fieldName, fieldOrder, fieldValidationType }) => ({
        fieldCriteria,
        fieldName,
        fieldOrder,
        fieldValidationType,
        value: '',
      }));

      handleChange(mappedParams, 'params');
    }
  }, [isSuccess, allFields]);

  const actionTypeOptions = useMemo(
    () =>
      agentActions?.map(({ displayName }) => ({
        label: displayName,
        value: displayName,
      })),
    [agentActions?.length]
  );

  return (
    <StyledFlex gap="30px">
      {isAgentActionsLoading ? (
        <Spinner fadeBgParent medium />
      ) : (
        <>
          <StyledFlex gap="17px 0">
            <StyledFlex>
              <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
                <InputLabel label="Type" name="actionType" isOptional={false} size={15} weight={600} mb={0} lh={24} />
                <StyledTooltip arrow placement="top" title="Action Type" p="10px 15px">
                  <InfoOutlined fontSize="inherit" />
                </StyledTooltip>
              </StyledFlex>
              <CustomSelect
                menuPlacement="auto"
                placeholder="Select Type"
                options={actionTypeOptions}
                getOptionValue={({ value }) => value}
                closeMenuOnSelect
                isClearable={false}
                isSearchable={false}
                value={actionTypeOptions?.find(({ value }) => value === stepItem.data.actionType)}
                onChange={handleActionTypeChange}
                components={{
                  DropdownIndicator: CustomIndicatorArrow,
                  Option: IconOption,
                }}
                maxHeight={30}
                menuPadding={0}
                controlTextHidden
                menuPortalTarget={document.body}
                form
                invalid={stepItem.data.errors?.actionType}
              />
            </StyledFlex>

            <StyledSwitchHolder>
              <Switch
                id="ignoreErrors"
                activeLabel=""
                inactiveLabel=""
                checked={stepItem.data.ignoreErrors}
                onChange={() => handleChange(!stepItem.data.ignoreErrors, 'ignoreErrors')}
              />
              <StyledSwitchLabel htmlFor="ignoreErrors">Ignore Errors</StyledSwitchLabel>
              <StyledTooltip
                arrow
                placement="top"
                title="When toggled on, the “On Action Error” transition will not be triggered if an error occurs during action execution"
                p="10px 15px"
              >
                <InfoOutlined fontSize="inherit" />
              </StyledTooltip>
            </StyledSwitchHolder>
          </StyledFlex>

          <StyledDivider m="0" />

          <ActionDynamicControls
            stepItem={stepItem}
            agentActions={agentActions}
            processes={processes}
            onChange={handleChange}
          />
        </>
      )}
    </StyledFlex>
  );
};

export default ActionsSidebar;
