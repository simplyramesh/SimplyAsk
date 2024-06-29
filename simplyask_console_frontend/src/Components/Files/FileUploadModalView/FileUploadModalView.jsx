import { Close } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { Button, DragAndDrop } from 'simplexiar_react_components';

import { selectFile } from '../../../utils/functions/selectFile';
import Spinner from '../../shared/Spinner/Spinner';
import File from '../File/File';
import classes from './FileUploadModalView.module.css';

const FileUploadModalView = ({ closeModal, saveFile, uploadInProgress }) => {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef();

  const handleDrop = (fileArr) => {
    setFiles((prev) => [...prev, ...fileArr]);
  };

  const handleBrowseButton = (event) => {
    const { files } = event.target;
    setFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const onFileUpload = async () => {
    await saveFile(files);
    setFiles([]);
  };

  return (
    <>
      <div className={classes.titleContainer}>
        <p>Upload Files</p>
        <Close onClick={closeModal} />
      </div>
      <DragAndDrop handleDrop={handleDrop}>
        <div className={classes.fileContainer}>
          {/* Checking if the user has already selected a file */}
          {files.length === 0 ? (
            <div className={classes.filePrompt}>
              <p>Drag and Drop Files</p>
              <p>or</p>
              <Button color="secondary" onClick={() => selectFile(fileInputRef)}>
                Select Files
              </Button>
            </div>
          ) : (
            <Scrollbars autoHide>
              <div className={classes.files}>
                {files.map(({ name }, index) => (
                  <File
                    id={index}
                    name={name}
                    key={index}
                    onRemoveFile={() => setFiles((prev) => prev.filter((file, i) => i !== index))}
                    className={classes.selectedFile}
                  />
                ))}
              </div>
            </Scrollbars>
          )}
        </div>
      </DragAndDrop>

      {files.length !== 0 && (
        <Button color="primary" className={classes.button} onClick={onFileUpload} disabled={uploadInProgress}>
          {uploadInProgress ? <Spinner parent /> : 'Upload'}
        </Button>
      )}

      {/* The input used to ask for files when clicking on select files button. */}
      <input type="file" onChange={handleBrowseButton} className={classes.hidden} ref={fileInputRef} multiple />
    </>
  );
};

export default FileUploadModalView;

FileUploadModalView.propTypes = {
  closeModal: PropTypes.func,
  saveFile: PropTypes.func,
  uploadInProgress: PropTypes.bool,
};
