import React, { useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import routes from '../../../../config/routes';
import { useScrollActiveSection } from '../../../../hooks/genAI/useScrollActiveSection';
import { modifiedCurrentPageDetails } from '../../../../store';
import { CustomHelmet } from '../../../shared/REDISIGNED/CustomHelmet/CustomHelmet';
import { CustomScrollbar } from '../../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import Spinner from '../../../shared/Spinner/Spinner';
import { StyledFlowEditor, StyledFlowEditorBody } from '../../shared/components/StyledFlowEditor';
import useGenerativeAgentDetails from '../hooks/useGenerativeAgentDetails';
import { transitionClass, transitionDuration } from './StyledGenerativeEditor';
import GenerativeEditorAgenda from './components/GenerativeEditorAgenda/GenerativeEditorAgenda';
import GenerativeEditorCards from './components/GenerativeEditorCards/GenerativeEditorCards';
import GenerativeEditorHead from './components/GenerativeEditorHead/GenerativeEditorHead';
import ActionsSidebar from './components/sideForms/ActionsSidebar';
import { generativeEditorActionOpened } from './store';
import { cards } from './util/generativeEditorData';

const GenerativeEditor = ({ agent }) => {
  const actionOpened = useRecoilValue(generativeEditorActionOpened);
  const { generativeAgentDetails, isGenerativeAgentLoading } = useGenerativeAgentDetails(agent.agentId);
  const setCurrentPageDetailsState = useSetRecoilState(modifiedCurrentPageDetails);

  const { activeId, handleScroll } = useScrollActiveSection(cards.map((card) => card.id));

  useEffect(() => {
    if (generativeAgentDetails) {
      const isNewlyCreatedAgent = !generativeAgentDetails.objectives?.length && !generativeAgentDetails.topics?.length;

      isNewlyCreatedAgent
        ? setCurrentPageDetailsState({
            pageUrlPath: routes.AGENT_MANAGER_DIAGRAM,
            breadCrumbLabel: 'New Agent',
          })
        : setCurrentPageDetailsState({
            pageUrlPath: routes.AGENT_MANAGER_DIAGRAM,
            breadCrumbLabel: `#${agent.agentId}`,
          });
    }
  }, [generativeAgentDetails, agent]);

  if (isGenerativeAgentLoading) return <Spinner fadeBgParent medium />;

  return (
    <StyledFlowEditor>
      <CustomHelmet dynamicText={agent?.name} />
      <GenerativeEditorHead agent={agent} id="generativeEditorHeaderContainer" />
      <StyledFlowEditorBody pattern>
        {!actionOpened && <GenerativeEditorAgenda activeId={activeId} />}
        <CustomScrollbar onScroll={handleScroll}>
          <GenerativeEditorCards />
        </CustomScrollbar>
        <CSSTransition classNames={transitionClass} in={actionOpened} timeout={transitionDuration} unmountOnExit>
          <ActionsSidebar />
        </CSSTransition>
      </StyledFlowEditorBody>
    </StyledFlowEditor>
  );
};

export default GenerativeEditor;
