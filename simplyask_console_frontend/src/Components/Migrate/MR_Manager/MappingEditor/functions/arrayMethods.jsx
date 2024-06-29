import { columnHeaderSchema } from './columns';
import { getInObj, updateObj } from './objectMethods';

export const move = (datum, from, to) => {
  const clonedData = [...datum];

  clonedData.splice(to, 0, clonedData.splice(from, 1)[0]);

  return clonedData;
};

export const update = (datum, index, newDatum) => [
  ...datum.slice(0, index),
  newDatum,
  ...datum.slice(index + 1, datum.length),
];

export const removeById = (datum, id) => datum.filter((item) => item.id !== id);

export const removeByIndex = (datum, index) => [
  ...datum.slice(0, index),
  ...datum.slice(index + 1, datum.length),
];

export const add = (datum, newDatum) => [...datum, newDatum];

export const updateCell = (datum, rowIndex, columnId, value) => {
  const updateCell = [...datum].map((item, index) => {
    if (index === rowIndex) {
      return { ...datum[rowIndex], [columnId]: { ...datum[rowIndex][columnId], value } };
    }

    return item;
  });

  return updateCell;
};

export const addNewRow = (datum) => {
  const rowCopy = [...datum];

  const lastRow = rowCopy[rowCopy.length - 1];

  const newRow = Object.keys(lastRow).reduce((acc, key) => {
    if (key === 'created' || key === 'modified') return acc;

    const rowObj = getInObj(lastRow, key);

    if (key.match(/^id$|^move$|^delete$|^priority$/) !== null) {
      return { ...acc, [key]: rowCopy.length + 1 };
    }

    return { ...acc, [key]: { ...rowObj, value: '' } };
  }, {});

  return [...rowCopy, { ...newRow }];
};

export const removeRowByIndex = (datum, index) => {
  if (datum.length === 1) return datum;

  const removed = [...datum]
    .filter((row) => row.id !== index + 1)
    .map((row, index) => ({
      ...row,
      priority: index + 1,
      id: index + 1,
      move: index + 1,
      delete: index + 1,
    }));

  return removed;
};

export const addSubColumn = {
  addColumn: (previous, id, headerName) => {
    const newColumn = columnHeaderSchema(id, {}, true);

    const newPrevious = [...previous];
    const cols = newPrevious.find((c) => c.header === headerName);
    const columnAdded = [...add(cols.columns, newColumn)];

    const newCols = newPrevious.map((c) => {
      if (c.header === headerName) return { ...c, columns: [...columnAdded] };

      return c;
    });

    return newCols;
  },
  addColumnRecord: (previous, id) => {
    const newPrevious = [...previous];

    const updatedRecords = newPrevious.map((record) => {
      const clonedRecord = { ...record };
      const newRecord = {
        ...clonedRecord,
        [id]: {
          field: {
            fieldId: null,
            fieldType: null,
            fieldName: null,
          },
          value: '',
        },
      };

      return newRecord;
    });

    return updatedRecords;
  },
};

export const updateColumn = (current, columnId, parentId, objPath, value) => {
  const newColumn = [...current];
  const parentColumn = newColumn.find((item) => item.id === parentId);
  const childColumn = parentColumn.columns.find((item) => item.id === columnId);

  const updatedColumn = updateObj(childColumn, objPath, value);

  const updatedColumns = parentColumn.columns.map((item) => {
    if (item.id === columnId) return updatedColumn;

    return item;
  });

  const updatedParentColumn = { ...parentColumn, columns: updatedColumns };

  const updatedNewColumn = newColumn.map((item) => {
    if (item.id === parentId) return updatedParentColumn;

    return item;
  });

  return updatedNewColumn;
};

export const removeColumnById = (columns, columnId, parentId) => {
  const parentColumn = [...columns].find((item) => item.id === parentId);

  if (parentColumn.columns.length === 1) return;

  const renamedColumns = parentColumn.columns
    .filter((column) => column.id !== columnId)
    .map((col, index) => {
      if (col.id.match(/source|target/) === null) return col;

      const newId = `${col.id.replace(/(Field)\d+(Value)$/, `$1${index + 1}$2`)}`;

      return {
        ...col,
        header: `${col.header.replace(/\d+$/, `${index + 1}`)}`,
        accessorFn: (info) => info[newId]?.value,
        id: newId,
      };
    });

  const updatedColumns = [...columns].map((col) => {
    if (col.id === parentId) return { ...col, columns: [...renamedColumns] };

    return col;
  });

  return updatedColumns;
};

export const removeColumnFromRow = (row, columnId) => {
  const newRows = [...row];
  const updatedRows = newRows.map((record) => {
    const { [columnId]: _, ...rest } = record;

    const sourceOrTarget = columnId.match(/^(source|target)/)[0];

    const removeAndRename = Object.keys(rest).reduce((acc, key) => {
      if (!key.includes(sourceOrTarget)) return { ...acc, [key]: rest[key] };

      const keyNum = +key.match(/\d+/)[0];
      const columnNum = +columnId.match(/\d+/)[0];

      if (keyNum > columnNum) {
        return {
          ...acc,
          [key.replace(/\d+/, `${keyNum - 1}`)]: rest[key],
        };
      }

      return { ...acc, [key]: rest[key] };
    }, {});

    return removeAndRename;
  });

  return updatedRows;
};
