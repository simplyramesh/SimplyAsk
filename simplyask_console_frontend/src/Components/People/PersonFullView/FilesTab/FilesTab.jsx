import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { toast } from 'react-toastify';
import { Card, Modal, SearchBar } from 'simplexiar_react_components';

import {
  deleteFileOrFolder,
  getFileDonwloadLink,
  renameFileOrFolder,
} from '../../../../Services/axios/filesAxios';
import File from '../../../Files/File/File';
import SmallModalView from '../../../Files/SmallModalView/SmallModalView';
import classes from './FilesTab.module.css';

const INITIAL_SMALL_MODAL_VALUE = { show: false, type: null };
const SMALL_MODAL_TYPES = { RENAME: 'Rename', NEW_FOLDER: 'Create Folder', DELETE: 'Remove Folder' };

const FilesTab = ({ files, refetchFilesData }) => {
  const [smallModal, setSmallModal] = useState(INITIAL_SMALL_MODAL_VALUE);
  const [fileInfo, setFileInfo] = useState({ name: '', id: null });
  const [filteredFiles, setFilteredFiles] = useState({ userInput: '' });

  useEffect(() => {
    refetchFilesData(false, {
      userInput: filteredFiles.userInput,
    });
  }, [filteredFiles, refetchFilesData]);

  const searchBarHandler = (event) => {
    setFilteredFiles((prevParams) => ({ ...prevParams, userInput: event.target.value.trim().toLowerCase() }));
  };

  const downloadFile = (fileId) => {
    // TODO: what happens when downloading a folder
    window.open(getFileDonwloadLink(fileId), '_blank', 'noopener,noreferrer');
  };

  const openRenameModal = (fileId, fileName) => {
    setSmallModal({ show: true, type: SMALL_MODAL_TYPES.RENAME });
    setFileInfo({ name: fileName, id: fileId });
  };

  const openDeleteModal = (fileId) => {
    setSmallModal({ show: true, type: SMALL_MODAL_TYPES.DELETE });
    setFileInfo({ name: '', id: fileId });
  };

  const setFileInfoName = (name) => {
    setFileInfo((prev) => ({ ...prev, name }));
  };

  const renameFile = async () => {
    await renameFileOrFolder(fileInfo.name, fileInfo.id);
    setSmallModal(INITIAL_SMALL_MODAL_VALUE);
    refetchFilesData(false);
    toast.success('File has been renamed successfully.');
  };

  const deleteFile = async () => {
    await deleteFileOrFolder(fileInfo.id);
    setSmallModal(INITIAL_SMALL_MODAL_VALUE);
    refetchFilesData(false);
    toast.success('File has been deleted successfully.');
  };

  return (
    <>
      <Card className={classes.filters}>
        <SearchBar className={classes.searchBar} placeholder="Search File Name" onChange={searchBarHandler} />
      </Card>
      <Card className={classes.card}>
        <Scrollbars className={classes.filesScrollbar} autoHide>
          <div className={classes.files}>
            {files?.content?.map(({ id, name, type }) => (
              <File
                name={name}
                id={id}
                isFolder={type === 'FOLDER'}
                onClick={downloadFile}
                onRename={openRenameModal}
                onDownload={downloadFile}
                onDelete={openDeleteModal}
                key={id}
                isDraggable
              />
            ))}
          </div>
        </Scrollbars>
      </Card>
      <Modal
        show={smallModal.show}
        modalClosed={() => setSmallModal(INITIAL_SMALL_MODAL_VALUE)}
        className={classes.modal}
      >
        <SmallModalView
          type={smallModal.type}
          name={fileInfo.name}
          setName={setFileInfoName}
          onConfirmRename={renameFile}
          onConfirmDelete={deleteFile}
          closeModal={() => setSmallModal(INITIAL_SMALL_MODAL_VALUE)}
        />
      </Modal>
    </>
  );
};

export default FilesTab;

FilesTab.propTypes = {
  files: PropTypes.shape({
    // TODO: update to more specific shape of content array prop.
    content: PropTypes.array,
    pagination: PropTypes.shape({
      endingPoint: PropTypes.number,
      numberOfElements: PropTypes.number,
      pageNumber: PropTypes.number,
      startingPoint: PropTypes.number,
      totalElements: PropTypes.number,
      totalPages: PropTypes.number,
    }),
  }),
  refetchFilesData: PropTypes.func,
};
