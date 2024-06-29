import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { components } from 'react-select';

import { getAllAgents } from '../../../../../../../../Services/axios/conversationHistoryAxios';
import LinkedItemCard from '../../../../../../../Issues/components/ServiceTickets/components/shared/LinkedItems/LinkedItemCard/LinkedItemCard';
import LinkedItemIcon from '../../../../../../../Issues/components/ServiceTickets/components/shared/LinkedItems/LinkedItemIcon/LinkedItemIcon';
import { ISSUE_ENTITY_TYPE } from '../../../../../../../Issues/constants/core';
import { StyledButton } from '../../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import NoOptionsMessage from '../../../../../../../shared/REDISIGNED/selectMenus/customComponents/options/NoOptionsMessage';
import CustomSelect from '../../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledFlex, StyledSubmissionForm, StyledText } from '../../../../../../../shared/styles/styled';
import { WIDGETS_QUERY_KEYS } from '../../../../constants/common';
import { linkedAgentEntityMapper } from '../../../../utils/helpers';

const AgentsOption = ({ children, data, ...rest }) => {
  const { agentId, name } = data;

  return (
    <components.Option {...rest}>
      <StyledFlex direction="row" gap="14px" alignItems="center">
        <LinkedItemIcon type={ISSUE_ENTITY_TYPE.AGENT} />
        <StyledFlex>
          <StyledText size={15} weight={600} lh={22}>
            {name}
          </StyledText>
          <StyledText size={13} lh={19}>
            #{agentId}
          </StyledText>
        </StyledFlex>
      </StyledFlex>
    </components.Option>
  );
};

const ChatWidgetAgentsSetting = ({ values, setFieldValue }) => {
  const [selectAgent, setSelectAgent] = useState(null);

  const { data: getAllAgentsOption } = useQuery({
    queryKey: [WIDGETS_QUERY_KEYS.GET_ALL_AGENTS_FOR_WIDGETS],
    queryFn: () => getAllAgents('pageSize=999'),
    select: (res) => res?.content || [],
  });

  const addAgents = () => {
    if (!selectAgent) return;

    const agentFormat = {
      agentId: selectAgent.agentId,
      name: selectAgent.name,
    };

    const allAgents = [...values.agents, agentFormat];
    const sortedAgents = allAgents?.sort((a, b) => a.name.localeCompare(b.name));

    setFieldValue('agents', sortedAgents);
    setSelectAgent(null);
  };

  const removeClickedAgent = (agent) => {
    const filterClickedAgent = values?.agents?.filter((item) => item.agentId !== agent.agentId);
    setFieldValue('agents', filterClickedAgent);
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    addAgents();
  };

  const filterCustomSelectOptions = (option, inputValue) => {
    // CustomSelect options filter to show options of only unselected agents
    const selectedAgentIds = values?.agents?.map((agent) => agent.agentId);
    const lowerCaseInputVal = inputValue?.toLowerCase();

    return (
      !selectedAgentIds.includes(option?.value) &&
      (option.label?.toLowerCase()?.includes(lowerCaseInputVal) ||
        option.value?.toLowerCase()?.includes(lowerCaseInputVal))
    );
  };

  return (
    <StyledFlex flex="auto" p="25px">
      <StyledSubmissionForm onSubmit={onFormSubmit}>
        <StyledFlex flex="auto" direction="row" gap="10px">
          <StyledFlex flex="auto" width="100%">
            <CustomSelect
              name="agents"
              placeholder="Search for an Agent..."
              form
              options={getAllAgentsOption ?? []}
              value={selectAgent}
              onChange={setSelectAgent}
              components={{
                DropdownIndicator: () => null,
                Option: AgentsOption,
                NoOptionsMessage,
              }}
              isSearchable
              closeMenuOnSelect
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.agentId}
              filterOption={filterCustomSelectOptions}
              minMenuHeight={150}
              maxMenuHeight={450}
              hideSelectedOptions={false}
              isClearable={false}
              openMenuOnClick
            />
          </StyledFlex>
          <StyledButton tertiary variant="contained" onClick={addAgents} disabled={!selectAgent}>
            Add
          </StyledButton>
        </StyledFlex>
      </StyledSubmissionForm>

      {values?.agents?.length === 0 ? (
        <StyledFlex alignItems="center">
          <StyledText display="inline" size={16} mt={30} weight={600} textAlign="center" width="350px">
            There Are Currently No Agents Assigned To This Chat Widget
          </StyledText>
        </StyledFlex>
      ) : (
        <StyledFlex flex="auto" direction="column" gap="10px" marginTop="30px">
          {values?.agents?.map((agent) => (
            <LinkedItemCard
              key={agent.agentId}
              item={linkedAgentEntityMapper(agent)}
              onUnlink={removeClickedAgent}
              closeTooltipText="Remove"
            />
          ))}
        </StyledFlex>
      )}
    </StyledFlex>
  );
};

export default ChatWidgetAgentsSetting;
