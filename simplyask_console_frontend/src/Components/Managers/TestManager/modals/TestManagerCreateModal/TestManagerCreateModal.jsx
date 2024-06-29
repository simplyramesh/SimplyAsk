import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { useFormik } from 'formik';
import { debounce } from 'lodash';
import { useState } from 'react';
import { getTestGenericType } from '../../../../../Services/axios/test';
import LinkedItemCard from '../../../../Issues/components/ServiceTickets/components/shared/LinkedItems/LinkedItemCard/LinkedItemCard';
import LoadingMessage from '../../../../Sell/shared/LoadingMessage';
import NoOptionsMessage from '../../../../Sell/shared/NoOptionsMessage';
import FormErrorMessage from '../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import BaseTextInput from '../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import TagsInput from '../../../../shared/REDISIGNED/controls/TagsInput/TagsInput';
import { RichTextEditor } from '../../../../shared/REDISIGNED/controls/lexical/RichTextEditor';
import CenterModalFixed from '../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import ConfirmationModal from '../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomIndicatorArrow from '../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import { StyledTooltip } from '../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import Spinner from '../../../../shared/Spinner/Spinner';
import { StyledDivider, StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { EXECUTION_FRAMEWORK_OPTIONS, TEST_ENTITY_TYPE, TEST_MANAGER_LABELS } from '../../constants/constants';
import useGetSuiteLinkages from '../../hooks/useGetSuiteLinkages';
import useGetTestCaseLinkages from '../../hooks/useGetTestCaseLinkages';
import useGetTestGroupLinkages from '../../hooks/useGetTestGroupLinkages';
import { linkedTestEntityMapper } from '../../utils/helpers';
import {
  createTestCaseInitialValues,
  duplicateTestCaseInitialValues,
  importTestCaseInitialValues,
} from '../../utils/initialValues';
import ButtonGroupCancelAndAssign from './ButtonGroupCancelAndAssign';
import TestTypeOption from './TestTypeOption';
import { createTestCaseSchema, createTestGroupSuiteSchema } from './validationSchema';

export const CreateTestModal = ({
  openTestModal,
  onCloseTestModal,
  onSubmitCreateNewTest,
  createAndStartAnother,
  create,
  testTypeText,
  assignToTest,
  selectPlaceHolder,
  isTestSuiteModal = false,
  isTestCaseModal = false,
  richTextEditorKey,
  duplicateTestData,
  testType,
  importModeData,
  allTestCasesOptions = [],
  isLoading,
  ...rest
}) => {
  const isImportMode = !!importModeData;

  const isDuplicateMode = !!duplicateTestData;

  const DEBOUNCE_TIMEOUT = 300;

  const [shouldStayOpen, setShouldStayOpen] = useState(false);
  const [addTestType, setAddTestType] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const { testSuitesLinkages } = useGetSuiteLinkages({
    options: { enabled: testTypeText !== TEST_MANAGER_LABELS.SUITE },
  });

  const { testCaseLinkages } = useGetTestCaseLinkages({
    options: { enabled: testTypeText !== TEST_MANAGER_LABELS.CASE },
  });

  const { testGroupLinkages } = useGetTestGroupLinkages({
    options: { enabled: testTypeText !== TEST_MANAGER_LABELS.GROUP },
  });

  const suitesAndGroupsLinkages = [...(testSuitesLinkages || []), ...(testGroupLinkages || [])];
  const casesAndSuitesLinkages = [...(testCaseLinkages || []), ...(testSuitesLinkages || [])];

  const initialValues = () => {
    if (isImportMode) return importTestCaseInitialValues(importModeData);

    return duplicateTestData
      ? duplicateTestCaseInitialValues(duplicateTestData, allTestCasesOptions)
      : createTestCaseInitialValues();
  };

  const initialTouched = isImportMode
    ? {
        displayName: true,
      }
    : {};

  const validationSchema =
    isTestCaseModal || isDuplicateMode
      ? createTestCaseSchema(allTestCasesOptions)
      : createTestGroupSuiteSchema(duplicateTestData?.displayName);

  const validateOnMount = (isImportMode || duplicateTestData) && allTestCasesOptions;

  const { values, errors, touched, handleBlur, setFieldValue, resetForm, submitForm, dirty } = useFormik({
    initialValues: initialValues(),
    enableReinitialize: true,
    validateOnMount,
    initialTouched,
    validationSchema,
    onSubmit: () => {
      const payload = getCreatePayload(testTypeText, values);
      setAddTestType(null);
      onSubmitCreateNewTest(payload, shouldStayOpen, resetForm);
    },
  });

  const addTestTypeFn = (addedTestType) => {
    const testTypeFormat = {
      id: addedTestType.testGenericId,
      displayName: addedTestType?.displayName,
      genericTestType: addedTestType?.genericTestType,
    };

    const allTestTypes = [...values.assignTests, testTypeFormat];

    setFieldValue('assignTests', allTestTypes);
    setAddTestType(null);
  };

  const filterCustomSelectOptions = (option, inputValue) => {
    const selectedIds = values?.assignTests?.map((test) => test.id);
    const value = inputValue?.toLowerCase();

    return (
      !selectedIds.includes(option?.value) &&
      (option.label?.toLowerCase()?.includes(value) || option.value?.toLowerCase()?.includes(value))
    );
  };

  const removeTest = (test) => {
    const filterTest = values?.assignTests?.filter((item) => item.id !== test.id);
    setFieldValue('assignTests', filterTest);
  };

  const getTestIds = (groupIds, suiteIds, caseIds) =>
    values?.assignTests
      ?.filter((item) => {
        if (groupIds) return item.genericTestType === TEST_ENTITY_TYPE.GROUP;
        if (suiteIds) return item.genericTestType === TEST_ENTITY_TYPE.SUITE;
        if (caseIds) return item.genericTestType === TEST_ENTITY_TYPE.CASE;
        return false;
      })
      .map((item) => item.id);

      const getCreatePayload = (type, formValues) => {
        if (isImportMode) {
          return {
            fileContent: {
              ...importModeData,
              attributes: {
                ...importModeData?.attributes,
                displayName: values.displayName,
                description: values.description,
                tags: values.tags,
              },
            },

            testSuiteId:
              values.assignTests
                ?.filter((test) => test.genericTestType === TEST_ENTITY_TYPE.SUITE)
                .map((suite) => suite.id) || [],

            testGroupId:
              values.assignTests
                ?.filter((test) => test.genericTestType === TEST_ENTITY_TYPE.GROUP)
                .map((group) => group.id) || [],
            framework: values.type?.value,
          };
        }

        if (type === TEST_MANAGER_LABELS.CASE) {
          return {
            displayName: formValues?.displayName,
            description: formValues?.description,
            isEditingDisabled: false,
            isFavourite: false,
            isArchived: false,
            testCaseType: formValues?.type?.value,
            testGroupId: getTestIds(true, false, false),
            testSuiteId: getTestIds(false, true, false),
            tags: formValues?.tags.map((tag) => ({ name: tag })),
            ...(isDuplicateMode && { workFlowId: duplicateTestData?.workflowId }),
          };
        }
        if (type === TEST_MANAGER_LABELS.GROUP) {
          return {
            displayName: formValues?.displayName,
            description: formValues?.description,
            isFavourite: false,
            isArchived: false,
            testCaseId: getTestIds(false, false, true),
            testSuiteId: getTestIds(false, true, false),
            tags: formValues?.tags.map((tag) => ({ name: tag })),
          };
        }
        if (type === TEST_MANAGER_LABELS.SUITE) {
          return {
            displayName: formValues?.displayName,
            description: formValues?.description,
            testGroupId: getTestIds(true, false, false),
            testCaseId: getTestIds(false, false, true),
            tags: formValues?.tags.map((tag) => ({ name: tag })),
          };
        }
        return {};
      };

  const handleSubmit = (shouldStay) => {
    setShouldStayOpen(shouldStay);
    submitForm();
  };

  const getTagLabelValueArr = () =>
    values?.tags?.map((tag) => ({
      label: tag,
      value: tag,
    }));

  const renderTestTypeHeader = (testType, testHeader) =>
    values.assignTests.some((test) => test.genericTestType === testType) && (
      <StyledText weight={600} key={testType} mt={12}>
        {testHeader}
      </StyledText>
    );

  const renderLinkedItemTestCards = (testType) =>
    values?.assignTests
      ?.filter((test) => test.genericTestType === testType)
      .map((test) => (
        <LinkedItemCard
          key={test.id}
          item={linkedTestEntityMapper(test)}
          onUnlink={() => removeTest(test)}
          closeTooltipText="Remove"
        />
      ));

  const testCaseOnLoad = debounce((inputValue, setOptions) => {
    getTestGenericType(TEST_ENTITY_TYPE.CASE, inputValue).then(setOptions);
  }, DEBOUNCE_TIMEOUT);

  const testGroupsOnLoad = debounce((inputValue, setOptions) => {
    getTestGenericType(TEST_ENTITY_TYPE.GROUP, inputValue).then(setOptions);
  }, DEBOUNCE_TIMEOUT);

  const testSuitesAndGroupsOnLoad = debounce((inputValue, setOptions) => {
    Promise.all([
      getTestGenericType(TEST_ENTITY_TYPE.SUITE, inputValue),
      getTestGenericType(TEST_ENTITY_TYPE.GROUP, inputValue),
    ]).then(([suites, groups]) => setOptions([...suites, ...groups]));
  }, DEBOUNCE_TIMEOUT);

  const testCasesAndSuitesOnLoad = debounce((inputValue, setOptions) => {
    Promise.all([
      getTestGenericType(TEST_ENTITY_TYPE.CASE, inputValue),
      getTestGenericType(TEST_ENTITY_TYPE.SUITE, inputValue),
    ]).then(([cases, suites]) => setOptions([...cases, ...suites]));
  }, DEBOUNCE_TIMEOUT);

  const frameworkTypeLabel = EXECUTION_FRAMEWORK_OPTIONS.find(
    (framework) => framework.value === values?.type?.value
  )?.label;

  const isLoadingModal = isLoading;

  return (
    <>
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onCloseModal={() => {
          setShowConfirmationModal(false);
        }}
        onSuccessClick={() => {
          resetForm();
          setShowConfirmationModal(false);
          onCloseTestModal();
        }}
        alertType="WARNING"
        title="Are You Sure?"
        text="You have unsaved changes that will be lost if you leave the page."
      />

      <CenterModalFixed
        open={openTestModal}
        onClose={() => {
          if (dirty) {
            setShowConfirmationModal(true);
          } else {
            onCloseTestModal();
          }
        }}
        maxWidth="745px"
        title={
          <StyledText size={20} weight={600}>
            {isDuplicateMode ? `Duplicate ${testTypeText}` : `Create ${testTypeText}`}
          </StyledText>
        }
        actions={
          <StyledFlex direction="row" gap="15px">
            {!isDuplicateMode && createAndStartAnother && (
              <StyledButton
                primary
                variant="outlined"
                onClick={() => handleSubmit(true, testTypeText)}
                disabled={isLoadingModal}
              >
                {createAndStartAnother}
              </StyledButton>
            )}

            {isDuplicateMode && (
              <StyledButton
                primary
                variant="outlined"
                onClick={() => {
                  if (dirty) {
                    setShowConfirmationModal(true);
                  } else {
                    onCloseTestModal();
                  }
                }}
              >
                Cancel
              </StyledButton>
            )}

            <StyledButton
              primary
              variant="contained"
              onClick={() => handleSubmit(false, testTypeText)}
              disabled={isLoadingModal}
            >
              {isDuplicateMode ? 'Duplicate' : create}
            </StyledButton>
          </StyledFlex>
        }
        {...rest}
      >
        <StyledFlex flex="auto" p="25px">
          {isLoadingModal && <Spinner fadeBgParent medium />}

          <StyledFlex direction="column" flex="auto" width="100%" mb="24px">
            <InputLabel label="Name" isOptional={false} />
            <BaseTextInput
              name="displayName"
              placeholder={`Enter Name of ${testTypeText}...`}
              value={values?.displayName}
              onChange={(e) => setFieldValue('displayName', e.target.value)}
              invalid={errors?.displayName && touched?.displayName}
              onBlur={handleBlur}
            />
            {errors?.displayName && touched?.displayName && <FormErrorMessage>{errors?.displayName}</FormErrorMessage>}
          </StyledFlex>
          <StyledFlex direction="column" flex="auto" width="100%" mb="24px">
            <InputLabel label="Description" isOptional />
            <RichTextEditor
              key={richTextEditorKey}
              onChange={(descr) => {
                setFieldValue('description', JSON.stringify(descr));
              }}
              editorState={values.description}
              addToolbarPlugin
              placeholder="Enter a description..."
            />
          </StyledFlex>
          {isTestCaseModal ? (
            <StyledFlex direction="column" flex="auto" width="100%" mb="24px">
              <StyledFlex direction="row">
                <InputLabel mr={10} label="Type" isOptional={false} />{' '}
                {(duplicateTestData || isImportMode) && (
                  <StyledTooltip
                    arrow
                    placement="top"
                    title={
                      duplicateTestData
                        ? 'The Type for duplicated Test Cases cannot be changed'
                        : 'The type of an imported Test Case cannot be changed'
                    }
                    p="10px 15px"
                  >
                    <InfoOutlined fontSize="inherit" />
                  </StyledTooltip>
                )}
              </StyledFlex>

              {duplicateTestData || isImportMode ? (
                frameworkTypeLabel
              ) : (
                <>
                  <CustomSelect
                    placeholder="Select Type"
                    options={EXECUTION_FRAMEWORK_OPTIONS}
                    onChange={(val) => setFieldValue('type', val)}
                    value={values?.type}
                    closeMenuOnSelect
                    searchable
                    components={{
                      DropdownIndicator: CustomIndicatorArrow,
                    }}
                    menuPortalTarget={document.body}
                    form
                    isMenuOpen
                  />
                  {errors.type && touched.type && <FormErrorMessage>{errors.type}</FormErrorMessage>}
                </>
              )}
            </StyledFlex>
          ) : null}
          <StyledFlex direction="column" flex="auto" width="100%" mb="32px">
            <InputLabel label="Tags" isOptional />
            <TagsInput
              value={getTagLabelValueArr()}
              onCreateOption={(tag) => setFieldValue('tags', [...values.tags, tag])}
              onChange={(e) =>
                setFieldValue(
                  'tags',
                  e.map((tag) => tag.value)
                )
              }
              placeholder="Create..."
            />
          </StyledFlex>

          <StyledDivider borderWidth={2} color="lightgrey" />

          {!isTestSuiteModal ? (
            <>
              <StyledFlex direction="column" flex="auto" width="100%" mt="32px" mb="24px">
                <InputLabel label={assignToTest} isOptional />
                <CustomSelect
                  isAsync
                  loadOptions={isTestCaseModal ? testSuitesAndGroupsOnLoad : testCasesAndSuitesOnLoad}
                  defaultOptions={isTestCaseModal ? suitesAndGroupsLinkages : casesAndSuitesLinkages}
                  placeholder="Search Items..."
                  value={addTestType}
                  closeMenuOnSelect
                  closeMenuOnScroll
                  onChange={setAddTestType}
                  components={{
                    DropdownIndicator: CustomIndicatorArrow,
                    Option: TestTypeOption,
                    LoadingMessage,
                    NoOptionsMessage,
                  }}
                  filterOption={filterCustomSelectOptions}
                  getOptionLabel={(option) => option?.displayName}
                  getOptionValue={(option) => option.testGenericId}
                  isSearchable
                  maxHeight={30}
                  menuPadding={0}
                  form
                  menuPlacement="auto"
                  withSeparator
                  menuPortalTarget={document.body}
                />
              </StyledFlex>

              {!!addTestType && (
                <ButtonGroupCancelAndAssign
                  cancelTestType={() => {
                    setAddTestType(null);
                  }}
                  disableAssignButton={!addTestType}
                  assignTestType={() => addTestTypeFn(addTestType)}
                />
              )}

              {values?.assignTests?.length > 0 ? (
                <StyledFlex flex="auto" direction="column" gap="10px" marginBottom="30px">
                  {testTypeText === TEST_MANAGER_LABELS.TEST_CASE ? (
                    <>
                      {renderTestTypeHeader(TEST_ENTITY_TYPE.GROUP, TEST_MANAGER_LABELS.TEST_GROUPS)}
                      {renderLinkedItemTestCards(TEST_ENTITY_TYPE.GROUP)}

                      {renderTestTypeHeader(TEST_ENTITY_TYPE.SUITE, TEST_MANAGER_LABELS.TEST_SUITES)}
                      {renderLinkedItemTestCards(TEST_ENTITY_TYPE.SUITE)}
                    </>
                  ) : (
                    <>
                      {renderTestTypeHeader(TEST_ENTITY_TYPE.SUITE, TEST_MANAGER_LABELS.TEST_SUITES)}
                      {renderLinkedItemTestCards(TEST_ENTITY_TYPE.SUITE)}
                      {renderTestTypeHeader(TEST_ENTITY_TYPE.CASE, TEST_MANAGER_LABELS.TEST_CASES)}
                      {renderLinkedItemTestCards(TEST_ENTITY_TYPE.CASE)}
                    </>
                  )}
                </StyledFlex>
              ) : null}
            </>
          ) : (
            <>
              <StyledFlex direction="column" flex="auto" width="100%" mt="32px" mb="24px">
                <InputLabel label="Add Test Cases" isOptional />
                <CustomSelect
                  defaultOptions={testCaseLinkages}
                  isAsync
                  loadOptions={testCaseOnLoad}
                  placeholder="Search Items..."
                  value={addTestType?.genericTestType === TEST_ENTITY_TYPE.CASE ? addTestType : ''}
                  closeMenuOnSelect
                  closeMenuOnScroll
                  onChange={setAddTestType}
                  components={{
                    DropdownIndicator: CustomIndicatorArrow,
                    Option: TestTypeOption,
                    LoadingMessage,
                    NoOptionsMessage,
                  }}
                  filterOption={filterCustomSelectOptions}
                  getOptionLabel={(option) => option.displayName}
                  getOptionValue={(option) => option.testGenericId}
                  isSearchable
                  maxHeight={30}
                  menuPadding={0}
                  form
                  menuPlacement="auto"
                  withSeparator
                  menuPortalTarget={document.body}
                />
              </StyledFlex>
              {addTestType?.genericTestType === TEST_ENTITY_TYPE.CASE && (
                <ButtonGroupCancelAndAssign
                  cancelTestType={() => setAddTestType(null)}
                  disableAssignButton={!addTestType}
                  assignTestType={() => addTestTypeFn(addTestType)}
                  confirmText="Add"
                />
              )}
              <StyledFlex flex="auto" direction="column" gap="10px">
                {renderTestTypeHeader(TEST_ENTITY_TYPE.CASE, TEST_MANAGER_LABELS.TEST_CASES)}
                {renderLinkedItemTestCards(TEST_ENTITY_TYPE.CASE)}
              </StyledFlex>

              <StyledFlex mt={4} mb={1}>
                <StyledDivider borderWidth={2} color="lightgrey" />
              </StyledFlex>

              <StyledFlex direction="column" flex="auto" width="100%" mt="32px" mb="24px">
                <InputLabel label="Assign to Test Groups" isOptional />
                <CustomSelect
                  defaultOptions={testGroupLinkages}
                  isAsync
                  loadOptions={testGroupsOnLoad}
                  placeholder="Search Items..."
                  value={addTestType?.genericTestType === TEST_ENTITY_TYPE.GROUP ? addTestType : ''}
                  closeMenuOnSelect
                  closeMenuOnScroll
                  onChange={setAddTestType}
                  components={{
                    DropdownIndicator: CustomIndicatorArrow,
                    Option: TestTypeOption,
                    LoadingMessage,
                    NoOptionsMessage,
                  }}
                  filterOption={filterCustomSelectOptions}
                  getOptionLabel={(option) => option.displayName}
                  getOptionValue={(option) => option.testGenericId}
                  isSearchable
                  maxHeight={30}
                  menuPadding={0}
                  form
                  menuPlacement="auto"
                  withSeparator
                  menuPortalTarget={document.body}
                />
              </StyledFlex>
              {addTestType?.genericTestType === TEST_ENTITY_TYPE.GROUP && (
                <ButtonGroupCancelAndAssign
                  cancelTestType={() => setAddTestType(null)}
                  disableAssignButton={!addTestType}
                  assignTestType={() => addTestTypeFn(addTestType)}
                />
              )}
              <StyledFlex flex="auto" direction="column" gap="10px" marginBottom="10px">
                {renderTestTypeHeader(TEST_ENTITY_TYPE.GROUP, TEST_MANAGER_LABELS.TEST_GROUPS)}
                {renderLinkedItemTestCards(TEST_ENTITY_TYPE.GROUP)}
              </StyledFlex>
            </>
          )}
        </StyledFlex>
      </CenterModalFixed>
    </>
  );
};
