import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import css from './MappingTable.module.css';

const MappingTable = ({ children, ...rest }) => {
  return (
    <table className={css.table} {...rest}>{children}</table>
  );
};

export default MappingTable;

MappingTable.Thead = ({ children, ...rest }) => {
  return (
    <thead className={css.thead} {...rest}>{children}</thead>
  );
};
MappingTable.Tr = forwardRef(({ children, ...rest }, ref) => {
  return (
    <tr className={css.tr} {...rest} ref={ref}>{children}</tr>
  );
});

MappingTable.Th = ({ children, ...rest }) => {
  return (
    <th className={css.th} {...rest}>{children}</th>
  );
};

MappingTable.Tbody = ({ children, ...rest }) => {
  return (
    <tbody className={css.tbody} {...rest}>{children}</tbody>
  );
};

MappingTable.Td = forwardRef(({ children, ...rest }, ref) => {
  return (
    <td className={css.td} {...rest} ref={ref}>{children}</td>
  );
});

MappingTable.propTypes = {
  children: PropTypes.node,
};

MappingTable.Thead.propTypes = MappingTable.propTypes;
MappingTable.Tr.propTypes = MappingTable.propTypes;
MappingTable.Th.propTypes = MappingTable.propTypes;
MappingTable.Tbody.propTypes = MappingTable.propTypes;
MappingTable.Td.propTypes = MappingTable.propTypes;
