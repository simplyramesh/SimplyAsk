import React, { useMemo } from 'react';

import { useLocalStorage } from '../../hooks/useLocalStorage';
import Spinner from '../shared/Spinner/Spinner';
import { StyledFlex } from '../shared/styles/styled';

import ConversationsInformation from './ConversationsInformation';
import ConversationsStatistic from './ConversationsStatistic';
import useGetAvgResolutionGraph from './hooks/useGetAvgResolutionGraph';
import useGetOpenResolvedGraph from './hooks/useGetOpenResolvedGraph';
import useGetServiceDashboard from './hooks/useGetServiceDashboard';
import Overview from './Overview';
import ChartFilters from './shared/ChartFilters/ChartFilters';
import {
  CONVERSE_DASHBOARD_FILTER_TYPE_KEYS, CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS,
  FILTER_KEYS_SIDE_FILTERS_SERVICE_TICKETS, ISSUE_CATEGORY_IDS, TIME_RANGE_TYPES,
  SERVICE_TICKET_LOCAL_STORAGE_KEYS,
} from './utils/constants';
import { selectResponseData } from './utils/formatters';
import {
  getFormikFiltersInitialValues, getShowFiltersType, TIME_RANGE_PAST_DAYS_OPTIONS, TIME_RANGE_PRESENT_DAYS_OPTIONS,
} from './utils/initialValuesHelpers';

const ServiceTicketsOverviewSection = ({
  timeSelection,
  onTimeframeChange,
  filters,
  setFilters,
  filterTypes,
}) => {
  const timeRangeTab = TIME_RANGE_PAST_DAYS_OPTIONS?.find((range) => range.value === timeSelection);

  const usageParams = {
    ...(filters?.timeFrame?.filterValue ?? {}),
  };

  const { serviceTicketDashboard, isServiceTicketDashboardFetching } = useGetServiceDashboard({
    filterParams: usageParams,
    options: {
      placeholderData: [],
      select: (data) => data || [],
      enabled: !!usageParams.startTime && !!usageParams.endTime,
    },
  });

  const valueOptional = (value) => value ?? 0;

  function optionalToFixed(x) {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
    }).format(valueOptional(x));
  }

  return (
    <StyledFlex gap="30px 0">
      <ChartFilters
        filters={filters}
        setFilters={setFilters}
        timeRangeTab={timeRangeTab}
        filterTypes={filterTypes}
        onTimeframeChange={onTimeframeChange}
      />

      <StyledFlex width="-webkit-fill-available" direction="row" gap="25px">
        {!isServiceTicketDashboardFetching
          ? (
            <>
              <ConversationsInformation
                total={{ label: 'Total Service Tickets', value: optionalToFixed(serviceTicketDashboard?.serviceTicketsStats?.totalItems) }}
                voice={{ label: 'Open Tickets', value: optionalToFixed(serviceTicketDashboard?.serviceTicketsStats?.openItems) }}
                text={{ label: 'Resolved Tickets', value: optionalToFixed(serviceTicketDashboard?.serviceTicketsStats?.closedItems) }}
                average={{ label: 'Average Service Ticket Resolution Time', value: `${optionalToFixed(serviceTicketDashboard?.serviceTicketsStats?.averageResolutionTime)} hours` }}
              />
              <ConversationsInformation
                total={{ label: 'Total Ticket Tasks', value: optionalToFixed(serviceTicketDashboard?.serviceTicketTaskStats?.totalItems) }}
                voice={{ label: 'Open Ticket Tasks', value: optionalToFixed(serviceTicketDashboard?.serviceTicketTaskStats?.openItems) }}
                text={{ label: 'Resolved Tickets Tasks', value: optionalToFixed(serviceTicketDashboard?.serviceTicketTaskStats?.closedItems) }}
                average={{ label: 'Average Ticket Task Resolution Time', value: `${optionalToFixed(serviceTicketDashboard?.serviceTicketTaskStats?.averageResolutionTime)} hours` }}
              />
            </>
          )
          : (
            <StyledFlex width="-webkit-fill-available" minHeight="352px">
              <Spinner inline />
            </StyledFlex>
          )}
      </StyledFlex>
    </StyledFlex>
  );
};

const ServiceTickets = () => {
  const openCloseXDataKeys = useMemo(() => (['openItems', 'closedItems']), []);
  const durationXDataKeys = useMemo(() => (['duration']), []);

  const serviceTicketDashboardFilterTypes = useMemo(() => ({
    type: CONVERSE_DASHBOARD_FILTER_TYPE_KEYS.SERVICE_TICKET_OVERVIEW,
    main: [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.TIME_FRAME],
  }), []);

  const statisticFilterTypes = useMemo(() => ({
    type: CONVERSE_DASHBOARD_FILTER_TYPE_KEYS.SERVICE_TICKET,
    main: [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.TIME_FRAME, CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.FREQUENCY],
    settings: [
      CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.BAR_OR_LINE_GRAPH,
    ],
    sideFilters: FILTER_KEYS_SIDE_FILTERS_SERVICE_TICKETS,
  }), []);

  const statisticFilterTypesWithAverage = useMemo(() => ({
    ...statisticFilterTypes,
    settings: [
      CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.BAR_OR_LINE_GRAPH,
      CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.SHOW_MOVING_AVERAGE,
    ],
  }), []);

  const serviceTicketTaskFilterTypes = useMemo(() => ({
    type: CONVERSE_DASHBOARD_FILTER_TYPE_KEYS.SERVICE_TICKET_TASK,
    main: [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.TIME_FRAME, CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.FREQUENCY],
    settings: [
      CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.BAR_OR_LINE_GRAPH,
    ],
    sideFilters: FILTER_KEYS_SIDE_FILTERS_SERVICE_TICKETS,
  }), []);

  const serviceTicketTaskFilterTypesWithAverage = useMemo(() => ({
    ...serviceTicketTaskFilterTypes,
    settings: [
      CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.BAR_OR_LINE_GRAPH,
      CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.SHOW_MOVING_AVERAGE,
    ],
  }), []);

  const timeSelection = TIME_RANGE_PRESENT_DAYS_OPTIONS?.find((range) => range.value === TIME_RANGE_TYPES.TODAY);

  const initialChartFilterValues = (filterTypes) => getFormikFiltersInitialValues(getShowFiltersType(filterTypes), '', timeSelection);

  const [serviceTicketDashboardFilters, setServiceTicketDashboardFilters] = useLocalStorage(
    SERVICE_TICKET_LOCAL_STORAGE_KEYS.SERVICE_TICKET_DASHBOARD,
    initialChartFilterValues(serviceTicketDashboardFilterTypes),
  );
  const [openResolvedTicketsFilters] = useLocalStorage(
    SERVICE_TICKET_LOCAL_STORAGE_KEYS.OPEN_AND_RESOLVED,
    initialChartFilterValues(statisticFilterTypes),
  );
  const [averageTicketResolutionTimeFilters] = useLocalStorage(
    SERVICE_TICKET_LOCAL_STORAGE_KEYS.AVG_TICKET_RESOLUTION_TIME,
    initialChartFilterValues(statisticFilterTypesWithAverage),
  );
  const [openResolvedTicketTasksFilters] = useLocalStorage(
    SERVICE_TICKET_LOCAL_STORAGE_KEYS.OPEN_AND_RESOLVED_TASKS,
    initialChartFilterValues(serviceTicketTaskFilterTypes),
  );
  const [averageTicketTaskResolutionTimeFilters] = useLocalStorage(
    SERVICE_TICKET_LOCAL_STORAGE_KEYS.AVG_TICKET_TASK_AND_RESOLUTION_TIME,
    initialChartFilterValues(serviceTicketTaskFilterTypesWithAverage),
  );

  const { openResolved, isOpenResolvedFetching } = useGetOpenResolvedGraph({
    filterParams: {
      ...(openResolvedTicketsFilters?.timeFrame?.filterValue ?? {}),
      categoryId: ISSUE_CATEGORY_IDS[CONVERSE_DASHBOARD_FILTER_TYPE_KEYS.SERVICE_TICKET],
      channel: openResolvedTicketsFilters?.channels?.value ?? 'CHAT',

      ...(openResolvedTicketsFilters?.assignedAgents?.value?.length && {
        agentIds: openResolvedTicketsFilters?.assignedAgents?.value?.map((agent) => agent.value).join(','),
      }),

      ...(openResolvedTicketsFilters?.ivaAgentTags?.value?.length && {
        tags: openResolvedTicketsFilters?.ivaAgentTags?.value?.map((tag) => tag.value).join(','),
      }),
    },
    options: {
      placeholderData: [],
      select: (data) => selectResponseData({
        data,
        xDataKeys: ['openItems', 'closedItems'],
        filterTypes: statisticFilterTypes,
        filters: openResolvedTicketsFilters,
      }) || [],
      enabled: !!openResolvedTicketsFilters?.timeFrame,
    },
  });

  const { avgResolutions, isAvgResolutionsFetching } = useGetAvgResolutionGraph({
    filterParams: {
      ...(averageTicketResolutionTimeFilters?.timeFrame?.filterValue ?? {}),
      categoryId: ISSUE_CATEGORY_IDS[CONVERSE_DASHBOARD_FILTER_TYPE_KEYS.SERVICE_TICKET],
      channel: averageTicketResolutionTimeFilters?.channels?.value ?? 'CHAT',

      ...(averageTicketResolutionTimeFilters?.assignedAgents?.value?.length && {
        agentIds: averageTicketResolutionTimeFilters?.assignedAgents?.value?.map((agent) => agent.value).join(','),
      }),

      ...(averageTicketResolutionTimeFilters?.ivaAgentTags?.value?.length && {
        tags: averageTicketResolutionTimeFilters?.ivaAgentTags?.value?.map((tag) => tag.value).join(','),
      }),
    },
    options: {
      placeholderData: [],
      select: (data) => selectResponseData({
        data,
        xDataKeys: ['duration'],
        filterTypes: statisticFilterTypesWithAverage,
        filters: averageTicketResolutionTimeFilters,
      }) || [],
      enabled: !!averageTicketResolutionTimeFilters?.timeFrame,
    },
  });

  const { openResolved: openResolvedTasks, isOpenResolvedFetching: isOpenResolvedTasksFetching } = useGetOpenResolvedGraph({
    filterParams: {
      ...(openResolvedTicketTasksFilters?.timeFrame?.filterValue ?? {}),
      categoryId: ISSUE_CATEGORY_IDS[CONVERSE_DASHBOARD_FILTER_TYPE_KEYS.SERVICE_TICKET_TASK],
      channel: openResolvedTicketTasksFilters?.channels?.value ?? 'CHAT',

      ...(openResolvedTicketTasksFilters?.assignedAgents?.value?.length && {
        agentIds: openResolvedTicketTasksFilters?.assignedAgents?.value?.map((agent) => agent.value).join(','),
      }),

      ...(openResolvedTicketTasksFilters?.ivaAgentTags?.value?.length && {
        tags: openResolvedTicketTasksFilters?.ivaAgentTags?.value?.map((tag) => tag.value).join(','),
      }),
    },
    options: {
      placeholderData: [],
      select: (data) => selectResponseData({
        data,
        xDataKeys: ['openItems', 'closedItems'],
        filterTypes: serviceTicketTaskFilterTypes,
        filters: openResolvedTicketTasksFilters,
      }) || [],
      enabled: !!openResolvedTicketTasksFilters?.timeFrame,
    },
  });

  const { avgResolutions: avgResolutionsTasks, isAvgResolutionsFetching: isAvgResolutionsTasksFetching } = useGetAvgResolutionGraph({
    filterParams: {
      ...(averageTicketTaskResolutionTimeFilters?.timeFrame?.filterValue ?? {}),
      categoryId: ISSUE_CATEGORY_IDS[CONVERSE_DASHBOARD_FILTER_TYPE_KEYS.SERVICE_TICKET_TASK],
      channel: averageTicketTaskResolutionTimeFilters?.channels?.value ?? 'CHAT',

      ...(averageTicketTaskResolutionTimeFilters?.assignedAgents?.value?.length && {
        agentIds: averageTicketTaskResolutionTimeFilters?.assignedAgents?.value?.map((agent) => agent.value).join(','),
      }),

      ...(averageTicketTaskResolutionTimeFilters?.ivaAgentTags?.value?.length && {
        tags: averageTicketTaskResolutionTimeFilters?.ivaAgentTags?.value?.map((tag) => tag.value).join(','),
      }),
    },
    options: {
      placeholderData: [],
      select: (data) => selectResponseData({
        data,
        xDataKeys: ['duration'],
        filterTypes: statisticFilterTypesWithAverage,
        filters: averageTicketTaskResolutionTimeFilters,
      }) || [],
      enabled: !!averageTicketTaskResolutionTimeFilters?.timeFrame,
    },
  });

  return (
    <StyledFlex gap="30px">
      <Overview
        label="Service Tickets Overview"
        ConversationSection={ServiceTicketsOverviewSection}
        timeRangeTab={timeSelection}
        filters={serviceTicketDashboardFilters}
        setFilters={setServiceTicketDashboardFilters}
        filterTypes={serviceTicketDashboardFilterTypes}
      />
      <ConversationsStatistic
        xDataKeys={openCloseXDataKeys}
        chartData={openResolved}
        isChartDataFetching={isOpenResolvedFetching}
        filterTypes={statisticFilterTypes}
        title="Open & Resolved Tickets"
        yLabel="Number of Tickets"
        initialSavedFilter={openResolvedTicketsFilters}
      />
      <ConversationsStatistic
        xDataKeys={durationXDataKeys}
        chartData={avgResolutions}
        isChartDataFetching={isAvgResolutionsFetching}
        filterTypes={statisticFilterTypesWithAverage}
        title="Average Ticket Resolution Time"
        withAverage
        yLabel="Resolution Time (Hours)"
        initialSavedFilter={averageTicketResolutionTimeFilters}
      />
      <ConversationsStatistic
        xDataKeys={openCloseXDataKeys}
        chartData={openResolvedTasks}
        isChartDataFetching={isOpenResolvedTasksFetching}
        filterTypes={serviceTicketTaskFilterTypes}
        title="Open & Resolved Ticket Tasks"
        yLabel="Number of Ticket Tasks"
        initialSavedFilter={openResolvedTicketTasksFilters}
      />
      <ConversationsStatistic
        xDataKeys={durationXDataKeys}
        chartData={avgResolutionsTasks}
        isChartDataFetching={isAvgResolutionsTasksFetching}
        filterTypes={serviceTicketTaskFilterTypesWithAverage}
        title="Average Ticket Task Resolution Time"
        withAverage
        yLabel="Resolution Time (Hours)"
        initialSavedFilter={averageTicketTaskResolutionTimeFilters}
      />
    </StyledFlex>
  );
};

export default ServiceTickets;
