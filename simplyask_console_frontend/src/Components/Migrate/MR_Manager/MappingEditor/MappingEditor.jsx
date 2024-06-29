import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Fragment, useRef, useState, useEffect } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import routes from '../../../../config/routes';
import { MIGRATE_ENGINE_API as axios } from '../../../../Services/axios/AxiosInstance';
import { getAssociationSetById } from '../../../../Services/axios/migrate';
import { modifiedCurrentPageDetails } from '../../../../store';
import Spinner from '../../../shared/Spinner/Spinner';

import AvailableParametersButton from './components/buttons/AvailableParametersButton/AvailableParametersButton';
import EditDeleteButton from './components/buttons/EditDeleteButton/EditDeleteButton';
import NewRowButton from './components/buttons/NewRowButton/NewRowButton';
import SaveMRMapButton from './components/buttons/SaveMRMapButton/SaveMRMapButton';
import GroupHeader from './components/column/GroupHeader/GroupHeader';
import Header from './components/column/Header/Header';
import MoveRow from './components/dnd/MoveRow/MoveRow';
import RowDnd from './components/dnd/RowDnd';
import RevertChangesDropdown from './components/dropdowns/RevertChangesDropdown/RevertChangesDropdown';
import Editable from './components/Editable/Editable';
import MappingEditorFooter from './components/MappingEditorFooter/MappingEditorFooter';
import MappingEditorHeader from './components/MappingEditorHeader/MappingEditorHeader';
import AvailableParametersSideModal from './components/modals/sideModals/AvailableParametersSideModal/AvailableParametersSideModal';
import EditingFieldsSideModal from './components/modals/sideModals/EditingFieldsSideModal/EditingFieldsSideModal';
import SideModal from './components/modals/sideModals/SideModal';
import MappingTable from './components/table/MappingTable';
import { defaultColumns } from './constants/newAssociationSet';
import {
  add,
  addNewRow,
  addSubColumn,
  move,
  removeById,
  removeByIndex,
  removeColumnById,
  removeColumnFromRow,
  removeRowByIndex,
  update,
  updateCell,
  updateColumn,
} from './functions/arrayMethods';
import { headerStyles } from './functions/columns';
import { convertToApiRequest } from './functions/convertPostRequest';
import { createColumns } from './functions/createColumns';
import { prepareData } from './functions/prepareData';
import css from './MappingEditor.module.css';

export const CREATE_KEY = 'create';

const MappingEditor = () => {
  const setCurrentPageDetailsState = useSetRecoilState(modifiedCurrentPageDetails);

  const { MappingEditorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [records, setRecords] = useState(() => [...prepareData(defaultColumns.rules)]);
  const [columns, setColumns] = useState(() => [...createColumns(defaultColumns.rules)]);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (MappingEditorId) {
      setCurrentPageDetailsState({
        pageUrlPath: MappingEditorId === CREATE_KEY ? routes.MR_MANAGER_MAPPING_EDITOR : null,
        breadCrumbLabel: MappingEditorId === CREATE_KEY ? 'Create Set' : null,
      });
    }
  }, [MappingEditorId]);

  const {
    data,
    isSuccess,
    isFetching: isFetchingData,
  } = useQuery({
    queryKey: ['getAssociationSetById', MappingEditorId],
    queryFn: () => getAssociationSetById(MappingEditorId),
    enabled: MappingEditorId !== CREATE_KEY,
  });

  useEffect(() => {
    if (data && isSuccess) {
      const sourceState = location.state?.runs?.sources || [];
      const targetState = location.state?.runs?.targets || [];

      const field = (state, index) => ({
        fieldId: state[index].fieldId,
        fieldType: null,
        fieldName: state[index].fieldName,
        parentObject: {
          objectId: state[index].objectId,
          objectName: state[index].objectName,
          parentSystem: {
            systemId: state[index].systemId,
            systemName: state[index].systemName,
          },
        },
      });

      const alterResponse = data?.rules?.map((rule) => {
        const source = Object.keys(rule).filter((key) => key.includes('source'));
        const target = Object.keys(rule).filter((key) => key.includes('target'));

        const reduceByKey = (keyArray, state, rule) =>
          keyArray.reduce((acc, key, index) => {
            if (!state[index]) return { ...acc, [key]: null };
            return {
              ...acc,
              [key]: {
                field: field(state, index),
                value: rule[key] || null,
              },
            };
          }, {});

        const sourceObj = reduceByKey(source, sourceState, rule);
        const targetObj = reduceByKey(target, targetState, rule);

        return {
          records: {
            id: rule?.id,
            priority: rule?.priority || null,
            ...sourceObj,
            ...targetObj,
          },
          columns: {
            source: {
              id: rule?.id,
              priority: rule?.priority || null,
              ...sourceObj,
            },
            target: {
              id: rule?.id,
              priority: rule?.priority || null,
              ...targetObj,
            },
          },
        };
      });

      const initRecords = alterResponse?.map((rule) => rule.records);
      const initColumns = alterResponse?.map((rule) => rule.columns);

      if (MappingEditorId !== CREATE_KEY && data && data?.rules?.length > 0) {
        setRecords(() => [...prepareData(initRecords)]);
        setColumns(() => [...createColumns(initColumns)]);
      }
    }
  }, [isSuccess, data]);

  const [isCollapsed, setIsCollapsed] = useState({ sources: false, targets: false });

  // subheader state
  const [isEditingOpen, setIsEditingOpen] = useState(false);
  const [editingValues, setEditingValues] = useState({});

  const [isAvailParamsOpen, setIsAvailParamsOpen] = useState(false);

  const missingFields = () => {
    const notSelected = [];

    [...columns].forEach((column) => {
      if (column.id === 'sources' || column.id === 'targets') {
        column.columns.forEach((c) => {
          if (c?.meta?.field?.fieldId == null) {
            notSelected.push(c.header);
          }
        });
      }
    });

    return notSelected;
  };

  const onSave = () => {
    const postUrl = MappingEditorId === CREATE_KEY ? '/design' : `/design?id=${+MappingEditorId}`;
    // for update: /design?id=
    // for post: /design
    // const sendData = axios.post(`/design?id=${MappingEditorId}`, JSON.stringify(post), {
    const isUpdate = MappingEditorId !== CREATE_KEY;
    const sendData = axios
      .post(postUrl, JSON.stringify(convertToApiRequest(records, isUpdate)), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        if (res.status === 200) {
          navigate(-1);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {});

    return sendData;
  };

  const addRow = () => {
    setRecords((prev) => [...addNewRow(prev)]);
  };

  const removeRow = (index) => {
    setRecords((prev) => [...removeRowByIndex(prev, index)]);
  };

  const addColumn = (headerName, length) => {
    if (length > 5) return;

    const { addColumn: addCol, addColumnRecord } = addSubColumn;

    const idNum = length + 1;
    const id = `${headerName.slice(0, -1).toLowerCase()}Field${idNum}Value`;

    setColumns((p) => [...addCol(p, id, headerName)]);
    setRecords((p) => [...addColumnRecord(p, id)]);
  };

  const removeColumn = (columnId, parentId) => {
    setRecords((row) => [...removeColumnFromRow(row, columnId)]);
    setColumns((cols) => [...removeColumnById(cols, columnId, parentId)]);
  };

  const updateSubHeader = (columnId, parentId, objPath, value) => {
    setColumns((prev) => updateColumn(prev, columnId, parentId, objPath, value));
    setRecords((p) => {
      const newP = [...p];
      const t = [];

      newP.forEach((record) => {
        Object.keys(record).forEach((rec) => {
          if (rec === columnId) {
            t.push({
              ...record,
              [rec]: {
                ...record[rec],
                field: { ...value },
                value: record[rec].value,
              },
            });
          }
        });
      });

      return t;
    });
  };

  const updateRecord = (rowIndex, columnId, value) => {
    setRecords((prev) => [...updateCell(prev, rowIndex, columnId, value)]);
  };

  const moveRow = (draggedRowIndex, targetRowIndex) => {
    setRecords((previous) => [...move(previous, draggedRowIndex, targetRowIndex)]);
  };

  const table = useReactTable({
    data: records,
    columns,
    defaultColumn: { cell: Editable },
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    meta: {
      getRowIndex: (row) => row.index,
      getColumnId: (column) => column.id,
      getStyles: (id, type) => {
        if (type === 'header') return headerStyles(id);
      },
      update,
      onColumns: setColumns,
      onRecords: setRecords,
      updateRecord,
      addRow,
      moveRow,
      removeRow,
      addColumn,
      updateSubHeader,
      removeColumn,
      removeById,
      removeByIndex,
      add,
      move,
      edit: {
        isEditingOpen,
        setIsEditingOpen,
        editingValues,
        setEditingValues,
      },
      collapse: {
        isCollapsed,
        setIsCollapsed,
      },
    },
  });

  return (
    <>
      {isEditingOpen && (
        <SideModal isModalOpen={isEditingOpen}>
          <EditingFieldsSideModal
            isEditOpen={isEditingOpen}
            onClose={setIsEditingOpen}
            onEdit={setEditingValues}
            field={editingValues}
            onConfirm={updateSubHeader}
          />
        </SideModal>
      )}
      {isAvailParamsOpen && (
        <SideModal isModalOpen={isAvailParamsOpen}>
          <AvailableParametersSideModal onClose={() => setIsAvailParamsOpen(false)} />
        </SideModal>
      )}
      <div className={css.container}>
        {/* header */}
        <MappingEditorHeader>
          <MappingEditorHeader.Left />
          <MappingEditorHeader.Right>
            <RevertChangesDropdown onReset={() => {}} versionDate="" />
            <SaveMRMapButton
              onSave={() => onSave()}
              columnNames={[...missingFields()]}
              isDisabled={missingFields().length > 0}
            />
          </MappingEditorHeader.Right>
        </MappingEditorHeader>
        {/* table */}
        {isFetchingData ? (
          <Spinner parent />
        ) : (
          <Scrollbars ref={scrollRef}>
            <DndProvider backend={HTML5Backend}>
              <MappingTable>
                <MappingTable.Thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <MappingTable.Tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <MappingTable.Th
                          key={header.id}
                          colSpan={header.colSpan}
                          style={{ ...table.options.meta.getStyles(header.id, 'header') }}
                        >
                          {header.isPlaceholder || header.id.match(/move|delete/) !== null ? null : (
                            <>
                              {header.depth === 1 && flexRender(GroupHeader, { ...header.getContext() })}
                              {header.depth === 2 && flexRender(Header, { ...header.getContext() })}
                            </>
                          )}
                        </MappingTable.Th>
                      ))}
                    </MappingTable.Tr>
                  ))}
                </MappingTable.Thead>
                <MappingTable.Tbody>
                  {table.getRowModel().rows.map((row) => (
                    <RowDnd key={row.id} {...table.options} row={row}>
                      {({ previewRef, dropRef, isDragging, dragRef }) => (
                        <MappingTable.Tr key={row.id} ref={previewRef} style={{ opacity: isDragging ? 0.3 : 1 }}>
                          {row.getVisibleCells().map((cell) => (
                            <Fragment key={cell.id}>
                              {cell.column.id === 'move' && (
                                <MappingTable.Td ref={dropRef}>
                                  <MoveRow dragRef={dragRef} {...cell} />
                                </MappingTable.Td>
                              )}
                              {cell.column.id === 'delete' && (
                                <MappingTable.Td style={{ ...table.options.meta.getStyles('sourceField1', 'header') }}>
                                  <EditDeleteButton
                                    icon="DELETE"
                                    onAction={() => removeRow(cell.row.index)}
                                    isRowIcon
                                  />
                                </MappingTable.Td>
                              )}
                              {cell.column.id.match(/move|delete/) === null && (
                                <MappingTable.Td
                                  data-editable={cell.column.columnDef.meta?.field?.fieldId != null}
                                  style={{ ...table.options.meta.getStyles(cell.column.id, 'header') }}
                                  // onClick={() => { inputRef.current.focus(); }}
                                >
                                  {flexRender(cell.column.columnDef.cell, {
                                    ...cell.getContext(),
                                    collapse: isCollapsed,
                                  })}
                                </MappingTable.Td>
                              )}
                            </Fragment>
                          ))}
                        </MappingTable.Tr>
                      )}
                    </RowDnd>
                  ))}
                </MappingTable.Tbody>
              </MappingTable>
            </DndProvider>
            {/* add row and avail params section and buttons */}
            <MappingEditorFooter>
              <NewRowButton onAction={() => addRow()} />
              <AvailableParametersButton onAction={() => setIsAvailParamsOpen(true)} />
            </MappingEditorFooter>
          </Scrollbars>
        )}
      </div>
    </>
  );
};

export default MappingEditor;
