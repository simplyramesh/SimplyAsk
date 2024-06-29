import React, { Fragment, useMemo } from 'react';
import { ACTION_CONTROLS_TYPES } from '../../../../constants/steps';
import ProcessSelect from '../ProcessSelect/ProcessSelect';
import InputFieldsControl from '../../../../../../shared/components/InputFieldsControl/InputFieldsControl';
import { StyledFlex, StyledText } from '../../../../../../../shared/styles/styled';
import PromptSymplyAsistant from '../PromptSymplyAsistant/PromptSymplyAsistant';
import OutputFieldsControl from '../../../../../../shared/components/OutputFieldsControl/OutputFieldsControl';

const ActionDynamicControls = ({ agentActions, processes, stepItem, onChange }) => {
  const processOptions =
    processes?.map(({ workflowId, displayName }) => ({
      label: displayName,
      value: workflowId,
    })) || [];

  const actionControls = useMemo(
    () =>
      agentActions?.find(({ displayName }) => {
        return displayName === stepItem.data.actionType;
      })?.actionParameterSettings,
    [agentActions, stepItem.data.actionType]
  );

  const renderControl = (setting) => {
    const { actionSettingInputType, displayName } = setting;

    return (
      <Fragment key={actionSettingInputType}>
        {actionSettingInputType === ACTION_CONTROLS_TYPES.CONTROLS_TITLE && (
          <StyledFlex gap="30px">
            <StyledText size={19} weight={600}>
              {displayName}
            </StyledText>
          </StyledFlex>
        )}

        {actionSettingInputType === ACTION_CONTROLS_TYPES.PROCESS_DROPDOWN && (
          <ProcessSelect
            processOptions={processOptions}
            value={stepItem.data.processId}
            onChange={({ value }) => {
              // clear params when process is changed
              onChange([], 'params');
              onChange(value, 'processId');
            }}
            invalid={stepItem.data?.errors.processId}
          />
        )}

        {actionSettingInputType === ACTION_CONTROLS_TYPES.PROCESS_INPUT_FIELDS && (
          <InputFieldsControl
            label="Process Input Fields"
            labelTooltip="Process Input Fields"
            value={stepItem.data.params}
            onSave={(val) => {
              onChange(val, 'params');
            }}
            errors={stepItem.data.errors?.params}
            type="AGENT"
          />
        )}

        {actionSettingInputType === ACTION_CONTROLS_TYPES.PROCESS_OUTPUT_FIELDS && (
          <OutputFieldsControl
            value={stepItem.data.outputParamMapping}
            onChange={(val) => {
              handleChange(val, 'outputParamMapping');
            }}
            disabled={!stepItem.data.processId}
          />
        )}

        {actionSettingInputType === ACTION_CONTROLS_TYPES.PROMPT_SIMPLYASSISTANT && (
          <PromptSymplyAsistant stepItem={stepItem} onChange={onChange} />
        )}
      </Fragment>
    );
  };

  const renderActionControls = () =>
    actionControls?.length > 0 ? (
      actionControls.sort((a, b) => a.actionSettingOrderNumber - b.actionSettingOrderNumber).map(renderControl)
    ) : (
      <StyledFlex p="0 60px">
        <StyledText textAlign="center">Select a Type first in order to set parameters.</StyledText>
      </StyledFlex>
    );

  return renderActionControls();
};

export default ActionDynamicControls;
