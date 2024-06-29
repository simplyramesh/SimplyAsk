import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useQuery } from '@tanstack/react-query';
import { Button } from 'simplexiar_react_components';

import { getProcessDefinitions } from '../../../Services/axios/bpmnAxios';
import { modifyStringENUMS } from '../../../utils/helperFunctions';
import Calendar from '../../shared/Calendars/PredefinedOptionsCalendar/CalendarComponent';
import Spinner from '../../shared/Spinner/Spinner';
import classes from './ProcessHistorySideModalFilters.module.css';
import CustomIndicatorArrow from '../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomSelect from '../../shared/REDISIGNED/selectMenus/CustomSelect';

const UPLOAD_STATUS_FILTER = [
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'FAILED', label: 'Rejected' },
];

export const EXECUTION_STATUS_FILTER = [
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'PROCESSING', label: 'In Progress' },
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

// TODO: cleanAllProcessFilters: determine if prop is required, it is set in ProcessHistory.js
const BulkExecutionSideModalFilters = ({
  setSelectBulkUploadStatusFilter,
  selectBulkUploadStatusFilter,
  setSelectBulkExecutionStatusFilter,
  selectBulkExecutionStatusFilter,
  selectBulkWorkFlowNamesFilter,
  setSelectBulkWorkFlowNamesFilter,
  setBulkFilterTriggerQuery,
  bulkFilterQuery,

  setShowBulkFilterModal,
  setBulkFilterQuery,
  showBulkFilterModal,
  bulkViewBackupFilters,
  setBulkViewBackupFilters,
  ClearAllBulkViewFilters,
}) => {
  const { data: response, isLoading } = useQuery({
    queryKey: ['getProcessDefinitions'],
    queryFn: getProcessDefinitions,
  });

  const [calendarNewText1, setCalendarNewText1] = useState('');
  const [calendarNewText2, setCalendarNewText2] = useState('');
  const [selectedDateCriteria, setSelectedDateCriteria] = useState();

  const getUploadStatusesOptions = () => {
    return UPLOAD_STATUS_FILTER.map((item) => ({
      label: item.label,
      value: item.value,
    }));
  };

  const getWorkflowNameOptions = () => {
    return response?.map((item) => ({
      label: modifyStringENUMS(item.name),
      value: item.name,
    }));
  };

  const getExecutionStatusesOptions = () => {
    return EXECUTION_STATUS_FILTER.map((item) => ({
      label: item.label,
      value: item.value,
    }));
  };

  const onUploadStatusFilterChange = (event) => {
    if (!event) return;

    setSelectBulkUploadStatusFilter([...event]);
  };

  const onWorkflowFilterChange = (event) => {
    if (!event) return;

    setSelectBulkWorkFlowNamesFilter([...event]);
  };

  const onExecutionStatusFilterChange = (event) => {
    if (!event) return;

    setSelectBulkExecutionStatusFilter([...event]);
  };

  const triggerFilterAPI = () => {
    setBulkFilterTriggerQuery(bulkFilterQuery);
    setShowBulkFilterModal(false);
    setBulkViewBackupFilters((prev) => ({
      ...prev,
      selectBulkExecutionStatusFilter,
      selectBulkUploadStatusFilter,
      selectBulkWorkFlowNamesFilter,
      calendarNewText1,
      calendarNewText2,
      selectedDateCriteria,
    }));
  };

  useEffect(() => {
    if (showBulkFilterModal === false && bulkViewBackupFilters) {
      setSelectBulkExecutionStatusFilter(bulkViewBackupFilters.selectBulkExecutionStatusFilter);
      setSelectBulkUploadStatusFilter(bulkViewBackupFilters.selectBulkUploadStatusFilter);
      setSelectBulkWorkFlowNamesFilter(bulkViewBackupFilters.selectBulkWorkFlowNamesFilter);
      setCalendarNewText1(bulkViewBackupFilters.calendarNewText1);
      setCalendarNewText2(bulkViewBackupFilters.calendarNewText2);
      setSelectedDateCriteria(bulkViewBackupFilters.selectedDateCriteria);
    }
  }, [showBulkFilterModal, bulkViewBackupFilters]);

  if (isLoading) {
    return (
      <div className={classes.root}>
        <Spinner parent />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <div className="">
        <Button color="primary" className={classes.saveButton} onClick={triggerFilterAPI}>
          Confirm
        </Button>
      </div>

      <div className={classes.rootCol}>
        <ClearAllBulkViewFilters />

        <Scrollbars className={classes.scrollbar_height}>
          <div className={classes.flex_col_gap}>
            <CustomSelect
              options={getWorkflowNameOptions()}
              onChange={onWorkflowFilterChange}
              value={[...selectBulkWorkFlowNamesFilter]}
              placeholder="Search Workflow Names..."
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
              setStateFunction={setBulkFilterQuery}
              stateValue={bulkFilterQuery}
              showBulkFilterModal={showBulkFilterModal}
              bulkViewBackupFilters={bulkViewBackupFilters}
              setBulkViewBackupFilters={setBulkViewBackupFilters}
              calendarNewText1={calendarNewText1}
              setCalendarNewText1={setCalendarNewText1}
              calendarNewText2={calendarNewText2}
              setCalendarNewText2={setCalendarNewText2}
              selectedDateCriteria={selectedDateCriteria}
              setSelectedDateCriteria={setSelectedDateCriteria}
            />
            <div className={classes.selectParent}>
              <CustomSelect
                options={getUploadStatusesOptions()}
                onChange={onUploadStatusFilterChange}
                value={[...selectBulkUploadStatusFilter]}
                placeholder="Select Upload Status"
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

            <div className={classes.selectParent}>
              <CustomSelect
                options={getExecutionStatusesOptions()}
                onChange={onExecutionStatusFilterChange}
                value={[...selectBulkExecutionStatusFilter]}
                placeholder="Select Execution Status"
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

export default BulkExecutionSideModalFilters;

BulkExecutionSideModalFilters.propTypes = {
  ClearAllBulkViewFilters: PropTypes.func,
  bulkFilterQuery: PropTypes.shape({
    bulkExecutionStatus: PropTypes.string,
    bulkExecutionWorkflows: PropTypes.string,
    bulkSearchFilterAPI: PropTypes.string,
    bulkUploadStatus: PropTypes.string,
    endDate: PropTypes.string,
    newestFirst: PropTypes.bool,
    pageNumber: PropTypes.number,
    startDate: PropTypes.string,
  }),
  bulkViewBackupFilters: PropTypes.shape({
    selectBulkExecutionStatusFilter: PropTypes.arrayOf(PropTypes.string),
    selectBulkUploadStatusFilter: PropTypes.arrayOf(PropTypes.string),
    selectBulkWorkFlowNamesFilter: PropTypes.arrayOf(PropTypes.string),
    calendarNewText1: PropTypes.string,
    calendarNewText2: PropTypes.string,
    selectedDateCriteria: PropTypes.string,
  }),
  // TODO: Uncomment when this prop is included cleanAllProcessFilters: PropTypes.func,
  selectBulkExecutionStatusFilter: PropTypes.arrayOf(PropTypes.string),
  selectBulkUploadStatusFilter: PropTypes.arrayOf(PropTypes.string),
  selectBulkWorkFlowNamesFilter: PropTypes.arrayOf(PropTypes.string),
  setBulkFilterQuery: PropTypes.func,
  setBulkFilterTriggerQuery: PropTypes.func,
  setBulkViewBackupFilters: PropTypes.func,
  setSelectBulkExecutionStatusFilter: PropTypes.func,
  setSelectBulkUploadStatusFilter: PropTypes.func,
  setSelectBulkWorkFlowNamesFilter: PropTypes.func,
  showBulkFilterModal: PropTypes.bool,
  setShowBulkFilterModal: PropTypes.func,
};
