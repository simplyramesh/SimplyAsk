import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getKnowledgeBase } from '../../../../../../Services/axios/knowledgeBaseAxios';
import routes from '../../../../../../config/routes';
import { useUser } from '../../../../../../contexts/UserContext';
import { useFilter } from '../../../../../../hooks/useFilter';
import { useTableSortAndFilter } from '../../../../../../hooks/useTableSortAndFilter';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomTableIcons from '../../../../../shared/REDISIGNED/icons/CustomTableIcons';
import ConfirmationModal from '../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import CustomSidebar from '../../../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import TableV2 from '../../../../../shared/REDISIGNED/table-v2/Table-v2';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import KnowledgeBasesFilters from './components/KnowledgeBasesFilters';
import { useDeleteKnowledgeBase } from './hooks/useDeleteKnowledgeBase';
import { useRegenerateKnowledgeBase } from './hooks/useRegenerateKnowledgeBase';
import {
  KNOWLEDGE_BASES_SIDE_FILTER_INITIAL_VALUES,
  KNOWLEDGE_BASE_QUERY_KEYS,
  KNOWLEDGE_BASE_STATUS,
} from './utils/constants';
import { KNOWLEDGE_BASE_COLUMNS } from './utils/formatter';
import { KNOWLEDGE_BASES_FILTER_KEY, knowledgeBaseSearchFormatter, knowledgeBasesFiltersMeta } from './utils/helper';

const SimplyAssistantKnowledgeBases = () => {
  const [knowledgeBaseToDelete, setKnowledgeBaseToDelete] = useState(null);
  const [isKnowledgeBasesFiltersOpen, setIsKnowledgeBasesFiltersOpen] = useState(false);
  const [enableGetKnowledgeBaseQuery, setEnableGetKnowledgeBaseQuery] = useState(true);
  const navigate = useNavigate();

  const { user } = useUser();

  const { regenerateKnowledgeBaseTask, isRegenerateKnowledgeBaseTaskLoading } = useRegenerateKnowledgeBase({
    onSuccess: () => {
      toast.success('knowledge base has been regenerated');
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });

  const { sourceFilterValue, initialFilterValues, setFilterFieldValue, submitFilterValue } = useFilter({
    formikProps: {
      initialValues: {
        [KNOWLEDGE_BASES_FILTER_KEY]: KNOWLEDGE_BASES_SIDE_FILTER_INITIAL_VALUES,
        timezone: user?.timezone,
      },
    },
    onSubmit: ({ filterValue, selectedFilters }) => {
      setColumnFilters(filterValue);
      setSelectedFiltersBar(selectedFilters);
    },
    formatter: knowledgeBaseSearchFormatter,
    selectedFiltersMeta: knowledgeBasesFiltersMeta,
  });

  const { deleteKnowledgeBase, isDeleteKnowledgeBaseLoading } = useDeleteKnowledgeBase({
    onSuccess: () => {
      toast.success('knowledge base has been deleted');
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });

  const renderTableActions = () => (
    <StyledFlex direction="row" gap="15px">
      <StyledButton
        variant="contained"
        secondary
        startIcon={<CustomTableIcons icon="ADD" width={24} color="white" />}
        onClick={() =>
          navigate({
            pathname: routes.SETTINGS_GENERAL_TAB_CREATE_KNOWLEDGE_BASE,
          })
        }
      >
        Create Knowledge Base
      </StyledButton>
    </StyledFlex>
  );

  const {
    setColumnFilters,
    selectedFiltersBar,
    setSelectedFiltersBar,
    setSearchText,
    sorting,
    setSorting,
    pagination,
    setPagination,
    data: filteredKnowledgeBases,
    isFetching,
    refetch,
  } = useTableSortAndFilter({
    queryFn: getKnowledgeBase,
    queryKey: KNOWLEDGE_BASE_QUERY_KEYS.GET_KNOWLEDGE_BASE,
    pageIndex: 0,
    pageSize: 10,
    initialSearchText: '',
    initialFilters: initialFilterValues,
    initialSorting: [
      {
        id: 'updatedAt',
        desc: true,
      },
    ],
    options: {
      onError: () => toast.error('Something went wrong'),
      refetchInterval: enableGetKnowledgeBaseQuery ? 60000 : undefined,
    },
  });

  const handleClearAll = () => {
    setFilterFieldValue(KNOWLEDGE_BASES_FILTER_KEY, KNOWLEDGE_BASES_SIDE_FILTER_INITIAL_VALUES);
    submitFilterValue();
  };

  const handleClearFilterField = (key) => {
    setFilterFieldValue(KNOWLEDGE_BASES_FILTER_KEY, {
      ...sourceFilterValue[KNOWLEDGE_BASES_FILTER_KEY],
      [key]: KNOWLEDGE_BASES_SIDE_FILTER_INITIAL_VALUES[key],
    });
    submitFilterValue();
  };

  const handleSorting = (old) => {
    const { id, desc } = old()[0];

    setFilterFieldValue(
      KNOWLEDGE_BASES_FILTER_KEY,
      { ...sourceFilterValue[KNOWLEDGE_BASES_FILTER_KEY], [`${id}Sort`]: `${!desc}` },
      false
    );
    setSorting(old);
    submitFilterValue();
  };

  useEffect(() => {
    const shouldQueryEnabled = filteredKnowledgeBases?.content?.every(
      (kb) => kb.status === KNOWLEDGE_BASE_STATUS.READY
    );
    setEnableGetKnowledgeBaseQuery(!shouldQueryEnabled);
  }, [filteredKnowledgeBases]);

  const handleRegenerateKnowledgeBase = (knowledgeBaseId) => regenerateKnowledgeBaseTask(knowledgeBaseId);

  const handleSingleDelete = (knowledgeBase) => setKnowledgeBaseToDelete(knowledgeBase);

  const onTableRowClick = (row) => {
    navigate(routes.SETTINGS_GENERAL_TAB_EDIT_KNOWLEDGE_BASE.replace(':knowledgeBaseId', row.knowledgeBaseId));
  };

  const tableMeta = {
    handleSingleDelete,
    handleRegenerateKnowledgeBase,
    onTableRowClick,
    user,
  };

  return (
    <StyledFlex mb="47px">
      <TableV2
        data={filteredKnowledgeBases}
        columns={KNOWLEDGE_BASE_COLUMNS}
        searchPlaceholder="Search Knowledge Base Names..."
        onSearch={(e) => setSearchText(e.target.value)}
        sorting={sorting}
        setSorting={handleSorting}
        onShowFilters={() => setIsKnowledgeBasesFiltersOpen(true)}
        selectedFilters={selectedFiltersBar}
        onClearAllFilters={handleClearAll}
        onClearFilter={handleClearFilterField}
        isLoading={isFetching || isDeleteKnowledgeBaseLoading || isRegenerateKnowledgeBaseTaskLoading}
        pagination={pagination}
        setPagination={setPagination}
        emptyTableDescription={
          !!filteredKnowledgeBases
            ? 'There are no results on your current search and/ or filters, adjust your filters, and try again.'
            : 'No knowledge bases have been made yet.'
        }
        meta={tableMeta}
        headerActions={renderTableActions()}
        entityName="Knowledge Bases"
        pinColumns={['knowledgeName']}
        pinRowHoverActionColumns={['deleteById', 'regenerateById']}
        enableRowSelection={false}
        isEmbedded
        onTableRefresh={refetch}
      />
      <ConfirmationModal
        isOpen={!!knowledgeBaseToDelete}
        successBtnText="Confirm"
        alertType="DANGER"
        title="Are You Sure?"
        onCloseModal={() => setKnowledgeBaseToDelete(null)}
        onSuccessClick={() => {
          deleteKnowledgeBase(knowledgeBaseToDelete?.knowledgeBaseId);
          setKnowledgeBaseToDelete(null);
        }}
        actionConfirmationText="delete knowledge base"
      >
        <StyledText textAlign="center" size={14} lh={22}>
          You are about to delete the
          <StyledText display="inline" weight={600}>
            {' '}
            {knowledgeBaseToDelete?.name}{' '}
          </StyledText>
          . Completing this action will
          <StyledText display="inline" weight={700}>
            {' '}
            permanently delete{' '}
          </StyledText>
          the knowledge base and its configurations.
        </StyledText>
      </ConfirmationModal>
      <CustomSidebar
        open={isKnowledgeBasesFiltersOpen}
        onClose={() => setIsKnowledgeBasesFiltersOpen(false)}
        headStyleType="filter"
      >
        {({ customActionsRef }) => (
          <StyledFlex>
            {isKnowledgeBasesFiltersOpen && (
              <KnowledgeBasesFilters
                initialValues={sourceFilterValue[KNOWLEDGE_BASES_FILTER_KEY]}
                onApplyFilters={(sideFilter) => {
                  setIsKnowledgeBasesFiltersOpen(false);
                  setFilterFieldValue(KNOWLEDGE_BASES_FILTER_KEY, sideFilter);
                  submitFilterValue();
                }}
                customActionsRef={customActionsRef}
              />
            )}
          </StyledFlex>
        )}
      </CustomSidebar>
    </StyledFlex>
  );
};

export default SimplyAssistantKnowledgeBases;
