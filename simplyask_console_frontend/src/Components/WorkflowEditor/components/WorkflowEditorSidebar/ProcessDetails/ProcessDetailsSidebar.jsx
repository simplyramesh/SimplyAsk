import React from 'react';

import { AGENT_DESC_MAX_LEN, AGENT_NAME_MAX_LEN } from '../../../../Managers/AgentManager/AgentEditor/constants/common';
import FormErrorMessage from '../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import BaseTextInput from '../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import InputLabel from '../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import TagsInput from '../../../../shared/REDISIGNED/controls/TagsInput/TagsInput';
import { StyledFlex } from '../../../../shared/styles/styled';

const ProcessDetailsSidebar = ({ settingsTab, setSettingsTab }) => {
  const getTagLabelValueArr = (tags) => {
    if (!Array.isArray(tags) && !tags.length) return [];

    return tags.map((tag) => ({
      label: tag,
      value: tag,
    }));
  };

  return (
    <StyledFlex display="flex" gap="30px" p="20px">
      <StyledFlex>
        <InputLabel label="Name" mb={15} size={16} />
        <BaseTextInput
          name="name"
          type="text"
          value={settingsTab?.displayName}
          onChange={(e) =>
            setSettingsTab({
              ...settingsTab,
              displayName: e.target.value,
            })
          }
          showLength
          maxLength={AGENT_NAME_MAX_LEN}
          invalid={!settingsTab?.displayName}
        />
        {!settingsTab?.displayName && <FormErrorMessage>A process name is required</FormErrorMessage>}
      </StyledFlex>
      <StyledFlex>
        <InputLabel label="Description" mb={15} size={16} isOptional />
        <BaseTextInput
          name="description"
          type="text"
          value={settingsTab?.description}
          onChange={(e) =>
            setSettingsTab({
              ...settingsTab,
              description: e.target.value,
            })
          }
          showLength
          maxLength={AGENT_DESC_MAX_LEN}
          invalid={!settingsTab?.description?.length > AGENT_DESC_MAX_LEN}
        />
      </StyledFlex>
      <StyledFlex>
        <InputLabel label="Tags" mb={15} size={16} isOptional />
        <TagsInput
          value={getTagLabelValueArr(settingsTab?.tags)}
          onCreateOption={(tag) =>
            setSettingsTab({
              ...settingsTab,
              tags: [...settingsTab.tags, tag],
            })
          }
          onChange={(e) =>
            setSettingsTab({
              ...settingsTab,
              tags: e.map((tag) => tag.value),
            })
          }
          placeholder="Create..."
        />
      </StyledFlex>
    </StyledFlex>
  );
};

export default ProcessDetailsSidebar;
