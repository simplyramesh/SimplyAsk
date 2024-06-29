import { toast } from 'react-toastify';
import { getFileInfo } from '../../../../../../Services/axios/filesAxios';
import useIssueUploadAttachments from '../../../../../Issues/hooks/useIssueUploadAttachments';
import { DATA_TYPES } from '../../../../../Settings/Components/FrontOffice/components/ChatWidget/ChatWidgetCreateOrEdit/ChatWidgetPreview/ChatWidgetView/utils/constants/common';
import DragAndDrop from '../../../../../shared/REDISIGNED/controls/DragAndDrop/DragAndDrop';
import Spinner from '../../../../../shared/Spinner/Spinner';
import { StyledFlex } from '../../../../../shared/styles/styled';

const FileUploadInput = ({ value, onChange, error, inputRef }) => {
  const getParsedValue = (value) => {
    try {
      return JSON.parse(value);
    } catch {
      return '';
    }
  };

  const parsedValue = getParsedValue(value);

  const { uploadFileToIssue, isUploadFileToIssueLoading } = useIssueUploadAttachments({
    onSuccess: (data) => {
      const fileData = {
        type: DATA_TYPES.FILE,
        id: data[0].id,
        name: data[0].name,
      };
      onChange(JSON.stringify(fileData));
    },
    onError: () => {
      toast.error('Upload Error - File could not be attached');
    },
  });

  const triggerFileUpload = (file) => {
    if (parsedValue) {
      toast.warning('you cannot upload more than one file');
    } else {
      const data = new FormData();
      const fileInfo = getFileInfo(null, null, false, file?.name);

      data.append(DATA_TYPES.FILE, file);
      data.append(DATA_TYPES.FILE_INFO, JSON.stringify([fileInfo]));
      data.append(DATA_TYPES.FILE_PFP, false);
      data.append(DATA_TYPES.FILE_SIZE, file?.size);

      uploadFileToIssue(data);
    }
  };

  const onBrowseFileClick = (e) => {
    const files = e.target?.files;
    if (!files || files?.length < 1) {
      return;
    }

    const currentFile = files[0];
    triggerFileUpload(currentFile);
  };

  const handleDragAndDrop = (files) => {
    const currentFile = files[0];
    triggerFileUpload(currentFile);
  };

  if (isUploadFileToIssueLoading) return <Spinner inline small />;

  return (
    <StyledFlex>
      <DragAndDrop
        handleDragAndDrop={handleDragAndDrop}
        onBrowseFileClick={onBrowseFileClick}
        fileValue={parsedValue}
        onRemoveFile={() => onChange('')}
        isError={!!error}
        inputRef={inputRef}
      />
    </StyledFlex>
  );
};

export default FileUploadInput;
