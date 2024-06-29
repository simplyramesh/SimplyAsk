import { Close } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Draggable, Dropdown } from 'simplexiar_react_components';

import RenameIcon from '../../../Assets/icons/cursor.svg?component';
import DownloadIcon from '../../../Assets/icons/downloadStroke.svg?component';
import FileIcon from '../../../Assets/icons/fileManagerGeneralSideBar.svg';
import FolderIcon from '../../../Assets/icons/folder.svg';
import MenuIcon from '../../../Assets/icons/threeDotsHorizontal.svg';
import DeleteIcon from '../../../Assets/icons/trashIcon.svg?component';
import classes from './File.module.css';

const File = ({
  id,
  name,
  isFolder,
  onClick,
  onRename,
  onDownload,
  onDelete,
  onRemoveFile, // used for previewing files before uploading
  removeMoreAndRemoveButton,
  isDraggable,
  className,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowMoreMenu((prev) => !prev);
  };

  const handleDrag = (e, id, name) => {
    if (window.electron && !isFolder) {
      e.preventDefault();
      window.electron.startDrag({
        id: id,
        fileName: name,
      });
    }
  };

  const handleStart = (e, id, name) => {
    if (window.electron && !isFolder) {
      window.electron.fileToched({
        id: id,
        fileName: name,
      });
    }
  };

  const handleClick = (e) => {
    if (e.detail === 1 && isFolder) {
      onClick(id, name, isFolder);
    }
    if (e.detail === 2 && !isFolder) {
      onDownload(id, name);
    }
  };

  const moreItems = [
    {
      title: 'Rename',
      Icon: RenameIcon,
      onClick: () => onRename(id, name),
    },
    {
      title: 'Download',
      Icon: DownloadIcon,
      onClick: () => onDownload(id, name),
    },
    {
      title: 'Remove',
      Icon: DeleteIcon,
      onClick: () => onDelete(id),
    },
  ];

  return (
    <Draggable
      isEnabled={isDraggable}
      dragData={{ id, name }}
      onStart={(e) => handleStart(e, id, name)}
      onDrag={(e) => handleDrag(e, id, name)}
    >
      <div className={`${classes.root} ${className}`} onClick={handleClick}>
        <img className={classes.icon} src={isFolder ? FolderIcon : FileIcon} />
        <Tooltip
          title={name}
          // This removes animations which solves the findDOMNode error
          TransitionComponent={({ children }) => children}
        >
          <p>{name}</p>
        </Tooltip>

        {!removeMoreAndRemoveButton &&
          (onRemoveFile ? (
            <Close className={classes.moreButton} onClick={onRemoveFile} />
          ) : (
            <Dropdown items={moreItems} className={classes.moreMenu} show={showMoreMenu} setShow={setShowMoreMenu}>
              <img src={MenuIcon} className={classes.moreButton} onClick={toggleDropdown} />
            </Dropdown>
          ))}
      </div>
    </Draggable>
  );
};

export default File;

File.defaultProps = {
  isFolder: false,
  onClick: () => {},
  isDraggable: false,
  removeMoreAndRemoveButton: false,
};

File.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  isFolder: PropTypes.bool,
  onClick: PropTypes.func,
  onRename: PropTypes.func,
  onDownload: PropTypes.func,
  onDelete: PropTypes.func,
  onRemoveFile: PropTypes.func,
  removeMoreAndRemoveButton: PropTypes.bool,
  isDraggable: PropTypes.bool,
  className: PropTypes.string,
};
