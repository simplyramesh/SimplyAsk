import React, { useState } from 'react';

import { useUser } from '../../../../../contexts/UserContext';
import { useFilter } from '../../../../../hooks/useFilter';
import { useTableSortAndFilter } from '../../../../../hooks/useTableSortAndFilter';
import CustomSidebar from '../../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import {
  StyledCard,
} from '../../../../shared/styles/styled';
import { MY_ISSUES_COLUMNS, formatter, selectedFiltersMeta } from '../../utils/myIssuesColumnsFormatter';
import MyIssuesFilter from '../MyIssuesFilter/MyIssuesFilter';
import TableV2 from '../../../../shared/REDISIGNED/table-v2/Table-v2';
import { getIssues } from '../../../../../Services/axios/issuesAxios';
import { useRecoilState } from 'recoil';
import { issuesCategories } from '../../../../../store';
import { useNavigate } from 'react-router-dom';
import routes from '../../../../../config/routes';
import { ISSUES_QUERY_KEYS, ISSUE_CATEGORIES } from '../../../../Issues/constants/core';

const MyIssuesList = () => {
  const { user } = useUser();
  const [isViewFiltersOpen, setIsViewFiltersOpen] = useState(false);
  const [issueCategories] = useRecoilState(issuesCategories);
  const navigate = useNavigate();

  const initialFilters = {
    sideFilter: {},
    timezone: user?.timezone,
    assignedTo: user?.id,
  };

  const {
    sourceFilterValue,
    initialFilterValues,
    submitFilterValue,
    setFilterFieldValue,
    resetFilter
  } = useFilter({
    formikProps: {
      initialValues: initialFilters,
    },
    onSubmit: ({ filterValue, selectedFilters }) => {
      setColumnFilters(filterValue);
      setSelectedFiltersBar(selectedFilters);
    },
    formatter,
    selectedFiltersMeta,
  });

  const {
    setColumnFilters,
    setSearchText,
    pagination,
    setPagination,
    sorting,
    setSorting,
    data,
    isLoading,
    isFetching,
    selectedFiltersBar,
    setSelectedFiltersBar,
  } = useTableSortAndFilter({
    queryFn: getIssues,
    queryKey: ISSUES_QUERY_KEYS.GET_MY_ISSUES,
    initialFilters: initialFilterValues,
    initialSorting: [{
      id: 'createdAt',
      desc: true,
    }],
  });

  const resetFilters = () => {
    resetFilter(initialFilters);
    submitFilterValue();
    setIsViewFiltersOpen(false);
  }

  const handleClearFilterField = (key) => {
    setFilterFieldValue('sideFilter', {
      ...sourceFilterValue.sideFilter,
      [key]: initialFilters.sideFilter[key],
    });
    submitFilterValue();
  };

  return (
    <>
      <StyledCard p="0">
        <TableV2
          data={data}
          columns={MY_ISSUES_COLUMNS}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
          isFetching={isFetching}
          isLoading={isLoading}
          enableRowSelection={false}
          selectedFilters={selectedFiltersBar}
          onClearAllFilters={resetFilters}
          onClearFilter={handleClearFilterField}
          meta={{
            user,
            issueCategories,
            onNameClick: (issue) => {
              const { category, id, parent } = issue;

              if (category === ISSUE_CATEGORIES.SERVICE_TICKET) {
                navigate(`${routes.TICKETS}/${id}`);
              } else if (category === ISSUE_CATEGORIES.FALLOUT_TICKET) {
                navigate(`${routes.FALLOUT_TICKETS}/${id}`)
              } else if (category === ISSUE_CATEGORIES.SERVICE_TICKET_TASK) {
                navigate(`${routes.TICKETS}/${parent}?tab=ticketTasks`);
              }
            }
          }}
          searchPlaceholder="Search Issue Names or Issue IDs..."
          onSearch={(e) => setSearchText(e.target.value)}
          onShowFilters={() => setIsViewFiltersOpen(true)}
          entityName="Issues"
          isEmbedded
        />
      </StyledCard>
      {/* Filter sidebar */}
      {isViewFiltersOpen && <CustomSidebar
        open={isViewFiltersOpen}
        onClose={() => setIsViewFiltersOpen(false)}
        headStyleType="filter"
      >
        {({ customActionsRef }) => (
          <MyIssuesFilter
            sidebarActionsRef={customActionsRef}
            initialValues={sourceFilterValue.sideFilter}
            onApplyFilters={(filters) => {
              setIsViewFiltersOpen(false);
              setFilterFieldValue('sideFilter', filters);
              submitFilterValue();
            }}
            onResetFilters={resetFilters}
            issueCategories={issueCategories}

          />
        )}
      </CustomSidebar>}
    </>

  );
};

export default MyIssuesList;
