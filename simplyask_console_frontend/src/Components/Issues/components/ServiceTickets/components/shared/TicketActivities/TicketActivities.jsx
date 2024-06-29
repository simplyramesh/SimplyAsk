import { Skeleton, ToggleButtonGroup } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import moment from 'moment/moment';
import { useEffect, useState } from 'react';

import { useUser } from '../../../../../../../contexts/UserContext';
import useActivitiesColors from '../../../../../../../hooks/activities/useActivitiesColors';
import { useCreateActivity } from '../../../../../../../hooks/activities/useCreateActivitiy';
import { useDeleteActivity } from '../../../../../../../hooks/activities/useDeleteActivity';
import { useGetActivities } from '../../../../../../../hooks/activities/useGetActivities';
import { useUpdateActivity } from '../../../../../../../hooks/activities/useUpdateActivity';
import BaseTextInput from '../../../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import StatusTimelineItem from '../../../../../../shared/REDISIGNED/layouts/StatusTimeline/StatusTimelineItem/StatusTimelineItem';
import { StyledTimeline } from '../../../../../../shared/REDISIGNED/layouts/StatusTimeline/StyledStatusTimeline';
import ConfirmationModal from '../../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import CustomIndicatorArrow from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomCheckboxOption from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/options/CustomCheckboxOption';
import CustomSelect from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledFlex, StyledText, StyledToggleButton } from '../../../../../../shared/styles/styled';
import { ISSUE_ACTIVITY_TYPE, ISSUE_CATEGORY_ID } from '../../../../../constants/core';
import ServiceTicketsEmptySectionDetail from '../ServiceTicketsEmptySectionDetail/ServiceTicketsEmptySectionDetail';

const ACTIVITIES_CAP = 5;
const ACTIVITIES_MAX_CAP = 9999;

const FALLOUT_TICKET_ACTIVITY_FILTERS = [
  {
    label: 'Ticket History',
    value: 'SERVICE_TICKET_HISTORY',
    categoryId: ISSUE_CATEGORY_ID.SERVICE_TICKET,
    type: ISSUE_ACTIVITY_TYPE.HISTORY,
  },
  {
    label: 'Ticket Comments',
    value: 'SERVICE_TICKET_COMMENT',
    categoryId: ISSUE_CATEGORY_ID.SERVICE_TICKET,
    type: ISSUE_ACTIVITY_TYPE.COMMENT,
  },
];

const SERVICE_TICKET_ACTIVITY_FILTERS = [
  ...FALLOUT_TICKET_ACTIVITY_FILTERS,
  {
    label: 'Task History',
    value: 'SERVICE_TICKET_TASK_HISTORY',
    categoryId: ISSUE_CATEGORY_ID.SERVICE_TICKET_TASK,
    type: ISSUE_ACTIVITY_TYPE.HISTORY,
  },
  {
    label: 'Task Comments',
    value: 'SERVICE_TICKET_TASK_COMMENT',
    categoryId: ISSUE_CATEGORY_ID.SERVICE_TICKET_TASK,
    type: ISSUE_ACTIVITY_TYPE.COMMENT,
  },
];

const ServiceTicketActivities = ({ ticketId, titleSize = 16, isFalloutTicketMode = false }) => {
  const { colors } = useTheme();
  const activitiesColors = useActivitiesColors();

  const [showCreateActivityActions, setShowCreateActivityActions] = useState(false);
  const [commentValue, setCommentValue] = useState('');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isExpanded, setIsExpanded] = useState(false);
  const [pageSize, setPageSize] = useState(ACTIVITIES_CAP);
  const [deleteActivityId, setDeleteActivityId] = useState();
  const [updateActivityId, setUpdateActivityId] = useState();
  const [isDeleting, setIsDeleting] = useState(false);
  const [activityType, setActivityType] = useState([]);
  const [activityTypeFilter, setActivityTypeFilter] = useState();
  const [activityTypeCategoryId, setActivityTypeCategoryId] = useState('');
  const { createCommentActivity, isFalloutLoading: isCommentCreating } = useCreateActivity();

  const activityTypes = isFalloutTicketMode ? FALLOUT_TICKET_ACTIVITY_FILTERS : SERVICE_TICKET_ACTIVITY_FILTERS;

  const { activities, isLoading } = useGetActivities({
    enabled: !!ticketId,
    payload: {
      relatedIssueId: ticketId,
      pageSize,
      isAscending: sortDirection === 'asc',
      type: activityTypeFilter,
      categoryId: activityTypeCategoryId,
    },
  });

  const { updateActivityAsync } = useUpdateActivity();
  const { deleteActivityAsync } = useDeleteActivity();

  const { user } = useUser();

  useEffect(() => {
    setPageSize(isExpanded ? ACTIVITIES_MAX_CAP : ACTIVITIES_CAP);
  }, [isExpanded]);

  useEffect(() => {
    if (activityType?.length === 1) {
      setActivityTypeFilter(activityType[0].type);
      setActivityTypeCategoryId(activityType[0].categoryId);
    } else {
      setActivityTypeFilter(null);
      setActivityTypeCategoryId('');
    }
  }, [activityType]);

  const createComment = () => {
    createCommentActivity(ticketId, commentValue, user.id);
    setCommentValue('');
    setShowCreateActivityActions(false);
  };

  const deleteActivity = async (id) => {
    await deleteActivityAsync(id);

    setIsDeleting(false);
  };

  const updateActivity = async (params) => {
    await updateActivityAsync(params);

    setUpdateActivityId(null);
  };

  const ActivitiesLoading = () => (
    <StyledFlex gap={2} maxWidth="620px">
      {[...Array(5)].map((item, index) => (
        <Skeleton key={index} variant="rounded" height={90} index={index} />
      ))}
    </StyledFlex>
  );

  const renderActivity = () =>
    activities.content.length > 0 ? (
      <StyledTimeline>
        {activities.content.map((activity) => (
          <StatusTimelineItem
            key={activity.activityId}
            color={activitiesColors[activity.reason]}
            editable={activity.type === 'COMMENT'}
            value={activity.activityMessageDto.body}
            onChange={(comment) => {
              setUpdateActivityId(activity.activityId);
              updateActivity({ id: activity.activityId, payload: { newValue: comment } });
            }}
            onDelete={() => setDeleteActivityId(activity.activityId)}
          >
            {updateActivityId === activity.activityId ? (
              <Skeleton variant="rounded" height={90} />
            ) : (
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
              </>
            )}
          </StatusTimelineItem>
        ))}
      </StyledTimeline>
    ) : (
      <ServiceTicketsEmptySectionDetail title="There Is No Activity" />
    );

  return (
    <>
      <StyledFlex>
        <StyledFlex mb={3} direction="row" justifyContent="space-between" alignItems="center">
          <StyledText size={titleSize} lh="150%" weight={600}>
            Activity
          </StyledText>
          <StyledFlex gap={1} direction="row" alignItems="center">
            <StyledText size={14} weight={600}>
              Show:
            </StyledText>
            <StyledFlex width="300px">
              <CustomSelect
                name="activityType"
                options={activityTypes}
                value={activityType}
                onChange={(e) => setActivityType(e)}
                placeholder="All Activity"
                components={{
                  DropdownIndicator: CustomIndicatorArrow,
                  Option: CustomCheckboxOption,
                }}
                getOptionLabel={(option) => option?.label}
                getOptionValue={(option) => option?.value}
                isSearchable={false}
                isMulti
                mb={0}
                hideSelectedOptions={false}
                minWidth="200px"
              />
            </StyledFlex>
          </StyledFlex>
        </StyledFlex>
        <StyledFlex mb={2}>
          <BaseTextInput
            placeholder="Leave a comment..."
            onFocus={() => setShowCreateActivityActions(true)}
            value={commentValue}
            onChange={(e) => setCommentValue(e.target.value)}
          />
          {showCreateActivityActions && (
            <StyledFlex alignSelf="flex-end" direction="row" gap={2} mt={1.5}>
              <StyledButton
                size="medium"
                variant="contained"
                tertiary
                onClick={() => {
                  setCommentValue('');
                  setShowCreateActivityActions(false);
                }}
              >
                Cancel
              </StyledButton>
              <StyledButton
                size="medium"
                secondary
                variant="contained"
                disabled={commentValue.length === 0}
                onClick={createComment}
              >
                Save
              </StyledButton>
            </StyledFlex>
          )}
        </StyledFlex>
        <StyledFlex>
          <StyledFlex mb={2}>
            <StyledText size={14} weight={500}>
              {activities?.totalElements} Activities Found
            </StyledText>
          </StyledFlex>

          {activities?.content.length > 0 && (
            <StyledFlex direction="row" alignItems="center" gap={1.5} mb={2}>
              <StyledText size={14} weight={600}>
                Sort By:
              </StyledText>
              <ToggleButtonGroup
                exclusive
                value={sortDirection}
                size="small"
                onChange={(event, value) => setSortDirection(value)}
              >
                <StyledToggleButton disableRipple value="desc">
                  Newest
                </StyledToggleButton>
                <StyledToggleButton disableRipple value="asc">
                  Oldest
                </StyledToggleButton>
              </ToggleButtonGroup>
            </StyledFlex>
          )}

          {isLoading || isCommentCreating || isDeleting ? (
            <ActivitiesLoading />
          ) : (
            activities?.content && renderActivity()
          )}
          {activities?.totalElements > ACTIVITIES_CAP && (
            <StyledFlex alignItems="flex-start" mt={2}>
              <StyledButton variant="text" onClick={() => setIsExpanded((prev) => !prev)}>
                {isExpanded ? 'Show Less' : 'Show All Remaining Activity'}
              </StyledButton>
            </StyledFlex>
          )}
        </StyledFlex>
      </StyledFlex>

      <ConfirmationModal
        isOpen={!!deleteActivityId}
        successBtnText="Delete"
        alertType="WARNING"
        title="Are You Sure?"
        text="You are about to delete a comment."
        onCloseModal={() => setDeleteActivityId(null)}
        onSuccessClick={() => {
          setIsDeleting(true);
          setDeleteActivityId(null);
          deleteActivity(deleteActivityId);
        }}
      />
    </>
  );
};

export default ServiceTicketActivities;
