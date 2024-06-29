import useTabs from '../../hooks/useTabs';
import NavTabs from '../shared/NavTabs/NavTabs';
import ContentLayout from '../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../shared/REDISIGNED/layouts/PageLayout/PageLayout';

import Conversations from './Conversations';
import { CONVERSE_DASHBOARD_TABS } from './helpers';
import ServiceTickets from './ServiceTickets';

const ConverseDashboard = () => {
  const { tabValue: tab, onTabChange } = useTabs(CONVERSE_DASHBOARD_TABS.CONVERSATIONS);

  const getContent = () => {
    switch (tab) {
    case CONVERSE_DASHBOARD_TABS.CONVERSATIONS:
      return (
        <Conversations />
      );
    case CONVERSE_DASHBOARD_TABS.SERVICE_TICKETS:
      return <ServiceTickets />;
    default:
      return <div>Conversations</div>;
    }
  };

  return (
    <PageLayout
      top={(
        <NavTabs
          labels={[
            { title: 'Conversations' },
            { title: 'Service Tickets' },
          ]}
          value={tab}
          onChange={onTabChange}
        />
      )}
    >
      <ContentLayout fullHeight>
        {getContent()}
      </ContentLayout>
    </PageLayout>
  );
};

export default ConverseDashboard;
