import { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { useFilter } from '../../../hooks/useFilter';
import { useTableSortAndFilter } from '../../../hooks/useTableSortAndFilter';
import { getAllExecutions } from '../../../Services/axios/migrate';
import EmptyTable from '../../Settings/AccessManagement/components/EmptyTable/EmptyTable';
import SideModalFilterContent from '../../Settings/AccessManagement/components/modals/sideModals/SideModalFilterContent/SideModalFilterContent';
import TabPanel from '../../shared/NavTabs/TabPanel';
import ContentLayout from '../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import PageableTableHeader from '../../shared/REDISIGNED/table/components/TableHeader/PageableTableHeader';
import PageableTable from '../../shared/REDISIGNED/table/PageableTable';
import SearchBar from '../../shared/SearchBar/SearchBar';
import { StyledCard, StyledFlex } from '../../shared/styles/styled';
import ViewFiltersButton from '../../shared/ViewFiltersButton/ViewFiltersButton';
import { MR_HISTORY_COLUMNS } from '../utils/formatters';
import { filterEmptyValues } from '../utils/helpers';
import MrHistoryFilters from './MrHistoryFilters/MrHistoryFilters';
import MrHistoryRecordList from './MrHistoryRecordList/MrHistoryRecordList';

const CALENDAR_KEY = 'calendar';

const MrHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const executionIdParams = searchParams.get('executionId');

  const [isViewFiltersOpen, setIsViewFiltersOpen] = useState(false);

  const [executionIdFilterOptions, setExecutionIdFilterOptions] = useState([]);

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
    queryFn: getAllExecutions,
    queryKey: ['getAllExecutions'],
    initialSorting: [
      {
        id: 'createdAt',
        desc: false,
      },
    ],
    options: {
      onSuccess: (data) => {
        if (executionIdFilterOptions.length === 0) setExecutionIdFilterOptions(data.content);
      },
    },
  });

  const { initialValues, filterValue, setFilterFieldValue, resetFilter, getFieldProps, setValues } = useFilter({
    formikProps: {
      initialValues: {
        ids: [],
        createdBefore: '',
        createdAfter: '',
        statuses: [],
      },
    },
  });

  const handleClearFilters = () => {
    resetFilter(initialValues);
    setColumnFilters({});
  };

  return (
    <PageLayout>
      <TabPanel value={executionIdParams ? 1 : 0} index={0}>
        <ContentLayout>
          {/* toolbar and table */}
          <StyledCard>
            <PageableTableHeader
              filters={columnFilters}
              onRemove={setColumnFilters}
              onClearFilters={handleClearFilters}
            >
              <StyledFlex direction="row" gap="16px" alignItems="center">
                <SearchBar placeholder="Search Execution ID..." onChange={(e) => setSearchText(e.target.value)} />
                <ViewFiltersButton onClick={() => setIsViewFiltersOpen(true)} />
              </StyledFlex>
            </PageableTableHeader>
            <PageableTable
              data={data}
              columns={MR_HISTORY_COLUMNS}
              tableName="Executions"
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
                  onClick: () =>
                    navigate({
                      pathname: `${location.pathname}`,
                      search: `executionId=${row.original.id}`,
                    }),
                };
              }}
            />
          </StyledCard>
          {/* modals */}
          <SideModalFilterContent
            isModalOpen={isViewFiltersOpen}
            onModalClose={() => setIsViewFiltersOpen(false)}
            onConfirm={() => {
              const filters = filterEmptyValues(filterValue, CALENDAR_KEY);
              setColumnFilters(filters);
              setIsViewFiltersOpen(false);
            }}
          >
            <MrHistoryFilters
              filterValue={filterValue}
              onFilterChange={setFilterFieldValue}
              onCalendarFilterChange={(option, action) => {
                setValues((prev) => ({ ...prev, ...option.filterValue, [action.name]: option }));
              }}
              onClearFilters={handleClearFilters}
              filterInputProps={getFieldProps}
              executionIdOptions={executionIdFilterOptions}
              calendarKey={CALENDAR_KEY}
            />
          </SideModalFilterContent>
        </ContentLayout>
      </TabPanel>
      <TabPanel value={executionIdParams ? 1 : 0} index={1}>
        <MrHistoryRecordList />
      </TabPanel>
    </PageLayout>
  );
};

export default MrHistory;
