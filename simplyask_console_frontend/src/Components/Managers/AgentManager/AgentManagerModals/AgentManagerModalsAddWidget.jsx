import styled from '@emotion/styled';
import { useTheme } from '@mui/system';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import routes from '../../../../config/routes';
import { useFilter } from '../../../../hooks/useFilter';
import { useGetCurrentUser } from '../../../../hooks/useGetCurrentUser';
import { useTableSortAndFilter } from '../../../../hooks/useTableSortAndFilter';
import { getFilteredChatWidgets } from '../../../../Services/axios/widgetAxios';
import { WIDGETS_QUERY_KEYS } from '../../../Settings/Components/FrontOffice/constants/common';
import { CHAT_WIDGETS_SIDE_FILTER_INITIAL_VALUES } from '../../../Settings/Components/FrontOffice/constants/initialValues';
import { EXPANDED_TYPES } from '../../../Settings/Components/FrontOffice/constants/tabConstants';
import { CHAT_WIDGETS_COLUMNS } from '../../../Settings/Components/FrontOffice/utils/formatters';
import {
  CHAT_WIDGETS_FILTER_KEY,
  chatWidgetSearchFormatter,
  chatWidgetsFiltersMeta,
} from '../../../Settings/Components/FrontOffice/utils/helpers';
import { StyledButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomTableIcons from '../../../shared/REDISIGNED/icons/CustomTableIcons';
import CenterModalFixed from '../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import TableV2 from '../../../shared/REDISIGNED/table-v2/Table-v2';
import { StyledFlex, StyledText } from '../../../shared/styles/styled';
import useAgents from '../hooks/useAgents';
import useUpdateAgent from '../hooks/useUpdateAgent';

import { useRecoilState } from 'recoil';
import { agentEditorAssociatedWidgets } from '../AgentEditor/store';
import AgentManagerModalWidgetFilters from './AgentManagerModalWidgetFilters/AgentManagerModalWidgetFilters';

export const StyledFlexTableRoot = styled(StyledFlex)`
  & > div > div {
    gap: 0px;
  }

  & .headerActionsContainer {
    margin-left: inherit;
    width: 100%;
  }
`;

const AgentManagerModalsAddWidget = ({
  open = false,
  onClose,
  onCloseSettingsAndCreateWidgetModals,
  clickedProcess,
  setPreventGoBackToPrimaryMenu,
  setClickedProcess,
  isAgentEditorSettingsView = false,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { currentUser } = useGetCurrentUser();
  const { colors, boxShadows } = useTheme();
  const [selectedTableWidgets, setSelectedTableWidgets] = useState([]);

  const widgetTableColumns = CHAT_WIDGETS_COLUMNS?.filter((column) => column.id !== 'delete');

  const [agentEditorWidgets, setAgentEditorWidgets] = useRecoilState(agentEditorAssociatedWidgets);

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
    searchText,
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
    pageSize: 999,
    initialSearchText: '',
    initialFilters: initialFilterValues,
    initialSorting: [
      {
        id: 'updatedAt',
        desc: false,
      },
    ],
    options: {
      select: (res) => {
        const filterClickedAgent = res?.content?.filter((widget) => {
          if (isAgentEditorSettingsView) {
            const updatedAgentEditorWidgets = agentEditorWidgets.map(({ widgetId }) => widgetId);
            return !updatedAgentEditorWidgets?.includes(widget.widgetId);
          }

          return !clickedProcess?.associatedWidgets?.includes(widget.widgetId);
        });

        return {
          ...res,
          content: filterClickedAgent,
          totalElements: filterClickedAgent?.length,
          numberOfElements: filterClickedAgent?.length,
        };
      },
    },
  });

  const { updateAgentById, isUpdateAgentByIdLoading } = useUpdateAgent({
    onSuccess: (data) => {
      toast.success('The chat widgets has been added successfully');
      setClickedProcess(data);
      onClose();
      queryClient.invalidateQueries({
        queryKey: [WIDGETS_QUERY_KEYS.GET_CHAT_WIDGETS_FILTERED],
      });

      setTimeout(() => {
        setPreventGoBackToPrimaryMenu?.(false);
      }, 3000);
    },
    onError: () => {
      toast.error('Something went wrong...');
      setPreventGoBackToPrimaryMenu?.(false);
    },
  });

  const allAssignedAgentIds = chatWidgetsData?.content
    ?.map((widget) => widget.assignedAgentIds)
    .flat()
    .join(',');

  const { agents: assignedAgentsAll, isAgentsLoading } = useAgents(
    { agentIds: allAssignedAgentIds, pageSize: 999 },
    {
      enabled: !!allAssignedAgentIds,
      select: (res) => res?.content,
    }
  );

  const getWidgetTableDataWithAgents = () => {
    const appendAgentsToWidgets = chatWidgetsData?.content?.map((widget) => {
      const { assignedAgentIds } = widget;
      const filterAgentsForWidget = assignedAgentsAll?.filter((agent) => assignedAgentIds.includes(agent.agentId));

      return { ...widget, agents: filterAgentsForWidget };
    });

    return { ...chatWidgetsData, content: appendAgentsToWidgets };
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

  const handleClearAll = () => {
    setFilterFieldValue(CHAT_WIDGETS_FILTER_KEY, CHAT_WIDGETS_SIDE_FILTER_INITIAL_VALUES);
    submitFilterValue();
    setSearchText('');
  };

  const handleClearFilterField = (key) => {
    setFilterFieldValue(CHAT_WIDGETS_FILTER_KEY, {
      ...sourceFilterValue[CHAT_WIDGETS_FILTER_KEY],
      [key]: CHAT_WIDGETS_SIDE_FILTER_INITIAL_VALUES[key],
    });
    submitFilterValue();
  };

  const tableMeta = {
    currentUser,
    theme: { colors, boxShadows },
    navigate: (data) => {
      onCloseSettingsAndCreateWidgetModals();
      navigate(data);
    },
  };

  const redirectToChatWidgetTable = () => {
    navigate({
      pathname: routes.SETTINGS_FRONT_OFFICE_TAB,
      search: `?autoExpandTab=${EXPANDED_TYPES.CHAT_WIDGETS}`,
    });
  };

  const addWidgetsToAgent = () => {
    if (!selectedTableWidgets?.length > 0) {
      toast.error('Could not add, as no chat widgets were selected.');
      return;
    }

    if (isAgentEditorSettingsView) {
      const refactoredSelectedTableWidgets = selectedTableWidgets.map((widgetId) => ({ widgetId }));

      const updatedWidgets = [...agentEditorWidgets, ...refactoredSelectedTableWidgets];

      setAgentEditorWidgets(updatedWidgets);

      onClose();
    } else {
      setPreventGoBackToPrimaryMenu?.(true);

      const body = {
        ...clickedProcess,
        associatedWidgets: [...clickedProcess.associatedWidgets, ...selectedTableWidgets],
      };

      const payload = {
        agentId: clickedProcess.agentId,
        ...body,
      };

      updateAgentById(payload);
    }
  };

  const getRowId = (row) => row.widgetId;

  const renderTableTitle = () => (
    <StyledText size={19} weight={600}>
      Select Chat Widgets
    </StyledText>
  );

  const renderTableDescription = () => (
    <StyledText weight={400} size={14} mt={6} mb={10} display="block">
      Don’t see a chat widget that works for you?{' '}
      <StyledButton
        variant="text"
        fontWeight={400}
        fontSize={14}
        display="inline"
        cursor="pointer"
        onClick={redirectToChatWidgetTable}
      >
        Click here
      </StyledButton>{' '}
      to go to Settings and create a new chat widget
    </StyledText>
  );

  const renderEmptyTable = () => (
    <StyledFlex gap="18px" flex="1" alignItems="center" justifyContent="center" mt="10vh" mb="10vh">
      <CustomTableIcons icon="EMPTY" width={88} />
      <StyledFlex width="290px" alignItems="center" justifyContent="center">
        <StyledText as="h3" size={18} lh={22} weight={600} mb={12} textAlign="center">
          There Are No Chat Widgets Available
        </StyledText>

        <StyledButton fontSize={16} variant="text" onClick={redirectToChatWidgetTable}>
          Create a New Chat Widget
        </StyledButton>
      </StyledFlex>
    </StyledFlex>
  );

  const renderHeaderFilterActions = () => (
    <AgentManagerModalWidgetFilters
      initialValues={sourceFilterValue[CHAT_WIDGETS_FILTER_KEY]}
      onApplyFilters={(sideFilter) => {
        setFilterFieldValue(CHAT_WIDGETS_FILTER_KEY, sideFilter);
        submitFilterValue();
      }}
      searchText={searchText}
      onSearch={(e) => setSearchText(e.target.value)}
    />
  );

  return (
    <CenterModalFixed
      open={open}
      onClose={onClose}
      maxWidth="80%"
      height="80%"
      width="min-content"
      bodyHeight="100%"
      bodyPadding="0"
      enableScrollbar={false}
    >
      <StyledFlexTableRoot height="100%">
        <TableV2
          data={getWidgetTableDataWithAgents()}
          columns={widgetTableColumns}
          entityName="Chat Widgets"
          sorting={sorting}
          setSorting={handleSorting}
          pagination={pagination}
          setPagination={setPagination}
          selectedFilters={selectedFiltersBar}
          enableRowSelection
          onClearAllFilters={handleClearAll}
          onClearFilter={handleClearFilterField}
          meta={tableMeta}
          isLoading={isFetching || isAgentsLoading || isUpdateAgentByIdLoading}
          isEmbedded
          enableShowFiltersButton={false}
          enableSearch={false}
          pinColumns={['name']}
          getRowId={getRowId}
          enableSelectedToolbar={false}
          pinSelectColumn
          rootHeight="100%"
          title={renderTableTitle()}
          titleDescription={renderTableDescription()}
          onSelectionChange={setSelectedTableWidgets}
          tableProps={{
            renderEmptyRowsFallback: () => renderEmptyTable(),
          }}
          showActionsInActionBar
          headerActions={renderHeaderFilterActions()}
          onTableRefresh={refetch}
          isRefreshAfterAction
        />
      </StyledFlexTableRoot>

      <StyledFlex position="absolute" bottom="18px" right="30px">
        <StyledFlex direction="row" gap="15px">
          <StyledButton primary variant="contained" minWidth={107} onClick={onClose}>
            Close
          </StyledButton>
          <StyledButton primary variant="contained" secondary minWidth={107} onClick={addWidgetsToAgent}>
            Add
          </StyledButton>
        </StyledFlex>
      </StyledFlex>
    </CenterModalFixed>
  );
};

export default AgentManagerModalsAddWidget;
