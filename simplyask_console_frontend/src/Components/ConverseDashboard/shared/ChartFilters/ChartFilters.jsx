import { useTheme } from '@emotion/react';
import { useFormik } from 'formik';
import React, { useMemo, useState } from 'react';

import { useProxyDefinitions } from '../../../../hooks/process/useProxyDefinitions';
import { useFilter } from '../../../../hooks/useFilter';
import CustomSidebar from '../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import TableSelectedFilters from '../../../shared/REDISIGNED/table/components/TableSelectedFilters/TableSelectedFilters';
import { StyledAccordion, StyledAccordionDetails, StyledDivider, StyledFlex } from '../../../shared/styles/styled';
import { useGetAllAgents } from '../../hooks/useGetAllAgents';
import {
  CHART_SIDE_FILTER_KEY,
  CONVERSE_DASHBOARD_FILTER_TYPE_KEYS,
  CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS,
  PROCESS_DEFINITIONS,
} from '../../utils/constants';
import {
  chartsConversationalSideFiltersFormatter,
  chartsConversationalSideFiltersMeta,
  chartsServiceTicketSideFiltersFormatter,
  chartsServiceTicketSideFiltersMeta,
  isSideFilterActive,
  onSubmitFiltersFormatter,
} from '../../utils/formatters';
import {
  getConversationalAppliedFiltersData,
  getDefaultFrequencyOptions,
  getFormikFiltersInitialValues,
  getInitialLocalStorageValuesForUseFilter,
  getServiceTicketAppliedFiltersData,
  getShowFiltersType,
} from '../../utils/initialValuesHelpers';

import ChartFiltersMain from './ChartFiltersMain/ChartFiltersMain';
import ChartFiltersSettings from './ChartFiltersSettings/ChartFiltersSettings';
import ChartFiltersSideConversations from './ChartFiltersSide/ChartFiltersSideConversations';
import ChartFiltersSideServiceTickets from './ChartFiltersSide/ChartFiltersSideServiceTickets';

export const sharedDropdownProps = {
  minMenuHeight: 150,
  maxMenuHeight: 560,
  closeMenuOnSelect: true,
  hideSelectedOptions: false,
  isClearable: false,
  isSearchable: false,
  withSeparator: false,
  openMenuOnClick: true,
  mb: 0,
  maxHeight: 38,
  maxWidth: 593,
};

const ChartFilters = ({ filterTypes, filters, setFilters, timeRangeTab, onTimeframeChange, initialSavedFilter }) => {
  const { colors } = useTheme();

  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  const [isSideFiltersOpen, setIsSideFiltersOpen] = useState(false);

  const showFiltersType = getShowFiltersType(filterTypes);

  const formikInitialValues = getFormikFiltersInitialValues(showFiltersType, initialSavedFilter, timeRangeTab);

  const hasSideFilters = !!filterTypes?.sideFilters?.length;
  const hasSettings = !!filterTypes?.settings?.length;
  const isMainFrequency = showFiltersType?.main?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.FREQUENCY];
  const isConversationsView = filterTypes?.type === CONVERSE_DASHBOARD_FILTER_TYPE_KEYS.CONVERSATIONAL;

  const isConversationsViewWithSideFilters =
    isConversationsView &&
    isSideFilterActive(showFiltersType, [
      CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.SIDE_FILTERS,
      CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENT_TAGS,
    ]);

  const isServiceTicketViewWithSideFilters =
    !isConversationsView &&
    isSideFilterActive(showFiltersType, [
      CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.ASSIGNED_AGENTS,
      CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.SHOW_MANUALLY_GENERATED_TICKETS,
      CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_ALL_PROCESSES,
      CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_TAGS,
      CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_ALL_AGENTS,
      CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_AGENT_TAGS,
    ]);

  const { allAgents: allAgentsOptions, isAllAgentsLoading: isAllAgentsOptionsLoading } = useGetAllAgents(
    new URLSearchParams({
      pageSize: 200,
    }),
    {
      select: (res) =>
        res?.content?.map((item) => ({
          label: item.name,
          value: item.agentId,
          tags: item.tags?.map((tag) => ({ label: tag, value: tag })) || [],
        })) || [],
      enabled: isConversationsViewWithSideFilters || isServiceTicketViewWithSideFilters,
    }
  );

  const { definitions: allProcessesOptions, isLoading: isAllProcessesOptionsLoading } = useProxyDefinitions(
    PROCESS_DEFINITIONS,
    {
      select: (res) =>
        res?.possibleValues?.[PROCESS_DEFINITIONS]?.map((item) => ({
          label: item.title,
          value: item.value,
          tags:
            item.tags?.map((tag) => ({
              label: tag,
              value: tag,
            })) || [],
        })) || [],
      enabled: isServiceTicketViewWithSideFilters,
    }
  );

  const { values, setFieldValue } = useFormik({
    enableReinitialize: true,
    initialValues: formikInitialValues,
  });

  const onSubmitConversationalSideFilters = ({ selectedFilters = {} }) => {
    const conversationFilters = [
      CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENTS,
      CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.AGENT_TAGS,
    ];

    const updatedValues = conversationFilters.reduce((acc, key) => {
      if (selectedFilters[key]) return { ...acc, [key]: selectedFilters[key] };

      return acc;
    }, {});

    onSubmitFiltersFormatter(showFiltersType, selectedFilters, setFieldValue, conversationFilters);

    setFilters((prev) => ({ ...prev, ...updatedValues }));
  };

  const onSubmitServiceTicketSideFilters = ({ selectedFilters = {} }) => {
    const serviceTicketFilters = [
      CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.ASSIGNED_AGENTS,
      CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_ALL_PROCESSES,
      CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.PROCESS_TAGS,
      CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_AGENT_TAGS,
      CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.IVA_ALL_AGENTS,
      CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.SHOW_MANUALLY_GENERATED_TICKETS,
    ];
    const updatedValues = serviceTicketFilters.reduce((acc, key) => {
      if (selectedFilters[key]) return { ...acc, [key]: selectedFilters[key] };

      return acc;
    }, {});

    onSubmitFiltersFormatter(showFiltersType, selectedFilters, setFieldValue, serviceTicketFilters);

    setFilters((prev) => ({ ...prev, ...updatedValues }));
  };
  const { sourceFilterValue, setFilterFieldValue, submitFilterValue } = useFilter({
    formikProps: {
      initialValues: {
        [CHART_SIDE_FILTER_KEY]: isConversationsView
          ? getInitialLocalStorageValuesForUseFilter(values)
          : getInitialLocalStorageValuesForUseFilter(values, showFiltersType),
      },
    },
    onSubmit: isConversationsView ? onSubmitConversationalSideFilters : onSubmitServiceTicketSideFilters,
    formatter: isConversationsView ? chartsConversationalSideFiltersFormatter : chartsServiceTicketSideFiltersFormatter,
    selectedFiltersMeta: isConversationsView ? chartsConversationalSideFiltersMeta : chartsServiceTicketSideFiltersMeta,
  });

  const handleClearFilterField = (filterKey, val) => {
    const selectedFilter = sourceFilterValue?.[CHART_SIDE_FILTER_KEY]?.[filterKey];
    let filterVal = [];

    if (filterKey === CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SIDE_FILTERS.ASSIGNED_AGENTS) {
      filterVal = selectedFilter?.filter((item) => item.value?.id !== val);
    } else {
      filterVal = selectedFilter?.filter((item) => item.value !== val);
    }

    setFilterFieldValue(CHART_SIDE_FILTER_KEY, {
      ...sourceFilterValue[CHART_SIDE_FILTER_KEY],
      [filterKey]: filterVal,
    });

    submitFilterValue();
  };

  const onApplySideFilters = (sideFilter) => {
    setFilterFieldValue(CHART_SIDE_FILTER_KEY, sideFilter);
    submitFilterValue();
    setIsSideFiltersOpen(false);
  };

  const conversationalSelectedSideFiltersPreviewData = useMemo(
    () => getConversationalAppliedFiltersData(showFiltersType, values),
    [showFiltersType, values]
  );

  const serviceTicketSelectedSideFiltersPreviewData = useMemo(
    () => getServiceTicketAppliedFiltersData(showFiltersType, values),
    [showFiltersType, values]
  );

  const frequencyOptions = isMainFrequency
    ? getDefaultFrequencyOptions(
        filters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.TIME_FRAME]?.filterValue?.startTime,
        filters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.TIME_FRAME]?.filterValue?.endTime
      )
    : null;

  const chartFiltersMainValues = {
    [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.TIME_FRAME]:
      filters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.TIME_FRAME] ||
      values[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.TIME_FRAME],
    [CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.FREQUENCY]:
      filters?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.FREQUENCY] ||
      values[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.FREQUENCY],
  };

  const handleDropdownFilterChange = (val, { name }) => {
    const isMainTimeFrame = name === CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.TIME_FRAME;

    if (isMainTimeFrame && val) {
      setFilters((prev) => ({ ...prev, [name]: val }));
    }

    onTimeframeChange?.(val, { name });

    setFieldValue(name, val);
  };

  const handleFrequencyChange = (val, { name }) => {
    setFieldValue(name, val);
    setFilters((prev) => ({ ...prev, [name]: val }));
  };

  return (
    <StyledFlex>
      <ChartFiltersMain
        showFilterBtn={hasSideFilters}
        showSettingsBtn={hasSettings}
        frequencyOptions={frequencyOptions}
        toggleSettingsExpand={() => setIsSettingsExpanded((prev) => !prev)}
        values={chartFiltersMainValues}
        handleOpenFilters={() => setIsSideFiltersOpen(true)}
        handleDropdownFilterChange={handleDropdownFilterChange}
        handleFrequencyChange={handleFrequencyChange}
      />
      {(isConversationsViewWithSideFilters || isServiceTicketViewWithSideFilters) && (
        <TableSelectedFilters
          selectedFilters={
            isConversationsView
              ? conversationalSelectedSideFiltersPreviewData
              : serviceTicketSelectedSideFiltersPreviewData
          }
          onClearFilterField={handleClearFilterField}
          isOneCategory
        />
      )}

      <StyledAccordion expanded={isSettingsExpanded}>
        <StyledFlex />
        <StyledAccordionDetails>
          <StyledDivider m="25px 0 0 0" borderWidth="2" color={colors.cardGridItemBorder} />
          <ChartFiltersSettings
            showFiltersType={showFiltersType}
            values={values}
            setFieldValue={(key, value) => {
              setFilters((prev) => ({ ...prev, [key]: value }));
              setFieldValue(key, value);
            }}
          />
        </StyledAccordionDetails>
      </StyledAccordion>

      <CustomSidebar open={isSideFiltersOpen} onClose={() => setIsSideFiltersOpen(false)} headStyleType="filter">
        {({ customActionsRef }) => (
          <StyledFlex marginTop="20px">
            {isSideFiltersOpen && isConversationsViewWithSideFilters && (
              <ChartFiltersSideConversations
                customActionsRef={customActionsRef}
                isLoading={isAllAgentsOptionsLoading}
                allAgentsOptions={allAgentsOptions}
                showFiltersType={showFiltersType}
                initialValues={sourceFilterValue[CHART_SIDE_FILTER_KEY]}
                onApplyFilters={onApplySideFilters}
              />
            )}
            {isSideFiltersOpen && isServiceTicketViewWithSideFilters && (
              <ChartFiltersSideServiceTickets
                customActionsRef={customActionsRef}
                isLoading={isAllProcessesOptionsLoading || isAllAgentsOptionsLoading}
                showFiltersType={showFiltersType}
                initialValues={sourceFilterValue[CHART_SIDE_FILTER_KEY]}
                onApplyFilters={onApplySideFilters}
                allProcessesOptions={allProcessesOptions}
                allAgentsOptions={allAgentsOptions}
              />
            )}
          </StyledFlex>
        )}
      </CustomSidebar>
    </StyledFlex>
  );
};

export default ChartFilters;
