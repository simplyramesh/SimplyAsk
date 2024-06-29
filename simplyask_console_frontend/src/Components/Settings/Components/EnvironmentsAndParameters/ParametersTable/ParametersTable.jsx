import { useState } from 'react';

import { AddRounded } from '@mui/icons-material';

import { useDeleteParameterSet } from '../../../../../hooks/environments/useDeleteParametersSet';
import { useFilter } from '../../../../../hooks/useFilter';
import { useTableSortAndFilter } from '../../../../../hooks/useTableSortAndFilter';
import { getParametersSets } from '../../../../../Services/axios/environment';
import { useModalToggle } from '../../../../shared/REDISIGNED/modals/CenterModalFixed/hooks/useModalToggle';
import TableV2 from '../../../../shared/REDISIGNED/table-v2/Table-v2';
import { PARAMETER_SETS_SIDE_FILTER_INITIAL_VALUES, PARAMETERS_SET_SIDE_FILTER_KEY } from '../utils/constants';
import {
  PARAMETER_SET_COLUMNS_SCHEMA,
  parametersSetFormatter,
  selectedParametersSetFiltersMeta,
} from '../utils/formatters';

import { useNavigate } from 'react-router-dom';
import routes from '../../../../../config/routes';
import { GET_PARAMETERS_SETS_TABLE_QUERY_KEY } from '../../../../../hooks/environments/useGetParametersSet';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import ParametersDeleteModal from './ParametersDeleteModal';
import ParametersFiltersSideBar from './ParametersFiltersSideBar';

const ParametersTable = () => {
  const navigate = useNavigate();
  const [openDeleteParameterModal, setOpenDeleteParameterModal] = useState(null);
  const [clickedTableRow, setClickedTableRow] = useState(null);

  const { open: isParametersSetFiltersOpen, setOpen: setIsParametersSetFilterOpen } = useModalToggle();

  const { deleteParameterSet } = useDeleteParameterSet();

  const { sourceFilterValue, setFilterFieldValue, submitFilterValue, initialFilterValues } = useFilter({
    formikProps: {
      initialValues: { ...PARAMETER_SETS_SIDE_FILTER_INITIAL_VALUES },
    },
    onSubmit: ({ filterValue, selectedFilters }) => {
      setColumnFilters(filterValue);
      setSelectedFiltersBar(selectedFilters);
    },
    formatter: parametersSetFormatter,
    selectedFiltersMeta: selectedParametersSetFiltersMeta,
  });

  const {
    setColumnFilters,
    setSearchText,
    data,
    pagination,
    setPagination,
    sorting,
    setSorting,
    isFetching,
    selectedFiltersBar,
    setSelectedFiltersBar,
    refetch,
  } = useTableSortAndFilter({
    queryFn: getParametersSets,
    initialFilters: initialFilterValues,
    initialSorting: [
      {
        desc: true,
        id: '',
      },
    ],
    queryKey: GET_PARAMETERS_SETS_TABLE_QUERY_KEY,
  });

  const handleClearAllFilters = () => {
    setFilterFieldValue(PARAMETERS_SET_SIDE_FILTER_KEY, PARAMETER_SETS_SIDE_FILTER_INITIAL_VALUES);
    submitFilterValue();
  };

  const handleClearFilterField = (key) => {
    setFilterFieldValue(PARAMETERS_SET_SIDE_FILTER_KEY, {
      ...sourceFilterValue[PARAMETERS_SET_SIDE_FILTER_KEY],
      [key]: PARAMETER_SETS_SIDE_FILTER_INITIAL_VALUES[key],
    });
    submitFilterValue();
  };

  const handleParameterSetClick = (row) => {
    navigate(routes.SETTINGS_EDIT_PARAMETER_SET.replace(':id', row.original.id));
  };

  const HeaderActions = () => (
    <StyledButton
      variant="contained"
      tertiary
      startIcon={<AddRounded />}
      onClick={() => navigate(routes.SETTINGS_CREATE_PARAMETER_SET)}
    >
      Create Parameter Set
    </StyledButton>
  );

  return (
    <>
      <TableV2
        data={data}
        columns={PARAMETER_SET_COLUMNS_SCHEMA}
        title="Parameters Sets"
        searchPlaceholder="Search Set Names..."
        enableRowSelection={false}
        headerActions={<HeaderActions />}
        onShowFilters={() => setIsParametersSetFilterOpen(true)}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        onClearAllFilters={handleClearAllFilters}
        onClearFilter={handleClearFilterField}
        onSearch={(e) => setSearchText(e.target.value)}
        selectedFilters={selectedFiltersBar}
        isLoading={isFetching}
        pinRowHoverActionColumns={['delete']}
        meta={{
          onDeleteIcon: (row) => {
            setClickedTableRow(row);
            setOpenDeleteParameterModal(true);
          },
          onNameClick: handleParameterSetClick,
        }}
        isEmbedded
        onTableRefresh={refetch}
      />

      <ParametersFiltersSideBar
        isOpen={isParametersSetFiltersOpen}
        onClose={() => {
          setIsParametersSetFilterOpen(false);
          setClickedTableRow(null);
        }}
        initialValues={sourceFilterValue.PARAMETERS_SET_SIDE_FILTER_KEY}
        onApplyFilters={(sideFilter) => {
          setIsParametersSetFilterOpen(false);
          setFilterFieldValue(PARAMETERS_SET_SIDE_FILTER_KEY, sideFilter);
          submitFilterValue();
        }}
        data={data}
      />

      <ParametersDeleteModal
        open={openDeleteParameterModal}
        onClose={() => setOpenDeleteParameterModal(false)}
        onDelete={() => {
          deleteParameterSet(clickedTableRow?.id);
          setOpenDeleteParameterModal(false);
        }}
        parameterSet={clickedTableRow}
      />
    </>
  );
};

export default ParametersTable;
