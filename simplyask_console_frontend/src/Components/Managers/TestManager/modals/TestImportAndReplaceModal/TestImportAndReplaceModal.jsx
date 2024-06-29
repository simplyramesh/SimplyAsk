import { useFormik } from 'formik';
import { useState } from 'react';

import { toast } from 'react-toastify';
import FormErrorMessage from '../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import DragAndDrop from '../../../../shared/REDISIGNED/controls/DragAndDrop/DragAndDrop';
import InputLabel from '../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import CenterModalFixed from '../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomIndicatorArrow from '../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import Spinner from '../../../../shared/Spinner/Spinner';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { MANAGERS_IMPORT_JSON_FORMAT } from '../../../shared/constants/common';
import { getParsedImportFile, isFileInJsonFormat, validateYupSchemaAsync } from '../../../shared/utils/validation';
import { TEST_CASE_IMPORT_TOAST_MSGS } from '../../utils/constants';
import { importAndReplaceTestCaseValidationSchema, importTestCaseFileSchema } from '../../utils/validationSchemas';

const TestImportAndReplaceModal = ({ onClose, allTestCasesOptions = [], isLoading = false, onSubmit }) => {
  const [isFileUploaderLoading, setIsFileUploaderLoading] = useState(false);

  const { values, setFieldValue, submitForm, touched, errors } = useFormik({
    initialValues: {
      importedFile: null,
      replaceTestCase: null,
    },
    validationSchema: importAndReplaceTestCaseValidationSchema,
    onSubmit: (val) => {
      const payload = {
        ...val.importedFile,
        attributes: {
          ...val.importedFile.attributes,
          description: val.replaceTestCase.description,
          displayName: val.replaceTestCase.displayName,
          tags: val.replaceTestCase.tags,
        },
      };

      const jsonString = JSON.stringify(payload);
      const blob = new Blob([jsonString], { type: MANAGERS_IMPORT_JSON_FORMAT.FILE_TYPE });

      const formDataPayload = new FormData();
      formDataPayload.append('file', blob);

      onSubmit({
        payload: formDataPayload,
        displayName: val.replaceTestCase?.displayName,
        params: new URLSearchParams({
          processType: val.importedFile?.processType,
        }),
        fileDisplayName: val.importedFile?.attributes?.displayName,
      });
    },
  });

  const handleFileChange = async (files = []) => {
    setIsFileUploaderLoading(true);
    try {
      const currentFile = files[0];
      const isJson = isFileInJsonFormat(currentFile?.name);

      if (!isJson) {
        toast.error(TEST_CASE_IMPORT_TOAST_MSGS.JSON_ALLOWED);
        return;
      }

      const parsedFile = await getParsedImportFile(currentFile);

      const isFileSchemaValid = await validateYupSchemaAsync(importTestCaseFileSchema, parsedFile);

      if (!isFileSchemaValid) {
        toast.error(TEST_CASE_IMPORT_TOAST_MSGS.INVALID_FILE);
        return;
      }
      const parsedFramework = parsedFile?.processType;

      if (values.replaceTestCase?.processType !== parsedFramework) {
        setFieldValue('replaceTestCase', null);
      }

      setFieldValue('importedFile', parsedFile);
    } catch (error) {
      toast.error('Something went wrong...');
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

  const fileFramework = values.importedFile?.processType;

  const frameworkMatchTestCaseOptions = () =>
    fileFramework
      ? allTestCasesOptions?.filter((testCase) => testCase.processType === fileFramework)
      : allTestCasesOptions;

  const importedFileDisplayName = values.importedFile?.attributes?.displayName
    ? { name: values.importedFile?.attributes?.displayName }
    : null;

  return (
    <CenterModalFixed
      open
      onClose={onClose}
      maxWidth="520px"
      title={
        <StyledText size={20} weight={600}>
          Import and Replace Test Case
        </StyledText>
      }
      actions={
        <StyledFlex gap="15px" direction="row">
          <StyledButton primary variant="outlined" onClick={onClose} disabled={isLoading}>
            Cancel
          </StyledButton>
          <StyledButton primary variant="contained" onClick={submitForm} disabled={isLoading}>
            Confirm
          </StyledButton>
        </StyledFlex>
      }
    >
      <>
        {isLoading && <Spinner fadeBgParent medium />}
        <StyledFlex p="24px 20px">
          <StyledFlex direction="column" flex="auto" width="100%" mb="30px">
            <InputLabel label="Select Test Case to Import" size={16} mb={10} />
            <DragAndDrop
              handleDragAndDrop={handleFileChange}
              onBrowseFileClick={onBrowseFileClick}
              rootHeight="65px"
              attachFileText="to attach a file or"
              acceptFileType={`.${MANAGERS_IMPORT_JSON_FORMAT.EXTENSION}`}
              fileValue={importedFileDisplayName}
              isLoading={isFileUploaderLoading}
              onRemoveFile={() => setFieldValue('importedFile', null)}
              isError={errors.importedFile && touched.importedFile}
            />
            {errors.importedFile && touched.importedFile && <FormErrorMessage>{errors.importedFile}</FormErrorMessage>}
          </StyledFlex>

          <StyledFlex direction="column" flex="auto" width="100%">
            <InputLabel label="Select Test Case to Replace" size={16} mb={10} />
            <CustomSelect
              options={frameworkMatchTestCaseOptions()}
              value={values?.replaceTestCase}
              mb={0}
              closeMenuOnSelect
              form
              components={{
                DropdownIndicator: CustomIndicatorArrow,
              }}
              onChange={(val) => setFieldValue('replaceTestCase', val)}
              isClearable={false}
              isSearchable
              withSeparator
              menuPortalTarget={document.body}
              placeholder="Search for an existing test case..."
              getOptionLabel={(opt) => opt.displayName}
              getOptionValue={(opt) => opt.id}
              invalid={errors.replaceTestCase && touched.replaceTestCase}
            />
            {errors.replaceTestCase && touched.replaceTestCase && (
              <FormErrorMessage>{errors.replaceTestCase}</FormErrorMessage>
            )}
          </StyledFlex>
        </StyledFlex>
      </>
    </CenterModalFixed>
  );
};

export default TestImportAndReplaceModal;
