import { useTheme } from '@emotion/react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useQueryClient } from '@tanstack/react-query';
import ConfirmationModal from '../../../../../../REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StyledDivider, StyledFlex, StyledIconButton, StyledText } from '../../../../../../styles/styled';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import { StyledButton } from '../../../../../../REDISIGNED/controls/Button/StyledButton';
import { PROCESS_VISIBILITY } from '../../../../../../../Managers/ProcessManager/constants/common';
import ProcessVisibilityInput from '../../../../../../../Managers/ProcessManager/components/ProcessVisibilityInput/ProcessVisibilityInput';
import { useState } from 'react';
import useUpdateProcess from '../../../../../../../Managers/ProcessManager/hooks/useUpdateProcess';
import { GET_WORKFLOWS } from '../../../../../../../../hooks/process/useProcesses';
import Spinner from '../../../../../../Spinner/Spinner';
import { toast } from 'react-toastify';
import LostProcessConfirmModal from '../../../../../../../Managers/ProcessManager/ProcessManagerModals/LostProcessConfirmModal/LostProcessConfirmModal';
import { isUserHaveAccessToProcess } from '../../../../../../../Managers/ProcessManager/utils/helpers';
import { useGetCurrentUser } from '../../../../../../../../hooks/useGetCurrentUser';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import BlockNavigate from '../../../../../../REDISIGNED/BlockNavigate/BlockNavigate';

const ProcessVisibilityPanel = ({
  clickedProcess: process,
  setShowSettingsSideDrawer,
  goBackToPrimaryMenu,
  setShowUnsavedChangesModalOpen,
  showUnsavedChangesModalOpen,
}) => {
  const { colors } = useTheme();
  const { currentUser } = useGetCurrentUser();

  const initialUsers = process?.users || [];
  const initialUserGroups = process?.userGroups || [];

  const areUsersAndGroupsInitiallyEmpty = initialUsers?.length === 0 && initialUserGroups?.length === 0;

  const { values, setValues, dirty, resetForm, submitForm } = useFormik({
    initialValues: {
      users: initialUsers,
      userGroups: initialUserGroups,
      visibility: areUsersAndGroupsInitiallyEmpty ? PROCESS_VISIBILITY.ORGANIZATION : PROCESS_VISIBILITY.USER_SPECIFIC,
    },
    enableReinitialize: true,
    onSubmit: () => onSaveClick(),
  });

  const [showLostProcesssConfirmModal, setShowLostProcesssConfirmModal] = useState(false);

  const queryClient = useQueryClient();

  const { updateProcess, isUpdateProcessLoading } = useUpdateProcess({
    onSuccess: () => {
      resetForm();
      toast.success('Process visibility updated successfully');
      queryClient.invalidateQueries({ queryKey: [GET_WORKFLOWS] });

      showUnsavedChangesModalOpen?.onCancelClick?.();
    },
    onError: () => {
      toast.error('Failed to update process visibility');
    },
  });

  const handleUnsavedChangeCloseModal = () => setShowUnsavedChangesModalOpen((prev) => ({ ...prev, isOpen: false }));

  const handleDiscardChangesAndGoToPrimaryMenu = () => {
    handleUnsavedChangeCloseModal(null);
    goBackToPrimaryMenu();
  };

  const handleDiscardChangesAndCloseSideModal = () => {
    handleDiscardChangesAndGoToPrimaryMenu();
    setShowSettingsSideDrawer(false);
  };

  const handleConfirmUnsavedChangesClick = () => {
    handleUnsavedChangeCloseModal();
    submitForm();
  };

  useEffect(() => {
    setShowUnsavedChangesModalOpen((prev) => ({
      ...prev,
      dirty,
      onCancelClick: handleDiscardChangesAndCloseSideModal,
    }));
  }, [dirty]);

  const getUpdatePayload = () => ({
    ...values,
    displayName: process.displayName,
    description: process.description,
    status: process.status,
    tags: process.tags.map((tag) => ({ name: tag.name })),
    processType: { id: process.processType.id },
    processTypeId: process.processType.id,
    createdAt: process.createdAt,
    isFavourite: process.isFavourite,
    isArchived: process.isArchived,
  });

  const onSaveClick = () => {
    if (
      isUserHaveAccessToProcess(currentUser, values.users, values.userGroups) ||
      values?.visibility === PROCESS_VISIBILITY.ORGANIZATION
    ) {
      updateProcessVisibility();
    } else {
      setShowLostProcesssConfirmModal(true);
    }
  };

  const updateProcessVisibility = () => {
    updateProcess({
      id: process.workflowId,
      payload: getUpdatePayload(),
    });
  };

  const onLostProcessConfirm = () => {
    updateProcessVisibility(values);
    setShowLostProcesssConfirmModal(false);
    setShowSettingsSideDrawer(false);
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      ...e,
    });
  };

  const handleBackButtonClick = () => {
    if (showUnsavedChangesModalOpen?.dirty) {
      setShowUnsavedChangesModalOpen((prev) => ({
        ...prev,
        isOpen: true,
        onCancelClick: handleDiscardChangesAndGoToPrimaryMenu,
      }));

      return;
    }

    goBackToPrimaryMenu();
  };

  return (
    <StyledFlex position="relative" height="100%" pb="100px" ml="-18px">
      {isUpdateProcessLoading && <Spinner parent fadeBgParent />}
      <StyledFlex position="absolute" top="-40px" right="20px">
        <StyledButton primary variant="contained" position="absolute" onClick={submitForm}>
          Save
        </StyledButton>
      </StyledFlex>
      <StyledFlex direction="row" gap="15px" p="20px 24px" alignItems="center">
        <StyledIconButton
          size="32px"
          iconSize="27px"
          bgColor="transparent"
          hoverBgColor={colors.galleryGray}
          onClick={handleBackButtonClick}
        >
          <KeyboardBackspaceRoundedIcon />
        </StyledIconButton>
        <StyledText as="h2" size={19} weight={600} lh={25}>
          Process Visibility
        </StyledText>
      </StyledFlex>
      <StyledDivider m="0" borderWidth={2} color={colors.cardGridItemBorder} />
      <StyledFlex height="100%">
        <Scrollbars autoHide>
          <StyledFlex gap="30px 0" p="24px 30px">
            <ProcessVisibilityInput value={values} onChange={handleChange} />
          </StyledFlex>
        </Scrollbars>
      </StyledFlex>

      <LostProcessConfirmModal
        isOpen={showLostProcesssConfirmModal}
        onConfirm={onLostProcessConfirm}
        onClose={() => setShowLostProcesssConfirmModal(false)}
      />

      <ConfirmationModal
        isOpen={!!showUnsavedChangesModalOpen?.isOpen}
        onCloseModal={handleUnsavedChangeCloseModal}
        onCancelClick={showUnsavedChangesModalOpen?.onCancelClick}
        cancelBtnText="Discard"
        onSuccessClick={handleConfirmUnsavedChangesClick}
        successBtnText="Save Changes"
        alertType="WARNING"
        title="You Have Unsaved Changes"
        text="Do you want to save the changes you have made?"
      />

      <BlockNavigate isBlocked={showUnsavedChangesModalOpen?.dirty} />
    </StyledFlex>
  );
};

export default ProcessVisibilityPanel;
