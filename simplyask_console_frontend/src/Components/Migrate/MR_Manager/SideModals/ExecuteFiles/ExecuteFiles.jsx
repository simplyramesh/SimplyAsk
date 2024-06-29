/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { DragAndDrop } from 'simplexiar_react_components';

import Spinner from '../../../../shared/Spinner/Spinner';
import { ACCESS_UPLOAD_FILE_KEYS, EXECUTE_FILES_API_KEYS } from '../../MR_Manager';
import classes from './ExecuteFiles.module.css';

const ACCEPTED_FILE_TYPES = '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';

const FILE_UPLOAD_IDS = {
  UPLOAD_FILE_ID: 'UPLOAD_FILE_ID',
  RTCS_FILE_ID: 'RTCS_FILE_ID',
  SOURCE_FILE_ID: 'SOURCE_FILE_ID',
};

const DragAndDropComponent = (
  {
    handleDragAndDropFile,
    handleInputFunction,
    uploadFile,
    setterFunction,
    removeFileFunction,
    headerText,
    FILE_UPLOAD_ID,
    headerClass,
    fileName,
  },
) => {
  const GetDragAndDropComponent = () => {
    const getFileName = uploadFile.find((item) => {
      const keys = Object.keys(item);
      if (keys?.includes(fileName)) return item;
    });

    return (
      <div className={classes.dragAndDropChildWithFile}>
        <div className={classes.dragAndDropSecondChild}>
          {getFileName?.[fileName]?.name ?? fileName}
        </div>
        <div
          className={classes.deleteFileText}
          onClick={() => removeFileFunction(setterFunction, fileName)}
        >
          Delete File

        </div>
      </div>
    );
  };

  return (
    <>
      <div className={`${classes.dragAndDropTitleRoot} ${headerClass}`}>
        {headerText}
      </div>

      <DragAndDrop handleDrop={(e) => handleDragAndDropFile(e, setterFunction, fileName)}>
        <>
          {uploadFile?.length > 0 && uploadFile.find((item) => {
            const keys = Object.keys(item);
            if (keys?.includes(fileName)) return item;
          })
            ? <GetDragAndDropComponent />
            : (
              <div className={classes.dragAndDropChild}>
                <div className={classes.dragAndDropSecondChild}>
                  <strong>
                    Drag and Drop
                    {' '}
                  </strong>
                  {' '}
                  an .xls / .xlsx / .csv file
                </div>

                <label htmlFor={FILE_UPLOAD_ID}>
                  {' '}
                  or
                  {' '}
                  <span className={classes.selectFileBtn}>Browse file</span>
                </label>
                <input
                  type="file"
                  id={FILE_UPLOAD_ID}
                  accept={ACCEPTED_FILE_TYPES}
                  onChange={(e) => handleInputFunction(e, setterFunction, fileName)}
                  className={classes.selectFileBtnInput}
                />

              </div>
            )}
        </>
      </DragAndDrop>
    </>
  );
};

const ExecuteFiles = (
  {
    uploadFileSource,
    setUploadFileSource,
    saveExecutionFilesWithApi,
    getPreDesignMetadataForExecution,
    getPreDesignMetadataForExecutionLoader,
  },
) => {
  const handleDragAndDropFile = (files, setterFunction, fileName) => {
    const fileObject = {
      [fileName]: files[ACCESS_UPLOAD_FILE_KEYS.INDEX],
    };

    setterFunction((prev) => [...prev, fileObject]);
  };

  const handleInputFunction = (e, setterFunction, fileName) => {
    const files = e.target?.files;
    if (files === '' || files === undefined || files?.length < 1) {
      return;
    }

    const fileObject = {
      [fileName]: files[ACCESS_UPLOAD_FILE_KEYS.INDEX],
    };

    setterFunction((prev) => [...prev, fileObject]);
  };

  const removeFileFunction = (setterFunction, fileName) => {
    const getFileNameFile = uploadFileSource?.find((item) => {
      const keys = Object.keys(item);

      let returnObject;
      keys?.forEach((keyItem) => {
        if (keyItem === fileName) { returnObject = item; }
      });

      if (returnObject) { return returnObject; }
    });

    const filterFileNameFile = uploadFileSource?.filter((item) => item !== getFileNameFile);

    setterFunction(filterFileNameFile ?? []);
  };

  return (
    <div
      className={classes.root}
    >
      <button
        className={`${classes.submitButton}
        ${uploadFileSource.length === 0
    && classes.disableSubmitButton}`}
        onClick={saveExecutionFilesWithApi}
      >
        Submit

      </button>

      <Scrollbars>
        <div className={`${classes.upperSection} ${getPreDesignMetadataForExecutionLoader && classes.fullHeight}`}>
          <div className={classes.titleRoot}>
            Execute
          </div>
          {getPreDesignMetadataForExecutionLoader ? (
            <div className={classes.fileExecutionLoaderRoot}>
              <Spinner inline medium />
            </div>
          )
            : (
              <>
                {getPreDesignMetadataForExecution?.map((item, index) => {
                  return (
                    <DragAndDropComponent
                      key={index}
                      handleDragAndDropFile={handleDragAndDropFile}
                      handleInputFunction={handleInputFunction}
                      removeFileFunction={removeFileFunction}
                      setterFunction={setUploadFileSource}
                      uploadFile={uploadFileSource}
                      headerText={`${item?.[EXECUTE_FILES_API_KEYS.systemName]}: Upload File`}
                      FILE_UPLOAD_ID={`${FILE_UPLOAD_IDS.SOURCE_FILE_ID}${index}`}
                      fileName={`${item?.[EXECUTE_FILES_API_KEYS.systemName]}`}
                    />
                  );
                })}
              </>
            )}
        </div>
      </Scrollbars>

    </div>
  );
};

export default ExecuteFiles;

DragAndDropComponent.propTypes = {
  handleDragAndDropFile: PropTypes.func,
  handleInputFunction: PropTypes.func,
  uploadFile: PropTypes.array,
  setterFunction: PropTypes.func,
  removeFileFunction: PropTypes.func,
  headerText: PropTypes.string,
  FILE_UPLOAD_ID: PropTypes.string,
  headerClass: PropTypes.string,
};

ExecuteFiles.propTypes = {
  uploadFileSource: PropTypes.array,
  setUploadFileSource: PropTypes.func,
  saveExecutionFilesWithApi: PropTypes.func,
  getPreDesignMetadataForExecution: PropTypes.array,
  getPreDesignMetadataForExecutionLoader: PropTypes.bool,
};
