import { useTheme } from '@mui/material/styles';
import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import FormErrorMessage from '../../../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import BaseTextInput from '../../../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import InputLabel from '../../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import TagsInput from '../../../../../../shared/REDISIGNED/controls/TagsInput/TagsInput';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import { AGENT_DESC_MAX_LEN, AGENT_NAME_MAX_LEN } from '../../../constants/common';
import { agentEditorSettings, agentEditorState } from '../../../store';

const AgentDetailsSideBar = () => {
  const { colors } = useTheme();
  const { settings } = useRecoilValue(agentEditorState);
  const setAgentEditorSettings = useSetRecoilState(agentEditorSettings);

  const getTagLabelValueArr = () => {
    if (!settings?.tags.length) return [];

    return settings.tags.map((tag) => ({
      label: tag,
      value: tag,
    }));
  };

  return (
    <StyledFlex display="flex" gap="30px" p="20px">
      <StyledText weight={600} size={19}>
        Agent Details
      </StyledText>
      <StyledDivider color={colors.cardGridItemBorder} m="0 -20px 0 -20px" />
      <StyledFlex>
        <InputLabel label="Name" mb={15} size={16} />
        <BaseTextInput
          name="name"
          type="text"
          value={settings?.name}
          onChange={(e) =>
            setAgentEditorSettings({
              name: e.target.value,
              description: settings.description,
              tags: settings.tags,
            })
          }
          showLength
          maxLength={AGENT_NAME_MAX_LEN}
          invalid={!settings?.name}
        />
        {!settings?.name && <FormErrorMessage>An Agent name is required</FormErrorMessage>}
      </StyledFlex>
      <StyledFlex>
        <InputLabel label="Description" mb={15} size={16} isOptional />
        <BaseTextInput
          name="description"
          type="text"
          value={settings?.description}
          onChange={(e) =>
            setAgentEditorSettings({
              name: settings.name,
              description: e.target.value,
              tags: settings.tags,
            })
          }
          showLength
          maxLength={AGENT_DESC_MAX_LEN}
          invalid={settings?.description?.length > AGENT_DESC_MAX_LEN}
        />
      </StyledFlex>
      <StyledFlex>
        <InputLabel label="Tags" mb={15} size={16} isOptional />
        <TagsInput
          value={getTagLabelValueArr()}
          onCreateOption={(tag) =>
            setAgentEditorSettings({
              name: settings.name,
              description: settings.description,
              tags: [...settings.tags, tag],
            })
          }
          onChange={(e) =>
            setAgentEditorSettings({
              name: settings.name,
              description: settings.description,
              tags: e.map((tag) => tag.value),
            })
          }
          placeholder="Create..."
        />
      </StyledFlex>
    </StyledFlex>
  );
};

export default AgentDetailsSideBar;
