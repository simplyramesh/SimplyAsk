import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card } from 'simplexiar_react_components';

import routes from '../../../config/routes';
import { useUser } from '../../../contexts/UserContext';
import useWindowSize from '../../../hooks/useWindowSize';
import { getAllTestSuitesNames, getTestSuiteStatistics } from '../../../Services/axios/test';
import Calendar, {
  CALENDAR_DATE_KEYS,
  CALENDAR_DIMENSION_KEYS,
} from '../../shared/Calendars/PredefinedOptionsCalendar/CalendarComponent';
import CountUpNumberAnimation from '../../shared/CountUpNumberAnimation/CountUpNumberAnimation';
import ContentLayout from '../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import Spinner from '../../shared/Spinner/Spinner';
import classes from './TestDashboard.module.css';
import { StyledCalendarIsolationWrapper } from './TestDashboard.styled';
import TestRuns from './TestRuns/TestRuns';
import CustomIndicatorArrow from '../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomSelect from '../../shared/REDISIGNED/selectMenus/CustomSelect';

const CHANGE_FILTERS_WIDTH_BREAKPOINT = {
  SMALL_SCREEN_BREAKPOINT: 1150,
  MEDIUM_SCREEN_BREAKPOINT: 1400,
};

const FILTER_TEMPLATE = {
  [CALENDAR_DATE_KEYS.START_DATE]: '',
  [CALENDAR_DATE_KEYS.END_DATE]: '',
};

const CALENDAR_DIMENSION_VALUES = {
  EXPANDED_SCREEN_WIDTH: '540px',
  EXPANDED_SCREEN_NEGATIVE_MARGIN: '-30px',
  NORMAL_SCREEN_WIDTH: '270px',
  NORMAL_SCREEN_NEGATIVE_MARGIN: '-325px',
  SMALL_SCREEN_WIDTH: '210px',
  SMALL_SCREEN_NEGATIVE_MARGIN: '-420px',
};

const API_KEYS = {
  testCase: 'testCase',
  testSuite: 'testSuite',
  total: 'total',
  success: 'success',
  fail: 'fail',
  completed: 'completed',
  ongoing: 'ongoing',
};

const StatsCard = ({
  mainTitle = '',
  completedTitle = '',
  ongoingTitle = '',
  showOrangeColor,
  showBlueColor,
  allStatsCount = 0,
  completedCount = 0,
  ongoingCount = 0,
  isFetching,
}) => {
  if (isFetching) {
    return (
      <div
        className={`${classes.colored_grid}
  ${showOrangeColor && classes.light_orange_bg}
   ${showBlueColor && classes.light_blue_bg}`}
      >
        <Spinner inline />
      </div>
    );
  }

  return (
    <div
      className={`${classes.colored_grid}
     ${showOrangeColor && classes.light_orange_bg}
      ${showBlueColor && classes.light_blue_bg}`}
    >
      <div
        className={`${classes.total_Stats}
      ${showOrangeColor && classes.orange_gradient}
      ${showBlueColor && classes.blue_gradient}`}
      >
        <div className={classes.main_title}>{mainTitle}</div>

        <CountUpNumberAnimation number={allStatsCount} className={classes.main_stats} />
      </div>

      <div className={classes.stats_body}>
        <div
          className={`${classes.success_stats_root}
           ${showOrangeColor && classes.orange_horizontal_line}
           ${showBlueColor && classes.blue_horizontal_line}`}
        >
          <div className={`${classes.stats_sub_title}`}>{ongoingTitle}</div>

          <CountUpNumberAnimation number={ongoingCount} className={classes.stats_sub_data} />
        </div>

        <div className={classes.success_stats_root}>
          <div className={`${classes.stats_sub_title}`}>{completedTitle}</div>

          <CountUpNumberAnimation number={completedCount} className={classes.stats_sub_data} />
        </div>
      </div>
    </div>
  );
};

const TestDashboard = () => {
  const { user } = useUser();
  const [filterQuery, setFilterQuery] = useState(FILTER_TEMPLATE);
  const [selectTestSuiteFilter, setSelectTestSuiteFilter] = useState();

  const { data, isFetching, error } = useQuery({
    queryKey: [
      'testSuiteStatisticsForDashBoard',
      user?.timezone,
      filterQuery[CALENDAR_DATE_KEYS.START_DATE],
      filterQuery[CALENDAR_DATE_KEYS.END_DATE],
      selectTestSuiteFilter?.value,
      filterQuery[CALENDAR_DATE_KEYS.INCLUSIVE_END_DATE],
    ],
    queryFn: () =>
      getTestSuiteStatistics(
        user?.timezone,
        filterQuery[CALENDAR_DATE_KEYS.START_DATE],
        filterQuery[CALENDAR_DATE_KEYS.END_DATE],
        selectTestSuiteFilter?.value,
        filterQuery[CALENDAR_DATE_KEYS.INCLUSIVE_END_DATE]
      ),
  });

  const { data: allTestSuites } = useQuery({
    queryKey: ['allTestSuitesNames'],
    queryFn: getAllTestSuitesNames,
  });

  const size = useWindowSize();
  const [calendarNewText1, setCalendarNewText1] = useState('');
  const [calendarNewText2, setCalendarNewText2] = useState('');
  const [selectedDateCriteria, setSelectedDateCriteria] = useState();
  const [calendarDimensions, setCalendarDimensions] = useState({
    [CALENDAR_DIMENSION_KEYS.INPUT_WIDTH]: CALENDAR_DIMENSION_VALUES.NORMAL_SCREEN_WIDTH,
    [CALENDAR_DIMENSION_KEYS.NEGATIVE_CALENDAR_MARGIN]: CALENDAR_DIMENSION_VALUES.NORMAL_SCREEN_NEGATIVE_MARGIN,
  });

  useEffect(() => {
    if (size.width < CHANGE_FILTERS_WIDTH_BREAKPOINT.SMALL_SCREEN_BREAKPOINT) {
      setCalendarDimensions({
        [CALENDAR_DIMENSION_KEYS.INPUT_WIDTH]: CALENDAR_DIMENSION_VALUES.SMALL_SCREEN_WIDTH,
        [CALENDAR_DIMENSION_KEYS.NEGATIVE_CALENDAR_MARGIN]: CALENDAR_DIMENSION_VALUES.SMALL_SCREEN_NEGATIVE_MARGIN,
        [CALENDAR_DIMENSION_KEYS.SHOW_ELLIPSIS_IN_FIRST_DATE]: true,
      });
    } else if (
      size.width < CHANGE_FILTERS_WIDTH_BREAKPOINT.MEDIUM_SCREEN_BREAKPOINT ||
      calendarNewText1.length === 0 ||
      calendarNewText2.length === 0
    ) {
      setCalendarDimensions({
        [CALENDAR_DIMENSION_KEYS.INPUT_WIDTH]: CALENDAR_DIMENSION_VALUES.NORMAL_SCREEN_WIDTH,
        [CALENDAR_DIMENSION_KEYS.NEGATIVE_CALENDAR_MARGIN]: CALENDAR_DIMENSION_VALUES.NORMAL_SCREEN_NEGATIVE_MARGIN,
        [CALENDAR_DIMENSION_KEYS.SHOW_ELLIPSIS_IN_FIRST_DATE]: true,
      });
    } else {
      setCalendarDimensions({
        [CALENDAR_DIMENSION_KEYS.INPUT_WIDTH]: CALENDAR_DIMENSION_VALUES.EXPANDED_SCREEN_WIDTH,
        [CALENDAR_DIMENSION_KEYS.NEGATIVE_CALENDAR_MARGIN]: CALENDAR_DIMENSION_VALUES.EXPANDED_SCREEN_NEGATIVE_MARGIN,
        [CALENDAR_DIMENSION_KEYS.SHOW_ELLIPSIS_IN_FIRST_DATE]: false,
      });
    }
  }, [size.width, calendarNewText1, calendarNewText2]);

  const handleTestSuiteFilterChange = (event) => {
    setSelectTestSuiteFilter(event);
  };

  const getAllTestSuitesForFilter = () => {
    return allTestSuites
      ?.filter((item) => !item.isArchived)
      .map((item) => ({
        label: item.displayName,
        value: item.testSuiteId,
      }));
  };

  if (error) {
    // return <p>Something went wrong...</p>;
  }

  return (
    <PageLayout>
      <ContentLayout>
        <Card className={classes.cardRoot}>
          <div className={classes.overviewText}>Execution History Summary</div>
          <Link to={routes.TEST_HISTORY} className={classes.openTextHistoryLink}>
            View Full Execution History
          </Link>
          <div className={classes.filters_parent}>
            <div className={classes.filters_row}>
              <div className={classes.selectLabel}>Showing</div>
              <CustomSelect
                options={getAllTestSuitesForFilter()}
                onChange={handleTestSuiteFilterChange}
                value={selectTestSuiteFilter}
                placeholder="All Active Test Suites"
                components={{
                  DropdownIndicator: CustomIndicatorArrow,
                }}
                closeMenuOnSelect
                maxHeight={30}
                menuPadding={0}
                mb={0}
                menuPlacement="auto"
                menuPortalTarget={document.body}
                withSeparator
                filter
                isSearchable={false}
                isClearable={false}
              />
            </div>

            {/* <div className={classes.filters_row}> */}
            <StyledCalendarIsolationWrapper>
              <div className={classes.selectLabel}>Timeframe</div>
              <Calendar
                setStateFunction={setFilterQuery}
                stateValue={filterQuery}
                calendarNewText1={calendarNewText1}
                setCalendarNewText1={setCalendarNewText1}
                calendarNewText2={calendarNewText2}
                setCalendarNewText2={setCalendarNewText2}
                selectedDateCriteria={selectedDateCriteria}
                setSelectedDateCriteria={setSelectedDateCriteria}
                calendarInputDisplayText="All Dates"
                inputHeight="35px"
                inputWidth={calendarDimensions[CALENDAR_DIMENSION_KEYS.INPUT_WIDTH]}
                addNegativeMarginToCalendar={calendarDimensions[CALENDAR_DIMENSION_KEYS.NEGATIVE_CALENDAR_MARGIN]}
                showEllipsisInFirstDate={calendarDimensions[CALENDAR_DIMENSION_KEYS.SHOW_ELLIPSIS_IN_FIRST_DATE]}
              />
            </StyledCalendarIsolationWrapper>
            {/* </div> */}
          </div>

          <div className={classes.cards_grid}>
            <StatsCard
              mainTitle="Total Test Suite Executions"
              completedTitle="Completed Executions"
              ongoingTitle="Ongoing Executions"
              allStatsCount={data?.[API_KEYS.testSuite]?.[API_KEYS.total]}
              completedCount={data?.[API_KEYS.testSuite]?.[API_KEYS.completed]}
              ongoingCount={data?.[API_KEYS.testSuite]?.[API_KEYS.ongoing]}
              showOrangeColor
              isFetching={isFetching}
            />

            <StatsCard
              mainTitle="Total Test Case Executions"
              completedTitle="Completed Executions"
              ongoingTitle="Ongoing Executions"
              allStatsCount={data?.[API_KEYS.testCase]?.[API_KEYS.total]}
              completedCount={data?.[API_KEYS.testCase]?.[API_KEYS.completed]}
              ongoingCount={data?.[API_KEYS.testCase]?.[API_KEYS.ongoing]}
              showBlueColor
              isFetching={isFetching}
            />
          </div>
        </Card>
        <TestRuns />
      </ContentLayout>
    </PageLayout>
  );
};

export default TestDashboard;

StatsCard.propTypes = {
  mainTitle: PropTypes.string,
  completedTitle: PropTypes.string,
  ongoingTitle: PropTypes.string,
  showOrangeColor: PropTypes.bool,
  showBlueColor: PropTypes.bool,
  allStatsCount: PropTypes.number,
  completedCount: PropTypes.number,
  ongoingCount: PropTypes.number,
  isFetching: PropTypes.bool,
};
