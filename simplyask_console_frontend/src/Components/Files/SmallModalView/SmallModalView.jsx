import PropTypes from 'prop-types';
import React from 'react';
import { toast } from 'react-toastify';
import { Button, Input } from 'simplexiar_react_components';

import classes from './SmallModalView.module.css';

const TYPES = { RENAME: 'Rename', NEW_FOLDER: 'Create Folder', DELETE: 'Remove Folder' };

const SmallModalView = ({
  type,
  name,
  setName,
  onConfirmNewFolder,
  onConfirmRename,
  onConfirmDelete,
  closeModal,
}) => {
  const getActionButtonName = () => {
    switch (type) {
    case TYPES.NEW_FOLDER:
      return 'Create';
    case TYPES.DELETE:
      return 'Delete';
    default:
      return 'Save';
    }
  };

  const handleClick = () => {
    if (type !== TYPES.DELETE && name === '') return toast.error('Name can not be empty.');

    switch (type) {
    case TYPES.RENAME:
      return onConfirmRename();
    case TYPES.NEW_FOLDER:
      return onConfirmNewFolder();
    case TYPES.DELETE:
      return onConfirmDelete();
    default:
    }
  };

  return (
    <>
      <p className={classes.title}>{type}</p>
      {type === TYPES.DELETE ? (
        <p>Are you sure you want to delete this file/folder?</p>
      ) : (
        <Input
          className={classes.input}
          placeholder="Enter a name..."
          value={name}
          handleEnter={handleClick}
          onChange={(e) => setName(e.target.value)}
        />
      )}

      <div className={classes.buttons}>
        <Button onClick={closeModal}>Cancel</Button>
        <Button color="primary" onClick={handleClick}>
          {getActionButtonName()}
        </Button>
      </div>
    </>
  );
};

export default SmallModalView;

SmallModalView.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  setName: PropTypes.func,
  onConfirmNewFolder: PropTypes.func,
  onConfirmRename: PropTypes.func,
  onConfirmDelete: PropTypes.func,
  closeModal: PropTypes.func,
};
