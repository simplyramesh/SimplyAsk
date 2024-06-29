import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import CustomCalendarIndicator from '../../../../Settings/AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import CustomCalendarMenu from '../../../../Settings/AccessManagement/components/dropdowns/customComponents/calendarMenu/CustomCalendarMenu';
import FilterDropdown from '../../../../Settings/AccessManagement/components/dropdowns/FilterDropdown/FilterDropdown';
import BaseTable from '../../../../shared/REDISIGNED/table/components/BaseTable/BaseTable';
import SearchBar from '../../../../shared/SearchBar/SearchBar';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { TEST_RUNS_TABLE } from '../../../utils/formatters';
import {
  StyledSideDrawerFilters, StyledSideDrawerTable, StyledSideDrawerTitle, StyledTestRunsSideDrawer,
} from './StyledTestRunsSideDrawer';

const TestRunsSideDrawer = ({
  isShowModal, setShowModal, onDelete, onOpen, allTestRuns = [],
}) => {
  const [searchInput, setSearchInput] = useState('');

  const [columnFilters, setColumnFilters] = useState([{ id: 'createdAt', value: '' }]);

  const tableRef = useRef(null);

  useEffect(() => {
    if (!isShowModal) {
      setSearchInput('');
      setColumnFilters([{ id: 'createdAt', value: '' }]);
    }
  }, [isShowModal]);

  return (
    <StyledTestRunsSideDrawer
      show={isShowModal}
      closeModal={() => {
        setShowModal(false);
      }}
      width="608px"
    >
      <StyledSideDrawerTitle>
        <StyledText size={20} weight={600} lh={24}>Test Runs</StyledText>
      </StyledSideDrawerTitle>
      <StyledSideDrawerFilters>
        <Box display="flex" justifyContent="space-between" gap="16px">
          {isShowModal && (
            <>
              <SearchBar
                placeholder="Search Test Run Names..."
                onChange={(e) => setSearchInput(e.target.value)}
                value={searchInput}
                maxWidth="264px"
              />
              <FilterDropdown
                name="date"
                placeholder="Created date"
                components={{
                  DropdownIndicator: CustomCalendarIndicator,
                  Menu: CustomCalendarMenu,
                }}
                onFilterSelect={({ value }) => setColumnFilters([{ id: 'createdAt', value }])}
                filterValue={columnFilters.createdAt}
                value={columnFilters.createdAt}
                closeMenuOnSelect={false}
                openMenuOnClick
                isSearchable={false}
                minMenuHeight={600}
                maxMenuHeight={600}
                maxHeight={32}
                mb={0}
                maxWidth={214}
                menuPlacement="auto"
                placement="auto"
                isDateModified
                styling={{
                  menu: (styles) => ({
                    ...styles,
                    zIndex: 99999,
                    minWidth: '554px',
                    padding: '16px 24px 20px 16px',
                    boxShadow: '1px 1px 10px 2px rgba(0, 0, 0, 0.1)',
                    borderRadius: '10px',
                    background: '#ffffff',
                    right: 0,
                  }),
                }}
              />
            </>
          )}
        </Box>
      </StyledSideDrawerFilters>

      <StyledSideDrawerTable>
        <StyledFlex mr="-26px">
          <BaseTable
            columns={TEST_RUNS_TABLE}
            data={allTestRuns}
            enableStickyHeader
            meta={{
              onDelete,
              onOpen,
            }}
            tableInstanceRef={tableRef}
            // Search props
            enableGlobalFilterRankedResults={false}
            onGlobalFilterChange={setSearchInput}
            state={{ globalFilter: searchInput, columnFilters }}
            // filters props
            manualFiltering={false}
            enableColumnFilters
            initialState={{
              showColumnFilters: false,
              pagination: { pageSize: -1, pageIndex: 0 },
            }}
            muiTableContainerProps={{
              sx: {
                maxHeight: 'calc(100vh - 215px)',
                paddingRight: '10px',
                '::-webkit-scrollbar': {
                  width: '16px',
                },
                '::-webkit-scrollbar-thumb': {
                  border: '4px solid #F4F4F4',
                  borderRadius: '10px',
                  background: 'rgba(198, 198, 198, 0.5)',
                },
                '::-webkit-scrollbar-track': {
                  marginTop: '60px',
                  background: '#F4F4F4',
                  borderRadius: '10px',
                },
                '::-webkit-scrollbar-track-piece:': {
                  margin: '4px 0',
                  background: '#F4F4F4',
                },
              },
            }}
            muiTableBodyRowProps={({ row }) => ({
              onClick: () => onOpen(row.original.id),
            })}
            enableBottomToolbar={false}
          />
        </StyledFlex>
      </StyledSideDrawerTable>
    </StyledTestRunsSideDrawer>
  );
};

TestRunsSideDrawer.propTypes = {
  isShowModal: PropTypes.bool,
  setShowModal: PropTypes.func,
  onDelete: PropTypes.func,
  onOpen: PropTypes.func,
  allTestRuns: PropTypes.arrayOf(PropTypes.object),
};

export default TestRunsSideDrawer;
