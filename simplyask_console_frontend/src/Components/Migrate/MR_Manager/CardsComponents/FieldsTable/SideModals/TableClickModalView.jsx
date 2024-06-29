/* eslint-disable no-unused-vars */
import Close from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { Table } from 'simplexiar_react_components';

import DarkHorizontalLine from '../../../../../shared/HorizontalLines/DarkHorizontalLine';
import LightHorizontalLine from '../../../../../shared/HorizontalLines/LightHorizontalLine';
import { ASSOCIATION_SET_TABLE_KEYS } from '../../AssociationSet/requestHeadersSchema';
import { FIELDS_TABLE_KEYS, getAssociationSetsNumber } from '../requestHeadersSchema';
import originalTableHeaders from './requestHeadersSchema';
import classes from './SideModalFilters.module.css';

const DataRow = ({
  className, keyString, value,
}) => {
  return (
    <div className={`${classes.grid} ${className}`}>
      <div className={classes.keyStyle}>{keyString}</div>
      {(() => {
        return <div className={classes.valueStyle}>{value ?? '---'}</div>;
      })()}

    </div>
  );
};

const TableClickModalView = ({
  closeModal,
  clickedTableRowData,
}) => {
  const scrollToTopRef = useRef();
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (clickedTableRowData) {
      const getTableData = clickedTableRowData
        ?.[ASSOCIATION_SET_TABLE_KEYS.SOURCES]?.map((item, index) => {
          return ({
            [ASSOCIATION_SET_TABLE_KEYS.SOURCES]: item,
            [ASSOCIATION_SET_TABLE_KEYS.TARGETS]: clickedTableRowData
              ?.[ASSOCIATION_SET_TABLE_KEYS.TARGETS]?.[index],
          });
        }) ?? [];

      setTableData(getTableData);
    }
  }, [clickedTableRowData]);

  return (
    <div className={classes.primary_menu_root}>

      <Scrollbars
        className={classes.contentHeightModal}
        autoHide
        ref={scrollToTopRef}
      >
        <Close
          className={classes.sideModalCloseIcon}
          onClick={closeModal}
        />

        <div className={`${classes.lightOrangeBg}`}>
          <div className={classes.sideModalHeader}>
            {clickedTableRowData?.[FIELDS_TABLE_KEYS.fieldName] ?? '---'}
          </div>

        </div>

        <div className={classes.dataRoot}>
          <DataRow
            keyString="Field Object"
            value={clickedTableRowData?.[FIELDS_TABLE_KEYS.objectName]}
          />

          <LightHorizontalLine lhlClassName={classes.lightHR} />

          <DataRow
            keyString="Field System"
            value={clickedTableRowData?.[FIELDS_TABLE_KEYS.systemName]}
          />
          <LightHorizontalLine lhlClassName={classes.lightHR} />

          <DataRow
            keyString="Association Set"
            value={getAssociationSetsNumber(clickedTableRowData)}
          />
        </div>
        <DarkHorizontalLine dhlClassName={classes.darkHR} />
        <div className={classes.relatedAssociationSetTitle}>
          Related Associations Sets
        </div>

        <Table
          className={classes.tableWidth}
          data={tableData}
          headers={originalTableHeaders}
          noDataFoundTitle="No Related Association Sets"
          noDataFoundCaption="There are currently no related association sets"
        />
      </Scrollbars>
    </div>
  );
};

export default TableClickModalView;

TableClickModalView.propTypes = {
  closeModal: PropTypes.func,
  clickedTableRowData: PropTypes.object,
};

DataRow.propTypes = {
  keyString: PropTypes.string,
  value: PropTypes.object,
  className: PropTypes.string,
};
