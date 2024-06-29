import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { useTheme } from '@mui/material/styles';
import { getIssues } from '../../../../../../Services/axios/issuesAxios';
import useGetIssues from '../../../../../../hooks/issue/useGetIssues';
import { useGetCurrentUser } from '../../../../../../hooks/useGetCurrentUser';
import { issuesCategories } from '../../../../../../store';
import { getServiceTaskTypes } from '../../../../../../store/selectors';
import FormErrorMessage from '../../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import CustomValueContainer from '../../../../../Settings/AccessManagement/components/dropdowns/customComponents/ValueContainer/CustomValueContainer';
import CustomDropdownIndicator from '../../../../../Settings/AccessManagement/components/dropdowns/customComponents/dropdownIndicator/CustomDropdownIndicator';
import ServiceTypeIconPreview from '../../../../../Settings/Components/FrontOffice/components/shared/ServiceTypeIconPreview';
import BaseTextInput from '../../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import { EXPRESSION_BUILDER_DEFAULT_VALUE } from '../../../../../shared/REDISIGNED/controls/lexical/ExpressionBuilder';
import { RichTextEditor } from '../../../../../shared/REDISIGNED/controls/lexical/RichTextEditor';
import CenterModalFixed from '../../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import CustomSelect from '../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { UserAutocompleteForm } from '../../../../../shared/REDISIGNED/selectMenus/UserAutocomplete/UserAutocomplete';
import { IconControl } from '../../../../../shared/REDISIGNED/selectMenus/customComponents/controls/IconControl';
import CustomIndicatorArrow from '../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import { IconOption } from '../../../../../shared/REDISIGNED/selectMenus/customComponents/options/IconOption';
import { StyledFlex, StyledIconButton, StyledText } from '../../../../../shared/styles/styled';
import { ISSUES_QUERY_KEYS, ISSUE_CATEGORIES } from '../../../../constants/core';
import { createTicketTaskSchema } from './validationSchemas';

const CREATE_AND_START_ANOTHER = 'createAndStartAnother';

const CreateTicketFormModal = ({ onSubmit, open, onClose }) => {
  const { currentUser } = useGetCurrentUser();
  const { ticketId } = useParams();
  const { colors } = useTheme();

  const serviceTaskTypes = useRecoilValue(getServiceTaskTypes);
  const issueCategories = useRecoilValue(issuesCategories);

  const [searchTicket, setSearchTicket] = useState('');

  const issuesCategoryIds = issueCategories?.reduce((acc, { id, name }) => ({ ...acc, [name]: id }), {});

  const { values, errors, setFieldValue, handleChange, submitForm, setStatus, status, touched, handleBlur, resetForm } =
    useFormik({
      initialTouched: false,
      initialValues: {
        displayName: '',
        description: EXPRESSION_BUILDER_DEFAULT_VALUE,
        issueTypeId: '',
        assignedToUserId: '',
        parentId: ticketId ? { id: ticketId } : '',
      },
      validationSchema: createTicketTaskSchema,
      onSubmit: (val, meta) => {
        const isCreateAnother = status === CREATE_AND_START_ANOTHER;
        const assignee = val.assignedToUserId?.value?.id;

        onSubmit(
          {
            ...val,
            ...(assignee ? { assignedToUserId: assignee } : {}),
            issueTypeId: val?.issueTypeId?.id,
            parentId: val?.parentId?.id,
          },
          isCreateAnother
        );
        meta.resetForm();
        setStatus(undefined);
      },
    });

    const { issues: issuesServiceTickets } = useGetIssues({
      queryKey: ISSUES_QUERY_KEYS.GET_SERVICE_TICKETS,
      filterParams: {
        displayName: searchTicket,
        returnParameters: true,
        returnRelatedEntities: true,
        pageSize: 10,
      },
      issueCategory: ISSUE_CATEGORIES.SERVICE_TICKET,
      options: {
        enabled: open && !ticketId,
        select: (data) => data?.content ?? [],
        placeholderData: [],
      },
    });

  const currentUserOption = {
    label: `${currentUser?.firstName} ${currentUser?.lastName}`,
    value: {
      id: currentUser?.id,
      firstName: currentUser?.firstName,
      lastName: currentUser?.lastName,
      pfp: currentUser?.pfp,
    },
  };

  const unassignedValue = {
    label: 'Unassigned',
    value: {},
  };

  const commonSelectProps = {
    components: {
      DropdownIndicator: CustomDropdownIndicator,
      ValueContainer: CustomValueContainer,
    },
    withSeparator: true,
    borderRadius: '10px',
    mb: '0px',
    padding: '0px 8px 0px 2px',
    isSearchable: false,
    isClearable: false,
    menuPortalTarget: document.body,
    menuShouldScrollIntoView: false,
    closeMenuOnSelect: true,
  };

  const handleLoad = (searchText, setOptions) => {
    const params = {
      issueCategoryId: issuesCategoryIds?.[ISSUE_CATEGORIES.SERVICE_TICKET],
      pageSize: 10,
      searchText,
    };

    const filterParams = new URLSearchParams(params).toString();

    getIssues(filterParams).then((res) => {
      setOptions(
        Array.from(new Set(res?.content.map((item) => item.displayName))).map((displayName, i) => {
          return {
            displayName,
            id: res?.content[i]?.id,
            Icon: () => <ServiceTypeIconPreview icon="SELL" iconColour="bluishCyan" />,
          };
        })
      );
    });
  };

  const renderAssociatedServiceTicketSelect = () => (
    <>
      <CustomSelect
        isAsync
        placeholder="Search Service Ticket to assign task to..."
        loadOptions={handleLoad}
        defaultOptions
        value={values.parentId}
        getOptionLabel={(option) => option.displayName}
        getOptionValue={(option) => option.id}
        onInputChange={(v) => setSearchTicket(v)}
        onChange={(option) => setFieldValue('parentId', option)}
        invalid={errors?.parentId && touched.parentId}
        onBlur={handleBlur}
        {...commonSelectProps}
        components={{
          DropdownIndicator: CustomIndicatorArrow,
          Control: IconControl,
          Option: IconOption,
        }}
        formatOptionLabel={(option, meta) => {
          return meta.context === 'menu' ? (
            <StyledFlex>
              <StyledText size={15} weight={600} lh={23}>
                {option.displayName}
              </StyledText>
              <StyledText size={13} lh={20}>
                {`#${option.id}`}
              </StyledText>
            </StyledFlex>
          ) : (
            <StyledText size={15} weight={600} lh={23}>
              {option.displayName}
            </StyledText>
          );
        }}
        isSearchable
        maxHeight={30}
        menuPadding={0}
        form
        menuPortalTarget={document.body}
        withSeparator
        isLoading={!issuesServiceTickets}
        isDisabled={!issuesServiceTickets}
      />
      {errors.parentId && touched.parentId && <FormErrorMessage>{errors.parentId}</FormErrorMessage>}
    </>
  );

  const renderSelectedAssociatedServiceTicket = () => (
    <StyledFlex
      direction="row"
      gap="0 10px"
      p="0 10px"
      bgcolor={colors.bgColorOptionTwo}
      borderRadius="10px"
      height="40px"
    >
      <StyledFlex justifyContent="center">
        <ServiceTypeIconPreview
          icon="SELL"
          iconColour="bluishCyan"
          wrapperWidth={25}
          wrapperHeight={25}
          iconWidth={14}
          iconHeight={14}
        />
      </StyledFlex>
      <StyledFlex flexWrap="nowrap" justifyContent="center" width="100%" alignItems="flex-start">
        <StyledText display="inline" size={16} lh={24} maxLines={1}>
          <StyledText display="inline" size={16} weight={600} lh={24}>
            {values?.parentId?.displayName}
          </StyledText>
          {` - #${values?.parentId?.id}`}
        </StyledText>
      </StyledFlex>
      <StyledFlex justifyContent="center">
        <StyledIconButton
          bgColor="transparent"
          hoverBgColor={colors.graySilver}
          size="30px"
          onClick={() => setFieldValue('parentId', '')}
        >
          <CloseIcon />
        </StyledIconButton>
      </StyledFlex>
    </StyledFlex>
  );

  return (
    <CenterModalFixed
      open={open}
      onClose={() => {
        resetForm();
        onClose();
      }}
      maxWidth="745px"
      title="Create Ticket Task"
      actions={
        <StyledFlex direction="row" justifyContent="flex-end" width="100%" gap="15px">
          <StyledButton
            primary
            variant="outlined"
            onClick={() => {
              setStatus(CREATE_AND_START_ANOTHER);
              submitForm();
            }}
          >
            Create and Start Another Ticket Task
          </StyledButton>
          <StyledButton primary variant="contained" type="submit" onClick={submitForm}>
            Create
          </StyledButton>
        </StyledFlex>
      }
    >
      <StyledFlex flex="auto" p="25px">
        <StyledFlex direction="column" flex="auto" width="100%" mb="24px">
          <InputLabel label="Name" isOptional={false} />
          <BaseTextInput
            id="displayName"
            name="displayName"
            placeholder="Enter Name of Ticket Task"
            value={values.displayName}
            onChange={handleChange}
            invalid={errors.displayName && touched.displayName}
            onBlur={handleBlur}
          />
          {errors.displayName && touched.displayName && <FormErrorMessage>{errors.displayName}</FormErrorMessage>}
        </StyledFlex>
        <StyledFlex direction="column" flex="auto" width="100%" mb="24px">
          <InputLabel label="Description" isOptional />
          <RichTextEditor
            placeholder="Enter a description..."
            onChange={(descr) => {
              setFieldValue('description', JSON.stringify(descr));
            }}
            addToolbarPlugin
          />
        </StyledFlex>
        <StyledFlex direction="column" flex="auto" width="100%" mb="24px">
          <InputLabel label="Type" isOptional={false} />
          <CustomSelect
            placeholder="Select Task Type"
            value={values.issueTypeId}
            options={serviceTaskTypes || []}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id}
            onChange={(option) => setFieldValue('issueTypeId', option)}
            invalid={errors.issueTypeId && touched.issueTypeId}
            onBlur={handleBlur}
            {...commonSelectProps}
            isLoading={!serviceTaskTypes}
            isDisabled={!serviceTaskTypes}
          />
          {errors.issueTypeId && touched.issueTypeId && <FormErrorMessage>{errors.issueTypeId}</FormErrorMessage>}
        </StyledFlex>
        {!ticketId ? (
          <StyledFlex direction="column" flex="auto" width="100%" mb="24px">
            <InputLabel label="Associated Service Ticket " isOptional={false} />
            {!values.parentId && renderAssociatedServiceTicketSelect()}
            {values.parentId && renderSelectedAssociatedServiceTicket()}
          </StyledFlex>
        ) : null}

        <StyledFlex direction="column" flex="auto" width="100%" mb="24px">
          <InputLabel label="Assignee" />
          <UserAutocompleteForm
            placeholder="Unassigned"
            value={values.assignedToUserId || unassignedValue}
            onChange={(v) => {
              setFieldValue('assignedToUserId', v);
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
      </StyledFlex>
    </CenterModalFixed>
  );
};

export default CreateTicketFormModal;
