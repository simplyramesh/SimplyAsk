import {useQuery} from '@tanstack/react-query';
import React, {useCallback, useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {Modal} from 'simplexiar_react_components';

import {
  deleteFileOrFolder,
  downloadApiFile,
  getFileParentOrSearchKey,
  renameFileOrFolder,
  saveFile,
  saveFolder,
} from '../../Services/axios/filesAxios';
import { useUser } from '../../contexts/UserContext';
import useGetAllLinkedFiles from '../../hooks/dataManager/useGetAllLinkedFiles';
import useGetLinkedFileLocation from '../../hooks/dataManager/useGetLinkedFileLocation';
import useTabs from '../../hooks/useTabs';
import TicketDetailsAttachedFile from '../Issues/components/ServiceTickets/components/shared/TicketDetailsAttachments/TicketDetailsAttachedFile/TicketDetailsAttachedFile';
import TicketDetailsAttachmentsPreview from '../Issues/components/ServiceTickets/components/shared/TicketDetailsAttachments/TicketDetailsAttachmentsPreview/TicketDetailsAttachmentsPreview';
import NavTabs from '../shared/NavTabs/NavTabs';
import TabPanel from '../shared/NavTabs/TabPanel';
import ContentLayout, { CustomScrollbar } from '../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import EmptyTable from '../shared/REDISIGNED/table-v2/EmptyTable/EmptyTable';
import Spinner from '../shared/Spinner/Spinner';
import { StyledFlex } from '../shared/styles/styled';
import DeleteFilesInUse from './DeleteModal/DeleteFilesInUse';
import FileManagerHeader from './FileManagerHeader';
import FileUploadModalView from './FileUploadModalView/FileUploadModalView';
import classes from './Files.module.css';
import SmallModalView from './SmallModalView/SmallModalView';
import { StyledFilesLayout } from './StyledFiles';
import { FILE, FOLDER } from './constants';

const INITIAL_URL = '/files/find/fileParent';
const SEARCH_URL = '/files/find/searchKey';
const UPLOAD_BY_URL = '/files/find/uploadBy';
const TAB_VALUES = { ALL_FILES: 0, RECENTLY_OPENED: 1, MY_UPLOADS: 2 };
const INITIAL_SMALL_MODAL_VALUE = { show: false, type: null };
const SMALL_MODAL_TYPES = { RENAME: 'Rename', NEW_FOLDER: 'Create Folder', DELETE: 'Remove Folder' };

const Files = ({ isFileUploadMode = false, selectedFile, setSelectedFile }) => {
  const [getURL, setGetURL] = useState(INITIAL_URL);
  const [isFilePreviewOpen, setIsFilePreviewOpen] = useState({ isOpen: false, fileData: null });

  const {
    data: files,
    isLoading,
    isFetching: isFilesFetching,
    refetch: fetchData,
  } = useQuery({
    queryKey: ['getFiles', getURL],
    queryFn: () => getFileParentOrSearchKey(getURL),
  });

  const { tabValue: tab, onTabChange } = useTabs(TAB_VALUES.ALL_FILES);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [showFileModal, setShowFileModal] = useState(false);
  const [smallModal, setSmallModal] = useState(INITIAL_SMALL_MODAL_VALUE);
  const [fileInfo, setFileInfo] = useState({ name: '', id: null });
  const [fileParent, setFileParent] = useState(null);
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [deletingFiles, setDeletingFiles] = useState({});
  const { user } = useUser();
  const isDeleteModalOpen = smallModal.type === SMALL_MODAL_TYPES.DELETE && smallModal.show === true;

  const { linkedFileLocation, isLinkedFileLocationLoading } = useGetLinkedFileLocation(fileInfo, isDeleteModalOpen);
  const { linkedFiles, isLinkedFilesLoading, refetchLinkedFiles } = useGetAllLinkedFiles(
    fileInfo,
    fileParent,
    isDeleteModalOpen
  );

  const getCurrentFolder = useCallback(() => {
    if (selectedFolders.length === 0) return null;
    return selectedFolders[selectedFolders.length - 1];
  }, [selectedFolders]);

  const setGetURLBasedOnFolder = useCallback(() => {
    const currentFolder = getCurrentFolder();

    setGetURL(currentFolder ? `${INITIAL_URL}/${currentFolder.id}` : INITIAL_URL);
  }, [getCurrentFolder]);

  useEffect(setGetURLBasedOnFolder, [setGetURLBasedOnFolder]);

  useEffect(() => {
    if (tab === TAB_VALUES.MY_UPLOADS) return setGetURL(`${UPLOAD_BY_URL}/${user.id}`);

    setGetURL(INITIAL_URL);
  }, [tab, user]);

  const searchBarHandler = (event) => {
    const query = event.target.value;

    if (query === '') setGetURLBasedOnFolder();
    else setGetURL(`${SEARCH_URL}/${query}`);
  };

  const handleFolderClick = ({ id, name }) => {
    const folderExists = selectedFolders.some((folder) => folder.id === id);

    if (!folderExists) {
      setSelectedFolders((prev) => [...prev, { id, name }]);
    }

    setSelectedFile?.();
  };

  const handleFileClick = (file) =>
    setSelectedFile && isFileUploadMode ? setSelectedFile(file) : setIsFilePreviewOpen(file);

  const handleFileSave = async (files) => {
    setUploadInProgress(true);
    const currentFolder = getCurrentFolder();
    await saveFile(files, currentFolder ? currentFolder.id : null, currentFolder ? currentFolder.name : '', user.id);

    setShowFileModal(false);
    toast.success(`Successfully uploaded ${files.length} file(s).`);
    await fetchData(false);
    setUploadInProgress(false);
  };

  const handleCreateNewFolder = async () => {
    setUploadInProgress(true);
    const currentFolder = getCurrentFolder();

    await saveFolder(fileInfo.name, currentFolder ? currentFolder.id : null, user.id);
    setSmallModal(INITIAL_SMALL_MODAL_VALUE);
    toast.success(`${fileInfo.name} has been created successfully.`);
    await fetchData(false);
    setUploadInProgress(false);
  };

  const handleRenameFile = async () => {
    await renameFileOrFolder(fileInfo.name, fileInfo.id);
    setSmallModal(INITIAL_SMALL_MODAL_VALUE);
    toast.success('File/Folder has been renamed successfully.');
    await fetchData(false);
  };

  const downloadFile = (fileId, name) => {
    // TODO: what happens when downloading a folder
    downloadApiFile(fileId, name);
    // window.open(getFileDonwloadLink(fileId), '_blank', 'noopener,noreferrer');
  };

  const handleDeleteFile = async () => {
    await deleteFileOrFolder(fileInfo.id);
    setSmallModal(INITIAL_SMALL_MODAL_VALUE);
    setIsFilePreviewOpen({ isOpen: false, fileData: null });
    toast.success('File/Folder has been deleted successfully.');
    await fetchData(false);
  };

  const openNewFolderModal = () => {
    setSmallModal({ show: true, type: SMALL_MODAL_TYPES.NEW_FOLDER });
    setFileInfo({ name: '', id: null });
  };

  const openRenameModal = (fileId, fileName) => {
    setSmallModal({ show: true, type: SMALL_MODAL_TYPES.RENAME });
    setFileInfo({ name: fileName, id: fileId });
  };

  const openDeleteModal = (fileName, id, type) => {
    setSmallModal({ show: true, type: SMALL_MODAL_TYPES.DELETE });
    setFileInfo({ name: fileName, id: id, type });
    setFileParent({ name: fileName, id: id, type });
  };

  const deleteFile = async () => {
    const fileId = fileInfo.id;
    setDeletingFiles((prev) => ({ ...prev, [fileId]: true }));

    try {
      await deleteFileOrFolder(fileId);
      toast.success('File/Folder has been deleted successfully.');
    } catch (error) {
      toast.error('Failed to delete file/folder.');
      console.error('Error deleting file:', error);
    }
    setSmallModal(INITIAL_SMALL_MODAL_VALUE);
    setIsFilePreviewOpen({ isOpen: false, fileData: null });
    setDeletingFiles((prev) => {
      const updated = { ...prev };
      delete updated[fileId];
      return updated;
    });
    fetchData(false);
  };

  const setFileInfoName = (name) => {
    setFileInfo((prev) => ({ ...prev, name }));
  };

  const handleFilesBreadCrumbClick = (main, index) => {
    setSelectedFile?.();

    if (main) {
      setSelectedFolders([]);
      return;
    }
    if (index >= 0 && index < selectedFolders?.length) {
      setSelectedFolders(selectedFolders?.slice(0, index + 1));
    }
  };

  const handleBreadCrumbBackClick = () => {
    setSelectedFile?.();
    const numSelectedFolders = selectedFolders?.length;

    if (numSelectedFolders > 1) {
      const previousFolderIndex = numSelectedFolders - 1;
      const updatedFolders = selectedFolders.slice(0, previousFolderIndex);

      setSelectedFolders(updatedFolders);
      return;
    }

    setSelectedFolders([]);
  };

  const isFileHighlighted = (file) => {
    return selectedFile?.fileData?.id === file.id && isFileUploadMode;
  };

  useEffect(() => {
    setFileParent((prev) => ({
      ...prev,
      fileDataLength: !prev?.fileDataLength ? linkedFiles?.length : prev?.fileDataLength,
    }));
  }, [linkedFiles]);

  console.log('linkedFiles', linkedFiles);

  //  TODO: Right Click Folder to open Context Menu with options such as "Open"
  const renderFiles = () =>
    files?.length > 0 ? (
      <StyledFilesLayout paddingBottom={isFileUploadMode ? '150px' : '0'}>
        {uploadInProgress && <TicketDetailsAttachedFile isUploadFileToIssueLoading={uploadInProgress} />}
        {files.map((file) => (
          <TicketDetailsAttachedFile
            key={file.id}
            file={file}
            isCreateTicketView
            onRename={
              file.type === FOLDER
                ? () => openRenameModal(file.id, file.name)
                : () => openRenameModal(file.id, file.name)
            }
            onDownload={(fileId, fileName) => downloadFile(fileId, fileName)}
            handleDeleteFileOnIssueCreation={() => openDeleteModal(file.name, file.id, file.type)}
            isFolder={file.type === FOLDER}
            isDeleting={deletingFiles[file.id]}
            onOpenFolder={() => handleFolderClick(file)}
            setIsFilePreviewOpen={handleFileClick}
            isDownloadAble={!isFileUploadMode && file.type !== FOLDER}
            isDraggable={!isFileUploadMode}
            disableMoreActions={isFileUploadMode}
            isFileHighlighted={isFileHighlighted(file)}
          />
        ))}
      </StyledFilesLayout>
    ) : (
      <EmptyTable
        title="Files or Folders Found"
        message="There are no results based on your current search and/or filters. Adjust your filters, and try again"
      />
    );

  const LoadingWrapper = useCallback(
    ({ isLoading, children }) => (isLoading ? <Spinner inline parent /> : children),
    [isLoading]
  );

  return (
    <>
      <PageLayout
        top={
          isFileUploadMode ? null : (
            <NavTabs
              labels={[{ title: 'Files' }, { title: 'Recently Opened' }, { title: 'My Uploads' }]}
              value={tab}
              onChange={onTabChange}
            />
          )
        }
        width="100%"
      >
        <TabPanel value={tab} index={0}>
          <ContentLayout fullHeight disableScroll>
            <FileManagerHeader
              searchBarHandler={searchBarHandler}
              fetchData={fetchData}
              openNewFolderModal={openNewFolderModal}
              showUploadFileModal={() => setShowFileModal(true)}
              onFilesBreadCrumbClick={handleFilesBreadCrumbClick}
              onBreadCrumbBackClick={handleBreadCrumbBackClick}
              selectedFolders={selectedFolders}
              isFileUploadMode={isFileUploadMode}
              isFilesFetching={isFilesFetching}
            />
            <LoadingWrapper isLoading={isLoading}>
              <StyledFlex height="100%">
                <CustomScrollbar>{renderFiles()}</CustomScrollbar>
              </StyledFlex>
            </LoadingWrapper>
          </ContentLayout>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <LoadingWrapper isLoading={isLoading}>
            <ContentLayout fullHeight>{renderFiles()}</ContentLayout>
          </LoadingWrapper>
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <LoadingWrapper isLoading={isLoading}>
            <ContentLayout fullHeight>{renderFiles()}</ContentLayout>
          </LoadingWrapper>
        </TabPanel>
      </PageLayout>

      {isFilePreviewOpen?.isOpen && (
        <TicketDetailsAttachmentsPreview
          setIsFilePreviewOpen={setIsFilePreviewOpen}
          getAllAttachedFiles={files}
          isFilePreviewOpen={isFilePreviewOpen}
          isCreateTicketView
          isDownloadable
          onDownload={(fileId, fileName) => downloadFile(fileId, fileName)}
          handleDeleteFileOnIssueCreation={() =>
            openDeleteModal(isFilePreviewOpen?.fileData?.name, isFilePreviewOpen?.fileData?.id, FILE)
          }
        />
      )}
      <DeleteFilesInUse
        linkedValues={linkedFileLocation || linkedFiles}
        isDeleteModalOpen={isDeleteModalOpen}
        deleteBtnClick={deleteFile}
        onCloseDeleteModal={() => {
          setFileInfo({});
          setFileParent({});
          setSmallModal(INITIAL_SMALL_MODAL_VALUE);
        }}
        onFileClick={(value) => setFileInfo(value)}
        onBackButtonClick={(parentData) => {
          setFileInfo(parentData);
        }}
        fileInfo={fileInfo}
        fileParent={fileParent}
        isLoading={isLinkedFileLocationLoading || isLinkedFilesLoading}
      />
      {/* File upload modal */}
      <Modal
        show={showFileModal}
        modalClosed={() => setShowFileModal(false)}
        className={`${classes.modal} ${classes.fileModal}`}
      >
        <FileUploadModalView
          closeModal={() => setShowFileModal(false)}
          saveFile={handleFileSave}
          uploadInProgress={uploadInProgress}
        />
      </Modal>

      {/* Small Modal: used for creating a new folder, rename a file, or delete a file */}
      <Modal
        show={
          smallModal.show &&
          (smallModal.type === SMALL_MODAL_TYPES.NEW_FOLDER || smallModal.type === SMALL_MODAL_TYPES.RENAME)
        }
        modalClosed={() => setSmallModal(INITIAL_SMALL_MODAL_VALUE)}
        className={classes.modal}
      >
        <SmallModalView
          type={smallModal.type}
          name={fileInfo.name}
          setName={setFileInfoName}
          onConfirmNewFolder={handleCreateNewFolder}
          onConfirmRename={handleRenameFile}
          onConfirmDelete={handleDeleteFile}
          closeModal={() => setSmallModal(INITIAL_SMALL_MODAL_VALUE)}
        />
      </Modal>
    </>
  );
};

export default Files;
