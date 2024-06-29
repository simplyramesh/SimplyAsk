import { AddRounded, InfoOutlined } from '@mui/icons-material';
import React, { memo } from 'react';
import { useRecoilState } from 'recoil';
import AvoidTopicsIcon from '../../../../../../Assets/icons/agent/generativeAgent/avoidTopics.svg?component';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import TrashBinIcon from '../../../../../shared/REDISIGNED/icons/svgIcons/TrashBinIcon';
import { StyledTooltip } from '../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { setIn } from '../../../../../shared/REDISIGNED/utils/helpers';
import { StyledFlex, StyledIconButton, StyledText, StyledTextareaAutosize } from '../../../../../shared/styles/styled';
import { StyledGenerativeEditorCard } from '../../StyledGenerativeEditor';
import { generativeEditorTopicsState } from '../../store';
import { topicDefaultTemplate } from '../../util/objective';
import GenerativeEditorCardsHeader from '../GenerativeEditorCardsHeader/GenerativeEditorCardsHeader';

const TopicsToAvoid = () => {
  const [topics, setTopics] = useRecoilState(generativeEditorTopicsState);
  const handleAddTopic = () => setTopics([...topics, topicDefaultTemplate()]);

  const handleTopicChange = (topic, topicIndex) => {
    setTopics((prev) => setIn(prev, [topicIndex], { topic }));
  };

  const handleDeleteTopic = (indexToDelete) => {
    const updatedTopics = topics.filter((topic, index) => index !== indexToDelete);

    setTopics(updatedTopics);
  };

  return (
    <StyledGenerativeEditorCard borderColor="purple" id="topicsToAvoid">
      <StyledFlex gap="30px">
        <GenerativeEditorCardsHeader
          icon={<AvoidTopicsIcon />}
          title="Topics to Avoid"
          description="Define general topics the Agent will avoid talking about"
        />

        <StyledFlex gap="17px">
          <StyledFlex direction="row" justifyContent="space-between" alignItems="center">
            <StyledFlex gap="10px" direction="row" alignItems="center">
              <InputLabel label="Topics" isOptional mb={0} />
              <StyledTooltip
                arrow
                placement="top"
                title="Topics can be defined using a single word (e.g politics, religion, etc) or multiple sentences. For the best results, write only one topic per field."
                p="10px 15px"
              >
                <InfoOutlined fontSize="inherit" />
              </StyledTooltip>
            </StyledFlex>
            <StyledButton startIcon={<AddRounded />} variant="text" onClick={handleAddTopic}>
              Add Topic
            </StyledButton>
          </StyledFlex>
          {topics.map((topic, idx) => (
            <StyledFlex direction="row" gap="15px" alignItems="center" key={idx}>
              <StyledFlex width="100%">
                <StyledTextareaAutosize
                  id={idx.toString()}
                  name="topic"
                  placeholder="Enter Topic..."
                  variant="standard"
                  value={topic.topic}
                  onChange={(e) => handleTopicChange(e.target.value, idx)}
                />
              </StyledFlex>
              <StyledIconButton size="34px" iconSize="18px" onClick={() => handleDeleteTopic(idx)}>
                <TrashBinIcon />
              </StyledIconButton>
            </StyledFlex>
          ))}
          {topics.length ? null : (
            <StyledFlex alignItems="center">
              <StyledText weight={500} textAlign="center">
                No Topics have been added yet
              </StyledText>
            </StyledFlex>
          )}
        </StyledFlex>
      </StyledFlex>
    </StyledGenerativeEditorCard>
  );
};

export default memo(TopicsToAvoid);
