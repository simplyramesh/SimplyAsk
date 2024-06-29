import { AddRounded } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import routes from '../../../../../../../config/routes';
import { useFilter } from '../../../../../../../hooks/useFilter';
import { useGetCurrentUser } from '../../../../../../../hooks/useGetCurrentUser';
import { useTableSortAndFilter } from '../../../../../../../hooks/useTableSortAndFilter';
import { getAllAgents } from '../../../../../../../Services/axios/conversationHistoryAxios';
import { getFilteredChatWidgets } from '../../../../../../../Services/axios/widgetAxios';
import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomSidebar from '../../../../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import TableV2 from '../../../../../../shared/REDISIGNED/table-v2/Table-v2';
import { StyledFlex } from '../../../../../../shared/styles/styled';
import { DELETE_MODAL_RADIO, WIDGETS_QUERY_KEYS } from '../../../constants/common';
import { CHAT_WIDGETS_SIDE_FILTER_INITIAL_VALUES } from '../../../constants/initialValues';
import useDeleteChatWidget from '../../../hooks/chatWidgetHooks/useDeleteChatWidget';
import { CHAT_WIDGETS_COLUMNS } from '../../../utils/formatters';
import { CHAT_WIDGETS_FILTER_KEY, chatWidgetSearchFormatter, chatWidgetsFiltersMeta } from '../../../utils/helpers';

import ChatWidgetDeleteMigrateAgentsModal from './ChatWidgetDeleteModals/ChatWidgetDeleteMigrateAgentsModal';
import ChatWidgetDeleteNoAgentsModal from './ChatWidgetDeleteModals/ChatWidgetDeleteNoAgentsModal';
import ChatWidgetDeleteNoWidgetsAvailableModal from './ChatWidgetDeleteModals/ChatWidgetDeleteNoWidgetsAvailableModal';
import ChatWidgetFilters from './ChatWidgetFilters/ChatWidgetFilters';

const ChatWidgetTable = () => {
  const { colors, boxShadows } = useTheme();
  const navigate = useNavigate();
  const { currentUser } = useGetCurrentUser();

  const [clickedTableRow, setClickedTableRow] = useState(null);
  const [isDeleteNoAgentsModalOpen, setIsDeleteNoAgentsModalOpen] = useState(false);
  const [isDeleteNoWidgetsModalOpen, setIsDeleteNoWidgetsModalOpen] = useState(false);
  const [isDeleteMigrateAgentsModalOpen, setIsDeleteMigrateAgentsModalOpen] = useState(false);
  const [isWidgetFilterOpen, setIsWidgetFilterOpen] = useState(false);
  const [selectedChatWidget, setSelectedChatWidget] = useState(null);
  const [isAgentAssignEnabled, setIsAgentAssignEnabled] = useState(DELETE_MODAL_RADIO.MIGRATE_AGENTS);

  const { data: getAllChatWidgets } = useQuery({
    queryKey: [WIDGETS_QUERY_KEYS.GET_CHAT_WIDGETS_ALL],
    queryFn: () => getFilteredChatWidgets('pageSize=999'),
  });

  const filterClickedWidget = getAllChatWidgets?.content?.filter((item) => item.widgetId !== clickedTableRow?.widgetId);

  const { sourceFilterValue, initialFilterValues, setFilterFieldValue, submitFilterValue } = useFilter({
    formikProps: {
      initialValues: {
        [CHAT_WIDGETS_FILTER_KEY]: CHAT_WIDGETS_SIDE_FILTER_INITIAL_VALUES,
        timezone: currentUser?.timezone,
      },
    },
    onSubmit: ({ filterValue, selectedFilters }) => {
      const modifiedAgentsValue = selectedFilters.agents?.map((item) => item.label)?.join(', ');
      setColumnFilters(filterValue);

      setSelectedFiltersBar(() => ({
        ...selectedFilters,
        agents: { label: 'Agents', value: modifiedAgentsValue, k: 'agents' },
      }));
    },
    formatter: chatWidgetSearchFormatter,
    selectedFiltersMeta: chatWidgetsFiltersMeta,
  });

  const {
    setColumnFilters,
    selectedFiltersBar,
    setSelectedFiltersBar,
    setSearchText,
    sorting,
    setSorting,
    pagination,
    setPagination,
    data: chatWidgetsData,
    isFetching,
    refetch,
  } = useTableSortAndFilter({
    queryFn: getFilteredChatWidgets,
    queryKey: WIDGETS_QUERY_KEYS.GET_CHAT_WIDGETS_FILTERED,
    pageIndex: 0,
    pageSize: 10,
    initialSearchText: '',
    initialFilters: initialFilterValues,
    initialSorting: [
      {
        id: 'updatedAt',
        desc: false,
      },
    ],
  });

  const assignedAgentIds = chatWidgetsData?.content
    ?.map((widget) => widget.assignedAgentIds)
    .flat()
    .join(',');

  const { data: assignedAgentsAll, isFetching: isAgentsFetching } = useQuery({
    queryFn: () => getAllAgents(`agentIds=${assignedAgentIds}&pageSize=999`),
    queryKey: [WIDGETS_QUERY_KEYS.GET_WIDGET_AGENTS_BY_ID, assignedAgentIds],
    enabled: !!assignedAgentIds,
    select: (res) => res?.content,
  });

  const getWidgetTableDataWithAgents = () => {
    const appendAgentsToWidgets = chatWidgetsData?.content?.map((widget) => {
      const { assignedAgentIds } = widget;
      const filterAgentsForWidget = assignedAgentsAll?.filter((agent) => assignedAgentIds.includes(agent.agentId));

      return { ...widget, agents: filterAgentsForWidget };
    });

    return { ...chatWidgetsData, content: appendAgentsToWidgets };
  };

  const renderHeaderActions = () => (
    <StyledFlex direction="row" gap="0 15px">
      <StyledButton
        variant="contained"
        tertiary
        startIcon={<AddRounded />}
        onClick={() =>
          navigate({
            pathname: routes.SETTINGS_CREATE_CHAT_WIDGET,
          })
        }
      >
        Create Chat Widget
      </StyledButton>
    </StyledFlex>
  );

  const handleClearAll = () => {
    setFilterFieldValue(CHAT_WIDGETS_FILTER_KEY, CHAT_WIDGETS_SIDE_FILTER_INITIAL_VALUES);
    submitFilterValue();
  };

  const handleClearFilterField = (key) => {
    setFilterFieldValue(CHAT_WIDGETS_FILTER_KEY, {
      ...sourceFilterValue[CHAT_WIDGETS_FILTER_KEY],
      [key]: CHAT_WIDGETS_SIDE_FILTER_INITIAL_VALUES[key],
    });
    submitFilterValue();
  };

  const handleSorting = (old) => {
    const { id, desc } = old()[0];

    setFilterFieldValue(
      CHAT_WIDGETS_FILTER_KEY,
      { ...sourceFilterValue[CHAT_WIDGETS_FILTER_KEY], [`${id}Sort`]: `${!desc}` },
      false
    );
    setSorting(old);
    submitFilterValue();
  };

  const onTableRowClick = (row) => {
    navigate({
      pathname: `${routes.SETTINGS_EDIT_CHAT_WIDGET_WITHOUT_ID}/${row.widgetId}`,
    });
  };

  const tableMeta = {
    currentUser,
    onDeleteIcon: (row, event) => {
      setClickedTableRow(row);
      chooseDeleteModal(row);
      event.stopPropagation();
    },
    theme: { colors, boxShadows },
    onTableRowClick,
    navigate,
  };

  const { deleteChatWidget, isDeleteChatWidgetLoading } = useDeleteChatWidget({
    onSuccess: () => {
      toast.success('The Chat Widget has been deleted successfully');
      setClickedTableRow(null);

      setIsDeleteNoAgentsModalOpen(false);
      setIsDeleteNoWidgetsModalOpen(false);
      setIsDeleteMigrateAgentsModalOpen(false);
      setSelectedChatWidget(null);
    },
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const closeDeleteNoAgentsModal = () => {
    setIsDeleteNoAgentsModalOpen(false);
    setClickedTableRow();
  };

  const closeDeleteNoWidgetsAvailableModal = () => {
    setIsDeleteNoWidgetsModalOpen(false);
    setClickedTableRow();
  };

  const closeDeleteMigrateAgentsModal = () => {
    setIsDeleteMigrateAgentsModalOpen(false);
    setClickedTableRow();
  };
  const handleWidgetDeletion = async (unAssign = false, transferToWidgetId = '') => {
    // const pathVariableWithoutWidgetId = `unAssign=${unAssign}`;
    // const pathVariableWithWidgetId = `unAssign=${unAssign}&assignToWidgetId=${transferToWidgetId}`;
    // const apiPathVariable = transferToWidgetId?.length !== 0
    //   ? pathVariableWithWidgetId
    //   : pathVariableWithoutWidgetId;

    const params = {
      unAssign,
      ...(transferToWidgetId?.length !== 0 && { assignToWidgetId: transferToWidgetId }),
    };

    const payload = {
      id: clickedTableRow?.widgetId,
      params,
    };

    await deleteChatWidget(payload);
  };

  const sharedDeleteModalProps = {
    isDeleteChatWidgetLoading,
    handleWidgetDeletion,
    clickedTableRow,
  };

  const chooseDeleteModal = (row) => {
    setIsAgentAssignEnabled(DELETE_MODAL_RADIO.MIGRATE_AGENTS);
    setSelectedChatWidget(null);

    const agentsLen = row?.assignedAgentIds?.length;
    const filterClickedWidgetFromData = getAllChatWidgets?.content?.filter((item) => item.widgetId !== row?.widgetId);

    if (agentsLen === 0) {
      setIsDeleteNoAgentsModalOpen(true);
    } else if (filterClickedWidgetFromData?.length === 0) {
      setIsDeleteNoWidgetsModalOpen(true);
    } else {
      setIsDeleteMigrateAgentsModalOpen(true);
    }
  };

  const getRowId = (row) => row.widgetId;

  return (
    <StyledFlex>
      <StyledFlex p="48px 17px 48px 10px">
        <TableV2
          data={getWidgetTableDataWithAgents()}
          columns={CHAT_WIDGETS_COLUMNS}
          entityName="Chat Widgets"
          searchPlaceholder="Search Chat Widgets..."
          onSearch={(e) => setSearchText(e.target.value)}
          sorting={sorting}
          setSorting={handleSorting}
          pagination={pagination}
          setPagination={setPagination}
          onShowFilters={() => setIsWidgetFilterOpen(true)}
          selectedFilters={selectedFiltersBar}
          headerActions={renderHeaderActions()}
          enableRowSelection={false}
          onClearAllFilters={handleClearAll}
          onClearFilter={handleClearFilterField}
          meta={tableMeta}
          isLoading={isFetching || isAgentsFetching}
          pinRowHoverActionColumns={['delete']}
          isEmbedded
          pinColumns={['name']}
          getRowId={getRowId}
          onTableRefresh={refetch}
        />
      </StyledFlex>

      <CustomSidebar open={isWidgetFilterOpen} onClose={() => setIsWidgetFilterOpen(false)} headStyleType="filter">
        {({ customActionsRef }) => (
          <StyledFlex>
            {isWidgetFilterOpen && (
              <ChatWidgetFilters
                initialValues={sourceFilterValue[CHAT_WIDGETS_FILTER_KEY]}
                onApplyFilters={(sideFilter) => {
                  setIsWidgetFilterOpen(false);
                  setFilterFieldValue(CHAT_WIDGETS_FILTER_KEY, sideFilter);
                  submitFilterValue();
                }}
                customActionsRef={customActionsRef}
              />
            )}
          </StyledFlex>
        )}
      </CustomSidebar>

      <ChatWidgetDeleteNoAgentsModal
        isOpen={isDeleteNoAgentsModalOpen}
        setClose={closeDeleteNoAgentsModal}
        {...sharedDeleteModalProps}
      />

      <ChatWidgetDeleteNoWidgetsAvailableModal
        isOpen={isDeleteNoWidgetsModalOpen}
        setClose={closeDeleteNoWidgetsAvailableModal}
        {...sharedDeleteModalProps}
      />

      <ChatWidgetDeleteMigrateAgentsModal
        isOpen={isDeleteMigrateAgentsModalOpen}
        setClose={closeDeleteMigrateAgentsModal}
        filterClickedWidget={filterClickedWidget}
        selectedChatWidget={selectedChatWidget}
        setSelectedChatWidget={setSelectedChatWidget}
        isAgentAssignEnabled={isAgentAssignEnabled}
        setIsAgentAssignEnabled={setIsAgentAssignEnabled}
        {...sharedDeleteModalProps}
      />
    </StyledFlex>
  );
};

export default ChatWidgetTable;
