import ReplayIcon from '@mui/icons-material/Replay';
import { useTheme } from '@mui/material/styles';
import { useQueryClient } from '@tanstack/react-query';
import { isEqual } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import CopyIcon from '../../../../Assets/icons/copy.svg?component';
import { getIssues } from '../../../../Services/axios/issuesAxios';
import routes from '../../../../config/routes';
import { GET_FALLOUT_TICKET_BY_INCIDENT_ID } from '../../../../hooks/fallout/useFalloutDetails';
import { useFalloutUpdate } from '../../../../hooks/fallout/useFalloutUpdate';
import useCopyToClipboard from '../../../../hooks/useCopyToClipboard';
import { useFilter } from '../../../../hooks/useFilter';
import { useGetCurrentUser } from '../../../../hooks/useGetCurrentUser';
import { useTableSortAndFilter } from '../../../../hooks/useTableSortAndFilter';
import useTabNavigation from '../../../Settings/AccessManagement/hooks/useTabNavigation';
import NavTabs from '../../../shared/NavTabs/NavTabs';
import TabPanel from '../../../shared/NavTabs/TabPanel';
import { ISSUES_QUERY_KEYS, ISSUE_CATEGORIES } from '../../constants/core';
import { FILTER_KEY, falloutTicketsFormatter, selectedFalloutTicketsFiltersMeta } from './utils/helpers';

import { getFalloutTicketsCategory } from '../../../../store/selectors';
import { StyledButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';
import OpenIcon from '../../../shared/REDISIGNED/icons/svgIcons/OpenIcon';
import ContentLayout from '../../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../../../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import CustomSidebar from '../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import TableV2 from '../../../shared/REDISIGNED/table-v2/Table-v2';
import { StyledTooltip } from '../../../shared/REDISIGNED/tooltip/StyledTooltip';
import {
  CustomBlackAndWhiteStyledButtonSideBar,
  StyledDivider,
  StyledFlex,
  StyledLink,
  StyledText,
} from '../../../shared/styles/styled';


import { useUpdateTableFilterSearchParams } from '../../../../hooks/useTableFilterSearchParams';
import ServiceTicketTypeIcon from '../ServiceTickets/components/shared/ServiceTicketTypeIcon/ServiceTicketTypeIcon';
import FalloutTicketDetails from './components/FalloutTicketDetails/FalloutTicketDetails';
import FalloutTicketsFilters from './components/FalloutTicketsFilters/FalloutTicketsFilters';
import { FALLOUT_TICKET_SIDE_FILTER_INITIAL_VALUES } from './constants/constants';
import { FALLOUT_TICKETS_COLUMNS } from './utils/formatters';

const NAV_TAB_LABELS = [{ title: 'Individual' }];

const COPY_URL_DEFAULT_TEXT = `Copy URL of ${ISSUE_CATEGORIES.FALLOUT_TICKET}`;

const FalloutTickets = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const { currentUser } = useGetCurrentUser();
  const { updateFalloutTicket } = useFalloutUpdate({ invalidateQueries: GET_FALLOUT_TICKET_BY_INCIDENT_ID });
  const { tabIndex, onTabChange } = useTabNavigation(NAV_TAB_LABELS);

  const falloutTicketQueryKeyRef = useRef(null);

  const [isViewFiltersOpen, setIsViewFiltersOpen] = useState(false);
  const [showTicketDetails, setShowTicketDetails] = useState(null);
  const [copyMessage, setCopyMessage] = useState(COPY_URL_DEFAULT_TEXT);

  const [isTableDataLoading, setIsTableDataLoading] = useState(true);
  const [paginationCache, setPaginationCache] = useState(null);

  const { copyToClipboard } = useCopyToClipboard(COPY_URL_DEFAULT_TEXT);

  const category = useRecoilValue(getFalloutTicketsCategory);

  const handleOpenSelectedItem = useCallback((item) => setShowTicketDetails(item), []);

  const excludedSearchParams = [
    'returnParameters',
    'returnAdditionalField',
    'returnRelatedEntities',
    'issueCategoryId',
  ];

  const { sourceFilterValue, setFilterFieldValue, submitFilterValue, initialFilterValues } = useFilter({
    formikProps: {
      initialValues: {
        [FILTER_KEY]: FALLOUT_TICKET_SIDE_FILTER_INITIAL_VALUES,
        timezone: currentUser?.timezone,
        returnParameters: true,
        returnAdditionalField: true,
        returnRelatedEntities: true,
        issueCategoryId: 3,
      },
    },
    onSubmit: ({ filterValue, selectedFilters }) => {
      setColumnFilters(filterValue);
      setSelectedFiltersBar(selectedFilters);
      handleUrlFiltersMeta(filterValue, selectedFilters);
    },
    formatter: falloutTicketsFormatter,
    selectedFiltersMeta: selectedFalloutTicketsFiltersMeta,
  });

  const { updateSearchParams, handleModalOpenUrl, handleUrlFiltersMeta } = useUpdateTableFilterSearchParams({
    excludedSearchParams,
    enableURLSearchParams: true,
  });

  const {
    setColumnFilters,
    setSearchText,
    pagination,
    setPagination,
    sorting,
    setSorting,
    data,
    isFetching,
    selectedFiltersBar,
    setSelectedFiltersBar,
    refetch,
  } = useTableSortAndFilter({
    queryFn: getIssues,
    queryKey: ISSUES_QUERY_KEYS.GET_FALLOUT_TICKETS,
    initialFilters: initialFilterValues,
    initialSorting: [
      {
        id: 'createdAt',
        desc: true,
      },
    ],
    keyRef: falloutTicketQueryKeyRef,
    enableURLSearchParams: true,
    excludedSearchParams,
    updateSearchParams,
    onModalAction: handleOpenSelectedItem,
  });

  useEffect(() => {
    if (isFetching && !isEqual(pagination, paginationCache)) {
      setPaginationCache(pagination);
      setIsTableDataLoading(true);
    } else if (isTableDataLoading && !isFetching) {
      setIsTableDataLoading(false);
    }
  }, [isFetching, pagination, paginationCache]);

  const handleSearch = useCallback((e) => setSearchText(e.target.value), []);

  const toggleSidebar = useCallback((sidebar = 'filters', value = false) => {
    const stateSelector = {
      filters: setIsViewFiltersOpen,
      details: setShowTicketDetails,
    };

    stateSelector[sidebar](value);
  }, []);

  const handleClearAll = useCallback(() => {
    setFilterFieldValue(FILTER_KEY, FALLOUT_TICKET_SIDE_FILTER_INITIAL_VALUES);
    submitFilterValue();
  }, []);

  const handleClearFilterField = useCallback(
    (key, val) => {
      const selectedFilter = sourceFilterValue?.[FILTER_KEY]?.[key];

      let updatedFilterValue;

      const isArray = Array.isArray(selectedFilter);

      if (isArray) {
        updatedFilterValue = selectedFilter?.filter((item) => item.label?.toLowerCase() !== val?.toLowerCase());
      } else {
        updatedFilterValue = FALLOUT_TICKET_SIDE_FILTER_INITIAL_VALUES[key];
      }

      setFilterFieldValue(FILTER_KEY, {
        ...sourceFilterValue[FILTER_KEY],
        [key]: updatedFilterValue,
      });
      submitFilterValue();
    },
    [sourceFilterValue]
  );

  const handleApplyFilter = useCallback((sideFilter) => {
    toggleSidebar('filters', false);
    setFilterFieldValue('sideFilter', sideFilter);
    submitFilterValue();
  }, []);

  const handleUpdate = useCallback(
    (data) => {
      const { ticket, assignedTo } = data;

      updateFalloutTicket({
        ticket,
        assignedTo: assignedTo ? assignedTo.value.id : null,
      });
    },
    [currentUser?.id]
  );

  const handleNameClick = useCallback((details) => {
    toggleSidebar('details', details);
    handleModalOpenUrl(details);
  }, []);

  const handleShowFilters = useCallback(() => toggleSidebar('filters', true), []);

  const getFalloutTicketTypeByName = (name) => category?.types?.find((type) => type.name === name);

  const issueType = getFalloutTicketTypeByName(ISSUE_CATEGORIES.FALLOUT_TICKET);
  const statusOptions = issueType?.statuses;

  const tableMeta = useMemo(
    () => ({
      onUpdate: handleUpdate,
      onNameClick: handleNameClick,
      user: currentUser,
      theme,
      key: falloutTicketQueryKeyRef.current,
      statusOptions,
    }),
    [handleUpdate, currentUser?.id, theme, falloutTicketQueryKeyRef]
  );

  const redirectToFalloutTicketById = () => {
    const path = generatePath(routes.FALLOUT_TICKETS_FULL_VIEW, {
      falloutTicketId: showTicketDetails?.id,
    });

    navigate(path);
  };

  const memoizedPinColumns = useMemo(() => ['displayName'], []);

  const renderSideBarHeader = () => (
    <StyledFlex gap="10px">
      <StyledFlex direction="row" alignItems="center" gap="15px">
        <ServiceTicketTypeIcon type={getFalloutTicketTypeByName(showTicketDetails?.issueType)} isMediumIcon />
        <StyledFlex>
          <StyledText size={16} weight={500} lh={20}>
            <StyledLink to={`${showTicketDetails?.id}`} themeColor="primary" onClick={(e) => e.preventDefault()}>
              #{showTicketDetails?.id}
            </StyledLink>
          </StyledText>
        </StyledFlex>
        <StyledFlex alignItems="center">
          <StyledDivider borderWidth={2} color={theme.colors.jetStreamGray} orientation="vertical" height="17px" />
        </StyledFlex>
        <StyledText weight={500} lh={20}>
          {showTicketDetails?.displayName}
        </StyledText>
      </StyledFlex>
    </StyledFlex>
  );

  const renderSideBarHeaderAction = () => (
    <StyledFlex direction="row" alignItems="center" gap="15px">
      <CustomBlackAndWhiteStyledButtonSideBar
        startIcon={<ReplayIcon sx={{ transform: 'scaleX(-1)' }} />}
        onClick={() =>
          queryClient.invalidateQueries({
            queryKey: [GET_FALLOUT_TICKET_BY_INCIDENT_ID],
          })
        }
      >
        Refresh
      </CustomBlackAndWhiteStyledButtonSideBar>
      <StyledButton
        primary
        variant="contained"
        onClick={redirectToFalloutTicketById}
        startIcon={<OpenIcon fontSize="inherit" />}
      >
        View Full Ticket
      </StyledButton>
      <StyledTooltip title={copyMessage} arrow placement="top" p="10px 15px" maxWidth="auto">
        <StyledFlex
          as="span"
          width="38px"
          height="38px"
          padding="8px 8px 8px 10px"
          cursor="pointer"
          borderRadius="7px"
          backgroundColor={theme.colors.darkGrayHoverFilterIcon}
          onClick={() => {
            copyToClipboard(`${window.location}/${showTicketDetails?.id}`);
            setCopyMessage('Copied!');
          }}
          onMouseLeave={() => setCopyMessage(COPY_URL_DEFAULT_TEXT)}
        >
          <CopyIcon />
        </StyledFlex>
      </StyledTooltip>
    </StyledFlex>
  );

  return (
    <PageLayout top={<NavTabs onChange={onTabChange} value={tabIndex} labels={NAV_TAB_LABELS} />}>
      <TabPanel value={tabIndex} index={0}>
        <ContentLayout noPadding fullHeight>
          <TableV2
            data={data}
            columns={FALLOUT_TICKETS_COLUMNS}
            searchPlaceholder="Search"
            onSearch={handleSearch}
            onShowFilters={handleShowFilters}
            setSorting={setSorting}
            selectedFilters={selectedFiltersBar}
            onClearAllFilters={handleClearAll}
            onClearFilter={handleClearFilterField}
            sorting={sorting}
            isLoading={isTableDataLoading}
            pagination={pagination}
            setPagination={setPagination}
            emptyTableDescription="There are currently no fallout tickets"
            meta={tableMeta}
            headerActions={null}
            enableRowSelection={false}
            entityName="Fallout Tickets"
            enablePageSizeChange
            enableEditing
            pinColumns={memoizedPinColumns}
            onTableRefresh={refetch}
          />
        </ContentLayout>
      </TabPanel>

      <CustomSidebar open={isViewFiltersOpen} onClose={() => toggleSidebar('filters', false)} headStyleType="filter">
        {({ customActionsRef }) => (
          <FalloutTicketsFilters
            sidebarActionsRef={customActionsRef}
            initialValues={sourceFilterValue.sideFilter}
            onApplyFilters={handleApplyFilter}
            isOpen={isViewFiltersOpen}
          />
        )}
      </CustomSidebar>

      <CustomSidebar
        open={!!showTicketDetails}
        onClose={() => {
          toggleSidebar('details', null);
          handleModalOpenUrl(null);
        }}
        headerTemplate={renderSideBarHeader()}
        customHeaderActionTemplate={renderSideBarHeaderAction()}
        width={780}
      >
        {() => (
          <FalloutTicketDetails queryKey={falloutTicketQueryKeyRef.current} falloutTicketId={showTicketDetails?.id} />
        )}
      </CustomSidebar>
    </PageLayout>
  );
};

export default FalloutTickets;
