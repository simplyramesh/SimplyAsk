import { useTheme } from '@emotion/react';
import { InfoOutlined } from '@mui/icons-material';
import { useRecoilValue } from 'recoil';

import { useGetAllAgents } from '../../../../../../ConverseDashboard/hooks/useGetAllAgents';
import InputLabel from '../../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import CustomIndicatorArrow from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import { IconOption } from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/options/IconOption';
import CustomSelect from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledTooltip } from '../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { setIn } from '../../../../../../shared/REDISIGNED/utils/helpers';
import Spinner from '../../../../../../shared/Spinner/Spinner';
import { StyledDivider, StyledFlex } from '../../../../../../shared/styles/styled';
import { STEP_TYPES } from '../../../../../shared/constants/steps';
import { getErrors } from '../../../../../shared/utils/validation';
import { stepDelegates } from '../../../constants/stepDelegates';
import { SWITCH_INPUT_KEYS, SWITCH_TYPES } from '../../../constants/steps';
import { useUpdateSteps } from '../../../hooks/useUpdateSteps';
import { agentEditorStepItem } from '../../../store';
import { switchSchema } from '../../../utils/validationSchemas';

const SwitchSidebar = ({ data }) => {
  const { colors } = useTheme();
  const stepItemOpened = useRecoilValue(agentEditorStepItem);
  const { updateStep } = useUpdateSteps();

  const { allAgents: allAgentsOptions, isAllAgentsLoading: isAllAgentsOptionsLoading } = useGetAllAgents(
    new URLSearchParams({
      pageSize: 999,
    }),
    {
      select: (res) =>
        res?.content?.map((item) => ({
          label: item.name,
          value: item.agentId,
        })),
      enabled: SWITCH_TYPES.AGENT === data.switchType,
    }
  );

  const options = stepDelegates
    .find((delegate) => delegate.type === STEP_TYPES.SWITCH)
    .children.map((child) => ({ value: child.switchType, label: child.name }));

  const handleDropdownChange = ({ value, label }, key) => {
    const errors = getErrors({
      schema: switchSchema,
      data: { ...data, [key]: value },
    });

    updateStep(stepItemOpened?.stepId, (prev) => {
      const { switchAgentId, ...restPrev } = prev.data;

      return setIn(prev, 'data', {
        ...restPrev,
        errors,
        ...(value === SWITCH_TYPES.AGENT && { switchAgentId }),
        ...(key === SWITCH_INPUT_KEYS.SWITCH_TYPE && { label }),
        [key]: value,
      });
    });
  };

  return (
    <StyledFlex>
      <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
        <InputLabel label="Type" name="Type" isOptional={false} size={15} weight={600} mb={0} lh={24} />
        <StyledTooltip
          arrow
          placement="top"
          title="Select the type of Switch block to use. Changing Types will reset any configurations made to the Switch block"
          maxWidth=""
          p="10px 15px"
        >
          <InfoOutlined fontSize="inherit" />
        </StyledTooltip>
      </StyledFlex>
      <CustomSelect
        menuPlacement="auto"
        placeholder="Select type"
        options={options}
        getOptionValue={({ value }) => value}
        closeMenuOnSelect
        isClearable={false}
        isSearchable={false}
        value={options.find(({ value }) => value === data[SWITCH_INPUT_KEYS.SWITCH_TYPE])}
        onChange={(e) => handleDropdownChange(e, SWITCH_INPUT_KEYS.SWITCH_TYPE)}
        components={{
          DropdownIndicator: CustomIndicatorArrow,
          Option: IconOption,
        }}
        maxHeight={30}
        menuPadding={0}
        controlTextHidden
        menuPortalTarget={document.body}
        form
      />

      {SWITCH_TYPES.AGENT === data.switchType && (
        <StyledFlex>
          <StyledDivider borderWidth={1.5} color={colors.cardGridItemBorder} m="30px -20px 25px -20px" />
          <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
            <InputLabel label="Agent" name="Agent" isOptional={false} size={15} weight={600} mb={0} lh={24} />
          </StyledFlex>
          {isAllAgentsOptionsLoading ? (
            <Spinner inline medium />
          ) : (
            <CustomSelect
              menuPlacement="auto"
              placeholder="Select Agent to Change to..."
              options={allAgentsOptions}
              getOptionValue={({ value }) => value}
              closeMenuOnSelect
              isClearable={false}
              isSearchable={false}
              value={allAgentsOptions.find(({ value }) => value === data[SWITCH_INPUT_KEYS.SWITCH_AGENT_ID])}
              onChange={(e) => handleDropdownChange(e, SWITCH_INPUT_KEYS.SWITCH_AGENT_ID)}
              components={{
                DropdownIndicator: CustomIndicatorArrow,
                Option: IconOption,
              }}
              maxHeight={30}
              menuPadding={0}
              controlTextHidden
              menuPortalTarget={document.body}
              form
              withSeparator
              invalid={data.errors?.switchAgentId}
            />
          )}
        </StyledFlex>
      )}
    </StyledFlex>
  );
};

export default SwitchSidebar;
