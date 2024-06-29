import { useTheme } from '@emotion/react';
import PropTypes from 'prop-types';
import React from 'react';

import { useGetCurrentUser } from '../../../hooks/useGetCurrentUser';
import { StyledText } from '../../shared/styles/styled';
import MyActivityPreview from '../MyActivity/MyActivityPreview/MyActivityPreview';
import MyIssuesPreview from '../MyIssues/component/MyIssuesPreview/MyIssuesPreview';
import ShortcutsSection from '../MyShortcuts/ShortcutsSection/ShortcutsSection';
import SimplyAskInsights from '../SimplyAskInsights/SimplyAskInsights';
import {
  StyledOverviewGrid,
  StyledOverviewHeader,
  StyledOverviewNarrow,
  StyledOverviewWelcome,
  StyledOverviewWide,
} from './StyledOverview';

const Overview = ({ switchToTab }) => {
  const { colors } = useTheme();
  const { currentUser } = useGetCurrentUser();

  return (
    <>
      <StyledOverviewWelcome>
        <StyledOverviewHeader>
          <StyledText size={30} weight={600} color={colors.symphonaBlue}>
            Welcome Back,
          </StyledText>
          <StyledText size={30}>{currentUser?.fullname}</StyledText>
        </StyledOverviewHeader>

        {/* <StyledText size={19}>
          There are
          <StyledText as="span" display="inline" size={19} weight={700} p="0 4px">{activityCount}</StyledText>
          new activity updates since you last viewed My Summary
        </StyledText> */}
      </StyledOverviewWelcome>

      <StyledOverviewGrid>
        <StyledOverviewWide>
          <MyActivityPreview switchToTab={switchToTab} />
          <MyIssuesPreview switchToTab={switchToTab} />
        </StyledOverviewWide>
        <StyledOverviewNarrow>
          <SimplyAskInsights />
          <ShortcutsSection />
        </StyledOverviewNarrow>
      </StyledOverviewGrid>
    </>
  );
};

export default Overview;

Overview.propTypes = {
  switchToTab: PropTypes.func,
};
