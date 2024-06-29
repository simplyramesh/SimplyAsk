import PropTypes from 'prop-types';
import { useEffect } from 'react';

import ColumnButton from '../../buttons/ColumnButton/ColumnButton';
import ColumnGroup from '../ColumnGroup/ColumnGroup';
// import css from './GroupHeader.module.css';

const GroupHeader = ({ header, table }) => {
  const { column, subHeaders } = header;
  const { getAllLeafColumns, options } = table;
  const { addColumn, collapse } = options.meta;

  const headerName = column.columnDef.header;
  const subColumnsLength = subHeaders.length;
  const totalColumnsLength = getAllLeafColumns().length - 2;

  useEffect(() => {
    if (totalColumnsLength < 5 && collapse.isCollapsed[column.id]) {
      collapse.setIsCollapsed((p) => ({ ...p, [column.id]: false }));
    }
  }, [totalColumnsLength, collapse]);

  return (
    <ColumnGroup>
      <ColumnGroup.Left>
        <ColumnGroup.Title>{headerName}</ColumnGroup.Title>
        <ColumnGroup.Ratio
          subColumnsLength={subColumnsLength}
          headerName={headerName.slice(0, -1)}
        />
      </ColumnGroup.Left>
      <ColumnGroup.Right>
        {subColumnsLength < 6 && (
          <ColumnButton
            headerName={headerName}
            icon="ADD_COLUMN"
            onClick={() => addColumn(headerName, subColumnsLength)}
          />
        )}
        {!collapse.isCollapsed[column.id] && totalColumnsLength > 4
          && (
            <ColumnButton
              headerName={headerName}
              icon="COLLAPSE"
              onClick={() => collapse.setIsCollapsed((p) => ({ ...p, [column.id]: true }))}
            />
          )}
        {collapse.isCollapsed[column.id] && totalColumnsLength > 4
          && (
            <ColumnButton
              headerName={headerName}
              icon="EXPAND_MORE"
              onClick={() => collapse.setIsCollapsed((p) => ({ ...p, [column.id]: false }))}
            />
          )}
      </ColumnGroup.Right>

    </ColumnGroup>
  );
};

export default GroupHeader;

GroupHeader.propTypes = {
  header: PropTypes.object,
  table: PropTypes.object,
};
