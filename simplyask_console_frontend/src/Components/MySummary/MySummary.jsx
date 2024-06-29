import useTabs from '../../hooks/useTabs';
import NavTabs from '../shared/NavTabs/NavTabs';
import ContentLayout from '../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import { SUMMARY_TABS } from './helpers';
import MyActivitySection from './MyActivity/MyActivitySection/MyActivitySection';
import MyIssues from './MyIssues/MyIssues';
import Overview from './Overview/Overview';
import { StyledMySummaryContent } from './StyledMySummary';

const MySummary = () => {
  const { tabValue: tab, onTabChange } = useTabs(SUMMARY_TABS.OVERVIEW);

  const getContent = () => {
    switch (tab) {
    case SUMMARY_TABS.OVERVIEW:
      return (
        <Overview
          channel="overview"
          switchToTab={onTabChange}
        />
      );
    case SUMMARY_TABS.MY_ISSUES:
      return <MyIssues />;
    case SUMMARY_TABS.MY_ACTIVITY:
      return <MyActivitySection />;
    default:
      return <Overview channel="overview" />;
    }
  };

  return (
    <PageLayout
      top={(
        <NavTabs
          labels={[
            { title: 'Overview' },
            { title: 'My Issues' },
            { title: 'My Activity' },
          ]}
          value={tab}
          onChange={onTabChange}
        />
      )}
    >
      <ContentLayout fullHeight>
        <StyledMySummaryContent>
          {getContent()}
        </StyledMySummaryContent>
      </ContentLayout>
    </PageLayout>
  );
};

export default MySummary;
