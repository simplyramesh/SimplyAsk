import { InfoOutlined } from '@mui/icons-material';
import React, { memo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import GreetingIcon from '../../../../../../Assets/icons/agent/generativeAgent/greeting.svg?component';
import Switch from '../../../../../SwitchWithText/Switch';
import InputLabel from '../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import { StyledTooltip } from '../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledFlex, StyledTextareaAutosize } from '../../../../../shared/styles/styled';
import { StyledStepErrorCircle } from '../../../../shared/components/CustomSteps/StyledStep';
import { StyledGenerativeEditorCard } from '../../StyledGenerativeEditor';
import { generativeEditorErrors, generativeEditorState } from '../../store';
import GenerativeEditorCardsHeader from '../GenerativeEditorCardsHeader/GenerativeEditorCardsHeader';

const Greeting = () => {
  const [agentState, setAgentState] = useRecoilState(generativeEditorState);
  const errors = useRecoilValue(generativeEditorErrors);
  const hasError = errors?.['greeting'];
  const showGreeting = agentState.greetingEnabled;

  const handleGreetingChange = (newText) => {
    setAgentState((prev) => ({ ...prev, greeting: newText }));
  };

  const toggleGreetingVisibility = () => {
    setAgentState((prev) => ({
      ...prev,
      greetingEnabled: !prev.greetingEnabled,
    }));
  };

  return (
    <StyledGenerativeEditorCard borderColor="lightBlue" id="greeting">
      <StyledFlex gap="30px">
        <GenerativeEditorCardsHeader
          icon={<GreetingIcon />}
          title="Greeting"
          description="Define how the Agent should greet the user in the initial message "
        />
        <StyledFlex gap="17px">
          <StyledFlex direction="row" alignItems="center" gap="10px">
            <InputLabel label="Have the Agent Say a Greeting" name="greeting" size={15} weight={600} mb={0} lh={24} />
            <StyledTooltip arrow placement="top" title="If toggled on, the Agent will greet the user in the initial message. If this is toggled off, the user will have to make the first interaction with the Agent." p="10px 15px">
              <InfoOutlined fontSize="inherit" />
            </StyledTooltip>
          </StyledFlex>
          <Switch
            id="validateGreeting"
            activeLabel=""
            inactiveLabel=""
            checked={showGreeting}
            onChange={toggleGreetingVisibility}
          />
          {showGreeting && (
            <>
              <StyledFlex mt="10px" direction="row" alignItems="center" gap="10px">
                <InputLabel label="Greeting Guidance" name="persona" size={15} weight={600} mb={0} lh={24} />
                <StyledTooltip arrow placement="top" title="Greeting Guidance" p="10px 15px">
                  <InfoOutlined fontSize="inherit" />
                </StyledTooltip>
              </StyledFlex>
              <StyledFlex direction="row" alignItems="center" gap="10px" position="relative">
                <StyledTextareaAutosize
                  placeholder="Enter guidance..."
                  value={agentState.greeting}
                  onChange={(e) => handleGreetingChange(e.target.value)}
                  variant="standard"
                />
                {hasError && (
                  <StyledTooltip arrow placement="top" title={hasError} p="10px 15px">
                    <StyledFlex
                      position="absolute"
                      right="14px"
                      top="8px"
                      marginLeft="auto"
                      flexShrink="0"
                    >
                      <StyledStepErrorCircle inline />
                    </StyledFlex>
                  </StyledTooltip>
                )}
              </StyledFlex>
            </>
          )}
        </StyledFlex>
      </StyledFlex>
    </StyledGenerativeEditorCard>
  );
};

export default memo(Greeting);
