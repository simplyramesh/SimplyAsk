import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';

import SideModalFilterContent from '../../../Settings/AccessManagement/components/modals/sideModals/SideModalFilterContent/SideModalFilterContent';
import NoDataFound, { NO_DATA_MY_SUMMARY_TEXTS } from '../../../shared/NoDataFound/NoDataFound';
import { StyledTimeline } from '../../../shared/REDISIGNED/layouts/StatusTimeline/StyledStatusTimeline';
import TableHeader from '../../../shared/REDISIGNED/table/components/TableHeader/TableHeader';
import SearchBar from '../../../shared/SearchBar/SearchBar';
import Spinner from '../../../shared/Spinner/Spinner';
import { StyledFlex, StyledText } from '../../../shared/styles/styled';
import ViewFiltersButton from '../../../shared/ViewFiltersButton/ViewFiltersButton';
import MyActivityFilters from '../component/MyActivityFilters/MyActivityFilters';

import {
  StyledActivityPart,
  StyledActivityPartTitle,
  StyledMyActivitySection,
  StyledSwitchHolder,
  StyledSwitchLabel,
} from './StyledMyActivitySection';
import { GET_ACTIVITIES_QUERY_KEY } from '../../../../hooks/activities/useGetActivities';
import { useUser } from '../../../../contexts/UserContext';
import { getInFormattedUserTimezone } from '../../../../utils/timeUtil';
import StatusTimelineItem from '../../../shared/REDISIGNED/layouts/StatusTimeline/StatusTimelineItem/StatusTimelineItem';
import moment from 'moment';
import useActivitiesColors from '../../../../hooks/activities/useActivitiesColors';
import Scrollbars from 'react-custom-scrollbars-2';
import { getActivitiesFilter } from '../../../../Services/axios/activitiesAxios';
import { useFilter } from '../../../../hooks/useFilter';
import { useTableSortAndFilter } from '../../../../hooks/useTableSortAndFilter';
import Switch from '../../../SwitchWithText/Switch';
import { StyledButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';
import { StyledStatusIcon } from '../component/ActivityLog/StyledActivityLog';
import { StyledTooltip } from '../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { useUpdateActivitiesStatus } from '../../../../hooks/activities/useUpdateActivityStatus';

export const selectedFiltersMeta = {
  key: 'sideFilter',
  formatter: {
    createdDate: ({ v, k }) => ({
      label: 'Created date',
      value: v?.label,
      k,
    }),
  },
};

export const formatter = (values) => ({
  createdAfter: values.sideFilter.createdDate?.filterValue?.createdAfter || '',
  createdBefore: values.sideFilter.createdDate?.filterValue?.createdBefore || '',
});

const ActivityVisibility = ({ activity }) => {
  const { updateActivityStatus, isLoading: isActivityStatusLoading } = useUpdateActivitiesStatus();

  return isActivityStatusLoading ? (
    <StyledFlex alignItems="flex-end" position="absolute" right="0" top="50%">
      <Spinner inline extraSmall />
    </StyledFlex>
  ) : (
    <StyledTooltip
      title={activity.isRead ? 'Open issues that have passed their due dates.' : 'Mark As Seen'}
      arrow
      placement="top"
      p="3px 25px"
      size="12px"
      lh="1.5"
      radius="25px"
      weight="500"
    >
      <StyledStatusIcon
        isNew={!activity.isRead}
        onClick={() => updateActivityStatus({ activityIds: [activity.activityId], isRead: true })}
      />
    </StyledTooltip>
  );
};

const MyActivitySection = () => {
  const { colors } = useTheme();

  const { user } = useUser();

  const activitiesColors = useActivitiesColors();

  const [isViewFiltersOpen, setIsViewFiltersOpen] = useState(false);

  const [activityData, setActivityData] = useState([]);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const { updateActivityStatus } = useUpdateActivitiesStatus();

  const filteredActivityData = unreadOnly
    ? Object.keys(activityData).reduce((acc, element) => {
        const filteredData = activityData[element].filter((activity) => !activity.isRead);

        if (filteredData.length) {
          acc[element] = filteredData;
        }

        return acc;
      }, {})
    : activityData;

  const activityIds = Object.entries(filteredActivityData)
    .map(([_, activities]) => activities)
    .flat()
    .filter((activityId) => !activityId?.isRead)
    .map((activity) => activity.activityId);

  const { sourceFilterValue, setFilterFieldValue, submitFilterValue, initialFilterValues } = useFilter({
    formikProps: {
      initialValues: {
        sideFilter: {
          createdDate: '',
        },
      },
    },
    onSubmit: ({ filterValue, selectedFilters }) => {
      setColumnFilters(filterValue);
      setSelectedFiltersBar(selectedFilters);
    },
    formatter,
    selectedFiltersMeta,
  });

  const {
    setColumnFilters,
    searchText,
    setSearchText,
    data: activities,
    isLoading,
    selectedFiltersBar,
    setSelectedFiltersBar,
  } = useTableSortAndFilter({
    queryFn: getActivitiesFilter,
    queryKey: GET_ACTIVITIES_QUERY_KEY,
    initialFilters: initialFilterValues,
    initialSorting: [
      {
        desc: true,
      },
    ],
    pageSize: 99,
  });

  useEffect(() => {
    if (activities?.content) {
      const groupedActivities = activities.content.reduce((acc, val) => {
        const createdDateFormat = getInFormattedUserTimezone(val.createdDate, user.timezone, 'LLLL d, y');

        return {
          ...acc,
          [createdDateFormat]: acc[createdDateFormat] ? [...acc[createdDateFormat], val] : [val],
        };
      }, {});

      setActivityData(groupedActivities);
    }
  }, [activities]);

  const handleConfirmFilters = () => {
    submitFilterValue();
  };

  const handleClearFilters = () => {
    console.log('handleClearFilters');
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

  const headerComponents = [
    <Box display="flex" gap="16px" key="permission-group-header-1">
      <SearchBar placeholder="Search Activity...." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
      <ViewFiltersButton onClick={() => setIsViewFiltersOpen(true)} />
    </Box>,
    <Box display="flex" alignItems="center" key="permission-group-header-2" gap="20px">
      <StyledSwitchHolder>
        <Switch
          id="unreadActivity"
          activeLabel=""
          inactiveLabel=""
          checked={unreadOnly}
          onChange={() => setUnreadOnly(!unreadOnly)}
        />
        <StyledSwitchLabel htmlFor="unreadActivity">Show Unread Activity Only</StyledSwitchLabel>
      </StyledSwitchHolder>

      <StyledFlex as="span" color={colors.information}>
        &#124;
      </StyledFlex>

      <StyledButton
        variant="text"
        onClick={() =>
          updateActivityStatus({
            activityIds,
            isRead: true,
          })
        }
        disabled={!activityIds.length}
      >
        Mark all as seen
      </StyledButton>
    </Box>,
  ];

  return (
    <StyledMyActivitySection>
      <Scrollbars>
        {filteredActivityData && (
          <>
            <SideModalFilterContent
              isModalOpen={isViewFiltersOpen}
              onModalClose={() => setIsViewFiltersOpen(false)}
              onConfirm={handleConfirmFilters}
            >
              <MyActivityFilters
                myActivityFilters={sourceFilterValue.sideFilter}
                onFilterChange={(e) => setFilterFieldValue('sideFilter', { createdDate: e })}
                onClearFilters={() => setFilterFieldValue('sideFilter', { createdDate: '' })}
              />
            </SideModalFilterContent>

            <TableHeader
              filterList={selectedFiltersBar}
              secondarySelectPlaceholder
              onClearFilters={handleClearFilters}
              enhancedHeader
              headerComponents={headerComponents}
            />

            {isLoading && <Spinner inline />}

            {!isLoading &&
              (Object.entries(filteredActivityData).length ? (
                <StyledFlex gap="24px">
                  {Object.entries(filteredActivityData).map(([date, activities]) => (
                    <StyledActivityPart key={date}>
                      <StyledActivityPartTitle>
                        <StyledText size={16} lh={20} weight={600}>
                          {date}
                        </StyledText>
                      </StyledActivityPartTitle>
                      <StyledTimeline>
                        {activities.map((activity) => (
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
                            </>
                            <ActivityVisibility activity={activity} />
                          </StatusTimelineItem>
                        ))}
                      </StyledTimeline>
                    </StyledActivityPart>
                  ))}
                </StyledFlex>
              ) : (
                emptyContent()
              ))}
          </>
        )}
      </Scrollbars>
    </StyledMyActivitySection>
  );
};

export default MyActivitySection;
