import React, { useState } from 'react';
import PageLayout from '../../../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import NavTabs from '../../../shared/NavTabs/NavTabs';
import { ORCHESTRATOR_DETAILS_TABS } from './constants/core';
import useTabNavigation from '../../../Settings/AccessManagement/hooks/useTabNavigation';
import TabPanel from '../../../shared/NavTabs/TabPanel';
import ContentLayout from '../../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import OrchestratorViewMode from './components/OrchestratorViewMode/OrchestratorViewMode';
import OrchestratorDetailsActions from './components/OrchestratorDetailsActions/OrchestratorDetailsActions';
import OrchestratorFullView from './components/OrchestratorFullView/OrchestratorFullView';


const NAVIGATION_LABELS = [
  { title: 'Details', value: ORCHESTRATOR_DETAILS_TABS.DETAILS },
  { title: 'Orchestration', value: ORCHESTRATOR_DETAILS_TABS.ORCHESTRATION },
];

const ProcessOrchestratorDetails = () => {
  const { tabIndex, onTabChange } = useTabNavigation(NAVIGATION_LABELS);
  const [navigationTabs] = useState(NAVIGATION_LABELS);

  return (
    <PageLayout top={(
      <NavTabs
        labels={navigationTabs}
        value={tabIndex}
        onChange={onTabChange}
        action={tabIndex  === 1 && (<OrchestratorDetailsActions />)}
      />
    )}>
      <ContentLayout fullHeight noPadding>
        <TabPanel
          index={0}
          value={tabIndex}
        >
          <OrchestratorFullView />
        </TabPanel>
        <TabPanel
          index={1}
          value={tabIndex}
        >
          <OrchestratorViewMode />
        </TabPanel>
      </ContentLayout>
    </PageLayout>
  );
};

export default ProcessOrchestratorDetails;
