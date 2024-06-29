import { useFormik } from 'formik';
import { useRecoilState } from 'recoil';
import { PROCESS_VISIBILITY } from '../../constants/common';
import { useState } from 'react';
import { MANAGER_API_KEYS } from '../../../../../config/managerKeys';
import { useGetCurrentUser } from '../../../../../hooks/useGetCurrentUser';
import { organizationProcessTypes } from '../../../../../store';
import FormErrorMessage from '../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import BaseTextInput from '../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import TagsInput from '../../../../shared/REDISIGNED/controls/TagsInput/TagsInput';
import CenterModalFixed from '../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import Spinner from '../../../../shared/Spinner/Spinner';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { DUPLICATE_AGENT_OR_PROCESS_VALIDATION_DATA } from '../../../shared/utils/validation';
import ProcessVisibilityInput from '../../components/ProcessVisibilityInput/ProcessVisibilityInput';
import { isUserHaveAccessToProcess } from '../../utils/helpers';
import { getDuplicateProcessValidationSchema } from '../../utils/validations';
import LostProcessConfirmModal from '../LostProcessConfirmModal/LostProcessConfirmModal';

const ProcessManagerDuplicateModal = ({
  data,
  isLoading,
  onClose,
  duplicateProcess,
  handleImportProcess,
  allProcessesOptions = [],
  headerTitle = 'Duplicate Process',
  submitBtnTitle = 'Duplicate',
  isImportProcessModal = false,
}) => {
  const { currentUser } = useGetCurrentUser();
  const [showLostProcesssConfirmModal, setShowLostProcesssConfirmModal] = useState(false);
  const [processTypes] = useRecoilState(organizationProcessTypes);
  const processTypesOptions = processTypes?.map((type) => ({ value: type.id, label: type.name }));

  const initialUsers = data?.users || [];
  const initialUserGroups = data?.userGroups || [];

  const areUsersAndGroupsInitiallyEmpty = initialUsers.length === 0 && initialUserGroups?.length === 0;

  const getInitialValues = () => ({
    displayName: (isImportProcessModal ? data?.displayName : `${data?.displayName} - Copy`) || '',
    description: data?.description || '',
    tags: data?.tags?.map((tag) => ({ value: tag.name, label: tag.name })) || [],
    processType: { value: data?.processType?.id, label: data?.processType?.name },
    users: initialUsers,
    userGroups: initialUserGroups,
    visibility: areUsersAndGroupsInitiallyEmpty ? PROCESS_VISIBILITY.ORGANIZATION : PROCESS_VISIBILITY.USER_SPECIFIC,
  });

  const getVisibilityPayload = (values) => {
    return {
      isEntireOrganization: values.users.length === 0 && values.userGroups.length === 0,
      users: values.users,
      userGroups: values.userGroups,
    };
  };

  const onSubmit = (val) => {
    if (isImportProcessModal) {
      handleImportProcess?.({
        fileContent: {
          ...data?.fileContent,
          attributes: {
            ...data?.fileContent?.attributes,
            displayName: val.displayName,
            description: val.description,
            tags: val.tags?.map((tag) => ({ name: tag.label })),
          },
        },
        processTypeId: val?.processType?.value,
        ...getVisibilityPayload(val),
      });
    } else {
      duplicateProcess?.({
        id: data?.[MANAGER_API_KEYS.WORKFLOW_ID],
        payload: {
          displayName: val.displayName,
          description: val.description,
          tags: val.tags?.map((tag) => ({ name: tag.label })),
          processTypeId: val?.processType?.value,
          ...getVisibilityPayload(val),
        },
      });
    }
  };

  const { values, setFieldValue, setValues, submitForm, touched, errors } = useFormik({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    validateOnMount: true,
    validationSchema: getDuplicateProcessValidationSchema(allProcessesOptions),
    onSubmit: (val) => {
      if (
        isUserHaveAccessToProcess(currentUser, val.users, val.userGroups) ||
        val.visibility === PROCESS_VISIBILITY.ORGANIZATION
      ) {
        onSubmit(val);
      } else {
        setShowLostProcesssConfirmModal(true);
      }
    },
  });

  const onSaveConfirm = () => {
    onSubmit(values);
    setShowLostProcesssConfirmModal(false);
  };

  return (
    <CenterModalFixed
      open
      onClose={onClose}
      maxWidth="775px"
      title={
        <StyledText size={20} weight={600}>
          {headerTitle}
        </StyledText>
      }
      actions={
        <StyledButton primary variant="contained" onClick={submitForm} disabled={isLoading}>
          {submitBtnTitle}
        </StyledButton>
      }
    >
      <>
        {isLoading && <Spinner fadeBgParent />}
        <StyledFlex p="30px" gap="30px">
          <StyledFlex>
            <InputLabel label="Process Name" size={16} mb={10} />
            <BaseTextInput
              name="displayName"
              placeholder="Enter Name of Process..."
              value={values?.displayName}
              onChange={(e) => setFieldValue('displayName', e.target.value)}
              invalid={errors.displayName}
              showLength
              maxLength={DUPLICATE_AGENT_OR_PROCESS_VALIDATION_DATA.NAME_MAX_LEN}
            />
            {errors.displayName && <FormErrorMessage>{errors.displayName}</FormErrorMessage>}
          </StyledFlex>
          <StyledFlex>
            <InputLabel label="Process Description" size={16} mb={10} isOptional />
            <BaseTextInput
              name="description"
              placeholder="Enter Description of Process..."
              value={values?.description}
              onChange={(e) => setFieldValue('description', e.target.value)}
              invalid={errors.description && touched.description}
              showLength
              maxLength={DUPLICATE_AGENT_OR_PROCESS_VALIDATION_DATA.DESCRIPTION_MAX_LEN}
            />
            {errors.description && touched.description && <FormErrorMessage>{errors.description}</FormErrorMessage>}
          </StyledFlex>

          <StyledFlex>
            <InputLabel label="Process Type" size={16} mb={10} />
            <CustomSelect
              options={processTypesOptions}
              value={values?.processType}
              mb={0}
              closeMenuOnSelect
              form
              onChange={(val) => setFieldValue('processType', val)}
              isClearable={false}
              isSearchable={false}
            />
          </StyledFlex>

          <StyledFlex>
            <InputLabel label="Tags" isOptional size={16} mb={10} />
            <TagsInput
              value={values?.tags}
              onCreateOption={(tag) => setFieldValue('tags', [...values?.tags, { value: tag, label: tag }])}
              onChange={(e) => setFieldValue('tags', e)}
              placeholder="Create Tags..."
            />
          </StyledFlex>

          <StyledFlex>
            <ProcessVisibilityInput
              value={{
                users: values.users,
                userGroups: values.userGroups,
                visibility: values.visibility,
              }}
              onChange={(e) => setValues({ ...values, ...e })}
            />
          </StyledFlex>
        </StyledFlex>
      </>
      <LostProcessConfirmModal
        isOpen={showLostProcesssConfirmModal}
        onConfirm={onSaveConfirm}
        onClose={() => setShowLostProcesssConfirmModal(false)}
      />
    </CenterModalFixed>
  );
};

export default ProcessManagerDuplicateModal;
