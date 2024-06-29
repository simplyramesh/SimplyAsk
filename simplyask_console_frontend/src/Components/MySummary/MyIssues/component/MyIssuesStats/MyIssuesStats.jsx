import PropTypes from 'prop-types';
import React from 'react';

import StatsCardCalendar from '../../../../../Assets/icons/statsCardCalendar.svg?component';
import StatsCardClock from '../../../../../Assets/icons/statsCardClock.svg?component';
import StatsCardTotal from '../../../../../Assets/icons/statsCardTotal.svg?component';
import StatsCardWarning from '../../../../../Assets/icons/statsCardWarning.svg?component';
import { StyledFlex } from '../../../../shared/styles/styled';
import StatsCard from '../StatsCard/StatsCard';
import { useIssuesStatus } from '../../../../../hooks/issue/useIssuesStatus';
const MyIssuesStats = ({ gap }) => {
  const { issuesStats, isFetching } = useIssuesStatus();

  const { dueToday, newlyAssigned, openIssues, overDue } = issuesStats || {};

  const dataCards = [
    {
      title: 'Total Issues',
      Icon: StatsCardTotal,
      count: openIssues,
      tooltip: 'Your active issues. This number includes overdue issues.',
    },
    {
      title: 'Newly Assigned',
      Icon: StatsCardClock,
      count: newlyAssigned,
      tooltip: 'Issues assigned to you in the last 24 hours.',
    },
    {
      title: 'Issues Due Today',
      Icon: StatsCardCalendar,
      count: dueToday,
      tooltip: 'Open issues that are due on today’s date.',
    },
    {
      title: 'Overdue Open Issues',
      Icon: StatsCardWarning,
      count: overDue,
      tooltip: 'Open issues that have passed their due dates.',
    },
  ];

  return (
    <StyledFlex direction="row" gap={gap || '30px'}>
      {dataCards.map((card, index) => (
        <StatsCard {...card} isLoading={isFetching} key={index} />
      ))}
    </StyledFlex>
  );
};

export default MyIssuesStats;

MyIssuesStats.propTypes = {
  gap: PropTypes.string,
};
