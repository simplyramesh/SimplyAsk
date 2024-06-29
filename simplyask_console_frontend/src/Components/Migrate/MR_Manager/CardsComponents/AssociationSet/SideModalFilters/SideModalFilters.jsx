import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { Button } from 'simplexiar_react_components';

import Calendar, {
  CALENDAR_DATE_KEYS,
} from '../../../../../shared/Calendars/PredefinedOptionsCalendar/CalendarComponent';
import { ComputeViewAppliedFilters, FILTER_TEMPLATE_KEYS } from '../AssociationSetTable';
import classes from './SideModalFilters.module.css';
import CustomIndicatorArrow from '../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomSelect from '../../../../../shared/REDISIGNED/selectMenus/CustomSelect';

const AddFilterToArrayButton = ({ deactivateButton, buttonText = '', onClickFunction }) => {
  return (
    <div
      className={`${classes.addFilterToArrayButtonRoot} 
      ${deactivateButton && classes.deactivateButton}`}
      onClick={onClickFunction}
    >
      {buttonText}
    </div>
  );
};

const SideModalFilters = ({
  selectSourceSystemFilter,
  selectSourceFieldFilter,
  setSelectSourceSystemFilter,
  selectSourceObjectFilter,
  setSelectSourceFieldFilter,
  setSelectSourceObjectFilter,
  setFilterTriggerQuery,
  filterQuery,
  setShowFiltersSideModal,
  setFilterQuery,
  showFiltersSideModal,
  viewBackupFilters,
  setViewBackupFilters,
  ClearAllProcessViewFilters,
  getSourceObjectFilterOptions,
  getTargetObjectFilterOptions,
  cleanAllProcessFilters,
  sourcesFilterArray,
  setSourcesFilterArray,
  cleanSelectSourcesFilter,
  selectTargetSystemFilter,
  selectTargetObjectFilter,
  selectTargetFieldFilter,
  targetsFilterArray,
  setSelectTargetSystemFilter,
  setSelectTargetObjectFilter,
  setSelectTargetFieldFilter,
  setTargetsFilterArray,
  cleanSelectTargetFilter,
  getSourceSystemFilterOptions,
  getTargetSystemFilterOptions,
  getSourceNamesFilterOptions,
  getTargetNamesFilterOptions,
}) => {
  const [selectedDateCriteria, setSelectedDateCriteria] = useState();
  const [calendarNewText1, setCalendarNewText1] = useState('');
  const [calendarNewText2, setCalendarNewText2] = useState('');

  useEffect(() => {
    if (showFiltersSideModal === false && viewBackupFilters) {
      cleanSelectSourcesFilter();
      cleanSelectTargetFilter();
      setSourcesFilterArray(viewBackupFilters.sourcesFilterArray);
      setTargetsFilterArray(viewBackupFilters.targetsFilterArray);
      setSelectedDateCriteria(viewBackupFilters.selectedDateCriteria);
      setCalendarNewText1(viewBackupFilters.calendarNewText1);
      setCalendarNewText2(viewBackupFilters.calendarNewText2);
    } else if (!showFiltersSideModal && !viewBackupFilters) {
      setSelectedDateCriteria();
      setCalendarNewText1('');
      setCalendarNewText2('');
      cleanSelectSourcesFilter();
      cleanSelectTargetFilter();
      setSourcesFilterArray([]);
    }
  }, [showFiltersSideModal, viewBackupFilters]);

  useEffect(() => {
    setSelectTargetObjectFilter(null);
    setSelectTargetFieldFilter(null);
  }, [selectTargetSystemFilter]);

  useEffect(() => {
    setSelectSourceObjectFilter(null);
    setSelectSourceFieldFilter(null);
  }, [selectSourceSystemFilter]);

  const onTargetSystemFilterChange = (event) => {
    setSelectTargetSystemFilter(event);
  };

  const onTargetObjectFilterChange = (event) => {
    setSelectTargetObjectFilter(event);
  };

  const onTargetNameFilterChange = (event) => {
    setSelectTargetFieldFilter(event);
  };

  const onSourceSystemFilterChange = (event) => {
    setSelectSourceSystemFilter(event);
  };

  const onSourceObjectFilterChange = (event) => {
    setSelectSourceObjectFilter(event);
  };

  const onSourceNameFilterChange = (event) => {
    setSelectSourceFieldFilter(event);
  };

  const triggerFilterAPI = () => {
    setFilterTriggerQuery((prev) => ({ ...prev, ...filterQuery }));
    setShowFiltersSideModal(false);
    setViewBackupFilters((prev) => ({
      ...prev,
      sourcesFilterArray,
      targetsFilterArray,
      selectedDateCriteria,
      calendarNewText1,
      calendarNewText2,
      [CALENDAR_DATE_KEYS.EDITED_AFTER]: filterQuery[CALENDAR_DATE_KEYS.EDITED_AFTER],
      [CALENDAR_DATE_KEYS.EDITED_BEFORE]: filterQuery[CALENDAR_DATE_KEYS.EDITED_BEFORE],
      [CALENDAR_DATE_KEYS.CREATED_AFTER]: filterQuery[CALENDAR_DATE_KEYS.CREATED_AFTER],
      [CALENDAR_DATE_KEYS.CREATED_BEFORE]: filterQuery[CALENDAR_DATE_KEYS.CREATED_BEFORE],
    }));
  };

  const handleAddSourcesFilterButtonClick = () => {
    const filterObject = {
      [FILTER_TEMPLATE_KEYS.sourceSystemFilter]: selectSourceSystemFilter,
      [FILTER_TEMPLATE_KEYS.sourceObjectFilter]: selectSourceObjectFilter,
      [FILTER_TEMPLATE_KEYS.sourceFieldFilter]: selectSourceFieldFilter,
    };
    setSourcesFilterArray((prev) => [...prev, filterObject]);

    cleanSelectSourcesFilter();
  };

  const handleAddTargetsFilterButtonClick = () => {
    const filterObject = {
      [FILTER_TEMPLATE_KEYS.targetSystemFilter]: selectTargetSystemFilter,
      [FILTER_TEMPLATE_KEYS.targetObjectFilter]: selectTargetObjectFilter,
      [FILTER_TEMPLATE_KEYS.targetFieldFilter]: selectTargetFieldFilter,
    };

    setTargetsFilterArray((prev) => [...prev, filterObject]);
    cleanSelectTargetFilter();
  };

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
              hideTimeStamps
              enableDateFilterType
              calendarInputDisplayText="Last Modified Date or Created Date"
            />
          </div>

          <div className={classes.lightHorizontalLine} />

          <div className={classes.flex_col_gap_second}>
            <div className={classes.filterHeaderRoot}>
              <div className={classes.filterHeader}>
                Sources {sourcesFilterArray?.length > 0 && `(${sourcesFilterArray?.length})`}
              </div>
              <div className={classes.filterHeaderBody}>
                To filter by sources, you must first select a Source System, then a Source Object, then a Source Field.
                You can select partial filters, with only a Source System or Source System and Source Object selected.
              </div>
            </div>

            <div className={`${classes.filterListRoot}`}>
              <div className={`${classes.filterListNumber}`}>1.</div>
              <CustomSelect
                options={getSourceSystemFilterOptions()}
                onChange={onSourceSystemFilterChange}
                value={selectSourceSystemFilter}
                placeholder="Select Source System"
                isClearable
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

            <div
              className={`${classes.filterListRootSecond} ${!selectSourceSystemFilter && classes.disableSelectInputs}`}
            >
              <div className={`${classes.filterListNumber}`}>2.</div>
              <CustomSelect
                options={getSourceObjectFilterOptions()}
                onChange={onSourceObjectFilterChange}
                value={selectSourceObjectFilter}
                placeholder="Select Source Object"
                isClearable
                isDisabled={!selectSourceSystemFilter}
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

            <div
              className={`${classes.filterListRootSecond} ${!selectSourceObjectFilter && classes.disableSelectInputs}`}
            >
              <div className={`${classes.filterListNumber}`}>3.</div>
              <CustomSelect
                options={getSourceNamesFilterOptions()}
                onChange={onSourceNameFilterChange}
                value={selectSourceFieldFilter}
                placeholder="Select Source Field"
                isClearable
                isDisabled={!selectSourceObjectFilter}
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

            <AddFilterToArrayButton
              deactivateButton={!selectSourceSystemFilter}
              buttonText="Add Sources Filter"
              onClickFunction={handleAddSourcesFilterButtonClick}
            />

            <ComputeViewAppliedFilters
              showSourcesFilterInsideSideModal
              viewBackupFilters={viewBackupFilters}
              setViewBackupFilters={setViewBackupFilters}
              sourcesFilterArray={sourcesFilterArray}
              setSourcesFilterArray={setSourcesFilterArray}
              ClearAllProcessViewFilters={ClearAllProcessViewFilters}
              cleanAllProcessFilters={cleanAllProcessFilters}
            />
          </div>

          <div className={classes.lightHorizontalLine} />

          <div className={classes.flex_col_gap_second}>
            <div className={classes.filterHeaderRoot}>
              <div className={classes.filterHeader}>
                Targets {targetsFilterArray?.length > 0 && `(${targetsFilterArray?.length})`}
              </div>
              <div className={classes.filterHeaderBody}>
                To filter by sources, you must first select a Target System, then a Target Object, then a Target Field.
                You can select partial filters, with only a Target System or Target System and Target Object selected.
              </div>
            </div>

            <div className={`${classes.filterListRoot}`}>
              <div className={`${classes.filterListNumber}`}>1.</div>
              <CustomSelect
                options={getTargetSystemFilterOptions()}
                onChange={onTargetSystemFilterChange}
                value={selectTargetSystemFilter}
                placeholder="Select Target System"
                isClearable
                isDisabled={!selectSourceObjectFilter}
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

            <div
              className={`${classes.filterListRootSecond} ${!selectTargetSystemFilter && classes.disableSelectInputs}`}
            >
              <div className={`${classes.filterListNumber}`}>2.</div>
              <CustomSelect
                options={getTargetObjectFilterOptions()}
                onChange={onTargetObjectFilterChange}
                value={selectTargetObjectFilter}
                placeholder="Select Target Object"
                isClearable
                isDisabled={!selectTargetSystemFilter}
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

            <div
              className={`${classes.filterListRootSecond} ${!selectTargetObjectFilter && classes.disableSelectInputs}`}
            >
              <div className={`${classes.filterListNumber}`}>3.</div>
              <CustomSelect
                options={getTargetNamesFilterOptions()}
                onChange={onTargetNameFilterChange}
                value={selectTargetFieldFilter}
                placeholder="Select Target Field"
                isClearable
                isDisabled={!selectTargetObjectFilter}
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

            <AddFilterToArrayButton
              deactivateButton={!selectTargetSystemFilter}
              buttonText="Add Target Filter"
              onClickFunction={handleAddTargetsFilterButtonClick}
            />

            <ComputeViewAppliedFilters
              showTargetFilterInsideSideModal
              viewBackupFilters={viewBackupFilters}
              setViewBackupFilters={setViewBackupFilters}
              targetsFilterArray={targetsFilterArray}
              setTargetsFilterArray={setTargetsFilterArray}
              ClearAllProcessViewFilters={ClearAllProcessViewFilters}
              cleanAllProcessFilters={cleanAllProcessFilters}
            />
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

  selectSourceSystemFilter: PropTypes.object,
  selectSourceObjectFilter: PropTypes.object,
  selectSourceFieldFilter: PropTypes.object,

  sourcesFilterArray: PropTypes.array,
  setSourcesFilterArray: PropTypes.func,

  setFilterQuery: PropTypes.func,
  setFilterTriggerQuery: PropTypes.func,
  setViewBackupFilters: PropTypes.func,
  setSelectSourceSystemFilter: PropTypes.func,
  setSelectSourceObjectFilter: PropTypes.func,
  setSelectSourceFieldFilter: PropTypes.func,
  setShowFiltersSideModal: PropTypes.func,
  showFiltersSideModal: PropTypes.bool,
  getSourceObjectFilterOptions: PropTypes.func,
  getTargetObjectFilterOptions: PropTypes.func,
  cleanSelectSourcesFilter: PropTypes.func,
  cleanSelectTargetFilter: PropTypes.func,
  selectTargetSystemFilter: PropTypes.object,
  selectTargetObjectFilter: PropTypes.object,
  selectTargetFieldFilter: PropTypes.object,
  targetsFilterArray: PropTypes.array,
  setSelectTargetSystemFilter: PropTypes.func,
  setSelectTargetObjectFilter: PropTypes.func,
  setSelectTargetFieldFilter: PropTypes.func,
  setTargetsFilterArray: PropTypes.func,
  getSourceSystemFilterOptions: PropTypes.func,
  getTargetSystemFilterOptions: PropTypes.func,
  getSourceNamesFilterOptions: PropTypes.func,
  getTargetNamesFilterOptions: PropTypes.func,
};

AddFilterToArrayButton.propTypes = {
  deactivateButton: PropTypes.bool,
  buttonText: PropTypes.string,
  onClickFunction: PropTypes.func,
};
