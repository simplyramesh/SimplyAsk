import React from 'react';

import { StyledFlex } from '../../shared/styles/styled';
import MyIssuesList from './component/MyIssuesList/MyIssuesList';
import MyIssuesStats from './component/MyIssuesStats/MyIssuesStats';

const MyIssues = () => {
  return (
    <StyledFlex
      width="100%"
      direction="column"
      gap="36px"
      pb="40px"
    >
      <MyIssuesStats />
      <MyIssuesList />
    </StyledFlex>
  );
};

export default MyIssues;
