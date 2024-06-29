import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { StyledButton } from '../../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomTableIcons from '../../../../../../../shared/REDISIGNED/icons/CustomTableIcons';
import ConfirmationModal from '../../../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import CustomSidebar from '../../../../../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import TableV2 from '../../../../../../../shared/REDISIGNED/table-v2/Table-v2';
import { HEADER_ACTIONS_POSITION } from '../../../../../../../shared/REDISIGNED/table-v2/TableHeader/TableHeader';
import { StyledCard, StyledFlex, StyledText } from '../../../../../../../shared/styles/styled';
import { KNOWLEDGE_SOURCE_COLUMNS } from '../../utils/formatter';
import KnowledgeSourcesFilters from './KnowledgeSourcesFilters';

import BulkDeleteIcon from '../../../../../../../../Assets/icons/issues/bulkOperations/delete.svg?component';
import { useUser } from '../../../../../../../../contexts/UserContext';
import BulkDeleteModal from '../../../../../../../Issues/components/ServiceTickets/components/BulkDeleteModal/BulkDeleteModal';
import { generateUUID } from '../../../../../../AccessManagement/utils/helpers';
import KnowledgeSourceFormModal from '../KnowledgeSourceFormModals/KnowledgeSourceFormModal';

const KnowledgeSources = ({ values, setFieldValue, filteredKnowledgeSources, setFilteredKnowledgeSources }) => {
  const [knowledgeSourceToDelete, setKnowledgeSourceToDelete] = useState(null);
  const [isKnowledgeSourcesFiltersOpen, setIsKnowledgeSourcesFiltersOpen] = useState(false);
  const [searchNameText, setSearchNameText] = useState('');
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [selectedKnowledgeSourceIds, setSelectedKnowledgeSourcesIds] = useState([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [selectionRefreshCount, setSelectionRefreshCount] = useState(0);
  const [typeAndLastUpdatedFilterValues, setTypeAndLastUpdatedFilterValues] = useState({
    type: null,
    lastUpdated: null,
  });
  const [isCreateKnowledgeSourceModalOpen, setIsCreateKnowledgeSourceModalOpen] = useState({
    isOpen: false,
    isEditMode: false,
    modalValues: null,
  });
  const EMPTY_STRING = '';
  const { user } = useUser();

  const handleCreateKnowledgeSource = (sourceValues, shouldStayOpen, sourceIdToEdit) => {
    const knowledgeSources = values.knowledgeSources ?? [];

    if (sourceIdToEdit) {
      const sourceToEditIndex = knowledgeSources.findIndex((source) => source.id === sourceIdToEdit);
      const updatedKnowledgeSources = [...knowledgeSources];
      updatedKnowledgeSources[sourceToEditIndex] = {
        ...sourceValues,
        id: sourceIdToEdit,
        updatedAt: new Date(),
        isEdited: true,
      };
      setFieldValue('knowledgeSources', updatedKnowledgeSources);
    } else {
      const sourceValuesWithId = { ...sourceValues, id: generateUUID(), updatedAt: new Date() };
      const updatedKnowledgeSources = [...knowledgeSources, sourceValuesWithId];
      setFieldValue('knowledgeSources', updatedKnowledgeSources);
    }

    toast.success(
      `Knowledge source "${sourceValues.name}" has been ${sourceIdToEdit ? 'edited' : 'created '} successfully`
    );

    if (!shouldStayOpen) {
      setIsCreateKnowledgeSourceModalOpen((prev) => ({
        ...prev,
        isOpen: false,
      }));
    }
  };

  useEffect(() => {
    const { knowledgeSources } = values;
    const filteredKnowledgeSources = isFilterApplied
      ? knowledgeSources.filter((source) => {
          const queriedType = typeAndLastUpdatedFilterValues.type?.value ?? EMPTY_STRING;
          const queriedLastUpdated = typeAndLastUpdatedFilterValues.lastUpdated?.value ?? EMPTY_STRING;
          const [fromLastUpdated, toLastUpdated] = queriedLastUpdated;

          return (
            (!queriedType || source.type === queriedType) &&
            (!queriedLastUpdated ||
              (source.updatedAt >= new Date(fromLastUpdated) && source.updatedAt <= new Date(toLastUpdated)))
          );
        })
      : knowledgeSources;

    const queriedKnowledgeSources = searchNameText
      ? filteredKnowledgeSources.filter((source) => source.name.toLowerCase().includes(searchNameText.toLowerCase()))
      : filteredKnowledgeSources;

    setFilteredKnowledgeSources(queriedKnowledgeSources);
  }, [searchNameText, values.knowledgeSources, typeAndLastUpdatedFilterValues, isFilterApplied]);

  const handleOnApplyFilter = () => {
    setIsFilterApplied(true);
    setIsKnowledgeSourcesFiltersOpen(false);
  };

  const onTableRowClick = (row) => {
    setIsCreateKnowledgeSourceModalOpen((prev) => ({
      ...prev,
      isOpen: true,
      modalValues: row,
      isEditMode: true,
    }));
  };

  const handleSingleRowDelete = () => {
    const updatedKnowledgeSources = values.knowledgeSources.filter(
      (source) => source.id !== knowledgeSourceToDelete.id
    );
    setFieldValue('knowledgeSources', updatedKnowledgeSources);
    toast.success(`Knowledge source "${knowledgeSourceToDelete.name}" has been deleted successfully`);
  };

  const handleBulkDelete = () => {
    const updatedKnowledgeSources = values.knowledgeSources.filter(
      (source) => !selectedKnowledgeSourceIds.includes(source.id)
    );
    setFieldValue('knowledgeSources', updatedKnowledgeSources);
    setIsBulkDeleteModalOpen(false);
    setSelectionRefreshCount((prev) => ++prev);
    toast.success('Knowledge sources have been deleted successfully');
  };

  const tableMeta = {
    handleSingleDelete: (knowledgeSource) => setKnowledgeSourceToDelete(knowledgeSource),
    onTableRowClick,
    user,
  };

  const tableBulkActions = [
    {
      text: 'Delete',
      icon: <BulkDeleteIcon />,
      callback: () => {
        setIsBulkDeleteModalOpen(true);
      },
    },
  ];

  const renderTableHeaderActions = () => (
    <StyledFlex direction="row" gap="15px">
      <StyledButton
        variant="contained"
        secondary
        startIcon={<CustomTableIcons icon="ADD" width={24} color="white" />}
        onClick={() =>
          setIsCreateKnowledgeSourceModalOpen((prev) => ({
            ...prev,
            isOpen: true,
            modalValues: null,
            isEditMode: false,
          }))
        }
      >
        Create Knowledge Source
      </StyledButton>
    </StyledFlex>
  );

  const emptyTableDescription = values?.knowledgeSources?.length
    ? 'There are no results on your current search and/ or filters, adjust your filters, and try again.'
    : 'No knowledge Sources have been made yet.';

  return (
    <StyledCard>
      <TableV2
        title="Knowledge Sources"
        titleDescription="Create knowledge sources and and define values for them."
        data={{ content: searchNameText || isFilterApplied ? filteredKnowledgeSources : values.knowledgeSources }}
        columns={KNOWLEDGE_SOURCE_COLUMNS}
        searchPlaceholder="Search Knowledge Source Names..."
        onSearch={(e) => setSearchNameText(e.target.value)}
        onShowFilters={() => setIsKnowledgeSourcesFiltersOpen(true)}
        isLoading={false}
        sorting={[{}]}
        onSelectionChange={setSelectedKnowledgeSourcesIds}
        selectBarActions={tableBulkActions}
        pinSelectColumn
        emptyTableDescription={emptyTableDescription}
        meta={tableMeta}
        headerActions={renderTableHeaderActions()}
        headerActionsPosition={HEADER_ACTIONS_POSITION.TITLE_BAR}
        entityName="Knowledge Sources"
        selectionRefreshTrigger={selectionRefreshCount}
        pinColumns={['knowledgeSourceName']}
        pinRowHoverActionColumns={['deleteById']}
        enableFooter={false}
      />

      <ConfirmationModal
        isOpen={!!knowledgeSourceToDelete}
        successBtnText="Confirm"
        alertType="WARNING"
        title="Are You Sure?"
        onCloseModal={() => setKnowledgeSourceToDelete(null)}
        onSuccessClick={() => {
          handleSingleRowDelete();
          setKnowledgeSourceToDelete(null);
        }}
      >
        <StyledText textAlign="center" size={14} lh={22}>
          You are about to delete the
          <StyledText display="inline" weight={600}>
            {' '}
            {knowledgeSourceToDelete?.name}{' '}
          </StyledText>
          . This action will permanently remove it, and it cannot be restored.
        </StyledText>
      </ConfirmationModal>

      <BulkDeleteModal
        open={isBulkDeleteModalOpen}
        selectedTickets={selectedKnowledgeSourceIds}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onDelete={handleBulkDelete}
        tableType="Knowledge Sources"
      />

      <KnowledgeSourceFormModal
        open={isCreateKnowledgeSourceModalOpen.isOpen}
        onClose={() =>
          setIsCreateKnowledgeSourceModalOpen((prev) => ({
            ...prev,
            isOpen: false,
          }))
        }
        onSubmit={handleCreateKnowledgeSource}
        modalProps={isCreateKnowledgeSourceModalOpen}
        knowledgeSources={values.knowledgeSources}
      />
      <CustomSidebar
        open={isKnowledgeSourcesFiltersOpen}
        onClose={() => setIsKnowledgeSourcesFiltersOpen(false)}
        headStyleType="filter"
      >
        {({ customActionsRef }) => (
          <StyledFlex>
            {isKnowledgeSourcesFiltersOpen && (
              <KnowledgeSourcesFilters
                customActionsRef={customActionsRef}
                setTypeAndLastUpdated={setTypeAndLastUpdatedFilterValues}
                typeAndLastUpdatedValues={typeAndLastUpdatedFilterValues}
                onApplyFilter={handleOnApplyFilter}
                setIsFilterApplied={setIsFilterApplied}
              />
            )}
          </StyledFlex>
        )}
      </CustomSidebar>
    </StyledCard>
  );
};

export default KnowledgeSources;
