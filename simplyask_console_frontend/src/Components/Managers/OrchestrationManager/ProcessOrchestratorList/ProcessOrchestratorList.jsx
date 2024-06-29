import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import routes from '../../../../config/routes';
import useOrchestrationCreate from '../../../../hooks/orchestrator/useOrchestrationCreate';
import useUpdateOrchestrator from '../../../../hooks/orchestrator/useOrchestrationUpdate';
import useOrchestratorDelete from '../../../../hooks/orchestrator/useOrchestratorDelete';
import { ORCHESTRATOR_QUERY_KEY } from '../../../../hooks/orchestrator/useOrchestratorDetails';
import { useOrchestratorExecuteBulk } from '../../../../hooks/orchestrator/useOrchestratorExecuteBulk';
import { useOrchestratorExecuteFromStart } from '../../../../hooks/orchestrator/useOrchestratorExecuteFromStart';
import { useFilter } from '../../../../hooks/useFilter';
import { useGetCurrentUser } from '../../../../hooks/useGetCurrentUser';
import { useTableSortAndFilter } from '../../../../hooks/useTableSortAndFilter';
import { getOrchestratorGroups } from '../../../../Services/axios/orchestrator';
import { StyledButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';
import TrashBinIcon from '../../../shared/REDISIGNED/icons/svgIcons/TrashBinIcon';
import ContentLayout from '../../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../../../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import TableV2 from '../../../shared/REDISIGNED/table-v2/Table-v2';

import { useUpdateTableFilterSearchParams } from '../../../../hooks/useTableFilterSearchParams';
import {
  ORCHESTRATOR_GROUPS_INITIAL_VALUES,
  ORCHESTRATOR_GROUPS_SIDE_FILTER_INITIAL_VALUES,
  ORCHESTRATOR_GROUPS_SIDE_FILTER_KEY,
} from './constants/initialValues';
import CreateOrchestrationModal from './CreateOrchestrationModal/CreateOrchestrationModal';
import DeleteOrchestrationModal from './DeleteOrchestrationModal/DeleteOrchestrationModal';
import ManageOrchestratorJobTags from './ManageOrchestratorJobTags/ManageOrchestratorJobTags';
import ProcessOrchestratorListFilters from './ProcessOrchestratorListFilters/ProcessOrchestratorListFilters';
import { ORCHESTRATOR_GROUPS_COLUMNS } from './utils/formatters';
import { orchestratorListFormatter, selectedOrchestratorListFiltersMeta } from './utils/helpers';

const ProcessOrchestratorList = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const { currentUser: user } = useGetCurrentUser();

  const [orchestrationJobToDelete, setOrchestrationJobToDelete] = useState(null);
  const [isCreateOrchestrationOpen, setIsCreateOrchestrationOpen] = useState(false);
  const [manageTags, setManageTags] = useState(false);

  const [isViewFiltersOpen, setIsViewFiltersOpen] = useState(false);
  const [tagOptions, setTagOptions] = useState(null);

  const [selectedOrchestratorJobIds, setSelectedOrchestratorJobIds] = useState([]);
  const [selectionRefreshCount, setSelectionRefreshCount] = useState(0);

  const isBulkDelete = Array.isArray(orchestrationJobToDelete);

  const { sourceFilterValue, setFilterFieldValue, submitFilterValue, initialFilterValues } = useFilter({
    formikProps: {
      initialValues: {
        [ORCHESTRATOR_GROUPS_SIDE_FILTER_KEY]: ORCHESTRATOR_GROUPS_SIDE_FILTER_INITIAL_VALUES,
        ...ORCHESTRATOR_GROUPS_INITIAL_VALUES,
        timezone: user?.timezone,
      },
    },
    onSubmit: ({ filterValue, selectedFilters }) => {
      setColumnFilters(filterValue);
      setSelectedFiltersBar(selectedFilters);
      handleUrlFiltersMeta(filterValue, selectedFilters);
    },
    formatter: orchestratorListFormatter,
    selectedFiltersMeta: selectedOrchestratorListFiltersMeta,
  });

  const { updateSearchParams, handleUrlFiltersMeta } = useUpdateTableFilterSearchParams({
    enableURLSearchParams: true,
  });

  const {
    pagination,
    setColumnFilters,
    setSearchText,
    setPagination,
    sorting,
    setSorting,
    data,
    isFetching,
    selectedFiltersBar,
    setSelectedFiltersBar,
  } = useTableSortAndFilter({
    queryFn: getOrchestratorGroups,
    queryKey: ORCHESTRATOR_QUERY_KEY,
    initialFilters: initialFilterValues,
    initialSorting: [
      {
        id: 'updatedAt',
        desc: true,
      },
    ],
    pageSize: 25,
    options: {
      select: (resData) => ({
        ...resData,
        tagOptions: [...new Set(resData?.content?.reduce((acc, curr) => [...acc, ...curr.tags], []))],
      }),
    },
    updateSearchParams,
    enableURLSearchParams: true,
  });

  const { createOrchestration } = useOrchestrationCreate({
    onSuccess: () => {
      toast.success('Created Orchestration');
    },
    onError: () => {
      toast.error('Failed to create Orchestration');
    },
  });

  const { executeOrchestrator, isOrchestratorExecuting } = useOrchestratorExecuteFromStart({
    onSuccess: ({ data }) => {
      const { jobGroupExecutionId, jobId } = data?.[0] || {};
      navigate(`${routes.PROCESS_ORCHESTRATION}/${jobId}/history/${jobGroupExecutionId}`);
    },
  });

  const { executeOrchestratorBulk } = useOrchestratorExecuteBulk({
    onSuccess: () => {
      toast.success('Orchestrator has been executed successfully');
    },
    onError: () => {
      toast.error('Failed to execute Orchestration');
    },
  });

  const { removeOrchestrationGroups } = useOrchestratorDelete({
    onSuccess: ({ data: resData, variables: { groupIds } }) => {
      toast.success(`${groupIds.length} Orchestration ${resData}`);
      setSelectedOrchestratorJobIds([]);
    },
    onError: () => {
      toast.error('Failed to delete Orchestration');
    },
  });

  const { updateOrchestration } = useUpdateOrchestrator({
    onSuccess: () => {
      toast.success('Orchestrator has been updated successfully.');
      setSelectedOrchestratorJobIds([]);
    },
    onError: () => {
      toast.error('Failed to update Orchestrator.');
    },
  });

  const handleClearAll = () => {
    setFilterFieldValue(ORCHESTRATOR_GROUPS_SIDE_FILTER_KEY, ORCHESTRATOR_GROUPS_SIDE_FILTER_INITIAL_VALUES);
    submitFilterValue();
  };

  const handleClearFilterField = (key) => {
    setFilterFieldValue(ORCHESTRATOR_GROUPS_SIDE_FILTER_KEY, {
      ...sourceFilterValue[ORCHESTRATOR_GROUPS_SIDE_FILTER_KEY],
      [key]: ORCHESTRATOR_GROUPS_INITIAL_VALUES[key],
    });
    submitFilterValue();
  };

  const handleSorting = (old) => {
    const { id, desc } = old()[0];

    setFilterFieldValue(
      ORCHESTRATOR_GROUPS_SIDE_FILTER_KEY,
      { ...sourceFilterValue[ORCHESTRATOR_GROUPS_SIDE_FILTER_KEY], [`${id}Sort`]: String(!desc) },
      false
    );
    setSorting(old);
    submitFilterValue();
  };

  const tableMeta = {
    handleSingleDelete: (jobToDelete) => setOrchestrationJobToDelete(jobToDelete),
    handleSingleExecute: executeOrchestrator,
    isOrchestratorExecuting,
    handleNavigateToDetails: (jobToNavigate) =>
      navigate({
        pathname: `${routes.PROCESS_ORCHESTRATION}/${jobToNavigate.id}`,
        search: '?tab=details',
      }),
    handleManageTags: ({ processId, tags }) => setManageTags({ processId, tags }),
    user,
    theme,
  };

  const tableBulkActions = [
    {
      text: 'Delete',
      icon: <TrashBinIcon />,
      callback: () => {
        setOrchestrationJobToDelete(selectedOrchestratorJobIds);
      },
    },
    {
      text: 'Manage Tags',
      icon: <SellOutlinedIcon />,
      callback: () => {
        const selectedUniqueOrchestratorJobTags = [
          ...(data?.content?.reduce((acc, { id, tags }) => {
            if (selectedOrchestratorJobIds.includes(id.toString())) {
              tags.forEach((tag) => acc.add(tag));
            }
            return acc;
          }, new Set()) || []),
        ];

        setManageTags({
          processId: selectedOrchestratorJobIds.map((id) => parseInt(id)),
          tags: selectedUniqueOrchestratorJobTags,
        });
      },
    },
    {
      text: 'Execute',
      icon: <PlayCircleOutlinedIcon />,
      callback: () => {
        const groupIdList = selectedOrchestratorJobIds.map((id) => parseInt(id));

        executeOrchestratorBulk(groupIdList);
      },
    },
  ];

  const renderTableHeaderActions = () => (
    <StyledButton secondary variant="contained" onClick={() => setIsCreateOrchestrationOpen(true)}>
      Create Orchestration
    </StyledButton>
  );

  return (
    <PageLayout fullPage>
      <ContentLayout noPadding fullHeight>
        <TableV2
          data={data}
          columns={ORCHESTRATOR_GROUPS_COLUMNS}
          searchPlaceholder="Search Orchestration Names and IDs..."
          onSearch={(e) => setSearchText(e.target.value)}
          selectedFilters={selectedFiltersBar}
          onClearAllFilters={handleClearAll}
          onClearFilter={handleClearFilterField}
          onShowFilters={() => {
            if (!tagOptions) setTagOptions(data?.tagOptions);

            setIsViewFiltersOpen(true);
          }}
          isLoading={isFetching}
          sorting={sorting}
          setSorting={handleSorting}
          onSelectionChange={setSelectedOrchestratorJobIds}
          selectBarActions={tableBulkActions}
          pagination={pagination}
          setPagination={setPagination}
          emptyTableDescription="No Orchestrations Found"
          pinSelectColumn
          meta={tableMeta}
          headerActions={renderTableHeaderActions()}
          entityName="Process Orchestrator"
          selectionRefreshTrigger={selectionRefreshCount}
          pinColumns={['name']}
          pinRowHoverActionColumns={['deleteById', 'manageTags', 'executeById']}
          enablePageSizeChange
        />
      </ContentLayout>
      <DeleteOrchestrationModal
        isOpen={!!orchestrationJobToDelete}
        onClose={() => setOrchestrationJobToDelete(null)}
        onDelete={() => {
          if (isBulkDelete) {
            const groupIds = selectedOrchestratorJobIds.map((id) => parseInt(id));

            removeOrchestrationGroups({ groupIds });
            setSelectionRefreshCount((prev) => prev + 1);
          } else {
            removeOrchestrationGroups({ groupIds: [orchestrationJobToDelete?.id] });
          }

          setOrchestrationJobToDelete(null);
        }}
        isBulkDelete={isBulkDelete}
      />
      <ProcessOrchestratorListFilters
        isOpen={isViewFiltersOpen}
        onClose={() => setIsViewFiltersOpen(false)}
        initialValues={sourceFilterValue[ORCHESTRATOR_GROUPS_SIDE_FILTER_KEY]}
        onApplyFilters={(sideFilter) => {
          setIsViewFiltersOpen(false);
          setFilterFieldValue(ORCHESTRATOR_GROUPS_SIDE_FILTER_KEY, sideFilter);
          submitFilterValue();
        }}
        tagOptions={tagOptions || []}
      />
      <CreateOrchestrationModal
        isOpen={isCreateOrchestrationOpen}
        onClose={() => setIsCreateOrchestrationOpen(false)}
        onCreateOrchestration={(values) => {
          createOrchestration(values);
          setIsCreateOrchestrationOpen(false);
        }}
      />
      <ManageOrchestratorJobTags
        isOpen={!!manageTags}
        onClose={() => setManageTags(null)}
        group={manageTags}
        onConfirm={({ processId, tags }) => {
          setSelectionRefreshCount((prev) => prev + 1);
          updateOrchestration({ processId, body: { tags } });
        }}
      />
    </PageLayout>
  );
};

export default ProcessOrchestratorList;
