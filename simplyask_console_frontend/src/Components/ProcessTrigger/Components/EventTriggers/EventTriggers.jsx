import { useTheme } from '@emotion/react';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BulkDeleteIcon from '../../../../Assets/icons/issues/bulkOperations/delete.svg?component';
import routes from '../../../../config/routes';
import { useGetProcessDefinitions } from '../../../../hooks/process/useProcessDefinitions';
import { useFilter } from '../../../../hooks/useFilter';
import { useGetCurrentUser } from '../../../../hooks/useGetCurrentUser';
import { useUpdateTableFilterSearchParams } from '../../../../hooks/useTableFilterSearchParams';
import { useTableSortAndFilter } from '../../../../hooks/useTableSortAndFilter';
import { getWebhookTriggers } from '../../../../Services/axios/webhook';
import { BULK_OPERATION_TYPES } from '../../../Issues/constants/bulkOperations';
import { StyledButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';
import ContentLayout from '../../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import ConfirmationModal from '../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import CustomSidebar from '../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import TableV2 from '../../../shared/REDISIGNED/table-v2/Table-v2';
import { StyledFlex } from '../../../shared/styles/styled';
import { useDeleteEventTrigger } from '../../hooks/useDeleteEventTrigger';
import { EVENT_TRIGGER_QUERY_KEYS } from '../../utils/constants';
import { EVENT_TRIGGERS_COLUMNS } from '../../utils/formatters';
import { EVENT_TRIGGERS_SIDE_FILTER_INITIAL_VALUES, FILTERS_FORM_KEY, EVENT_TRIGGER_FILTER_KEYS } from './constants';
import EventTriggersFilters from './EventTriggersFilters';
import EventTriggersSideDetails from './EventTriggersSideDetails';
import { eventTriggersFiltersFormatter, eventTriggersFiltersMeta } from './helper';
import DeleteEventTriggerModal from './modals/DeleteEventTriggerModal/DeleteEventTriggerModal';
import { useGetFilteredEnvironments } from '../../hooks/useGetFilteredEnvironments';

const EventTriggers = () => {
  const { currentUser } = useGetCurrentUser();
  const { colors } = useTheme();
  const navigate = useNavigate();

  const [bulkUpdateType, setBulkUpdateType] = useState('');
  const [selectionRefreshCount, setSelectionRefreshCount] = useState(0);
  const [selectedEventTriggersIds, setSelectedEventTriggersIds] = useState([]);
  const [eventTriggerToSingleDelete, setEventTriggerToSingleDelete] = useState(null);
  const queryKeyRef = useRef(null);
  const [openedEventTrigger, setOpenedEventTrigger] = useState(null);

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const { processDefinitionData, isProcessDefinitionDataLoading } = useGetProcessDefinitions();

  const { filteredEnvironments: environmentOptions, isFilteredEnvironmentsLoading: isEnvironmentOptionsLoading } =
    useGetFilteredEnvironments({
      params: `pageSize=10`,
      select: (res) => res.content?.map((env) => ({ label: env.envName, value: env.id })),
      gcTime: Infinity,
      staleTime: Infinity,
      enabled: isFiltersOpen,
    });

  const processDefinitionOptions = useMemo(
    () =>
      processDefinitionData?.map((item) => ({
        value: item.key,
        label: item.name,
      })),
    [processDefinitionData]
  );

  const { mutate: deleteEventTrigger } = useDeleteEventTrigger({ queryKey: queryKeyRef?.current });

  const handleOpenSelectedItem = useCallback((item) => setOpenedEventTrigger(item), []);

  const { updateSearchParams, handleModalOpenUrl, handleUrlFiltersMeta } = useUpdateTableFilterSearchParams({
    enableURLSearchParams: true,
  });

  const { sourceFilterValue, initialFilterValues, setFilterFieldValue, submitFilterValue } = useFilter({
    formikProps: {
      initialValues: {
        timezone: currentUser?.timezone,
        sideFilter: EVENT_TRIGGERS_SIDE_FILTER_INITIAL_VALUES,
      },
    },
    onSubmit: ({ filterValue = {}, selectedFilters = {} }) => {
      setColumnFilters(filterValue);
      setSelectedFiltersBar(selectedFilters);
      handleUrlFiltersMeta(filterValue, selectedFilters);
    },
    formatter: eventTriggersFiltersFormatter,
    selectedFiltersMeta: eventTriggersFiltersMeta,
  });

  const {
    data,
    sorting,
    selectedFiltersBar,
    pagination,
    isFetching,
    searchText,
    setColumnFilters,
    setSelectedFiltersBar,
    setSearchText,
    setSorting,
    setPagination,
  } = useTableSortAndFilter({
    queryFn: getWebhookTriggers,
    queryKey: EVENT_TRIGGER_QUERY_KEYS.GET_EVENT_TRIGGERS,
    initialFilters: initialFilterValues,
    pageIndex: 0,
    pageSize: 25,
    initialSearchText: '',
    keyRef: queryKeyRef,
    initialSorting: [
      {
        id: 'createdAt',
        desc: true,
      },
    ],
    updateSearchParams,
    enableURLSearchParams: true,
    onModalAction: handleOpenSelectedItem,
  });

  const handleClearAll = () => {
    setFilterFieldValue(FILTERS_FORM_KEY, EVENT_TRIGGERS_SIDE_FILTER_INITIAL_VALUES);
    submitFilterValue();
  };

  const handleClearFilterField = (key, label) => {
    const isMulti = [EVENT_TRIGGER_FILTER_KEYS.ENVIRONMENT_IDS].includes(key);

    let updatedValue = EVENT_TRIGGERS_SIDE_FILTER_INITIAL_VALUES[key];

    if (isMulti) {
      updatedValue = sourceFilterValue[FILTERS_FORM_KEY]?.[key]?.filter((item) => item.label !== label);
    }

    setFilterFieldValue(FILTERS_FORM_KEY, {
      ...sourceFilterValue[FILTERS_FORM_KEY],
      [key]: updatedValue,
    });

    submitFilterValue();
  };

  const handleSingleDelete = (eventTriggerData) => {
    setEventTriggerToSingleDelete(eventTriggerData);
  };

  const tableMeta = {
    currentUser,
    colors,
    handleSingleDelete,
    onTableRowClick: (row) => {
      setOpenedEventTrigger(row);
      handleModalOpenUrl(row);
    },
  };

  const renderTableActions = useMemo(
    () => (
      <StyledFlex direction="row" gap="15px">
        <StyledButton variant="contained" secondary onClick={() => navigate(routes.EVENT_TRIGGER_DETAILS)}>
          Create Event Trigger
        </StyledButton>
      </StyledFlex>
    ),
    []
  );

  const tableBulkActions = [
    {
      text: 'Delete',
      icon: <BulkDeleteIcon />,
      callback: () => {
        setBulkUpdateType(BULK_OPERATION_TYPES.DELETE);
      },
    },
  ];

  const memoizedPinColumns = useMemo(() => ['name'], []);
  const memoizedPinRowHoverActionColumns = useMemo(() => ['deleteById'], []);

  const onSearch = (e) => setSearchText(e.target.value);
  const handleShowEventTriggersFilter = () => {
    setIsFiltersOpen(true);
  };

  const toggleSidebar = (sidebar = 'filters', value = false) => {
    const stateSelector = {
      filters: setIsFiltersOpen,
      details: (v) => {
        setOpenedEventTrigger(v);
        handleModalOpenUrl(v || null);
      },
    };

    stateSelector[sidebar](value);
  };

  const handleCloseFilters = () => {
    setIsFiltersOpen(false);
  };

  const handleApplyFilters = (sideFilter) => {
    toggleSidebar('filters', false);
    setFilterFieldValue(FILTERS_FORM_KEY, sideFilter);
    submitFilterValue();
  };

  return (
    <StyledFlex flex={1}>
      <ContentLayout noPadding fullHeight>
        <TableV2
          data={data}
          columns={EVENT_TRIGGERS_COLUMNS}
          searchPlaceholder="Search Event Triggers..."
          initialSearchText={searchText}
          onSearch={onSearch}
          onShowFilters={handleShowEventTriggersFilter}
          selectedFilters={selectedFiltersBar}
          onClearAllFilters={handleClearAll}
          onClearFilter={handleClearFilterField}
          isLoading={isFetching}
          sorting={sorting}
          setSorting={setSorting}
          onSelectionChange={setSelectedEventTriggersIds}
          selectBarActions={tableBulkActions}
          pagination={pagination}
          setPagination={setPagination}
          emptyTableDescription="There are currently no event triggers"
          pinSelectColumn
          meta={tableMeta}
          headerActions={renderTableActions}
          entityName="Event Triggers"
          selectionRefreshTrigger={selectionRefreshCount}
          pinColumns={memoizedPinColumns}
          pinRowHoverActionColumns={memoizedPinRowHoverActionColumns}
          enablePageSizeChange
          getRowId={(row) => row?.webhookId}
          emptyTableTitle="Event Triggers"
        />
      </ContentLayout>
      <CustomSidebar open={isFiltersOpen} onClose={handleCloseFilters} headStyleType="filter">
        {({ customActionsRef }) => (
          <EventTriggersFilters
            initialValues={sourceFilterValue.sideFilter}
            onApplyFilters={handleApplyFilters}
            processDefinitionOptions={processDefinitionOptions}
            customActionsRef={customActionsRef}
            isLoading={isProcessDefinitionDataLoading || isEnvironmentOptionsLoading}
            environmentOptions={environmentOptions}
          />
        )}
      </CustomSidebar>
      <EventTriggersSideDetails eventTrigger={openedEventTrigger} toggleSidebar={toggleSidebar} />

      <DeleteEventTriggerModal
        isOpen={!!eventTriggerToSingleDelete}
        eventTrigger={eventTriggerToSingleDelete}
        onClose={() => setEventTriggerToSingleDelete(null)}
        onDelete={() => {
          deleteEventTrigger(eventTriggerToSingleDelete?.webhookId);
          setEventTriggerToSingleDelete(null);
        }}
      />

      <ConfirmationModal
        isOpen={bulkUpdateType === BULK_OPERATION_TYPES.DELETE}
        successBtnText="Delete"
        alertType="WARNING"
        title="Are You Sure?"
        text={`You are about to delete ${selectedEventTriggersIds.length} Event Triggers. This action cannot be undone. Are you sure you want to proceed?`}
        onCloseModal={() => {
          setBulkUpdateType('');
        }}
        onSuccessClick={() => {
          deleteEventTrigger(selectedEventTriggersIds.map((id) => `workflowsInUse=${id}`));
          setBulkUpdateType('');
          setSelectionRefreshCount((prev) => prev + 1);
        }}
      />
    </StyledFlex>
  );
};

export default EventTriggers;
