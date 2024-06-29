import { InputAdornment } from '@mui/material';
import { toast } from 'react-toastify';

import ExportIcon from '../../../../../Assets/icons/export.svg?component';
import { StyledFlex, StyledText } from '../../../styles/styled';
import { StyledButton } from '../Button/StyledButton';

import { getFileImageInfo, validateFileSize } from './helpers';
import { StyledPreviewWrapper, StyledUploadImageInput } from './StyledUploadImageFile';

const MAX_FILE_SIZE = 10;

const UploadImageFile = ({
  id,
  value,
  onChange,
  maxFileSize,
  disabled,
  inputRef,
  inputProps,
  previewImage,
  ...restTextFieldProps
}) => {
  const maximumFileSize = maxFileSize || MAX_FILE_SIZE;

  const resetInputValue = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleChange = async (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];

    if (files.length === 0) {
      resetInputValue();
      return;
    }

    const file = files[0];

    if (!validateFileSize(e.target, maximumFileSize)) {
      toast.error(`Unable to upload the profile image as the file size exceeds ${maximumFileSize}MB`);
      return;
    }

    const imageData = await getFileImageInfo(file, resetInputValue);

    onChange?.(imageData);
  };

  const renderAdornment = () => (
    <InputAdornment position="start">
      <StyledPreviewWrapper>{previewImage}</StyledPreviewWrapper>
      <StyledButton variant="text" disableRipple>
        <StyledFlex as="span" mr="8px">
          <ExportIcon width="13px" height="15px" />
        </StyledFlex>
        <StyledText size={15} weight={500} lh={18} wrap="nowrap" mt={3}>
          Upload Image
        </StyledText>
      </StyledButton>
    </InputAdornment>
  );

  return (
    <StyledUploadImageInput
      type="file"
      disabled={disabled}
      onChange={handleChange}
      ref={inputRef}
      InputProps={{
        startAdornment: renderAdornment(),
        inputProps: {
          accept: 'image/*',
        },
      }}
      minHeight="60px"
      p="0"
      {...restTextFieldProps}
    />
  );
};

export default UploadImageFile;
