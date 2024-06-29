import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { Button } from 'simplexiar_react_components';

import CustomCalendarIndicator from '../../../../Settings/AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import { CALENDAR_DATE_KEYS } from '../../../../shared/Calendars/PredefinedOptionsCalendar/CalendarComponent';
import CustomIndicatorArrow from '../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomCalendarMenu from '../../../../shared/REDISIGNED/selectMenus/customComponents/menus/CustomCalendarMenu';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { sharedDropdownProps } from '../../../TestManager/SideModals/TestManagerFilters/TestManagerFilters';
import { PROCESS_STATUSES_COLORS, PROCESS_TYPES_COLORS } from '../../ProcessManager';

import classes from './AdditionalFilters.module.css';

const AdditionalFilters = ({
  ClearAllTestViewFilters,
  showFilterModal,
  setShowFilterModal,
  selectTagsFilter = [],
  setSelectTagsFilter = () => {},
  setSelectStatusFilter = () => {},
  setSelectTypeFilter = () => {},
  selectStatusFilter = [],
  selectTypeFilter = [],
  viewBackupFilters,
  setViewBackupFilters,
  setFilterTriggerQuery,
  filterQuery,
  allTagsForFilters,
  setFilterQuery,
}) => {
  const [calendarValues, setCalendarValues] = useState('');

  const getAllTags = () => allTagsForFilters?.map((item) => ({
    label: item.name,
    value: item.tagId,
  }));

  const getAllStatuses = () => PROCESS_STATUSES_COLORS?.map((item) => ({
    label: item.label,
    value: item.value,
  }));

  const onTagFilterChange = (event) => {
    if (!event) return;
    setSelectTagsFilter([...event]);
  };

  const onStatusFilterChange = (event) => {
    if (!event) return;
    setSelectStatusFilter([...event]);
  };

  const onTypeFilterChange = (event) => {
    if (!event) return;
    setSelectTypeFilter([...event]);
  };

  const triggerFilterAPI = () => {
    setFilterTriggerQuery(filterQuery);
    setShowFilterModal(false);
    setViewBackupFilters((prev) => ({
      ...prev,
      [CALENDAR_DATE_KEYS.EDITED_AFTER]: filterQuery[CALENDAR_DATE_KEYS.EDITED_AFTER],
      [CALENDAR_DATE_KEYS.EDITED_BEFORE]: filterQuery[CALENDAR_DATE_KEYS.EDITED_BEFORE],
      [CALENDAR_DATE_KEYS.CREATED_AFTER]: filterQuery[CALENDAR_DATE_KEYS.CREATED_AFTER],
      [CALENDAR_DATE_KEYS.CREATED_BEFORE]: filterQuery[CALENDAR_DATE_KEYS.CREATED_BEFORE],
      selectTagsFilter,
      selectStatusFilter,
      selectTypeFilter,
    }));
  };

  useEffect(() => {
    if (showFilterModal === false && viewBackupFilters) {
      setSelectTagsFilter(viewBackupFilters.selectTagsFilter);
    }
  }, [showFilterModal, viewBackupFilters]);

  const handleDropdownFilterChange = (val) => {
    setCalendarValues(val);
    setFilterQuery((prevState) => ({
      ...prevState,
      [CALENDAR_DATE_KEYS.EDITED_BEFORE]: val.filterValue[CALENDAR_DATE_KEYS.EDITED_BEFORE] || '',
      [CALENDAR_DATE_KEYS.EDITED_AFTER]: val.filterValue[CALENDAR_DATE_KEYS.EDITED_AFTER] || '',
      [CALENDAR_DATE_KEYS.CREATED_BEFORE]: val.filterValue[CALENDAR_DATE_KEYS.CREATED_BEFORE] || '',
      [CALENDAR_DATE_KEYS.CREATED_AFTER]: val.filterValue[CALENDAR_DATE_KEYS.CREATED_AFTER] || '',
    }));
  };

  return (
    <div className={classes.root}>
      <div className="">
        <Button color="primary" className={classes.saveButton} onClick={triggerFilterAPI}>
          Confirm
        </Button>
      </div>

      <div className={classes.rootCol}>
        <Scrollbars className={classes.scrollBarRoot}>
          <ClearAllTestViewFilters />
          <div className={classes.scrollbarChild}>
            <CustomSelect
              options={getAllStatuses()}
              onChange={onStatusFilterChange}
              value={[...selectStatusFilter]}
              isMulti
              placeholder="Process Status"
              components={{
                DropdownIndicator: CustomIndicatorArrow,
              }}
              controlTextHidden
              menuPortalTarget={document.body}
              isSearchable={false}
              isClearable={false}
              closeMenuOnSelect
              withSeparator
              filter
              mb={0}
            />

            <CustomSelect
              options={PROCESS_TYPES_COLORS}
              onChange={onTypeFilterChange}
              value={[...selectTypeFilter]}
              placeholder="Process Type"
              isMulti
              components={{
                DropdownIndicator: CustomIndicatorArrow,
              }}
              controlTextHidden
              menuPortalTarget={document.body}
              isSearchable={false}
              isClearable={false}
              closeMenuOnSelect
              withSeparator
              filter
              mb={0}
            />

            <CustomSelect
              options={getAllTags()}
              onChange={onTagFilterChange}
              value={[...selectTagsFilter]}
              placeholder="Tags"
              isMulti
              components={{
                DropdownIndicator: CustomIndicatorArrow,
              }}
              controlTextHidden
              menuPortalTarget={document.body}
              isSearchable={false}
              isClearable={false}
              closeMenuOnSelect
              withSeparator
              filter
              mb={0}
            />

            <CustomSelect
              name="date"
              value={(!filterQuery.createdAfter && !filterQuery.editedAfter) ? '' : calendarValues}
              onChange={handleDropdownFilterChange}
              placeholder="Last Edited Date or Created Date"
              showDateFilterType
              withTimeRange={false}
              components={{
                DropdownIndicator: CustomCalendarIndicator,
                Menu: CustomCalendarMenu,
              }}
              {...sharedDropdownProps}
            />
          </div>
        </Scrollbars>
      </div>
    </div>
  );
};

export default AdditionalFilters;

AdditionalFilters.propTypes = {
  ClearAllTestViewFilters: PropTypes.func,
  showFilterModal: PropTypes.bool,
  setShowFilterModal: PropTypes.func,
  selectTagsFilter: PropTypes.array,
  setSelectTagsFilter: PropTypes.func,
  setSelectStatusFilter: PropTypes.func,
  setSelectTypeFilter: PropTypes.func,
  selectStatusFilter: PropTypes.array,
  selectTypeFilter: PropTypes.array,
  viewBackupFilters: PropTypes.object,
  setViewBackupFilters: PropTypes.func,
  setFilterTriggerQuery: PropTypes.func,
  filterQuery: PropTypes.object,
  allTagsForFilters: PropTypes.array,
  setFilterQuery: PropTypes.func,
};
