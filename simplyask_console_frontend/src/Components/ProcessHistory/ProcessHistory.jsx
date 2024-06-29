import { useNavTabsSearchParams } from '../../hooks/useTabs';
import NavTabs from '../shared/NavTabs/NavTabs';
import TabPanel from '../shared/NavTabs/TabPanel';
import ContentLayout from '../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../shared/REDISIGNED/layouts/PageLayout/PageLayout';

import IndividualExecutions from './components/IndividualExecutions/IndividualExecutions';
import BulkExecutionTable from './TableViews/BulkExecutionTable';

const NAVIGATION_LABELS = [
  { title: 'Individual Executions', value: 'individualExecutions' },
  { title: 'Execution Groups', value: 'executionGroups' },
];

const ProcessHistory = () => {
  const { tabValue, onTabChange, navTabLabels } = useNavTabsSearchParams(0, NAVIGATION_LABELS, true);

  return (
    <PageLayout top={<NavTabs labels={navTabLabels} value={tabValue} onChange={onTabChange} />}>
      <TabPanel value={tabValue} index={0}>
        <ContentLayout noPadding fullHeight>
          <IndividualExecutions />
        </ContentLayout>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <ContentLayout>
          <BulkExecutionTable />
        </ContentLayout>
      </TabPanel>
    </PageLayout>
  );
};

export default ProcessHistory;
