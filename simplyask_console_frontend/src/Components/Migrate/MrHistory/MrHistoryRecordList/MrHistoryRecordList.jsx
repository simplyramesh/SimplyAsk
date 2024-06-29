import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useUser } from '../../../../contexts/UserContext';
import { useFilter } from '../../../../hooks/useFilter';
import { useTableSortAndFilter } from '../../../../hooks/useTableSortAndFilter';
import { getExecutionSummaryById } from '../../../../Services/axios/migrate';
import { createValidationSchema } from '../../../../utils/validations/dynamicValidationSchema';
import EmptyTable from '../../../Settings/AccessManagement/components/EmptyTable/EmptyTable';
import SideModalFilterContent from '../../../Settings/AccessManagement/components/modals/sideModals/SideModalFilterContent/SideModalFilterContent';
import ContentLayout from '../../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageableTableHeader from '../../../shared/REDISIGNED/table/components/TableHeader/PageableTableHeader';
import PageableTable from '../../../shared/REDISIGNED/table/PageableTable';
import { StyledCard, StyledFlex } from '../../../shared/styles/styled';
import { MR_HISTORY_RECORD_LIST_COLUMNS } from '../../utils/formatters';
import { filterEmptyValues } from '../../utils/helpers';
import { MR_HISTORY_RECORD_LIST_API_KEYS, MR_HISTORY_RECORD_LIST_FILTER_KEYS } from '../../utils/mappers';
import {
  MR_HISTORY_RECORD_LIST_CALENDAR_KEY,
  mrHistoryRecordListFilterDropdownSchema,
  mrHistoryRecordListTableHeaderDropdownSchema,
} from '../../utils/validations';
import MrHistoryRecordDetails from './MrHistoryRecordDetails/MrHistoryRecordDetails';
import RecordDetailsDataModal from './MrHistoryRecordDetails/RecordDetailDataGroup/RecordDetailsDataModal/RecordDetailsDataModal';
import MrHistoryRecordListFilters from './MrHistoryRecordListFilters/MrHistoryRecordListFilters';
import MrHistoryRecordListHeaderContent from './MrHistoryRecordListHeaderContent/MrHistoryRecordListHeaderContent';
import SecondaryTopbar from './SecondaryTopbar/SecondaryTopbar';

const formatters = [
  ...mrHistoryRecordListFilterDropdownSchema,
  ...mrHistoryRecordListTableHeaderDropdownSchema,
].reduce((acc, filter) => ({ ...acc, [filter.name]: filter.formatter }), {});

const MrHistoryRecordList = () => {
  const { user: { timezone } } = useUser();

  const [searchParams] = useSearchParams();

  const [showFilters, setShowFilters] = useState(false);
  const [recordDetail, setRecordDetail] = useState(false);

  const [recordData, setRecordData] = useState(null);

  const executionId = searchParams.get('executionId');

  const {
    columnFilters,
    setColumnFilters,
    setSearchText,
    pagination,
    setPagination,
    sorting,
    setSorting,
    data,
    isFetching,
    isLoading,
  } = useTableSortAndFilter({
    queryKey: ['getAllExecutions', executionId],
    queryFn: (filterParams) => getExecutionSummaryById(executionId, filterParams),
    initialSorting: [{
      id: MR_HISTORY_RECORD_LIST_FILTER_KEYS.STARTED.BEFORE,
      desc: false,
    }],
    initialFilters: {
      timezone,
    },
    options: {
      onSuccess: () => {},
    },
  });

  const {
    initialValues,
    filterValue,
    setFilterFieldValue,
    resetFilter,
    getFieldProps,
    setValues,
  } = useFilter({
    formatter: { ...formatters },
    formikProps: {
      initialValues: createValidationSchema([
        ...mrHistoryRecordListTableHeaderDropdownSchema,
        ...mrHistoryRecordListFilterDropdownSchema,
      ]).cast(),
    },
  });

  return (
    <>
      <SecondaryTopbar />
      <ContentLayout>
        <StyledFlex pb="48px" mb="48px">
          <StyledCard>
            <PageableTableHeader
              filters={columnFilters}
              onRemove={setColumnFilters}
              onClearFilters={() => {
                resetFilter(initialValues);
                setColumnFilters({});
              }}
            >
              <MrHistoryRecordListHeaderContent
                onSearch={(e) => setSearchText(e.target.value)}
                onOpenFilters={() => setShowFilters(true)}
                onFilterChange={(option, action) => setFilterFieldValue(action.name, option)}
                filterInputProps={getFieldProps}
                onMenuClose={() => setColumnFilters(filterEmptyValues(filterValue))}
              />
            </PageableTableHeader>
            <PageableTable
              data={data ?? {}}
              columns={MR_HISTORY_RECORD_LIST_COLUMNS}
              tableName="Execution Record List"
              muiTableBodyProps={EmptyTable}
              pagination={pagination}
              setPagination={setPagination}
              sorting={sorting}
              setSorting={setSorting}
              isFetching={isFetching}
              isLoading={isLoading}
              enableStickyHeader={false}
              muiTableBodyRowProps={({ row }) => {
                return {
                  hover: false,
                  sx: {
                    '&.MuiTableRow-root:hover .MuiTableCell-root': {
                      cursor: 'pointer',

                    },
                    '& .MuiTableCell-root *': {
                      pointerEvents: 'none',
                    },
                  },
                  onClick: () => setRecordDetail(row?.original),
                };
              }}
            />
          </StyledCard>
        </StyledFlex>
      </ContentLayout>
      <SideModalFilterContent
        isModalOpen={showFilters}
        onModalClose={() => setShowFilters(false)}
        onConfirm={() => {
          setColumnFilters(filterEmptyValues(filterValue, MR_HISTORY_RECORD_LIST_CALENDAR_KEY));
          setShowFilters(false);
        }}
        renderChildrenOnOpen
      >
        <MrHistoryRecordListFilters
          onFilterChange={(option, action) => setFilterFieldValue(action.name, option)}
          onCalendarFilterChange={(option, action) => {
            setValues((prev) => ({ ...prev, ...option.filterValue, [action.name]: option }));
          }}
          filterInputProps={getFieldProps}
          onClearFilters={() => {
            resetFilter(initialValues);
            setColumnFilters({});
          }}
          calendarKey={MR_HISTORY_RECORD_LIST_CALENDAR_KEY}
        />
      </SideModalFilterContent>

      <MrHistoryRecordDetails
        open={!!recordDetail}
        onClose={() => setRecordDetail(null)}
        onExpand={(data) => setRecordData(data)}
        recordId={recordDetail?.[MR_HISTORY_RECORD_LIST_API_KEYS.RECORD_ID]}
        executionId={executionId}
        times={{
          start: recordDetail?.[MR_HISTORY_RECORD_LIST_API_KEYS.STARTED_AT],
          end: recordDetail?.[MR_HISTORY_RECORD_LIST_API_KEYS.FINISHED_AT],
        }}
      />

      <RecordDetailsDataModal
        open={!!recordData}
        onClose={() => setRecordData(null)}
        title={recordData?.title}
        jsonData={recordData?.json}
      />
    </>
  );
};

export default MrHistoryRecordList;
