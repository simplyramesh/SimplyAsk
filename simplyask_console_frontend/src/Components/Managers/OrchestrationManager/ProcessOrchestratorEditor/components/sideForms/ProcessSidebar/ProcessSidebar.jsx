import { InfoOutlined } from '@mui/icons-material';
import React from 'react';
import { useProcessFields } from '../../../../../../../hooks/process/useProcessFields';
import { useProcesses } from '../../../../../../../hooks/process/useProcesses';
import FormErrorMessage from '../../../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import InputLabel from '../../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import { StyledTooltip } from '../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { setIn } from '../../../../../../shared/REDISIGNED/utils/helpers';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import ProcessSelect from '../../../../../AgentManager/AgentEditor/components/sideForms/ActionsSidebar/ProcessSelect/ProcessSelect';
import { useUpdateSteps } from '../../../../../AgentManager/AgentEditor/hooks/useUpdateSteps';
import InputFieldsControl from '../../../../../shared/components/InputFieldsControl/InputFieldsControl';
import SidebarGenerateVariant from '../../../../../shared/components/SidebarGenerateVariant/SidebarGenerateVariant';
import { getErrors } from '../../../../../shared/utils/validation';
import { JOB_TRANSITION_TYPES } from '../../../constants/steps';
import { defaultTransitions } from '../../../utils/defaultTemplates';
import { jobValidationSchema } from '../../../utils/schemas';
import CustomExecutes from './CustomExecutes';
import CustomTimoutDelay from './CustomTimoutDelay';

const ProcessSidebar = ({ id, data }) => {
  const { updateStep } = useUpdateSteps();
  const { processes } = useProcesses({
    params: {
      pageSize: 999,
    },
    options: {
      gcTime: Infinity,
      staleTime: Infinity,
    },
  });

  const processOptions =
    processes?.content?.map(({ deploymentId, displayName }) => ({
      label: displayName,
      value: deploymentId,
    })) || [];

  const { job = {}, transitions, errors } = data || {};
  const filteredTransitions = transitions?.filter(
    (transition) => !Object.values(JOB_TRANSITION_TYPES).includes(transition.id)
  );
  const isCustomDelayUsed = Boolean(job.delayValue && job.delayType);
  const isCustomTimeoutUsed = Boolean(job.timeoutValue && job.timeoutType);
  const isCustomExecutesUsed = Boolean(job.customStartTime && job.customEndTime);

  const autocompleteParams = job.params?.map((param) => ({
    label: param.fieldName,
    value: param.fieldName,
  }));

  const handleTransitionChange = (value) => {
    updateStep(id, (prev) => setIn(prev, 'data.transitions', [...defaultTransitions, ...value]));
  };

  const handleChange = (path, value) => {
    updateStep(id, (prev) => {
      const errors = getErrors({
        schema: jobValidationSchema,
        data: { ...prev.data.job, [path]: value },
      });

      return {
        ...prev,
        data: {
          ...prev.data,
          job: {
            ...prev.data.job,
            [path]: value,
          },
          errors,
        },
      };
    });
  };

  useProcessFields({
    processId: job.processId,
    onSuccess: (data) => {
      const mappedParams = data?.map((param) => ({
        ...param,
        value: '',
      }));

      handleChange('params', mappedParams);
    },
    enabled: !!job.processId && job.params?.length === 0,
  });

  const renderDelayControl = () => {
    return (
      <StyledFlex>
        <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
          <InputLabel label="Delay" name="delay" size={15} weight={600} mb={0} lh={24} />
          <StyledTooltip
            arrow
            placement="top"
            title="Set an amount of time for the execution to pause once it reaches this process.
            Setting the value to 0 equals to “No Delay”. The maximum seconds that can be set is 2,628,288,
            the maximum hours that can be set is 744, and the maximum days that can be set is 31. "
            p="10px 15px"
          >
            <InfoOutlined fontSize="inherit" />
          </StyledTooltip>
        </StyledFlex>
        <CustomTimoutDelay
          job={job}
          valueKey="delayValue"
          typeKey="delayType"
          onChange={handleChange}
          customChecked={isCustomDelayUsed}
        />
      </StyledFlex>
    );
  };

  const renderTimeoutControl = () => {
    return (
      <StyledFlex>
        <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
          <InputLabel label="Timeout" name="timeout" size={15} weight={600} mb={0} lh={24} />
          <StyledTooltip
            arrow
            placement="top"
            title="Set a period of time for the Orchestrator to wait for this Process to execute.
            If execution exceeds the timeout, the execution will stop."
            p="10px 15px"
          >
            <InfoOutlined fontSize="inherit" />
          </StyledTooltip>
        </StyledFlex>
        <CustomTimoutDelay
          job={job}
          valueKey="timeoutValue"
          typeKey="timeoutType"
          onChange={handleChange}
          customChecked={isCustomTimeoutUsed}
        />
      </StyledFlex>
    );
  };

  return (
    <StyledFlex display="flex" gap="30px" p="10px 20px 50px">
      <StyledText weight={600} size={19}>
        {job.jobName}
      </StyledText>

      <StyledDivider m="0 -20px 0 -20px" />

      <StyledFlex>
        <ProcessSelect
          isSearchable
          processOptions={processOptions}
          value={job.processId}
          onChange={({ value }) => {
            handleChange('params', []);
            handleChange('processId', value);
          }}
          invalid={!!errors?.processId}
        />
        {!!errors?.processId && <FormErrorMessage>{errors?.processId}</FormErrorMessage>}
      </StyledFlex>

      <StyledFlex>
        <InputFieldsControl
          errors={errors?.params}
          label="Process Input Fields"
          labelTooltip="Process Input Fields"
          value={job.params}
          onSave={(val) => {
            handleChange('params', val);
          }}
        />
      </StyledFlex>

      <StyledDivider m="0 -20px 0 -20px" />

      <StyledFlex gap="30px">
        <StyledFlex gap="15px">
          <SidebarGenerateVariant
            expressionBuilder
            autocompleteParams={autocompleteParams}
            values={filteredTransitions}
            onChange={handleTransitionChange}
            inputPlaceholder="Enter Expression..."
            label="Additional Transitions"
            labelTooltipTitle="Additional Transitions"
            addButtonText="Add"
            isGenerateVariantVisible={false}
            minItems={0}
            isOptional
          />
          {!filteredTransitions?.length && (
            <StyledText size={14} weight={600} textAlign="center">
              There Are Currently No Additional Transitions
            </StyledText>
          )}
        </StyledFlex>

        <StyledDivider m="0 -20px 0 -20px" />

        <StyledFlex>
          <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
            <InputLabel label="Executes" name="executes" isOptional={false} size={15} weight={600} mb={0} lh={24} />
            <StyledTooltip arrow placement="top" title="Set a time window for the Process to execute on." p="10px 15px">
              <InfoOutlined fontSize="inherit" />
            </StyledTooltip>
          </StyledFlex>

          <CustomExecutes job={job} onChange={handleChange} customChecked={isCustomExecutesUsed} />
        </StyledFlex>

        {renderTimeoutControl()}
        {renderDelayControl()}
      </StyledFlex>
    </StyledFlex>
  );
};

export default ProcessSidebar;
