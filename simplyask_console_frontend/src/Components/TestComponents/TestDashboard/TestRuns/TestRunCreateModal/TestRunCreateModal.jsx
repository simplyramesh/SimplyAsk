import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { getTestSuiteExecutionFilter, postTestRun } from '../../../../../Services/axios/test';
import CustomCheckboxOptions from '../../../../Settings/AccessManagement/components/dropdowns/customComponents/checkboxOptions/CustomCheckboxOptions';
import CustomDropdownIndicator from '../../../../Settings/AccessManagement/components/dropdowns/customComponents/dropdownIndicator/CustomDropdownIndicator';
import CustomValueContainer from '../../../../Settings/AccessManagement/components/dropdowns/customComponents/ValueContainer/CustomValueContainer';
import FormErrorMessage from '../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import BaseTextInput from '../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import CenterModalFixed from '../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import DropdownSelectedChip from '../DropdownSelectedChip/DropdownSelectedChip';
import { getUniqueSuitesAndEnv } from '../utils/helpers';
import { CREATE_TEST_RUN_VALIDATION_SCHEMA } from '../utils/validations';
import TestRunNextCreateModal from './TestRunNextCreateModal/TestRunNextCreateModal';

const TestRunCreateModal = ({ isOpen, onClose, onCreate }) => {
  const queryClient = useQueryClient();

  const [selectedSuiteIds, setSelectedSuiteIds] = useState({});
  const [isEnvExecutionsOpen, setIsEnvExecutionsOpen] = useState(false);

  const [shouldValidate, setShouldValidate] = useState(false);

  const createTestRunModalRef = useRef(null);

  const formik = useFormik({
    initialValues: CREATE_TEST_RUN_VALIDATION_SCHEMA.cast(),
    validationSchema: CREATE_TEST_RUN_VALIDATION_SCHEMA,
    validateOnChange: shouldValidate,
    validateOnBlur: shouldValidate,
    onSubmit: (values) => {
      setShouldValidate(false);

      const suiteIds = values.testSuiteIds.map((suite) => suite.testSuiteId);
      const selectedTestSuiteExecutionIds = [];

      values.environments.forEach((env) => {
        values.testSuiteIds.forEach((suite) => {
          const executionIds = testSuiteExecutions.testSuiteExecutionIds[env.environment][suite.displayName];

          if (executionIds != null) selectedTestSuiteExecutionIds.push(...executionIds);
        });
      });

      setSelectedSuiteIds({
        testSuiteIds: suiteIds,
        testSuiteExecutionIds: selectedTestSuiteExecutionIds,
      });
      onClose();
      setIsEnvExecutionsOpen(true);
    },
  });

  const testExecutionParams = {
    isAscending: false,
    pageSize: 200,
  };

  const { data: testSuiteExecutions } = useQuery({
    queryKey: ['getTestSuiteExecutionFilter', testExecutionParams],
    queryFn: () => getTestSuiteExecutionFilter(testExecutionParams),
    enabled: isOpen,
    select: (data) => getUniqueSuitesAndEnv(data?.content ?? []),
  });

  const { mutate: createTestRun } = useMutation({
    mutationFn: async ({ name, execIds }) => {
      const createdTestRun = await postTestRun({ name, testSuiteExecutions: execIds });

      return createdTestRun;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();

      setIsEnvExecutionsOpen(false);

      onCreate(formik.values.name);
    },
    onError: () => {
      toast.error('Unable to Create Test Run');
    },
  });

  const handleCreateTestRun = (testRunData) => {
    createTestRun(testRunData);

    onClose();
    setIsEnvExecutionsOpen(false);
    setSelectedSuiteIds({});

    setShouldValidate(false);

    formik.resetForm();
  };

  const commonSelectProps = {
    components: {
      DropdownIndicator: CustomDropdownIndicator,
      Option: CustomCheckboxOptions,
      ValueContainer: CustomValueContainer,
    },
    withSeparator: true,
    borderRadius: '10px',
    mb: '0px',
    padding: '0px 8px 0px 2px',
    openMenuOnClick: true,
    isSearchable: true,
    closeMenuOnSelect: false,
    menuShouldBlockScroll: false,
    menuShouldScrollIntoView: true,
    captureMenuScroll: false,
    isClearable: false,
    hideSelectedOptions: false,
    isMulti: true,
    withCommas: true,
  };

  return (
    <>
      <CenterModalFixed
        title="Create a New Test Run"
        open={isOpen}
        onClose={() => {
          formik.resetForm();
          setShouldValidate(false);
          onClose();
        }}
        maxWidth="622px"
        modalRef={createTestRunModalRef}
        actions={
          <StyledFlex direction="row" justifyContent="flex-end" width="100%">
            <StyledButton
              primary
              variant="contained"
              type="submit"
              onClick={() => {
                setShouldValidate(true);

                formik.submitForm();
              }}
              disabled={!formik.isValid}
            >
              Next
            </StyledButton>
          </StyledFlex>
        }
      >
        <StyledFlex flex="auto" p="25px">
          <StyledFlex direction="column" flex="auto" width="100%" mb="24px">
            <InputLabel label="Test Run Name" isOptional={false} />
            <BaseTextInput
              id="name"
              name="name"
              placeholder="Enter a Name"
              {...formik.getFieldProps('name')}
              invalid={formik.getFieldMeta('name')?.error != null}
            />
            {formik.errors.name && <FormErrorMessage>{formik.errors.name}</FormErrorMessage>}
          </StyledFlex>
          <StyledFlex direction="column" flex="auto" width="100%" mb="24px">
            <InputLabel label="Select Test Suites" isOptional={false} />
            <CustomSelect
              name="testSuiteIds"
              placeholder="Select Test Suites"
              options={testSuiteExecutions?.testSuites ?? []}
              getOptionLabel={(option) => option.displayName}
              getOptionValue={(option) => option.testSuiteId}
              {...formik.getFieldProps('testSuiteIds')}
              onChange={(option) => formik.setFieldValue('testSuiteIds', option)}
              invalid={formik.getFieldMeta('testSuiteIds')?.error != null}
              {...commonSelectProps}
              labelKey="displayName"
              valueKey="testSuiteId"
              menuPortalTarget={document.body}
              maxMenuHeight={262}
            />
            {formik.errors.testSuiteIds && <FormErrorMessage>{formik.errors.testSuiteIds}</FormErrorMessage>}
            <DropdownSelectedChip
              selectedArray={formik.values.testSuiteIds}
              onRemove={(updatedTestSuiteIds) => formik.setFieldValue('testSuiteIds', updatedTestSuiteIds)}
            >
              {({ item }) => <StyledText lh={24}>{item.displayName}</StyledText>}
            </DropdownSelectedChip>
          </StyledFlex>
          <StyledFlex direction="column" flex="auto" width="100%" mb="24px">
            <InputLabel label="Select Environments" isOptional={false} />
            <CustomSelect
              name="environments"
              placeholder="Select Environments"
              options={testSuiteExecutions?.environments ?? []}
              getOptionLabel={(option) => option.environment}
              getOptionValue={(option) => option.environment}
              {...formik.getFieldProps('environments')}
              onChange={(option) => formik.setFieldValue('environments', option)}
              invalid={formik.getFieldMeta('environments')?.error != null}
              {...commonSelectProps}
              labelKey="environment"
              valueKey="environment"
              menuPortalTarget={document.body}
              maxMenuHeight={262}
            />
            {formik.errors.environments && <FormErrorMessage>{formik.errors.environments}</FormErrorMessage>}
            <DropdownSelectedChip
              selectedArray={formik.values.environments}
              onRemove={(updatedEnvironments) => formik.setFieldValue('environments', updatedEnvironments)}
            >
              {({ item }) => <StyledText lh={24}>{item.environment}</StyledText>}
            </DropdownSelectedChip>
          </StyledFlex>
        </StyledFlex>
      </CenterModalFixed>
      <TestRunNextCreateModal
        isOpen={isEnvExecutionsOpen}
        onOpenChange={setIsEnvExecutionsOpen}
        selectedSuiteIds={selectedSuiteIds}
        testRunName={formik.values.name}
        onBack={onClose}
        onCreate={handleCreateTestRun}
        onReset={formik.resetForm}
      />
    </>
  );
};

TestRunCreateModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default TestRunCreateModal;
