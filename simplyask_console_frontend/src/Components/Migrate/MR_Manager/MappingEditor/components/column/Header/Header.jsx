import PropTypes from 'prop-types';
import React, { useState } from 'react';

import ConfirmationModal from '../../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import EditDeleteButton from '../../buttons/EditDeleteButton/EditDeleteButton';
import ColumnGroup from '../ColumnGroup/ColumnGroup';

const Header = ({ column, header, table }) => {
  // eslint-disable-next-line no-unused-vars
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { removeColumn, collapse, edit } = table.options.meta;

  const { column: headerColumn } = header;

  const { setIsEditingOpen, setEditingValues } = edit;

  const { id: columnId, parent } = column;

  const parentId = parent?.id;
  const columnsLength = parent?.columns.length;
  const headerName = headerColumn.columnDef.header;
  const isValid = headerColumn.columnDef.meta?.field?.fieldId != null;

  const shortHeaderName = `${headerName.slice(0, 1)}${headerName.slice(-1)}`;

  const handleConfirmRemove = () => {
    removeColumn(columnId, parentId);
    setIsDeleteModalOpen(false);
  };

  const handleRemoveColumn = () => {
    if (columnsLength < 2) return;

    if (!isValid) removeColumn(columnId, parentId);

    if (isValid) {
      setIsDeleteModalOpen(true);
    }
  };

  const handleEditField = () => {
    setEditingValues({
      headerName: headerName.split(' ')[0],
      columnId,
      parentId,
      field: {
        fieldId: headerColumn.columnDef.meta?.field?.fieldId,
        fieldType: headerColumn.columnDef.meta?.field?.fieldType,
        fieldName: headerColumn.columnDef.meta?.field?.fieldName,
        parentObject: {
          objectId: headerColumn.columnDef.meta?.field?.parentObject?.objectId,
          objectName: headerColumn.columnDef.meta?.field?.parentObject?.objectName,
          parentSystem: {
            systemId: headerColumn.columnDef.meta?.field?.parentObject?.parentSystem?.systemId,
            systemName: headerColumn.columnDef.meta?.field?.parentObject?.parentSystem?.systemName,
            isSourceSystem: headerColumn.columnDef.meta?.field?.parentObject?.parentSystem?.isSourceSystem,
          },
        },
      },
    });
  };

  const handleEditOpen = () => {
    handleEditField();
    setIsEditingOpen(true);
  };

  return (
    <>
      {isDeleteModalOpen && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onCloseModal={() => setIsDeleteModalOpen(false)}
          onSuccessClick={() => handleConfirmRemove()}
          successBtnText="Delete"
          alertType="DANGER"
          title="Are You Sure?"
          text={`You are about to delete ${headerName}. This will remove it, and all associated data, from the table and it cannot be restored`}
        />
      )}
      <ColumnGroup.SubHeader
        isCollapsed={collapse.isCollapsed[parentId] && columnsLength > 3}
        isLargeMargin={!collapse.isCollapsed[parentId]}
      >
        <ColumnGroup.SubLeft isCollapsed={collapse.isCollapsed}>
          <ColumnGroup.SubGroupTitle>
            {collapse.isCollapsed[parentId] && columnsLength > 3 ? shortHeaderName : headerName}
          </ColumnGroup.SubGroupTitle>
          <ColumnGroup.SysObjField
            systemName={headerColumn.columnDef.meta?.field?.parentObject?.parentSystem?.systemName}
            objectName={headerColumn.columnDef.meta?.field?.parentObject?.objectName}
            fieldName={headerColumn.columnDef.meta?.field?.fieldName}
            isCollapsed={collapse.isCollapsed[parentId] && columnsLength > 3}
            isValid={isValid}
          />
        </ColumnGroup.SubLeft>
        <ColumnGroup.SubRight isCollapsed={collapse.isCollapsed}>
          <ColumnGroup.EditDeleteIcon>
            <EditDeleteButton icon="EDIT" onAction={handleEditOpen} />
          </ColumnGroup.EditDeleteIcon>

          <ColumnGroup.Divider />
          <ColumnGroup.EditDeleteIcon>
            <EditDeleteButton icon="DELETE" onAction={handleRemoveColumn} />
          </ColumnGroup.EditDeleteIcon>
        </ColumnGroup.SubRight>
      </ColumnGroup.SubHeader>
    </>
  );
};

export default Header;

Header.propTypes = {
  column: PropTypes.object,
  header: PropTypes.object,
  table: PropTypes.object,
};
