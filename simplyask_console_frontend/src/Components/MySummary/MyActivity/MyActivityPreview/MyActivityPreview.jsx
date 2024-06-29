import React, { useState } from 'react';

import NoDataFound, { NO_DATA_MY_SUMMARY_TEXTS } from '../../../shared/NoDataFound/NoDataFound';
import { StyledButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';
import Spinner from '../../../shared/Spinner/Spinner';
import { StyledFlex, StyledText } from '../../../shared/styles/styled';
import { SUMMARY_TABS } from '../../helpers';
import { StyledMyActivityContent, StyledMyActivityFooter, StyledMyActivityPreview } from './StyledMyActivityPreview';
import StatusTimelineItem from '../../../shared/REDISIGNED/layouts/StatusTimeline/StatusTimelineItem/StatusTimelineItem';
import { useGetActivities } from '../../../../hooks/activities/useGetActivities';
import { StyledTimeline } from '../../../shared/REDISIGNED/layouts/StatusTimeline/StyledStatusTimeline';
import { useUser } from '../../../../contexts/UserContext';
import { useTheme } from '@mui/material';
import moment from 'moment';
import useActivitiesColors from '../../../../hooks/activities/useActivitiesColors';
import { StyledStatusIcon } from '../component/ActivityLog/StyledActivityLog';
import { StyledTooltip } from '../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { useUpdateActivitiesStatus } from '../../../../hooks/activities/useUpdateActivityStatus';
import { groupBy } from '../../../../utils/helperFunctions';

const GroupedActivities = ({ activities }) => {
  const { colors } = useTheme();
  const activitiesColors = useActivitiesColors();

  const { updateActivityStatus } = useUpdateActivitiesStatus();

  const activitiesCount = activities?.length;

  const [showMore, setShowMore] = useState(false);

  const filteredActivities = showMore ? activities : activities.slice(0, 1);

  return (
    <>
      {filteredActivities.map((activity, index) => (
        <StatusTimelineItem key={activity.activityId} color={activitiesColors[activity.reason]}>
          <>
            <StyledText size={12} lh={15} weight={700} mb="4" color={colors.dustyGray}>
              {moment(activity.createdDate).fromNow()} ago
            </StyledText>
            <StyledText size={14} lh={17} weight={600} mb="4">
              {activity.activityMessageDto.header}
            </StyledText>
            <StyledText size={14} lh={17}>
              {activity.activityMessageDto.body}
            </StyledText>

            {activitiesCount > 1 && index === filteredActivities.length - 1 && (
              <StyledText mt="10">
                <StyledButton variant="text" onClick={() => setShowMore(!showMore)}>
                  {!showMore ? `Show ${activitiesCount - 1} Related Updates` : `Show less`}
                </StyledButton>
              </StyledText>
            )}
          </>

          {index === 0 && (
            <StyledTooltip
              title={activity.isRead ? 'Open issues that have passed their due dates.' : 'Mark As Seen'}
              arrow
              placement="top"
              p={activity.isRead ? '10px 42px' : '3px 25px'}
              size="12px"
              lh="1.5"
              radius={activity.isRead ? '73px' : '25px'}
              weight="500"
            >
              <StyledStatusIcon
                isNew={!activity.isRead}
                onClick={() => updateActivityStatus({ activityIds: [activity.activityId], isRead: true })}
              />
            </StyledTooltip>
          )}
        </StatusTimelineItem>
      ))}
    </>
  );
};

const MyActivityPreview = ({ switchToTab }) => {
  const DEFAULT_PAGE_SIZE = 5;
  const MAX_PAGE_SIZE = 99999;

  const { user } = useUser();

  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const { updateActivityStatus } = useUpdateActivitiesStatus();

  const { activities, isLoading } = useGetActivities({
    enabled: !!user,
    payload: {
      mentionedUserId: [user.id],
      pageSize,
      isAscending: false,
    },
  });

  const newActivities = activities?.content?.filter((activity) => !activity.isRead);
  const newActivitiesCount = newActivities?.length;

  const toggleActivityPageSize = () => {
    setPageSize((prev) => (prev === DEFAULT_PAGE_SIZE ? MAX_PAGE_SIZE : DEFAULT_PAGE_SIZE));
  };

  const emptyContent = () => {
    return (
      <NoDataFound
        title={NO_DATA_MY_SUMMARY_TEXTS.NO_DATA_MY_CURRENTLY_ACTIVITY.title}
        customStyle={{
          minHeight: '290px',
          iconSize: '66px',
          titleFontSize: '16px',
        }}
      />
    );
  };

  const groupedActivities = groupBy(newActivities, 'relatedIssueId');

  return (
    <StyledMyActivityPreview>
      <StyledFlex direction="row" justifyContent="space-between" alignItems="center" mb="38px">
        <StyledText size={19} lh={23} weight={600}>
          My Activity
        </StyledText>
        {!isLoading && (
          <StyledButton tertiary variant="contained" onClick={(event) => switchToTab(event, SUMMARY_TABS.MY_ACTIVITY)}>
            View All
          </StyledButton>
        )}
      </StyledFlex>

      <StyledMyActivityContent>
        {isLoading && <Spinner medium />}

        <StyledFlex direction="row" justifyContent="space-between" alignItems="center" mb="26px">
          <StyledFlex direction="row" gap="4px">
            <StyledText size={16} lh={20} weight={600}>
              {newActivitiesCount}
            </StyledText>
            <StyledText size={16} lh={20}>
              New Updates
            </StyledText>
          </StyledFlex>

          <StyledButton
            variant="text"
            onClick={() =>
              updateActivityStatus({
                activityIds: [newActivities?.map((activity) => activity.activityId)],
                isRead: true,
              })
            }
            disabled={!newActivitiesCount}
          >
            Mark all as seen
          </StyledButton>
        </StyledFlex>

        {newActivitiesCount ? (
          <StyledTimeline>
            {Object.entries(groupedActivities).map(([_, activities], index) => (
              <GroupedActivities key={index} activities={activities} />
            ))}
          </StyledTimeline>
        ) : (
          emptyContent()
        )}
      </StyledMyActivityContent>

      {!isLoading && newActivitiesCount > DEFAULT_PAGE_SIZE && (
        <StyledMyActivityFooter>
          <StyledButton variant="text" onClick={toggleActivityPageSize}>
            {pageSize === DEFAULT_PAGE_SIZE ? 'View Older Activity' : 'Show Latest Activitiy'}
          </StyledButton>
        </StyledMyActivityFooter>
      )}
    </StyledMyActivityPreview>
  );
};

export default MyActivityPreview;
