import { createColumnHeaders } from './columns';

export const createColumns = (data) => {
  const sourceDataArray = data.map((datum) => datum.source);
  const targetDataArray = data.map((datum) => datum.target);

  const sourceArray = createColumnHeaders(sourceDataArray).filter((datum) => datum.header?.includes('Source'));
  const targetArray = createColumnHeaders(targetDataArray).filter((datum) => datum.header?.includes('Target'));

  return [
    {
      id: 'move',
      accessorFn: (row) => row.priority,
      maxSize: 62,
      minSize: 62,
      isPlaceholder: true,
      placeHolderId: 'move',
    },
    {
      id: 'delete',
      accessorKey: 'delete',
      minSize: 40,
      maxSize: 40,
      isPlaceholder: true,
      placeHolderId: 'delete',
    },
    {
      id: 'sources',
      header: 'Sources',
      // minSize: 560,
      accessor: 'sources',
      columns: [...sourceArray],
      meta: {
        numColumns: (data) => data.length,
      },
    },
    {
      id: 'targets',
      header: 'Targets',
      // minSize: 560,
      accessor: 'targets',
      columns: [...targetArray],
      meta: {
        numColumns: (data) => data.length,
      },
    },
  ];
};
