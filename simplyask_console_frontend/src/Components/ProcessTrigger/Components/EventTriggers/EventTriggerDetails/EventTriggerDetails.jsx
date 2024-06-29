import { SvgIcon, useTheme } from '@mui/material';
import { useFormik } from 'formik';
import { debounce } from 'lodash';
import { debouncedEnvironmentSearchFn } from '../helper';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import MoreHorizontalIcon from '../../../../../Assets/icons/threeDotsHorizontal.svg?component';
import { useGetFilteredEnvironments } from '../../../hooks/useGetFilteredEnvironments';
import { getWorkflows } from '../../../../../Services/axios/processManager';
import routes from '../../../../../config/routes';
import { useProcesses } from '../../../../../hooks/process/useProcesses';
import { useGetCurrentUser } from '../../../../../hooks/useGetCurrentUser';
import { usePopoverToggle } from '../../../../../hooks/usePopoverToggle';
import { FILTER_EXPRESSION_URL, PAYLOAD_MAPPING_URL } from '../../../../../utils/constants';
import LoadingMessage from '../../../../Sell/shared/LoadingMessage';
import NoOptionsMessage from '../../../../Sell/shared/NoOptionsMessage';
import FormErrorMessage from '../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import { StyledFlex } from '../../../../Settings/Components/FrontOffice/components/ChatWidget/ChatWidgetCreateOrEdit/ChatWidgetPreview/ChatWidgetView/components/shared/styles/styled';
import useGetWorkflowSettingsDto from '../../../../shared/ManagerComponents/SideModals/SettingsSideDrawer/hooks/useGetWorkflowSettingsDtoById';
import { StyledPopoverActionsBtn } from '../../../../shared/ManagerComponents/SubNavBar/StyledSubNavBar';
import BaseTextInput from '../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import OpenIcon from '../../../../shared/REDISIGNED/icons/svgIcons/OpenIcon';
import TrashBinIcon from '../../../../shared/REDISIGNED/icons/svgIcons/TrashBinIcon';
import ContentLayout from '../../../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../../../../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomIndicatorArrow from '../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import TableV2 from '../../../../shared/REDISIGNED/table-v2/Table-v2';
import { StyledTooltip } from '../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import Spinner from '../../../../shared/Spinner/Spinner';
import { StyledCard, StyledIconButton, StyledPopover, StyledText } from '../../../../shared/styles/styled';
import useCreateWebhookTrigger from '../../../hooks/useCreateWebhookTrigger';
import { useDeleteEventTrigger } from '../../../hooks/useDeleteEventTrigger';
import { useGetWebhookTriggerById } from '../../../hooks/useGetWebhookTriggerById';
import useUpdateWebhookTrigger from '../../../hooks/useUpdateWebhookTrigger';
import { CRITERIA, EVENT_TRIGGER_QUERY_KEYS } from '../../../utils/constants';
import { EVENT_EDITABLE_PAYLOAD_MAPPING_COLUMNS, eventTriggerValidationSchema } from '../../../utils/formatters';
import DeleteEventTriggerModal from '../modals/DeleteEventTriggerModal/DeleteEventTriggerModal';

const EventTriggerDetails = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { filteredEnvironments: environmentOptions, isFilteredEnvironmentsLoading: isEnvironmentOptionsLoading } =
    useGetFilteredEnvironments({
      params: `pageSize=10`,
      select: (res) => res.content?.map((env) => ({ label: env.envName, value: env.id })),
      gcTime: Infinity,
      staleTime: Infinity,
    });

  const { colors, boxShadows } = useTheme();
  const navigate = useNavigate();

  const { currentUser } = useGetCurrentUser();

  const mapProcessesToOptions = (processes) => {
    return processes?.map((item) => ({ label: item.displayName, value: item.workflowId })) || [];
  };

  const mapWorkflowParamsToEventTriggerParams = (workflowParams, webhookOverridenParams) => {
    return workflowParams.map((item) => {
      const paramValue = webhookOverridenParams?.find((param) => param.name === item.paramName)?.value || '';

      return {
        name: item.paramName,
        type: item.validationType,
        criteria: item.isRequired ? CRITERIA.MANDATORY : CRITERIA.OPTIONAL,
        value: paramValue,
      };
    });
  };

  const { values, setValues, setFieldValue, errors, touched, submitForm } = useFormik({
    initialValues: {
      name: '',
      process: null,
      environment: null,
      parameters: [],
    },
    validationSchema: eventTriggerValidationSchema,
    onSubmit: (values) => {
      const payload = {
        ...values,
        process: { workflowId: values.process.value },
        environment: {
          id: values.environment?.value,
          envName: values.environment?.label,
        },
      };

      if (isEditMode) {
        updateWebhookTrigger({ id, payload });
      } else {
        createWebhookTrigger(payload);
      }
    },
  });

  const workflowId = values.process?.value;

  const { processes: processesOptions, isLoading: isLoadingProcessOptions } = useProcesses({
    params: {
      isFavourite: false,
      isArchived: false,
      isAscending: true,
      pageNumber: 0,
      timezone: currentUser?.timezone,
      pageSize: 10,
    },
    options: { select: (res) => mapProcessesToOptions(res?.content) },
  });

  const { workflowDtoSettings: workflowInputParams, isWorkflowDtoSettingsFetching: isParamsLoading } =
    useGetWorkflowSettingsDto({
      workflowId: workflowId,
      options: {
        enabled: !!workflowId,
        select: (res) => res?.inputParamSets[0]?.dynamicInputParams || [],
      },
    });

  const { webhookTrigger, isWebhookTriggerLoading } = useGetWebhookTriggerById({
    id,
    options: {
      enabled: isEditMode,
    },
  });

  useEffect(() => {
    if (webhookTrigger && processesOptions) {
      setValues({
        name: webhookTrigger.name,
        filterExpression: webhookTrigger.filterExpression,
        process: { label: webhookTrigger.process?.displayName, value: webhookTrigger.process?.workflowId },
        environment: { label: webhookTrigger.environment?.envName, value: webhookTrigger.environment?.id },
      });
    }
  }, [webhookTrigger, processesOptions]);

  useEffect(() => {
    if (workflowInputParams && (!isEditMode || webhookTrigger)) {
      setFieldValue(
        'parameters',
        mapWorkflowParamsToEventTriggerParams(workflowInputParams, webhookTrigger?.parameters)
      );
    }
  }, [webhookTrigger, workflowInputParams]);

  const { createWebhookTrigger } = useCreateWebhookTrigger({
    onSuccess: () => {
      goToProcessTriggerPage();
      toast.success('Event Trigger created successfully');
    },
    onError: () => {
      toast.error('Failed to create Event Trigger');
    },
  });

  const { updateWebhookTrigger } = useUpdateWebhookTrigger({
    onSuccess: () => {
      goToProcessTriggerPage();
      toast.success('Event Trigger updated successfully');
    },
    onError: () => {
      toast.error('Failed to update Event Trigger');
    },
  });

  const { mutate: deleteEventTrigger } = useDeleteEventTrigger({
    queryKey: EVENT_TRIGGER_QUERY_KEYS.GET_EVENT_TRIGGERS,
    onSuccess: () => {
      goToProcessTriggerPage();
    },
  });

  const goToProcessTriggerPage = () => navigate(`${routes.PROCESS_TRIGGER}?tab=event-triggers`);

  const onParamMappingChange = (name, value) => {
    setFieldValue(
      'parameters',
      values.parameters.map((param) => (param.name === name ? { ...param, value } : param))
    );
  };

  const {
    id: idEventTriggerPopover,
    open: openEventTriggerPopover,
    anchorEl: anchorElEventTriggerPopover,
    handleClick: handleClickEventTriggerPopover,
    handleClose: handleCloseEventTriggerPopover,
  } = usePopoverToggle('event-trigger-actions');

  const processesLoadFn = debounce((inputValue, setOptions) => {
    getWorkflows({ searchText: inputValue })
      .then((res) => mapProcessesToOptions(res?.content))
      .then((resp) => setOptions(resp));
  }, 300);

  const sharedWidthProps = {
    maxWidth: '545px',
  };

  const isLoading = isEnvironmentOptionsLoading || isLoadingProcessOptions || isWebhookTriggerLoading;

  const getActionsPopover = () => (
    <StyledPopover
      id={idEventTriggerPopover}
      open={openEventTriggerPopover}
      anchorEl={anchorElEventTriggerPopover}
      onClose={(e) => {
        e.stopPropagation();
        handleCloseEventTriggerPopover(e);
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: -8,
        horizontal: 'right',
      }}
    >
      <StyledFlex overflow="hidden">
        <StyledPopoverActionsBtn
          onClick={(e) => {
            handleCloseEventTriggerPopover(e);
          }}
        >
          <StyledFlex
            onClick={() => setShowDeleteModal(true)}
            cursor="pointer"
            p="12px 16px"
            direction="row"
            gap="10px"
            alignItems="center"
            width="141px"
          >
            <SvgIcon
              component={TrashBinIcon}
              sx={{
                width: '19px',
                height: '19px',
                color: colors.primary,
              }}
            />
            <StyledText>Delete</StyledText>
          </StyledFlex>
        </StyledPopoverActionsBtn>
      </StyledFlex>
    </StyledPopover>
  );

  return (
    <PageLayout
      top={
        <StyledFlex
          justifyContent="flex-end"
          direction="row"
          gap="12px"
          backgroundColor={colors.white}
          boxShadow={boxShadows.table}
          p="8px 36px"
        >
          <StyledButton variant="outlined" primary onClick={goToProcessTriggerPage}>
            {isEditMode ? 'Close' : 'Discard'}
          </StyledButton>
          <StyledButton variant="contained" primary onClick={submitForm}>
            {isEditMode ? 'Save Changes' : 'Create'}
          </StyledButton>

          {isEditMode && (
            <>
              <StyledTooltip arrow placement="top" title="Actions" p="10px 15px" maxWidth="325px">
                <StyledIconButton
                  onClick={handleClickEventTriggerPopover}
                  iconSize="20px"
                  size="38px"
                  bgColor={colors.lightBlueShade}
                  hoverBgColor={colors.mischkaShade}
                  borderRadius="8px"
                >
                  <MoreHorizontalIcon />
                </StyledIconButton>
              </StyledTooltip>

              {getActionsPopover()}
            </>
          )}
        </StyledFlex>
      }
    >
      <ContentLayout>
        {isLoading && <Spinner medium fadeBgParent />}
        <StyledFlex gap="30px">
          <StyledCard p="30px">
            <StyledText size={19} lh={28.5} weight={600} mb={30}>
              General
            </StyledText>
            <StyledFlex>
              <StyledFlex {...sharedWidthProps} mb="30px">
                <InputLabel label="Name" size={16} lh={24} />
                <BaseTextInput
                  id="name"
                  name="name"
                  value={values.name}
                  onChange={(e) => setFieldValue('name', e.target.value)}
                  invalid={errors.name && touched.name}
                  placeholder="Enter a name for your event trigger..."
                />
                {errors.name && touched.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
              </StyledFlex>
              <StyledFlex maxWidth="775px" mb="30px">
                <InputLabel label="Filter Expression" size={16} lh={24} isOptional />
                <StyledText>
                  Define a conditional expression to filter received events based on event payload values and ignore
                  events where the Filter Expression evaluates to “false” — commonly used for filtering events based on
                  an “event type” payload field.
                </StyledText>
                <StyledFlex mt={2} alignItems="flex-start">
                  <StyledButton
                    variant="text"
                    startIcon={<OpenIcon />}
                    onClick={() => {
                      window.open(FILTER_EXPRESSION_URL, '_blank');
                    }}
                  >
                    How to Define Filter Expressions
                  </StyledButton>
                </StyledFlex>

                <StyledFlex {...sharedWidthProps} mt={2}>
                  <BaseTextInput
                    id="filter-expression"
                    name="filter-expression"
                    value={values.filterExpression}
                    onChange={(e) => setFieldValue('filterExpression', e.target.value)}
                    placeholder="Enter expression..."
                  />
                </StyledFlex>
              </StyledFlex>
              <StyledFlex {...sharedWidthProps}>
                <InputLabel label="Process" size={16} lh={24} />
                <CustomSelect
                  isAsync
                  placeholder="Select Process"
                  defaultOptions={processesOptions}
                  loadOptions={processesLoadFn}
                  value={values.process}
                  closeMenuOnSelect
                  closeMenuOnScroll
                  onChange={(e) => setFieldValue('process', e)}
                  components={{
                    DropdownIndicator: CustomIndicatorArrow,
                    NoOptionsMessage,
                    LoadingMessage,
                  }}
                  maxHeight={39}
                  menuPadding={0}
                  form
                  menuPlacement="auto"
                  withSeparator
                  isSearchable
                />
                {errors.process && touched.process && <FormErrorMessage>{errors.process}</FormErrorMessage>}
              </StyledFlex>

              <StyledFlex {...sharedWidthProps} marginTop="30px">
                <InputLabel label="Environment" size={16} lh={24} />
                <CustomSelect
                  isAsync
                  placeholder="Select Environment"
                  defaultOptions={environmentOptions}
                  loadOptions={debouncedEnvironmentSearchFn}
                  value={values.environment}
                  closeMenuOnSelect
                  closeMenuOnScroll
                  onChange={(e) => setFieldValue('environment', e)}
                  components={{
                    DropdownIndicator: CustomIndicatorArrow,
                    NoOptionsMessage,
                    LoadingMessage,
                  }}
                  maxHeight={39}
                  menuPadding={0}
                  form
                  menuPlacement="auto"
                  withSeparator
                  isSearchable
                />
                {errors.environment && touched.environment && <FormErrorMessage>{errors.environment}</FormErrorMessage>}
              </StyledFlex>
            </StyledFlex>
          </StyledCard>
          <StyledCard p="30px">
            <StyledFlex position="relative">
              {isParamsLoading && <Spinner medium fadeBgParent />}
              <StyledFlex alignItems="flex-start" mb={4}>
                <StyledFlex mb={2} gap={1}>
                  <StyledText size={19} lh={28.5} weight={600}>
                    Event Payload Mapping
                  </StyledText>
                  <StyledText size={16} lh={24}>
                    Define how event payload data is mapped to Process input parameters when executing the selected
                    Process.
                  </StyledText>
                </StyledFlex>

                <StyledButton
                  variant="text"
                  startIcon={<OpenIcon />}
                  onClick={() => {
                    window.open(PAYLOAD_MAPPING_URL, '_blank');
                  }}
                >
                  How to Define Payload Mapping
                </StyledButton>
              </StyledFlex>
              <StyledFlex>
                {!workflowId && (
                  <StyledText size={16} lh={24} weight={500}>
                    Select a Process in order to configure this section.
                  </StyledText>
                )}
                {workflowId && (
                  <TableV2
                    columns={EVENT_EDITABLE_PAYLOAD_MAPPING_COLUMNS}
                    data={{
                      content: values.parameters,
                    }}
                    enableHeader={false}
                    enableFooter={false}
                    enableRowSelection={false}
                    meta={{
                      onParamMappingChange,
                      errors,
                      touched,
                    }}
                    entityName="Workflow Input Parameters"
                  />
                )}
              </StyledFlex>
            </StyledFlex>
          </StyledCard>
        </StyledFlex>

        {isEditMode && (
          <DeleteEventTriggerModal
            isOpen={showDeleteModal}
            eventTrigger={webhookTrigger}
            onClose={() => setShowDeleteModal(false)}
            onDelete={() => {
              setShowDeleteModal(false);
              deleteEventTrigger(id);
            }}
          />
        )}
      </ContentLayout>
    </PageLayout>
  );
};

export default EventTriggerDetails;
