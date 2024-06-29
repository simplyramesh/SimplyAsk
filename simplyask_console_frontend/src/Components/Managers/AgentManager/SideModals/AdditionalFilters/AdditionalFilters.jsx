import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { Button } from 'simplexiar_react_components';

import Calendar, { CALENDAR_DATE_KEYS } from '../../../../shared/Calendars/PredefinedOptionsCalendar/CalendarComponent';
import classes from './AdditionalFilters.module.css';
import CustomIndicatorArrow from '../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';

const AdditionalFilters = ({
  ClearAllTestViewFilters,
  showFilterModal,
  setShowFilterModal,
  selectTagsFilter = [],
  setSelectTagsFilter = () => {},
  viewBackupFilters,
  setViewBackupFilters,
  setFilterTriggerQuery,
  filterQuery,
  allTagsForFilters,
  setFilterQuery,
}) => {
  const [calendarNewText1, setCalendarNewText1] = useState('');
  const [calendarNewText2, setCalendarNewText2] = useState('');
  const [selectedDateCriteria, setSelectedDateCriteria] = useState();

  const getAllTags = () => {
    return allTagsForFilters?.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  };

  const onTagFilterChange = (event) => {
    if (!event) return;
    setSelectTagsFilter(event);
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
      selectedDateCriteria,
      selectTagsFilter,
    }));
  };

  useEffect(() => {
    if (showFilterModal === false && viewBackupFilters) {
      setSelectTagsFilter(viewBackupFilters.selectTagsFilter);
    }
  }, [showFilterModal, viewBackupFilters]);

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
              options={getAllTags()}
              onChange={onTagFilterChange}
              value={selectTagsFilter}
              isMulti
              placeholder="Tags"
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

            <Calendar
              setStateFunction={setFilterQuery}
              stateValue={filterQuery}
              viewBackupFilters={viewBackupFilters}
              calendarNewText1={calendarNewText1}
              setCalendarNewText1={setCalendarNewText1}
              calendarNewText2={calendarNewText2}
              setCalendarNewText2={setCalendarNewText2}
              selectedDateCriteria={selectedDateCriteria}
              setSelectedDateCriteria={setSelectedDateCriteria}
              hideTimeStamps
              enableDateFilterType
              calendarInputDisplayText="Last Edited Date or Created Date"
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
  viewBackupFilters: PropTypes.object,
  setViewBackupFilters: PropTypes.func,
  setFilterTriggerQuery: PropTypes.func,
  filterQuery: PropTypes.object,
  allTagsForFilters: PropTypes.array,
  setFilterQuery: PropTypes.func,
};
