import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { Button } from 'simplexiar_react_components';
import { TEST_HISTORY_STATUSES } from '../../../../config/test';
import Calendar from '../../../shared/Calendars/PredefinedOptionsCalendar/CalendarComponent';
import CustomIndicatorArrow from '../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomSelect from '../../../shared/REDISIGNED/selectMenus/CustomSelect';
import classes from './SideModalFilters.module.css';

const TEST_HISTORY_STATUS_OPTIONS = [
  { value: TEST_HISTORY_STATUSES.PREPARING, label: 'Preparing' },
  { value: TEST_HISTORY_STATUSES.EXECUTING, label: 'Executing' },
  { value: TEST_HISTORY_STATUSES.FINALIZING, label: 'Finalizing' },
  { value: TEST_HISTORY_STATUSES.DONE, label: 'Done' },
];

const SideModalFilters = ({
  selectStatusFilter,
  setSelectStatusFilter,
  selectNamesFilter,
  setSelectNamesFilter,
  setFilterTriggerQuery,
  filterQuery,
  setShowFiltersSideModal,
  setFilterQuery,
  showFiltersSideModal,
  viewBackupFilters,
  setViewBackupFilters,
  ClearAllProcessViewFilters,
  getTestSuiteOptions,
  cleanAllProcessFilters,
}) => {
  const [selectedDateCriteria, setSelectedDateCriteria] = useState();
  const [calendarNewText1, setCalendarNewText1] = useState('');
  const [calendarNewText2, setCalendarNewText2] = useState('');

  const getStatusesOptions = () => {
    return TEST_HISTORY_STATUS_OPTIONS.map((item) => ({
      label: item.label,
      value: item.value,
    }));
  };

  const onStatusFilterChange = (event) => {
    if (!event) return;

    setSelectStatusFilter([...event]);
  };

  const onNameFilterChange = (event) => {
    if (!event) return;

    setSelectNamesFilter([...event]);
  };

  const triggerFilterAPI = () => {
    setFilterTriggerQuery(filterQuery);
    setShowFiltersSideModal(false);
    setViewBackupFilters((prev) => ({
      ...prev,
      selectStatusFilter,
      selectNamesFilter,
      calendarNewText1,
      calendarNewText2,
      selectedDateCriteria,
    }));
  };

  useEffect(() => {
    if (showFiltersSideModal === false && viewBackupFilters) {
      setSelectStatusFilter(viewBackupFilters.selectStatusFilter);
      setSelectNamesFilter(viewBackupFilters.selectNamesFilter);
      setSelectedDateCriteria(viewBackupFilters.selectedDateCriteria);
      setCalendarNewText1(viewBackupFilters.calendarNewText1);
      setCalendarNewText2(viewBackupFilters.calendarNewText2);
    }
  }, [showFiltersSideModal, viewBackupFilters]);

  return (
    <div className={classes.root}>
      <div className="">
        <Button color="primary" className={classes.saveButton} onClick={triggerFilterAPI}>
          Confirm
        </Button>
      </div>

      <div className={classes.rootCol}>
        <ClearAllProcessViewFilters
          cleanAllProcessFilters={cleanAllProcessFilters}
          setViewBackupFilters={setViewBackupFilters}
        />

        <Scrollbars className={classes.scrollbar_height}>
          <div className={classes.flex_col_gap}>
            <CustomSelect
              options={getStatusesOptions()}
              onChange={onStatusFilterChange}
              value={[...selectStatusFilter]}
              placeholder="Select Status"
              isMulti
              components={{
                DropdownIndicator: CustomIndicatorArrow,
              }}
              controlTextHidden
              menuPortalTarget={document.body}
              closeMenuOnSelect
              withSeparator
              filter
              mb={0}
            />
            <Calendar
              setStateFunction={setFilterQuery}
              stateValue={filterQuery}
              calendarNewText1={calendarNewText1}
              setCalendarNewText1={setCalendarNewText1}
              calendarNewText2={calendarNewText2}
              setCalendarNewText2={setCalendarNewText2}
              selectedDateCriteria={selectedDateCriteria}
              setSelectedDateCriteria={setSelectedDateCriteria}
              viewBackupFilters={viewBackupFilters}
            />
            <div className={classes.selectParent}>
              <CustomSelect
                options={getTestSuiteOptions()}
                onChange={onNameFilterChange}
                value={[...selectNamesFilter]}
                placeholder="Search Test Suites..."
                isMulti
                components={{
                  DropdownIndicator: CustomIndicatorArrow,
                }}
                controlTextHidden
                menuPortalTarget={document.body}
                closeMenuOnSelect
                withSeparator
                filter
                mb={0}
              />
            </div>
          </div>
        </Scrollbars>
      </div>
    </div>
  );
};

export default SideModalFilters;

SideModalFilters.propTypes = {
  ClearAllProcessViewFilters: PropTypes.func,
  cleanAllProcessFilters: PropTypes.func,
  filterQuery: PropTypes.object,
  viewBackupFilters: PropTypes.object,

  selectStatusFilter: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  selectNamesFilter: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  setFilterQuery: PropTypes.func,
  setFilterTriggerQuery: PropTypes.func,
  setViewBackupFilters: PropTypes.func,
  setSelectStatusFilter: PropTypes.func,
  setSelectNamesFilter: PropTypes.func,
  setShowFiltersSideModal: PropTypes.func,
  showFiltersSideModal: PropTypes.bool,
  getTestSuiteOptions: PropTypes.func,
};
