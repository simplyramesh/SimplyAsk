import React, { useMemo } from 'react';

import { useLocalStorage } from '../../hooks/useLocalStorage';
import Spinner from '../shared/Spinner/Spinner';
import { StyledFlex } from '../shared/styles/styled';

import ConversationsInformation from './ConversationsInformation';
import ConversationsStatistic from './ConversationsStatistic';
import useGetAvgConversationsGraph from './hooks/useGetAvgConversationsGraph';
import useGetConversationDashboard from './hooks/useGetConversationDashboard';
import useGetConversationsGraph from './hooks/useGetConversationsGraph';
import useGetTransferredConversationsGraph from './hooks/useGetTransferredConversationsGraph';
import Overview from './Overview';
import ChartFilters from './shared/ChartFilters/ChartFilters';
import {
  CONVERSATIONS_LEGEND_LABELS,
  CONVERSATIONS_LOCAL_STORAGE_KEYS,
  CONVERSE_DASHBOARD_FILTER_TYPE_KEYS,
  CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS,
  FILTER_KEYS_SIDE_FILTERS_CONVERSATIONAL,
  NUMBER_OR_PERCENTAGE_GRAPH_TYPES,
  TIME_RANGE_TYPES,
} from './utils/constants';
import { selectResponseData } from './utils/formatters';
import {
  getFormikFiltersInitialValues,
  getShowFiltersType,
  TIME_RANGE_PAST_DAYS_OPTIONS,
  TIME_RANGE_PRESENT_DAYS_OPTIONS,
} from './utils/initialValuesHelpers';
import { convertSecondsToHours } from './utils/timeUtil';

const ConversationOverviewSection = ({ timeSelection, onTimeframeChange, filters, setFilters, filterTypes }) => {
  const timeRangeTab = TIME_RANGE_PAST_DAYS_OPTIONS?.find((range) => range.value === timeSelection);

  const usageParams = {
    ...(filters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.TIME_FRAME]?.filterValue ?? {}),
  };

  const { conversationsDashboard, isConversationsDashboardFetching } = useGetConversationDashboard({
    filterParams: usageParams,
    options: {
      placeholderData: [],
      select: (data) => data || [],
      enabled: !!usageParams.startTime && !!usageParams.endTime,
    },
  });

  const total = (firstStep, secondStep) => (firstStep ?? 0) + (secondStep ?? 0);

  const valueOptional = (value) => value ?? 0;

  return (
    <StyledFlex gap="30px 0">
      <StyledFlex>
        <ChartFilters
          filters={filters}
          setFilters={setFilters}
          timeRangeTab={timeRangeTab}
          filterTypes={filterTypes}
          onTimeframeChange={onTimeframeChange}
        />
      </StyledFlex>

      <StyledFlex width="-webkit-fill-available" direction="row" gap="25px">
        {!isConversationsDashboardFetching ? (
          <>
            <ConversationsInformation
              total={{
                label: 'Total Conversations',
                value: total(
                  conversationsDashboard?.voiceData?.totalItems,
                  conversationsDashboard?.chatData?.totalItems
                ),
              }}
              average={{
                label: 'Average Voice Conversation Length',
                value: convertSecondsToHours(conversationsDashboard?.voiceData?.averageConversationLength),
              }}
              voice={{
                label: 'Voice Channel (Conversations)',
                value: valueOptional(conversationsDashboard?.voiceData?.totalItems),
              }}
              text={{
                label: 'Text Channel (Conversations)',
                value: valueOptional(conversationsDashboard?.chatData?.totalItems),
              }}
            />
            <ConversationsInformation
              total={{
                label: 'Total Transferred Conversations',
                value: total(
                  conversationsDashboard?.voiceData?.transferredItems,
                  conversationsDashboard?.chatData?.transferredItems
                ),
              }}
              average={{
                label: 'Average Text Conversation Length',
                value: `${valueOptional(conversationsDashboard?.chatData?.averageConversationLength)} messages`,
              }}
              voice={{
                label: 'Voice Channel (Transferred Conversations)',
                value: valueOptional(conversationsDashboard?.voiceData?.transferredItems),
              }}
              text={{
                label: 'Text Channel (Transferred Conversations)',
                value: valueOptional(conversationsDashboard?.chatData?.transferredItems),
              }}
            />
          </>
        ) : (
          <StyledFlex width="-webkit-fill-available" minHeight="352px">
            <Spinner inline />
          </StyledFlex>
        )}
      </StyledFlex>
    </StyledFlex>
  );
};

const Conversations = () => {
  const xDataKeys = useMemo(() => ['duration'], []);

  const dashboardFilterTypes = useMemo(
    () => ({
      type: CONVERSE_DASHBOARD_FILTER_TYPE_KEYS.CONVERSATIONAL,
      main: [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.TIME_FRAME],
    }),
    []
  );

  const statisticFilterTypes = useMemo(
    () => ({
      type: CONVERSE_DASHBOARD_FILTER_TYPE_KEYS.CONVERSATIONAL,
      main: [
        CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.TIME_FRAME,
        CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.FREQUENCY,
      ],
      settings: [
        CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.BAR_OR_LINE_GRAPH,
        CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.SHOW_INDIVIDUAL_CHANNEL_POSITION_1,
        CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.CHANNELS,
      ],
      sideFilters: FILTER_KEYS_SIDE_FILTERS_CONVERSATIONAL,
    }),
    []
  );

  const statisticFilterTypesWithAverage = useMemo(
    () => ({
      ...statisticFilterTypes,
      settings: [
        CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.BAR_OR_LINE_GRAPH,
        CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.CHANNELS,
        CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.SHOW_MOVING_AVERAGE,
        CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.SHOW_INDIVIDUAL_CHANNEL_POSITION_2
      ],
    }),
    []
  );

  const transferredFilters = useMemo(
    () => ({
      ...statisticFilterTypesWithAverage,
      settings: [
        CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.NUMBER_OR_PERCENTAGE_GRAPH,
        CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.BAR_OR_LINE_GRAPH,
        CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.CHANNELS,
        CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.SHOW_MOVING_AVERAGE,
        CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.SHOW_INDIVIDUAL_CHANNEL_POSITION_2
      ],
    }),
    []
  );

  const timeSelection = TIME_RANGE_PRESENT_DAYS_OPTIONS?.find((range) => range.value === TIME_RANGE_TYPES.TODAY);

  const initialChartFilterValues = (filterTypes) =>
    getFormikFiltersInitialValues(getShowFiltersType(filterTypes), '', timeSelection);

  const [conversationDashboardFilters, setConversationDashboardFilters] = useLocalStorage(
    CONVERSATIONS_LOCAL_STORAGE_KEYS.DASHBOARD,
    initialChartFilterValues(dashboardFilterTypes)
  );

  const [conversationFilters] = useLocalStorage(
    CONVERSATIONS_LOCAL_STORAGE_KEYS.CONVERSATIONS,
    initialChartFilterValues(statisticFilterTypes)
  );

  const [avgConversationFilters] = useLocalStorage(
    CONVERSATIONS_LOCAL_STORAGE_KEYS.AVG_LENGTH,
    initialChartFilterValues(statisticFilterTypesWithAverage)
  );

  const [transferredConversationFilters] = useLocalStorage(
    CONVERSATIONS_LOCAL_STORAGE_KEYS.TRANSFERRED,
    initialChartFilterValues(transferredFilters)
  );

  const { conversations, isConversationsFetching } = useGetConversationsGraph({
    filterParams: {
      ...(conversationFilters?.timeFrame?.filterValue ?? {}),
      channel: conversationFilters?.channels?.value ?? 'CHAT',

      ...(conversationFilters?.agents?.value?.length && {
        agentIds: conversationFilters?.agents?.value?.map((agent) => agent.value).join(','),
      }),
      ...(conversationFilters?.agentTags?.value?.length && {
        tags: conversationFilters?.agentTags?.value?.map((tag) => tag.value).join(','),
      }),
    },
    options: {
      placeholderData: [],
      select: (data) =>
        selectResponseData({
          data,
          xDataKeys: ['duration'],
          filterTypes: statisticFilterTypes,
          filters: conversationFilters,
          tooltipLabel: 'Conversations',
        }) || [],
      enabled: !!conversationFilters?.timeFrame,
    },
  });

  const { avgConversations, isAvgConversationsFetching } = useGetAvgConversationsGraph({
    filterParams: {
      ...(avgConversationFilters?.timeFrame?.filterValue ?? {}),
      channel: avgConversationFilters?.channels?.value ?? 'CHAT',

      ...(avgConversationFilters?.agents?.value?.length && {
        agentIds: avgConversationFilters?.agents?.value?.map((agent) => agent.value).join(','),
      }),
      ...(avgConversationFilters?.agentTags?.value?.length && {
        tags: avgConversationFilters?.agentTags?.value?.map((tag) => tag.value).join(','),
      }),
    },
    options: {
      placeholderData: [],
      select: (data) =>
        selectResponseData({
          data,
          xDataKeys: ['duration'],
          filterTypes: statisticFilterTypesWithAverage,
          filters: avgConversationFilters,
        }) || [],
      enabled: !!avgConversationFilters?.timeFrame,
    },
  });

  const { transferredConversations, isTransferredConversationsFetching } = useGetTransferredConversationsGraph({
    filterParams: {
      ...(transferredConversationFilters?.timeFrame?.filterValue ?? {}),
      view: transferredConversationFilters?.view ?? NUMBER_OR_PERCENTAGE_GRAPH_TYPES.NUMBER,
      channel: transferredConversationFilters?.channels?.value ?? 'CHAT',
      ...(transferredConversationFilters?.agents?.value?.length && {
        agentIds: transferredConversationFilters?.agents?.value?.map((agent) => agent.value).join(','),
      }),
      ...(transferredConversationFilters?.agentTags?.value?.length && {
        tags: transferredConversationFilters?.agentTags?.value?.map((tag) => tag.value).join(','),
      }),
    },
    options: {
      placeholderData: [],
      select: (data) =>
        selectResponseData({
          data,
          xDataKeys: ['duration'],
          filterTypes: statisticFilterTypesWithAverage,
          filters: transferredConversationFilters,
          tooltipLabel:
            transferredConversationFilters?.view === NUMBER_OR_PERCENTAGE_GRAPH_TYPES.NUMBER
              ? 'Conversations'
              : 'Percentage',
        }) || [],
      enabled: !!transferredConversationFilters?.timeFrame,
    },
  });

  return (
    <StyledFlex gap="30px">
      <Overview
        label="Conversation Overview"
        ConversationSection={ConversationOverviewSection}
        timeRangeTab={timeSelection}
        filters={conversationDashboardFilters}
        setFilters={setConversationDashboardFilters}
        filterTypes={dashboardFilterTypes}
      />
      <ConversationsStatistic
        xDataKeys={xDataKeys}
        chartData={conversations}
        isChartDataFetching={isConversationsFetching}
        filterTypes={statisticFilterTypes}
        title="Conversations"
        yLabel="Number of Conversations"
        initialSavedFilter={conversationFilters}
        legendLabels={CONVERSATIONS_LEGEND_LABELS}
      />
      <ConversationsStatistic
        xDataKeys={xDataKeys}
        chartData={avgConversations}
        isChartDataFetching={isAvgConversationsFetching}
        filterTypes={statisticFilterTypesWithAverage}
        title="Average Conversations Length"
        withAverage
        yLabel="Conversation Length (min)"
        initialSavedFilter={avgConversationFilters}
      />
      <ConversationsStatistic
        xDataKeys={xDataKeys}
        chartData={transferredConversations}
        isChartDataFetching={isTransferredConversationsFetching}
        filterTypes={transferredFilters}
        title="Transferred Conversations"
        withAverage
        yLabel="Number of Conversations"
        initialSavedFilter={transferredConversationFilters}
      />
    </StyledFlex>
  );
};

export default React.memo(Conversations);
