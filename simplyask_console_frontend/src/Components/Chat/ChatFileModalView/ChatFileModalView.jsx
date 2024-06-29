import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useQuery } from '@tanstack/react-query';
import { Button, DragAndDrop, SearchBar } from 'simplexiar_react_components';

import BackArrow from '../../../Assets/icons/backArrow.svg?component';
import { useConversation } from '../../../contexts/ConversationContext';
import { useUser } from '../../../contexts/UserContext';
import useTabs from '../../../hooks/useTabs';
import { getFileParentOrSearchKey, saveFile } from '../../../Services/axios/filesAxios';
import { selectFile } from '../../../utils/functions/selectFile';
import File from '../../Files/File/File';
import { CHAT_FOLDER_ID } from '../../Files/FolderIds';
import Spinner from '../../shared/Spinner/Spinner';
import classes from './ChatFileModalView.module.css';
import Tabs from '../../shared/NavTabs/Tabs/Tabs';

const INITIAL_URL = '/files/find/fileParent';
const SEARCH_URL = '/files/find/searchKey';
const TAB_VALUES = { SELECT: 0, UPLOAD: 1 };

const ChatFileModalView = ({ closeModal }) => {
  const [getURL, setGetURL] = useState(INITIAL_URL);
  const { data: files, isLoading } = useQuery({
    queryKey: ['getFileParentOrSearchKey', getURL],
    queryFn: () => getFileParentOrSearchKey(getURL),
    enabled: !!getURL,
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const { tabValue, onTabChange } = useTabs(TAB_VALUES.SELECT);
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const { sendFile } = useConversation();
  const fileInputRef = useRef();
  const user = useUser();

  const getCurrentFolder = useCallback(() => {
    if (selectedFolders.length === 0) return null;
    return selectedFolders[selectedFolders.length - 1];
  }, [selectedFolders]);

  const setGetURLBasedOnFolder = useCallback(() => {
    const currentFolder = getCurrentFolder();

    setGetURL(currentFolder ? `${INITIAL_URL}/${currentFolder.id}` : INITIAL_URL);
  }, [getCurrentFolder]);

  useEffect(setGetURLBasedOnFolder, [setGetURLBasedOnFolder]);

  const searchBarHandler = (event) => {
    const query = event.target.value;

    if (query === '') setGetURLBasedOnFolder();
    else setGetURL(`${SEARCH_URL}/${query}`);
  };

  const handleDrop = (fileArr) => {
    setSelectedFiles((prev) => [...prev, ...fileArr]);
  };

  const handleBrowseButton = (event) => {
    const filesList = event.target.files;

    setSelectedFiles((prev) => [...prev, ...Array.from(filesList)]);
  };

  const onFileUpload = async () => {
    setUploadInProgress(true);

    const result = await saveFile(selectedFiles, CHAT_FOLDER_ID, user.id);
    sendFile(result);

    closeModal();
    setSelectedFiles([]);
    setUploadInProgress(false);
  };

  const onFileOrFolderClick = (id, name, isFolder) => {
    if (isFolder) return setSelectedFolders((prev) => [...prev, { id, name }]);

    sendFile([{ name, id }]);
    closeModal();
  };

  const backHandler = () => {
    setSelectedFolders((prev) => prev.slice(0, -1));
  };

  const getNoFileFoundMsg = () => {
    if (getURL.startsWith(SEARCH_URL)) return 'No items match your search';
    return 'This folder is empty';
  };

  return (
    <>
      <div className={classes.filters}>
        <Tabs
          tabs={[{ title: 'Select Files' }, { title: 'Upload Files' }]}
          value={tabValue}
          onChange={onTabChange}
          margin="25px"
        />
        {tabValue === TAB_VALUES.SELECT && <SearchBar placeholder="Search files" onChange={searchBarHandler} />}
      </div>
      <DragAndDrop handleDrop={handleDrop}>
        <div className={classes.fileContainer}>
          {(() => {
            if (tabValue === TAB_VALUES.SELECT) {
              return (
                <Scrollbars autoHide>
                  {/* Showing the back button if selected a folder */}
                  {selectedFolders.length !== 0 && (
                    <div className={classes.backContainer}>
                      <BackArrow className={classes.backButton} onClick={backHandler} />
                      <p>{selectedFolders.map(({ name }) => name).join(' - ')}</p>
                    </div>
                  )}

                  {(() => {
                    if (isLoading) {
                      return <Spinner parent />;
                    }
                    if (files?.length === 0) {
                      return <p className={classes.emptyFolderMsg}>{getNoFileFoundMsg()}</p>;
                    }
                    return (
                      <div className={classes.files}>
                        {files?.map(({ id, name, type }, index) => (
                          <File
                            name={name}
                            id={id}
                            isFolder={type === 'FOLDER'}
                            onClick={onFileOrFolderClick}
                            key={index}
                            className={classes.selectedFile}
                            removeMoreAndRemoveButton
                          />
                        ))}
                      </div>
                    );
                  })()}
                </Scrollbars>
              );
            }
            if (selectedFiles?.length === 0) {
              return (
                <div className={classes.filePrompt}>
                  <p>Drag and Drop Files</p>
                  <p>or</p>
                  <Button color="secondary" onClick={() => selectFile(fileInputRef)}>
                    Select Files
                  </Button>
                </div>
              );
            }
            return (
              <Scrollbars autoHide>
                <div className={classes.files}>
                  {selectedFiles?.map(({ name }, index) => (
                    <File
                      id={index}
                      name={name}
                      key={index}
                      onRemoveFile={() => setSelectedFiles((prev) => prev.filter((file, i) => i !== index))}
                      className={classes.selectedFile}
                    />
                  ))}
                </div>
              </Scrollbars>
            );
          })()}
        </div>
      </DragAndDrop>

      {selectedFiles.length !== 0 && (
        <Button color="primary" className={classes.button} onClick={onFileUpload} disabled={uploadInProgress}>
          {uploadInProgress ? <Spinner parent /> : 'Send'}
        </Button>
      )}

      {/* The input used to ask for files when clicking on select files button. */}
      <input type="file" onChange={handleBrowseButton} className={classes.hidden} ref={fileInputRef} multiple />
    </>
  );
};

export default ChatFileModalView;

ChatFileModalView.propTypes = {
  closeModal: PropTypes.func.isRequired,
};
