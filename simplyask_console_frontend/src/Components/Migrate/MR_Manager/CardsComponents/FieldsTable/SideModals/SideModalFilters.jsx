import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { Button } from 'simplexiar_react_components';

import { ComputeViewAppliedFilters, FILTER_TEMPLATE_KEYS } from '../FieldsTable';
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
  selectFieldSystemFilter,
  selectFieldNameFilter,
  setSelectFieldSystemFilter,
  selectFieldObjectFilter,
  setSelectFieldNameFilter,
  setSelectFieldObjectFilter,
  setFilterTriggerQuery,
  filterQuery,
  setShowFiltersSideModal,
  showFiltersSideModal,
  viewBackupFilters,
  setViewBackupFilters,
  ClearAllProcessViewFilters,
  getFieldsObjectsFilterOptions,
  getFieldsSystemFilterOptions,
  getFieldNameFilterOptions,
  cleanAllProcessFilters,
  fieldsFilterArray,
  setFieldsFilterArray,
  cleanSelectSourcesFilter,
}) => {
  useEffect(() => {
    if (showFiltersSideModal === false && viewBackupFilters) {
      cleanSelectSourcesFilter();
      setFieldsFilterArray(viewBackupFilters.fieldsFilterArray);
    } else if (showFiltersSideModal === false && !viewBackupFilters) {
      cleanSelectSourcesFilter();
      setFieldsFilterArray([]);
    }
  }, [showFiltersSideModal, viewBackupFilters]);

  useEffect(() => {
    setSelectFieldObjectFilter(null);
    setSelectFieldNameFilter(null);
  }, [selectFieldSystemFilter]);

  const onFieldSystemFilterChange = (event) => {
    setSelectFieldSystemFilter(event);
  };

  const onFieldObjectFilterChange = (event) => {
    setSelectFieldObjectFilter(event);
  };

  const onFieldNameFilterChange = (event) => {
    setSelectFieldNameFilter(event);
  };

  const triggerFilterAPI = () => {
    setFilterTriggerQuery((prev) => ({ ...prev, ...filterQuery }));
    setShowFiltersSideModal(false);
    setViewBackupFilters((prev) => ({
      ...prev,
      fieldsFilterArray,
    }));
  };

  const handleAddSourcesFilterButtonClick = () => {
    const filterObject = {
      [FILTER_TEMPLATE_KEYS.fieldSystemFilter]: selectFieldSystemFilter,
      [FILTER_TEMPLATE_KEYS.fieldObjectFilter]: selectFieldObjectFilter,
      [FILTER_TEMPLATE_KEYS.fieldNameFilter]: selectFieldNameFilter,
    };
    setFieldsFilterArray((prev) => [...prev, filterObject]);

    cleanSelectSourcesFilter();
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
          <div className={classes.flex_col_gap_second}>
            <div className={classes.filterHeaderRoot}>
              <div className={classes.filterHeader}>
                Fields {fieldsFilterArray?.length > 0 && `(${fieldsFilterArray?.length})`}
              </div>
              <div className={classes.filterHeaderBody}>
                To filter by fields, you must first select a Field System, then a Field Object, then a Field Name. You
                can select partial filters, with only a Field System or Field System and Field Object selected.
              </div>
            </div>

            <div className={`${classes.filterListRoot}`}>
              <div className={`${classes.filterListNumber}`}>1.</div>
              <CustomSelect
                options={getFieldsSystemFilterOptions()}
                onChange={onFieldSystemFilterChange}
                value={selectFieldSystemFilter}
                placeholder="Select Field System"
                isClearable
                components={{
                  DropdownIndicator: CustomIndicatorArrow,
                }}
                menuPortalTarget={document.body}
                closeMenuOnSelect
                withSeparator
                filter
                mb={0}
              />
            </div>

            <div
              className={`${classes.filterListRootSecond} ${!selectFieldSystemFilter && classes.disableSelectInputs}`}
            >
              <div className={`${classes.filterListNumber}`}>2.</div>
              <CustomSelect
                options={getFieldsObjectsFilterOptions()}
                onChange={onFieldObjectFilterChange}
                value={selectFieldObjectFilter}
                placeholder="Select Field Object"
                isClearable
                isDisabled={!selectFieldSystemFilter}
                components={{
                  DropdownIndicator: CustomIndicatorArrow,
                }}
                menuPortalTarget={document.body}
                closeMenuOnSelect
                withSeparator
                filter
                mb={0}
              />
            </div>

            <div
              className={`${classes.filterListRootSecond} ${!selectFieldObjectFilter && classes.disableSelectInputs}`}
            >
              <div className={`${classes.filterListNumber}`}>3.</div>
              <CustomSelect
                options={getFieldNameFilterOptions()}
                onChange={onFieldNameFilterChange}
                value={selectFieldNameFilter}
                placeholder="Select Field Name"
                isClearable
                isDisabled={!selectFieldObjectFilter}
                components={{
                  DropdownIndicator: CustomIndicatorArrow,
                }}
                menuPortalTarget={document.body}
                closeMenuOnSelect
                withSeparator
                filter
                mb={0}
              />
            </div>

            <AddFilterToArrayButton
              deactivateButton={!selectFieldSystemFilter}
              buttonText="Add Field Filter"
              onClickFunction={handleAddSourcesFilterButtonClick}
            />

            <ComputeViewAppliedFilters
              showSourcesFilterInsideSideModal
              viewBackupFilters={viewBackupFilters}
              setViewBackupFilters={setViewBackupFilters}
              fieldsFilterArray={fieldsFilterArray}
              setFieldsFilterArray={setFieldsFilterArray}
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

  selectFieldSystemFilter: PropTypes.object,
  selectFieldObjectFilter: PropTypes.object,
  selectFieldNameFilter: PropTypes.object,

  fieldsFilterArray: PropTypes.array,
  setFieldsFilterArray: PropTypes.func,

  setFilterTriggerQuery: PropTypes.func,
  setViewBackupFilters: PropTypes.func,
  setSelectFieldSystemFilter: PropTypes.func,
  setSelectFieldObjectFilter: PropTypes.func,
  setSelectFieldNameFilter: PropTypes.func,
  setShowFiltersSideModal: PropTypes.func,
  showFiltersSideModal: PropTypes.bool,
  getFieldNameFilterOptions: PropTypes.func,
  getFieldsObjectsFilterOptions: PropTypes.func,
  getFieldsSystemFilterOptions: PropTypes.func,
  cleanSelectSourcesFilter: PropTypes.func,
};

AddFilterToArrayButton.propTypes = {
  deactivateButton: PropTypes.bool,
  buttonText: PropTypes.string,
  onClickFunction: PropTypes.func,
};
