import { useTheme } from '@mui/system';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import routes from '../../../../../../config/routes';
import { useGetIssueTypeById } from '../../../../../../hooks/issue/useGetIssueTypeById';
import { useSaveIssues } from '../../../../../../hooks/issue/useSaveIssues';
import { modifiedCurrentPageDetails } from '../../../../../../store';
import { getServiceTicketsCategory } from '../../../../../../store/selectors';
import { useNavigationBlock } from '../../../../../shared/REDISIGNED/BlockNavigate/BlockNavigate';
import LeavePageBlockerModal from '../../../../../shared/REDISIGNED/BlockNavigate/LeavePageBlockerModal/LeavePageBlockerModal';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import ContentLayout from '../../../../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../../../../../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import ConfirmationModal from '../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import CustomSelect from '../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomIndicatorArrow from '../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import Spinner from '../../../../../shared/Spinner/Spinner';
import { StyledFlex, StyledStatus, StyledText } from '../../../../../shared/styles/styled';
import { STATUSES_COLORS_OPTIONS, serviceTypeIconColors, serviceTypeIconNames } from '../../constants/iconConstants';
import { CREATE_SERVICE_TICKET_TYPE_INIT_VALUES } from '../../constants/initialValues';
import { EXPANDED_TYPES } from '../../constants/tabConstants';
import useCreateServiceTicketType from '../../hooks/useCreateServiceTicketType';
import useDeleteServiceTicketTypeStatuses from '../../hooks/useDeleteServiceTicketTypeStatuses';
import useUpdateServiceTicketType from '../../hooks/useUpdateServiceTicketType';
import { createTicketTypeSchema } from '../../utils/validationSchemas';
import ServiceTicketTypeAdditionalFields from './ServiceTicketTypeAdditionalFields/ServiceTicketTypeAdditionalFields';
import ServiceTicketTypeGeneral from './ServiceTicketTypeGeneral/ServiceTicketTypeGeneral';
import ServiceTicketTypeStatuses from './ServiceTicketTypeStatuses/ServiceTicketTypeStatuses';
import ServiceTicketTypeTabs from './ServiceTicketTypeTabs/ServiceTicketTypeTabs';

const CreateServiceTicketType = () => {
  const setCurrentPageDetailsState = useSetRecoilState(modifiedCurrentPageDetails);

  const navigate = useNavigate();
  const { colors, boxShadows } = useTheme();

  const { id: serviceTicketCategoryId } = useRecoilValue(getServiceTicketsCategory);
  const { id } = useParams();

  const isEditMode = !!id;

  const { data: issueType, isLoading: isIssueTypeLoading } = useGetIssueTypeById({ id, enabled: isEditMode });

  const [issues, setIssues] = useState();
  const [shouldDeleteStatusWithId, setShouldDeleteStatusWithId] = useState(false);
  const [isSaveChangesClicked, setIsSaveChangesClicked] = useState(false);

  const [initialValues, setInitialValues] = useState({
    ...CREATE_SERVICE_TICKET_TYPE_INIT_VALUES,
    relatedCategoryId: serviceTicketCategoryId,
    icon: serviceTypeIconNames[0],
    iconColour: serviceTypeIconColors[0],
  });

  const { deleteServiceTicketTypeStatuses, isDeleteServiceTicketTypeStatusesLoading } =
    useDeleteServiceTicketTypeStatuses({
      onSuccess: () => {
        toast.success('Status has been successfully deleted');
        setFieldValue(
          'statuses',
          values.statuses.map((status, index) => ({ ...status, orderNumber: index + 1 }))
        );
      },
    });

  const [statusToDelete, setStatusToDelete] = useState();
  const [selectUnUsedStatusOption, setSelectUnUsedStatusOption] = useState(null);
  const [openStatusPanel, setOpenStatusPanel] = useState(false);
  const [isStatusCreatedOnDelete, setIsStatusCreatedOnDelete] = useState(false);

  const removeUUIDFromParameters = (payload) => {
    const newParameters = payload.parameters.map(({ id, ...rest }) => rest);
    return {
      ...payload,
      parameters: newParameters,
    };
  };

  const { isValid, values, setFieldValue, errors, handleChange, touched, handleBlur, handleSubmit, dirty } = useFormik({
    initialTouched: false,
    initialValues,
    enableReinitialize: true,
    validationSchema: createTicketTypeSchema,
    onSubmit: (payload) => {
      const newPayload = removeUUIDFromParameters(payload);
      if (isEditMode) {
        const updatePayload = getUpdatePayload(issueType, newPayload);
        updateServiceTicketType(updatePayload);
      } else {
        createServiceTicketType({
          ...newPayload,
          newStatuses: newPayload.statuses,
          statuses: undefined,
        });
      }
    },
  });

  const isNavigationBlocked = dirty && !isSaveChangesClicked;

  const { navBlocker } = useNavigationBlock(isNavigationBlocked);

  const unUsedStatusOptions = issueType?.statuses
    .filter((status) => status.name !== statusToDelete?.name)
    .map((status) => {
      const colorOption = STATUSES_COLORS_OPTIONS[status.colour];
      return {
        value: status.name,
        label: (
          <StyledStatus height="34px" minWidth="auto" textColor={colorOption.primary} bgColor={colorOption.secondary}>
            {status.name}
          </StyledStatus>
        ),
        id: status?.id,
      };
    });

  const handleNavigateToSettings = () => {
    navigate({
      pathname: routes.SETTINGS_FRONT_OFFICE_TAB,
      search: `?autoExpandTab=${EXPANDED_TYPES.SERVICE_TICKET_TYPE}`,
    });
  };

  const { createServiceTicketType, isCreateServiceTicketTypeLoading } = useCreateServiceTicketType({
    onSuccess: () => {
      setIsSaveChangesClicked(false);
      toast.success('Service Ticket Type created successfully');
      handleNavigateToSettings();
    },
    onError: () => {
      toast.error('Failed to create service ticket type');
    },
  });

  const { updateServiceTicketType, isUpdateServiceTicketTypeLoading } = useUpdateServiceTicketType({
    onSuccess: ({ data }) => {
      toast.success('Service Ticket Type updated successfully');
      if (isSaveChangesClicked) {
        handleNavigateToSettings();
      } else {
        setIsStatusCreatedOnDelete(false);
        const updatedStatuses = data[0].statuses;
        const newStatus = updatedStatuses[updatedStatuses.length - 1];
        const colorOption = STATUSES_COLORS_OPTIONS[newStatus.colour];
        const newStatusOption = {
          value: newStatus.name,
          label: (
            <StyledStatus height="34px" minWidth="auto" textColor={colorOption.primary} bgColor={colorOption.secondary}>
              {newStatus.name}
            </StyledStatus>
          ),
          id: newStatus.id,
        };
        setSelectUnUsedStatusOption(newStatusOption);
      }
      setIsSaveChangesClicked(false);
    },
    onError: () => {
      toast.error('Something went wrong');
    },
  });

  const { saveIssues, isUpdateIssuePending } = useSaveIssues({
    onSuccess: () => {
      toast.success(`Tickets have been moved to the ${selectUnUsedStatusOption.value} status`);
      setShouldDeleteStatusWithId(true);
    },
    onError: () => toast.error('something went wrong'),
  });

  useEffect(() => {
    if (!isUpdateIssuePending && shouldDeleteStatusWithId) {
      deleteServiceTicketTypeStatuses([statusToDelete?.id]);
      setShouldDeleteStatusWithId(false);
      setStatusToDelete(null);
    }
  }, [isUpdateIssuePending, shouldDeleteStatusWithId]);

  const isTabsChanged = (initialTabs, updatedTabs) =>
    initialTabs.length !== updatedTabs.length ||
    initialTabs.some((tab) => !updatedTabs.includes(tab)) ||
    updatedTabs.some((tab) => !initialTabs.includes(tab));

  const getUpdatePayload = (initialState, updatedState) => ({
    id: initialState.id,
    statuses: updatedState.statuses,
    parameters: updatedState.parameters,
    ...(initialState.name !== updatedState.name && { name: updatedState.name }),
    ...(initialState.description !== updatedState.description && { description: updatedState.description }),
    ...(initialState.iconColour !== updatedState.iconColour && { iconColour: updatedState.iconColour }),
    ...(initialState.icon !== updatedState.icon && { icon: updatedState.icon }),
    ...(isTabsChanged(initialState.tabs, updatedState.tabs) && { tabs: updatedState.tabs }),
  });

  useEffect(() => {
    if (issueType) {
      setInitialValues((prev) => ({
        ...prev,
        name: issueType.name,
        description: issueType.description,
        icon: issueType.icon,
        iconColour: issueType.iconColour,
        statuses: issueType.statuses,
        tabs: issueType.tabs,
        parameters: issueType.parameters,
      }));

      setCurrentPageDetailsState({
        pageUrlPath: routes.SETTINGS_EDIT_SERIVCE_TICKET_TYPE,
        breadCrumbLabel: issueType.name,
      });

      setIssues(issueType?.issues);
    }
  }, [issueType]);

  const isStatusUsed = (status) => status && issues?.some((issue) => issue.status === status.name);

  useEffect(() => {
    if (isStatusCreatedOnDelete) handleSubmit();
  }, [values.statuses]);

  const handleDeleteStatusConfirmationModal = () => {
    if (isStatusUsed(statusToDelete)) {
      saveIssues(
        issues
          .filter((issue) => issue.status === statusToDelete.name)
          .map((issue) => ({
            issueId: issue.id,
            issueStatusId: selectUnUsedStatusOption.id,
          }))
      );
    } else if (statusToDelete?.id) {
      setShouldDeleteStatusWithId(true);
    } else {
      setFieldValue(
        'statuses',
        values.statuses
          .filter((status) => status.orderNumber !== statusToDelete?.orderNumber)
          .map((status, index) => ({ ...status, orderNumber: index + 1 }))
      );
      setStatusToDelete(null);
    }
    setSelectUnUsedStatusOption(null);
  };

  const handleSaveChangesClick = () => {
    setIsSaveChangesClicked(true);
    handleSubmit();
  };

  const statusToDeleteUsingIssues = issues?.filter((issue) => issue.status === statusToDelete?.name);

  const isLoading =
    isUpdateIssuePending ||
    isDeleteServiceTicketTypeStatusesLoading ||
    isIssueTypeLoading ||
    isUpdateServiceTicketTypeLoading ||
    isCreateServiceTicketTypeLoading;

  return (
    <>
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
            <StyledButton variant="outlined" primary onClick={handleNavigateToSettings}>
              {id ? 'Close' : 'Discard'}
            </StyledButton>
            <StyledButton variant="contained" primary onClick={handleSaveChangesClick} disabled={!isValid}>
              Save Changes
            </StyledButton>
          </StyledFlex>
        }
      >
        <ContentLayout>
          {isLoading && <Spinner fadeBgParentFixedPosition />}
          <StyledFlex gap="36px">
            <ServiceTicketTypeGeneral
              handleChange={handleChange}
              handleBlur={handleBlur}
              onSubmit={handleSubmit}
              setFieldValue={setFieldValue}
              values={values}
              errors={errors}
              touched={touched}
            />
            <ServiceTicketTypeStatuses
              values={values.statuses}
              onAdd={(newStatus) =>
                setFieldValue('statuses', [
                  ...values.statuses,
                  {
                    ...newStatus,
                    orderNumber: values.statuses.length + 1,
                  },
                ])
              }
              onEdit={(oldStatus, orderNumber, newStatus) => {
                const statuses = values.statuses.map((status) =>
                  status.orderNumber === orderNumber ? { ...status, ...newStatus } : status
                );

                setFieldValue('statuses', statuses);
                const updatedIssues = issues.map((issue) =>
                  issue.status === oldStatus.name ? { ...issue, status: newStatus.name } : issue
                );
                setIssues(updatedIssues);
              }}
              onReorder={(newData) => {
                setFieldValue(
                  'statuses',
                  newData.map((status, index) => ({ ...status, orderNumber: index + 1 }))
                );
              }}
              onDelete={(deleteStatus) => setStatusToDelete(deleteStatus)}
              typeIssues={issues}
              openStatusPanel={openStatusPanel}
              setOpenStatusPanel={setOpenStatusPanel}
            />
            <ServiceTicketTypeTabs values={values.tabs} setFieldValue={setFieldValue} />
            <ServiceTicketTypeAdditionalFields
              setFieldValue={setFieldValue}
              values={values.parameters}
              issueType={issueType}
            />
          </StyledFlex>
        </ContentLayout>
      </PageLayout>

      <LeavePageBlockerModal navBlocker={navBlocker} isBlocked={isNavigationBlocked} />

      <ConfirmationModal
        isOpen={!!statusToDelete}
        successBtnText={isStatusUsed(statusToDelete) ? 'Move & Delete' : 'Delete'}
        alertType="WARNING"
        title={`Delete "${statusToDelete?.name ?? ''}" Status?`}
        onCloseModal={() => {
          setSelectUnUsedStatusOption(null);
          setStatusToDelete(null);
        }}
        onSuccessClick={handleDeleteStatusConfirmationModal}
        isSuccessBtnDisabled={isStatusUsed(statusToDelete) ? !selectUnUsedStatusOption : false}
      >
        {isStatusUsed(statusToDelete) ? (
          <>
            <StyledText textAlign="center" size={14} lh={22}>
              You are about to delete the "{statusToDelete.name}" status. You will have to move the
              <StyledText color={colors.linkColor} display="inline" weight={600} size={14} lh={22}>
                &nbsp; {statusToDeleteUsingIssues.length}
                &nbsp; {statusToDeleteUsingIssues.length === 1 ? 'ticket' : 'tickets'} &nbsp;
              </StyledText>
              currently set as {statusToDelete.name} to a different status
            </StyledText>
            <StyledText size={14} lh={22}>
              Select a status to set the tickets to:
            </StyledText>
            <StyledFlex width="259px">
              <CustomSelect
                options={unUsedStatusOptions}
                placeholder=""
                value={selectUnUsedStatusOption}
                isClearable={false}
                isSearchable={false}
                onChange={(val) => setSelectUnUsedStatusOption(val)}
                components={{
                  DropdownIndicator: CustomIndicatorArrow,
                }}
                menuPortalTarget={document.body}
                closeMenuOnSelect
                form
              />
            </StyledFlex>
            <StyledText size={14} lh={22}>
              or
            </StyledText>
            <StyledButton
              variant="text"
              onClick={() => {
                setOpenStatusPanel(true);
                setIsStatusCreatedOnDelete(true);
              }}
            >
              Create New Status
            </StyledButton>
          </>
        ) : (
          <StyledText size={14}>Are you sure you want to delete this status?</StyledText>
        )}
      </ConfirmationModal>
    </>
  );
};

export default CreateServiceTicketType;
