import { useFormik } from 'formik';
import { useState } from 'react';
import { toast } from 'react-toastify';

import FormErrorMessage from '../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import DragAndDrop from '../../../../shared/REDISIGNED/controls/DragAndDrop/DragAndDrop';
import InputLabel from '../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import CenterModalFixed from '../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import CustomIndicatorArrow from '../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import Spinner from '../../../../shared/Spinner/Spinner';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { MANAGERS_IMPORT_JSON_FORMAT } from '../../../shared/constants/common';
import { getParsedImportFile, isFileInJsonFormat, validateYupSchemaAsync } from '../../../shared/utils/validation';
import { getImportAndReplaceProcessValidationSchema, processImportedFileSchema, PROCESS_IMPORTED_FILE_INVALID_MSG } from '../../utils/validations';

const ProcessManagerImportReplaceModal = ({
  onClose,
  allProcessesOptions = [],
  isLoading = false,
  onSubmit,
}) => {
  const [isFileUploaderLoading, setIsFileUploaderLoading] = useState(false);

  const {
    values,
    setFieldValue,
    submitForm,
    touched,
    errors,
  } = useFormik({
    initialValues: {
      importedFile: null,
      replaceProcess: null,
    },
    validationSchema: getImportAndReplaceProcessValidationSchema(),
    onSubmit: (val) => {
      const formDataPayload = new FormData();
      formDataPayload.append('file', val.importedFile);

      onSubmit({
        payload: formDataPayload,
        id: val.replaceProcess?.value,
        processName: val.replaceProcess?.label,
        fileName: val.importedFile?.name,
      });
    },
  });

  const handleFileChange = async (files = []) => {
    setIsFileUploaderLoading(true);
    try {
      const currentFile = files[0];
      const isJson = isFileInJsonFormat(currentFile?.name);

      if (!isJson) {
        toast.error('Only "json" files are accepted');
        return;
      }

      const parsedFile = await getParsedImportFile(currentFile);
      const isFileSchemaValid = await validateYupSchemaAsync(processImportedFileSchema, parsedFile);

      if (!isFileSchemaValid) {
        toast.error(PROCESS_IMPORTED_FILE_INVALID_MSG);
        return;
      }

      setFieldValue('importedFile', currentFile);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFileUploaderLoading(false);
    }
  };

  const onBrowseFileClick = (e) => {
    const files = e.target?.files;
    if (!files || files?.length < 1) {
      return;
    }

    handleFileChange(files);
  };

  return (
    <CenterModalFixed
      open
      onClose={onClose}
      maxWidth="520px"
      title={(
        <StyledText size={20} weight={600}>
          Import and Replace Process
        </StyledText>
      )}
      actions={(
        <StyledFlex gap="15px" direction="row">
          <StyledButton
            primary
            variant="outlined"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </StyledButton>
          <StyledButton
            primary
            variant="contained"
            onClick={submitForm}
            disabled={isLoading}
          >
            Confirm
          </StyledButton>
        </StyledFlex>
      )}
    >
      <>
        {isLoading && <Spinner fadeBgParent />}
        <StyledFlex p="24px 20px">
          <StyledFlex direction="column" flex="auto" width="100%" mb="30px">
            <InputLabel label="Select Process to Import" size={16} mb={10} />
            <DragAndDrop
              handleDragAndDrop={handleFileChange}
              onBrowseFileClick={onBrowseFileClick}
              rootHeight="65px"
              attachFileText="to attach a file or"
              acceptFileType={`.${MANAGERS_IMPORT_JSON_FORMAT.EXTENSION}`}
              fileValue={values?.importedFile}
              isLoading={isFileUploaderLoading}
              onRemoveFile={() => setFieldValue('importedFile', null)}
              isError={errors.importedFile && touched.importedFile}
            />
            {(errors.importedFile && touched.importedFile) && <FormErrorMessage>{errors.importedFile}</FormErrorMessage>}
          </StyledFlex>
          <StyledFlex direction="column" flex="auto" width="100%">
            <InputLabel label="Select Process to Replace" size={16} mb={10} />
            <CustomSelect
              options={allProcessesOptions}
              value={values?.replaceProcess}
              mb={0}
              closeMenuOnSelect
              form
              components={{
                DropdownIndicator: CustomIndicatorArrow,
              }}
              onChange={(val) => setFieldValue('replaceProcess', val)}
              isClearable={false}
              isSearchable
              withSeparator
              menuPortalTarget={document.body}
              placeholder="Search for an existing process..."
              invalid={errors.replaceProcess && touched.replaceProcess}
            />
            {(errors.replaceProcess && touched.replaceProcess) && <FormErrorMessage>{errors.replaceProcess}</FormErrorMessage>}
          </StyledFlex>
        </StyledFlex>
      </>

    </CenterModalFixed>

  );
};

export default ProcessManagerImportReplaceModal;
