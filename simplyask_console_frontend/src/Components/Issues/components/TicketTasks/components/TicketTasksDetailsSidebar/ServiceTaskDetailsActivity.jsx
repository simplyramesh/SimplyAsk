import { useTheme } from '@mui/material/styles';
import { useRef, useState } from 'react';

import { useUser } from '../../../../../../contexts/UserContext';
import { useCreateActivity } from '../../../../../../hooks/activities/useCreateActivitiy';
import { useGetActivities } from '../../../../../../hooks/activities/useGetActivities';
import { getFormattedTimeToNow } from '../../../../../../utils/timeUtil';
import ArrowDownCircleIcon from '../../../../../shared/REDISIGNED/icons/svgIcons/ArrowDownCircleIcon';
import StatusTimeline from '../../../../../shared/REDISIGNED/layouts/StatusTimeline/StatusTimeline';
import StatusTimelineItem from '../../../../../shared/REDISIGNED/layouts/StatusTimeline/StatusTimelineItem/StatusTimelineItem';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { StyledAddActivityInput } from '../../../FalloutTickets/styled';

const STATUS_CONSTANTS = {
  UNASSIGNED: 'UNASSIGNED',
  ASSIGNED: 'ASSIGNED',
  RESOLVED: 'RESOLVED',
  UNRESOLVED: 'UNRESOLVED',
  CREATED: 'CREATED',
  COMMENT: 'COMMENT',
  ACTION_PERFORMED: 'ACTION_PERFORMED',
};

export const serviceStatusColors = (statusColors) => ({
  [STATUS_CONSTANTS.UNASSIGNED]: statusColors.blue,
  [STATUS_CONSTANTS.ASSIGNED]: statusColors.yellow,
  [STATUS_CONSTANTS.UNRESOLVED]: statusColors.red,
  [STATUS_CONSTANTS.RESOLVED]: statusColors.green,
});

const ServiceTaskDetailsActivity = ({ issueTask }) => {
  const { colors, statusColors } = useTheme();

  const { user } = useUser();

  const [commentInput, setCommentInput] = useState('');

  const activityInputRef = useRef(null);

  const { activities } = useGetActivities({
    enabled: !!issueTask?.id,
    payload: {
      relatedIssueId: issueTask?.id,
      pageSize: 99,
      isAscending: false,
    },
  });

  const { createCommentActivity } = useCreateActivity();

  const statusTimelineColors = {
    ...serviceStatusColors(statusColors),
    [STATUS_CONSTANTS.CREATED]: { color: colors.secondary },
    [STATUS_CONSTANTS.COMMENT]: colors.primary,
    [STATUS_CONSTANTS.ACTION_PERFORMED]: colors.primary,
    DEFAULT: { color: colors.primary },
  };

  return (
    <>
      <StyledFlex direction="row" mb="10px" alignItems="center" justifyContent="space-between">
        <StyledText as="span" weight={600} size={19} lh={24}>
          Activity
        </StyledText>
      </StyledFlex>
      <StyledFlex
        direction="row"
        alignItems="center"
        bgcolor={colors.paleAsh}
        width="427px"
        borderRadius="15px"
        border={`1px solid ${colors.tertiary}`}
        gap="0 13px"
        height="33px"
        p="0 14px"
        mb="23px"
        mt="24px"
        cursor="pointer"
        onClick={() => activityInputRef?.current?.focus()}
      >
        <StyledFlex as="span" fontSize="22px" color={colors.primary}>
          <ArrowDownCircleIcon fontSize="inherit" />
        </StyledFlex>
        <StyledAddActivityInput
          placeholder="Add a comment..."
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              createCommentActivity(issueTask?.id, commentInput, user.id);
              setCommentInput('');
            }
          }}
          onBlur={() => setCommentInput('')}
          inputRef={activityInputRef}
        />
      </StyledFlex>
      <StatusTimeline>
        {activities?.content?.map((activity, index) => (
          <StatusTimelineItem
            key={index}
            color={statusTimelineColors?.[activity?.reason]?.color || statusTimelineColors.DEFAULT.color}
          >
            <StyledFlex gap="4px 0">
              <StyledText size={12} lh={15} weight={700} color={colors.dustyGray}>
                {activity?.createdDate ? getFormattedTimeToNow(activity?.createdDate, user?.timezone) : ''}
              </StyledText>
              <StyledText size={14} lh={17} weight={600}>
                {activity?.activityMessageDto?.header}
              </StyledText>
              <StyledFlex>
                <StyledText size={14} lh={17} weight={400}>
                  {activity?.activityMessageDto?.body}
                </StyledText>
              </StyledFlex>
            </StyledFlex>
          </StatusTimelineItem>
        ))}
      </StatusTimeline>
    </>
  );
};

export default ServiceTaskDetailsActivity;
