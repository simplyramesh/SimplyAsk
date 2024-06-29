import TableEmpty from '../TableEmpty';

const tableEmptyAdapter = ({ table, ...emptyProps }) => {
  const Wrapper = () => (
    <tbody>
      <tr>
        <td colSpan={table.getAllColumns().length}>
          <TableEmpty {...emptyProps} />
        </td>
      </tr>
    </tbody>
  );

  if (table.getSortedRowModel().rows.length === 0) {
    return {
      component: Wrapper,
    };
  }
};

export default tableEmptyAdapter;
