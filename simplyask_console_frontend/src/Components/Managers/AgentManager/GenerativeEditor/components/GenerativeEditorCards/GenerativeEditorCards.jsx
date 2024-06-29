import React from 'react';
import { useRecoilValue } from 'recoil';
import { StyledGenerativeEditorCards } from '../../StyledGenerativeEditor';
import { generativeEditorActionOpened } from '../../store';
import Greeting from '../Greeting/Greeting';
import ModelConfigurations from '../ModelConfigurations/ModelConfigurations';
import Objectives from '../Objectives/Objectives';
import TopicsToAvoid from '../TopicsToAvoid/TopicsToAvoid';

const GenerativeEditorCards = () => {
  const actionOpened = useRecoilValue(generativeEditorActionOpened);

  return (
    <StyledGenerativeEditorCards
      width="100%"
      gap="20px"
      p="36px"
      alignItems="center"
      overflow="auto"
      id="generativeEditorCardContainer"
      sidebarOpen={actionOpened}
    >
      <Greeting />
      <Objectives />
      <TopicsToAvoid />
      <ModelConfigurations />
    </StyledGenerativeEditorCards>
  );
};

export default GenerativeEditorCards;
