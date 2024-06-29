import React, { useState } from 'react';

import NavTabs from '../shared/NavTabs/NavTabs';
import TabPanel from '../shared/NavTabs/TabPanel';
import ContentLayout from '../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../shared/REDISIGNED/layouts/PageLayout/PageLayout';

import { useNavTabsSearchParams } from '../../hooks/useTabs';
import EventTriggers from './Components/EventTriggers/EventTriggers';
import ProcessTriggerRoot from './Components/ProcessTrigger/ProcessTriggerRoot';
import ScheduledProcesses from './Components/ScheduledProcesses/ScheduledProcesses';
import { TRIGGER_RADIO } from './utils/constants';

const NAV_TAB_LABELS = [
  { title: 'Execute', value: 'schedule' },
  { title: 'View Scheduled Executions', value: 'view' },
  { title: 'Manage Event Triggers (Webhook)', value: 'event-triggers' },
];

const ProcessTrigger = () => {
  const { tabValue, onTabChange, navTabLabels } = useNavTabsSearchParams(0, NAV_TAB_LABELS, true);

  const [isOrchestrationTrigger, setIsOrchestrationTrigger] = useState(TRIGGER_RADIO.PROCESS);
  const [isDirtySynced, setIsDirtySynced] = useState({ isDirty: false, isOpen: false });

  const sharedProcessTriggerProps = {
    isOrchestrationTrigger,
    isDirtySynced,
    setIsOrchestrationTrigger,
    setIsDirtySynced,
    onViewScheduledProcesses: () => onTabChange(null, 1),
  };

  const onTabChangeClick = (event, newValue) => {
    if (isDirtySynced?.isDirty && isOrchestrationTrigger === TRIGGER_RADIO.PROCESS) {
      setIsDirtySynced((prev) => ({
        ...prev,
        isOpen: true,
        onSuccessCallback: () => {
          setIsDirtySynced({ isDirty: false, isOpen: false });
          onTabChange(event, newValue);
        },
      }));
      return;
    }

    onTabChange(event, newValue);
  };

  return (
    <PageLayout top={<NavTabs labels={navTabLabels} value={tabValue} onChange={onTabChangeClick} />}>
      <TabPanel value={tabValue} index={0}>
        <ContentLayout noPadding fullHeight>
          <ProcessTriggerRoot {...sharedProcessTriggerProps} />
        </ContentLayout>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <ContentLayout noPadding fullHeight>
          <ScheduledProcesses onScheduleClick={() => onTabChange(null, 0)} />
        </ContentLayout>
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <ContentLayout noPadding fullHeight>
          <EventTriggers />
        </ContentLayout>
      </TabPanel>
    </PageLayout>
  );
};

export default ProcessTrigger;
