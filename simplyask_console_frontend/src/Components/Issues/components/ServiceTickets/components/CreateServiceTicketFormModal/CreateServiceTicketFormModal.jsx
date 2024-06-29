/* eslint-disable no-unused-vars */

import { endOfDay } from 'date-fns';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { useGetCurrentUser } from '../../../../../../hooks/useGetCurrentUser';
import { getServiceTicketsCategory } from '../../../../../../store/selectors';
import CustomCalendarIndicator from '../../../../../Settings/AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import FormErrorMessage from '../../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import { toCamelCase } from '../../../../../Settings/AccessManagement/utils/formatters';
import ServiceTypeIconPreview from '../../../../../Settings/Components/FrontOffice/components/shared/ServiceTypeIconPreview';
import BaseTextInput from '../../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import { EXPRESSION_BUILDER_DEFAULT_VALUE } from '../../../../../shared/REDISIGNED/controls/lexical/ExpressionBuilder';
import { RichTextEditor } from '../../../../../shared/REDISIGNED/controls/lexical/RichTextEditor';
import CenterModalFixed from '../../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import { IconControl } from '../../../../../shared/REDISIGNED/selectMenus/customComponents/controls/IconControl';
import CustomIndicatorArrow from '../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import SingleCalendarMenuList from '../../../../../shared/REDISIGNED/selectMenus/customComponents/menuLists/SingleCalendarMenuList';
import { IconOption } from '../../../../../shared/REDISIGNED/selectMenus/customComponents/options/IconOption';
import { StatusOption } from '../../../../../shared/REDISIGNED/selectMenus/customComponents/options/StatusOption';
import { DateSingleValue } from '../../../../../shared/REDISIGNED/selectMenus/customComponents/singleControls/DateSingleValue';
import { StatusValue } from '../../../../../shared/REDISIGNED/selectMenus/customComponents/singleControls/StatusValue';
import CustomSelect from '../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { UserAutocompleteForm } from '../../../../../shared/REDISIGNED/selectMenus/UserAutocomplete/UserAutocomplete';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { ISSUE_ENTITY_TYPE, ISSUE_PRIORITIES } from '../../../../constants/core';
import { PRIORITY_OPTIONS } from '../../../../constants/options';
import { createTicketSchema } from '../../../TicketTasks/components/CreateTicketForm/validationSchemas';
import LinkedItems from '../shared/LinkedItems/LinkedItems';
import TicketDragAndDropFiles from '../shared/TicketDragAndDropFiles/TicketDragAndDropFiles';
import {
  ValidationTypeInput,
  getDataTypeInputValue,
} from '../../../../../Managers/AgentManager/AgentEditor/utils/formatters';
import {
  VALIDATION_TYPES,
  VALIDATION_TYPE_PLACEHOLDERS,
} from '../../../../../PublicFormPage/constants/validationTypes';
import { ERROR_TYPES } from '../../../../../WorkflowEditor/utils/validation';
import { additionalFieldsSchema } from '../../../../../Settings/Components/FrontOffice/utils/validationSchemas';
import { getErrors } from '../../../../../Managers/shared/utils/validation';

const CreateServiceTicketFormModal = ({ open, onClose, onSubmit, ...rest }) => {
  const { currentUser } = useGetCurrentUser();
  const [shouldStayOpen, setShouldStayOpen] = React.useState(false);
  const [relatedEntities, setRelatedEntities] = useState([]);
  const [additionalFields, setAdditionalField] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const serviceTicketTaskCategory = useRecoilValue(getServiceTicketsCategory);
  const mappedServiceTicketTypes = serviceTicketTaskCategory.types.map((category) => ({
    label: category.name,
    value: category.id,
    Icon: () => <ServiceTypeIconPreview icon={category.icon} iconColour={category.iconColour} />,
  }));
  const defaultSelectedType =
    serviceTicketTaskCategory.types.find((type) => type.isDefault) || serviceTicketTaskCategory.types[0];
  const [issueType, setIssueType] = useState(defaultSelectedType.id);

  const currentUserOption = {
    label: `${currentUser?.firstName} ${currentUser?.lastName}`,
    value: {
      id: currentUser?.id,
      firstName: currentUser?.firstName,
      lastName: currentUser?.lastName,
      pfp: currentUser?.pfp,
    },
  };

  const getAdditionalFieldKey = (name) => `additionalFields.${toCamelCase(name)}`;
  const [additionalFieldError, setAdditionalFieldError] = useState();

  const { values, errors, touched, handleBlur, setFieldValue, resetForm, submitForm } = useFormik({
    initialValues: {
      displayName: '',
      description: EXPRESSION_BUILDER_DEFAULT_VALUE,
      issueCategoryId: serviceTicketTaskCategory.id,
      issueTypeId: issueType,
      priority: ISSUE_PRIORITIES.NONE,
      issueStatusId: '',
      createdBy: ISSUE_ENTITY_TYPE.USER,
      dueDate: '',
      assignedToUserId: '',
      additionalFields: {},
      relatedEntities: [],
      attachmentFiles: [],
    },
    validationSchema: createTicketSchema,
    onSubmit: (values) =>
      onSubmit(
        {
          ...values,
          assignedToUserId: values.assignedToUserId?.value?.id || null,
          attachmentFiles: values?.attachmentFiles?.map((file) => file.id),
        },
        shouldStayOpen ? resetForm : null
      ),
  });

  useEffect(() => {
    setFieldValue(
      'relatedEntities',
      relatedEntities.map((entity) => ({
        relation: entity.relation,
        entityId: entity.id,
        type: entity.type,
      }))
    );
  }, [relatedEntities]);

  useEffect(() => {
    if (serviceTicketTaskCategory?.types) {
      const selectedType =
        serviceTicketTaskCategory.types.find((type) => (issueType ? type.id === issueType : type.isDefault)) ||
        serviceTicketTaskCategory.types[0];

      const mappedStatuses =
        selectedType?.statuses.map((status) => ({
          label: status.name,
          value: status.id,
          ...status,
        })) || [];

      const params = selectedType?.parameters.filter((parameter) => parameter.isVisible);

      setStatuses(mappedStatuses);
      setAdditionalField(params);
      params.forEach((param) => setFieldValue(getAdditionalFieldKey(param.name), param.defaultValue || ''));
      setFieldValue('issueStatusId', mappedStatuses?.length ? mappedStatuses[0].value : '');

      const fieldErrors = params?.map((param) => ({ [toCamelCase(param.name)]: '' }));
      setAdditionalFieldError(fieldErrors);
    }
  }, [issueType, serviceTicketTaskCategory]);

  const handleSubmit = (shouldStay) => {
    setShouldStayOpen(shouldStay);
    submitForm();
  };

  const validateAdditionalField = async (field, value, index) => {
    const updatedAdditionalFieldError = [...additionalFieldError];

    if (value) {
      const { defaultValue: error } = getErrors({
        schema: additionalFieldsSchema,
        data: { ...field, defaultValue: value },
      });

      updatedAdditionalFieldError[index][toCamelCase(field.name)] = error || '';
    } else if (!value && field.isMandatory) {
      updatedAdditionalFieldError[index][toCamelCase(field.name)] = 'A value is required';
    } else {
      updatedAdditionalFieldError[index][toCamelCase(field.name)] = '';
    }

    setAdditionalFieldError(updatedAdditionalFieldError);
  };

  const handleDataTypeValueChange = (e, field, index) => {
    const fieldKey = getAdditionalFieldKey(field.name);

    const value = getDataTypeInputValue(e, field.type);

    setFieldValue(fieldKey, value);

    validateAdditionalField(field, value, index);
  };

  const isError = () => {
    const updatedAdditionalFieldError = [...additionalFieldError];

    additionalFields.forEach((field, index) => {
      const fieldName = toCamelCase(field.name);
      if (field.isMandatory) {
        if (!values.additionalFields[fieldName] && !updatedAdditionalFieldError[index][fieldName].length) {
          updatedAdditionalFieldError[index][fieldName] = 'A value is required';
        }
      }
    });

    setAdditionalFieldError(updatedAdditionalFieldError);

    const fieldError = updatedAdditionalFieldError?.some((fieldError) => Object.values(fieldError)[0].length);

    return fieldError;
  };

  return (
    <CenterModalFixed
      open={open}
      onClose={onClose}
      maxWidth="745px"
      title={
        <StyledText size={20} weight={600}>
          Create service ticket
        </StyledText>
      }
      actions={
        <StyledFlex direction="row" gap="15px">
          <StyledButton primary variant="outlined" onClick={() => (isError() ? null : handleSubmit(true))}>
            Create and Start Another Ticket
          </StyledButton>
          <StyledButton primary variant="contained" onClick={() => (isError() ? null : handleSubmit(false))}>
            Create
          </StyledButton>
        </StyledFlex>
      }
      {...rest}
    >
      <StyledFlex flex="auto" p="25px">
        <StyledFlex mb="30px">
          <StyledText size={16} lh={24} weight={600}>
            Details
          </StyledText>
        </StyledFlex>
        <StyledFlex direction="column" flex="auto" width="100%" mb="24px">
          <InputLabel label="Ticket Name" isOptional={false} />
          <BaseTextInput
            name="displayName"
            placeholder="Enter Name of Service Ticket..."
            value={values.displayName}
            onChange={(e) => setFieldValue('displayName', e.target.value)}
            invalid={errors.displayName && touched.displayName}
            onBlur={handleBlur}
          />
          {errors.displayName && touched.displayName && <FormErrorMessage>{errors.displayName}</FormErrorMessage>}
        </StyledFlex>
        <StyledFlex direction="column" flex="auto" width="100%" mb="24px">
          <InputLabel label="Description" isOptional />
          <RichTextEditor
            onChange={(descr) => {
              setFieldValue('description', JSON.stringify(descr));
            }}
            addToolbarPlugin
          />
        </StyledFlex>
        <StyledFlex direction="column" flex="auto" width="100%" mb="24px">
          <InputLabel label="Attachments" isOptional />
          <TicketDragAndDropFiles
            onChange={(attachments) => setFieldValue('attachmentFiles', attachments)}
            valueAttachmentFiles={values.attachmentFiles}
          />
        </StyledFlex>
        <StyledFlex direction="column" flex="auto" width="100%" mb="24px">
          <InputLabel label="Ticket Type" isOptional={false} />
          <CustomSelect
            options={mappedServiceTicketTypes}
            placeholder="Select issue type"
            value={mappedServiceTicketTypes.filter((type) => type.value === values.issueTypeId)}
            closeMenuOnSelect
            isClearable={false}
            isSearchable={false}
            onChange={(val) => {
              setFieldValue('issueTypeId', val.value);
              setIssueType(val.value);
            }}
            components={{
              DropdownIndicator: CustomIndicatorArrow,
              Control: IconControl,
              Option: IconOption,
            }}
            maxHeight={30}
            menuPadding={0}
            form
            menuPortalTarget={document.body}
            withSeparator
          />
          {errors.issueTypeId && touched.issueTypeId && <FormErrorMessage>{errors.issueTypeId}</FormErrorMessage>}
        </StyledFlex>
        <StyledFlex direction="row" flex="auto" width="100%" mb="24px" gap="30px">
          <StyledFlex direction="column" width="358px">
            <InputLabel label="Priority" isOptional={false} />
            <CustomSelect
              options={PRIORITY_OPTIONS}
              placeholder="Select priority"
              value={PRIORITY_OPTIONS.filter((priority) => priority.value === values.priority)}
              getOptionValue={({ value }) => value}
              closeMenuOnSelect
              isClearable={false}
              isSearchable={false}
              onChange={(val) => setFieldValue('priority', val.value)}
              components={{
                DropdownIndicator: CustomIndicatorArrow,
                Control: IconControl,
                Option: IconOption,
              }}
              maxHeight={30}
              menuPadding={0}
              form
              menuPortalTarget={document.body}
            />
            {errors.priority && touched.priority && <FormErrorMessage>{errors.priority}</FormErrorMessage>}
          </StyledFlex>
          {!!statuses?.length && (
            <StyledFlex direction="column" width="174px">
              <InputLabel label="Status" isOptional={false} />
              <CustomSelect
                options={statuses}
                placeholder="Select status"
                value={statuses.filter((status) => status.value === values.issueStatusId)}
                closeMenuOnSelect
                isClearable={false}
                onChange={(val) => setFieldValue('issueStatusId', val.value)}
                components={{
                  DropdownIndicator: null,
                  Option: StatusOption,
                  SingleValue: StatusValue,
                }}
                maxHeight={30}
                menuPadding={0}
                isSearchable={false}
                cell
                status
                menuPortalTarget={document.body}
              />
              {errors.issueStatusId && touched.issueStatusId && (
                <FormErrorMessage>{errors.issueStatusId}</FormErrorMessage>
              )}
            </StyledFlex>
          )}
        </StyledFlex>

        <StyledFlex direction="column" flex="auto" width="100%" mb="24px">
          <InputLabel label="Due Date" isOptional />
          <CustomSelect
            placeholder="Select Due Date for Ticket"
            onChange={(val) => setFieldValue('dueDate', val)}
            value={values.dueDate}
            closeMenuOnSelect
            components={{
              DropdownIndicator: CustomCalendarIndicator,
              SingleValue: DateSingleValue,
              Menu: SingleCalendarMenuList,
            }}
            menuPortalTarget={document.body}
            form
            calendar
            isMenuOpen
            minDate={endOfDay(new Date())}
          />
          {errors.dueDate && touched.dueDate && <FormErrorMessage>{errors.dueDate}</FormErrorMessage>}
        </StyledFlex>
        <StyledFlex direction="column" flex="auto" width="100%">
          <InputLabel label="Assignee" isOptional={false} />
          <UserAutocompleteForm
            placeholder="Search Assignee..."
            value={values.assignedToUserId}
            onChange={(v) => {
              setFieldValue('assignedToUserId', v);
              setFieldValue('assignedByUserId', currentUser?.id);
            }}
          />
          <StyledButton
            variant="text"
            alignSelf="flex-start"
            onClick={() => setFieldValue('assignedToUserId', currentUserOption)}
          >
            Assign to me
          </StyledButton>
          {errors.assignedToUserId && touched.assignedToUserId && (
            <FormErrorMessage>{errors.assignedToUserId}</FormErrorMessage>
          )}
        </StyledFlex>

        {additionalFields.length > 0 && (
          <>
            <StyledDivider m="30px 0" />

            <StyledFlex mb="30px">
              <StyledText size={16} lh={24} weight={600}>
                Additional Fields
              </StyledText>
            </StyledFlex>

            {additionalFields.map((field, index) => {
              return (
                <StyledFlex
                  direction="column"
                  key={index}
                  flex="auto"
                  width="100%"
                  mb={index !== additionalFields.length - 1 ? '24px' : '0'}
                >
                  <InputLabel label={field.name} isOptional={!field.isMandatory} />
                  <ValidationTypeInput
                    id={getAdditionalFieldKey(field.name)}
                    fieldValidationType={field.type}
                    fieldCriteria={field.isMandatory ? 'M' : 'O'}
                    fieldName={field.name}
                    isProtected={field.isMasked}
                    value={values.additionalFields[toCamelCase(field.name)]}
                    onChange={(e) => handleDataTypeValueChange(e, field, index)}
                    dobProps={{ menuPlacement: 'top' }}
                    inputFieldProps={{
                      placeholder: VALIDATION_TYPE_PLACEHOLDERS?.[field.type] || 'Enter Value...',
                      error: { type: additionalFieldError[index][toCamelCase(field.name)] ? ERROR_TYPES.ERROR : null },
                    }}
                    addressAutocompleteProps={{
                      menuPlacement: 'top',
                      menuPortalTarget: document.body,
                    }}
                    onBlur={handleBlur}
                    error={additionalFieldError[index][toCamelCase(field.name)]}
                  />
                  {additionalFieldError[index][toCamelCase(field.name)] ? (
                    <FormErrorMessage>{additionalFieldError[index][toCamelCase(field.name)]}</FormErrorMessage>
                  ) : null}
                </StyledFlex>
              );
            })}
          </>
        )}
      </StyledFlex>

      <StyledFlex p="0 25px 25px">
        <StyledDivider m="30px 0" />
        <LinkedItems
          showAddFormByDefault
          relatedEntities={relatedEntities}
          onSave={(e) => {
            setRelatedEntities((prev) => [
              ...prev,
              {
                ...e,
                ...e.relatedEntity,
                description: e.relatedEntity.id,
              },
            ]);
          }}
          onUnlink={(e) => setRelatedEntities((prev) => prev.filter((entity) => entity.id !== e.relatedEntity.id))}
        />
      </StyledFlex>
    </CenterModalFixed>
  );
};

export default CreateServiceTicketFormModal;

CreateServiceTicketFormModal.propTypes = {
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
