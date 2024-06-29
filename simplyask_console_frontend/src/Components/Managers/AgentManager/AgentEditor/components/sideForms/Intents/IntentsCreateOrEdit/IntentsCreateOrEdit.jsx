import styled from '@emotion/styled';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SvgIcon from '@mui/material/SvgIcon';
import { useFormik } from 'formik';
import { useMemo, useState, useEffect } from 'react';
import { Portal } from 'react-portal';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import DuplicateIcon from '../../../../../../../../Assets/icons/agent/contextMenu/duplicate.svg?component';
import CircleQuestionMark from '../../../../../../../../Assets/icons/CircleQuestionMark.svg?component';
import { usePopoverToggle } from '../../../../../../../../hooks/usePopoverToggle';
import { generateUUID } from '../../../../../../../Settings/AccessManagement/utils/helpers';
import { StyledButton } from '../../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import TrashBinIcon from '../../../../../../../shared/REDISIGNED/icons/svgIcons/TrashBinIcon';
import ConfirmationModal from '../../../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StyledTooltip } from '../../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import Spinner from '../../../../../../../shared/Spinner/Spinner';
import { StyledFlex, StyledText, StyledDivider, StyledPopover } from '../../../../../../../shared/styles/styled';
import { AGENT_QUERY_KEYS } from '../../../../../constants/core';
import { INTENT_TYPE, INTENT_PARAMETER_COLORS } from '../../../../constants/common';
import useAgentTrainingPhrases from '../../../../hooks/useAgentTrainingPhrases';
import useCreateIntent from '../../../../hooks/useCreateIntent';
import useDeleteIntent from '../../../../hooks/useDeleteIntent';
import useUpdateIntent from '../../../../hooks/useUpdateIntent';
import { variantTemplate, intentsParameterTemplate, formattedAutoGenPhrases } from '../../../../utils/defaultTemplates';
import { intentCreateEditValidationSchema } from '../../../../utils/validationSchemas';
import { StyledStepItemSidebar } from '../../Sidebar/StyledStepItemSidebar';
import IntentCreateGlobalConfirmationModal from '../IntentModals/IntentCreateOrEditModals/IntentCreateGlobalConfirmationModal';
import IntentDuplicateConfirmationModal from '../IntentModals/IntentCreateOrEditModals/IntentDuplicateConfirmationModal';
import IntentEditGlobalConfirmationModal from '../IntentModals/IntentCreateOrEditModals/IntentEditGlobalConfirmationModal';
import IntentEditLocalConfirmationModal from '../IntentModals/IntentCreateOrEditModals/IntentEditLocalConfirmationModal';
import IntentDeleteConfirmationModal from '../IntentModals/IntentDeleteConfirmationModal';

import IntentsCreateOrEditInputs from './IntentsCreateOrEditInputs/IntentsCreateOrEditInputs';
import { useSetRecoilState } from 'recoil';
import { agentEditorSidebars } from '../../../../store';

export const INTENT_DUPLICATE_UNSAVED_CHANGES = {
  SAVE_UNSAVED_CHANGES: 'SAVE_UNSAVED_CHANGES',
  DISCARD_UNSAVED_CHANGES: 'DISCARD_UNSAVED_CHANGES',
};

export const StyledStrong = styled.strong``;

const StyledMoreVertBtn = styled(Button)`
  width: 26px;
  height: 42px;
  right: 5px;
  top: 14px;
  border-radius: 5px;
  position: absolute;
  padding: 0;
  min-width: 25px;
  color: ${({ theme }) => theme.colors.primary};

  &:hover {
    background-color: ${({ theme }) => theme.colors.tableEditableCellBg};
  }
`;

const StyledPopoverActionsBtn = styled(Button)`
  padding: 0;
  min-width: 25px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.altoGray};
  }
`;

const MODAL_TYPES = {
  CREATE_GLOBAL_INTENT: 'CREATE_GLOBAL_INTENT',
  EDIT_GLOBAL_INTENT: 'EDIT_GLOBAL_INTENT',
  EDIT_LOCAL_INTENT: 'EDIT_LOCAL_INTENT',
  DUPLICATE_INTENT: 'DUPLICATE_INTENT',
  DELETE_INTENT: 'DELETE_INTENT',
};

const DUPLICATE_NAME_COPY = ' - Copy';

const IntentsCreateOrEdit = ({
  clickedIntent,
  setClickedIntent,
  customActionsRef,
  slideToPrimaryMenu,
  isTransitionActive,
  allIntents,
  isUnsavedChangesModalOpen,
  setIsUnsavedChangesModalOpen,
  setIsCreateEditFormDirtySync,
}) => {
  const queryClient = useQueryClient();
  const setSidebarOpened = useSetRecoilState(agentEditorSidebars);
  const { serviceTypeId } = useParams();

  const { colors } = useTheme();

  const isEditMode = !!clickedIntent;

  const isIntentInUseByAgents = clickedIntent?.isUtilized;

  const {
    id: idMoreActionsPopover,
    open: openMoreActionsPopover,
    anchorEl: anchorElMoreActionsPopover,
    handleClick: handleClickMoreActionsPopover,
    handleClose: handleCloseMoreActionsPopover,
  } = usePopoverToggle('more-actions');

  const [duplicateIntentModalRadio, setDuplicateIntentModalRadio] = useState(
    INTENT_DUPLICATE_UNSAVED_CHANGES.SAVE_UNSAVED_CHANGES
  );

  const [showModal, setShowModal] = useState({ opened: false, type: MODAL_TYPES.CREATE_GLOBAL_INTENT });

  const isCurrentIntentGlobal = clickedIntent?.intentType === INTENT_TYPE.GLOBAL;

  const getInitialPhraseTemplate = useMemo(() => ({ ...variantTemplate(generateUUID()) }), []);
  const getInitialParameterTemplate = useMemo(() => ({ ...intentsParameterTemplate(INTENT_PARAMETER_COLORS[0]) }), []);

  const closeModal = () => setShowModal((prev) => ({ ...prev, opened: false }));

  const getIsModalOpen = (modalType) => showModal.opened && showModal.type === modalType;

  const INITIAL_VALUES = {
    name: clickedIntent?.name || '',
    trainingPhrases: clickedIntent?.trainingPhrases || [getInitialPhraseTemplate],
    isGlobalIntent: clickedIntent?.intentType === INTENT_TYPE.GLOBAL || false,
    parameters: clickedIntent?.parameters || [getInitialParameterTemplate],
  };

  const resetComponentOnSuccessAndGoBack = () => {
    resetForm();
    closeModal();
    slideToPrimaryMenu();
    queryClient.invalidateQueries({
      queryKey: [AGENT_QUERY_KEYS.GET_AGENT_INTENTS],
    });
  };

  const { createNewIntentApi, isCreateNewIntentApiLoading } = useCreateIntent({
    onSuccess: (data) => {
      toast.success(`${data?.name} has been created`);
      resetComponentOnSuccessAndGoBack();
    },
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const { createNewIntentApi: duplicateIntentApi, isCreateNewIntentApiLoading: isDuplicateIntentApiLoading } =
    useCreateIntent({
      onSuccess: (data) => {
        toast.success(`${data?.name} has been duplicated`);
        closeModal();
        setClickedIntent(data);
        queryClient.invalidateQueries({
          queryKey: [AGENT_QUERY_KEYS.GET_AGENT_INTENTS],
        });
        handleCloseMoreActionsPopover();
      },
      onError: () => {
        toast.error('Something went wrong...');
      },
    });

  const { updateIntentApi, isUpdateIntentApiLoading } = useUpdateIntent({
    onSuccess: (data) => {
      toast.success(`Your changes to ${data?.name} have been saved successfully.`);
      resetComponentOnSuccessAndGoBack();
    },
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const { deleteIntentApi, isDeleteIntentApiLoading } = useDeleteIntent({
    onSuccess: () => {
      toast.success('Intent has been deleted');
      resetComponentOnSuccessAndGoBack();
      handleCloseMoreActionsPopover();
    },
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const handleSubmit = (val) => {
    const payload = {
      name: val.name,
      trainingPhrases: val.trainingPhrases,
      intentType: val.isGlobalIntent ? INTENT_TYPE.GLOBAL : INTENT_TYPE.LOCAL,
      parameters: val.parameters,
    };

    isEditMode
      ? updateIntentApi({ ...payload, intentId: clickedIntent?.intentId })
      : createNewIntentApi({
          body: payload,
          params: val.isGlobalIntent ? '' : `agentId=${serviceTypeId}`,
        });
  };

  const handleSubmitConfirmationsModals = (val) => {
    if (isEditMode && isCurrentIntentGlobal) {
      setShowModal({ opened: true, type: MODAL_TYPES.EDIT_GLOBAL_INTENT });
    } else if (isEditMode && !isCurrentIntentGlobal && val.isGlobalIntent) {
      setShowModal({ opened: true, type: MODAL_TYPES.EDIT_LOCAL_INTENT });
    } else if (!isEditMode && val.isGlobalIntent) {
      setShowModal({ opened: true, type: MODAL_TYPES.CREATE_GLOBAL_INTENT });
    } else {
      handleSubmit(val);
    }
  };

  const { values, errors, touched, setFieldValue, submitForm, resetForm, dirty } = useFormik({
    initialValues: INITIAL_VALUES,
    validateOnMount: false,
    enableReinitialize: true,
    validationSchema: intentCreateEditValidationSchema,
    onSubmit: (val) => {
      handleSubmitConfirmationsModals(val);
    },
  });

  useEffect(() => {
    setIsCreateEditFormDirtySync(dirty);
  }, [dirty]);

  const doesAnyOnePhraseExists = values.trainingPhrases?.map((item) => item.value).join('')?.length > 1;

  const { submitIntentTrainingPhrases, isSubmitIntentTrainingPhrasesLoading } = useAgentTrainingPhrases({
    onSuccess: (data) => {
      const IS_INTENT_PHRASE = true;

      const aiPhrases = formattedAutoGenPhrases(data, IS_INTENT_PHRASE);

      if (doesAnyOnePhraseExists) {
        setFieldValue('trainingPhrases', [...values.trainingPhrases, ...aiPhrases]);
      } else {
        setFieldValue('trainingPhrases', [...aiPhrases]);
      }
    },
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const getSideBarTitle = () => {
    if (isEditMode) {
      return `Edit ${isCurrentIntentGlobal ? 'Global' : 'Local'} Intent`;
    }

    return 'Create Intent';
  };

  const getSubmitBtnTitle = () => (isEditMode ? 'Save Changes' : 'Create Intent');

  const getUniqueNameRecursively = (name, allIntentNames, index = 1) => {
    const duplicateName = index === 1 ? `${name}${DUPLICATE_NAME_COPY}` : `${name}${DUPLICATE_NAME_COPY} ${index}`;

    if (allIntentNames?.includes(duplicateName)) {
      return getUniqueNameRecursively(name, allIntentNames, index + 1);
    }

    return duplicateName;
  };

  const handleDuplicateIntent = () => {
    const name =
      duplicateIntentModalRadio === INTENT_DUPLICATE_UNSAVED_CHANGES.SAVE_UNSAVED_CHANGES
        ? values.name
        : clickedIntent?.name;

    const trainingPhrases =
      duplicateIntentModalRadio === INTENT_DUPLICATE_UNSAVED_CHANGES.SAVE_UNSAVED_CHANGES
        ? values.trainingPhrases
        : clickedIntent?.trainingPhrases;

    dirty &&
      duplicateIntentModalRadio === INTENT_DUPLICATE_UNSAVED_CHANGES.SAVE_UNSAVED_CHANGES &&
      updateIntentApi({
        name: values.name,
        trainingPhrases: values.trainingPhrases,
        intentType: values.intentType,
        intentId: clickedIntent?.intentId,
      });

    const allIntentNames = allIntents?.map((item) => item.name);

    let getUniqueName = '';
    if (name?.includes(DUPLICATE_NAME_COPY)) {
      const removeCopyString = name.split(DUPLICATE_NAME_COPY)[0];
      getUniqueName = getUniqueNameRecursively(removeCopyString, allIntentNames);
    } else {
      getUniqueName = getUniqueNameRecursively(name, allIntentNames);
    }

    const payload = {
      name: getUniqueName,
      trainingPhrases,
      intentType: INTENT_TYPE.LOCAL,
    };

    duplicateIntentApi({
      body: payload,
      params: `agentId=${serviceTypeId}`,
    });
  };

  const handleDeleteIntent = () => {
    const payload = { intentId: clickedIntent?.intentId };
    deleteIntentApi(payload);
  };

  const onDuplicateIntentClick = () => {
    dirty ? setShowModal({ opened: true, type: MODAL_TYPES.DUPLICATE_INTENT }) : handleDuplicateIntent();
  };

  const onDeleteIntentClick = () => {
    if (isIntentInUseByAgents) return;

    setShowModal({ opened: true, type: MODAL_TYPES.DELETE_INTENT });
  };

  const onDiscardUnSavedChanges = () => {
    setIsUnsavedChangesModalOpen(false);
    setSidebarOpened(null);
    resetComponentOnSuccessAndGoBack();
  };

  const onSaveUnSaveChangesClick = () => {
    setIsUnsavedChangesModalOpen(false);
    handleSubmit(values);
  };

  const isLoading =
    isSubmitIntentTrainingPhrasesLoading ||
    isDeleteIntentApiLoading ||
    isUpdateIntentApiLoading ||
    isCreateNewIntentApiLoading ||
    isDuplicateIntentApiLoading;

  return (
    <StyledStepItemSidebar>
      {isLoading && <Spinner fadeBgParent medium />}

      {isTransitionActive && (
        <Portal node={customActionsRef?.customActionsRef?.current}>
          <StyledButton variant="contained" primary onClick={submitForm}>
            {getSubmitBtnTitle()}
          </StyledButton>
        </Portal>
      )}

      <StyledFlex direction="row" gap="15px" p="20px 20px 0 20px" position="relative">
        <SvgIcon
          component={KeyboardBackspaceIcon}
          onClick={slideToPrimaryMenu}
          sx={{
            width: '32px',
            height: '27px',
            cursor: 'pointer',
            color: colors.primaryColourHex,
            borderRadius: '50%',
            transition: 'all 160ms ease-in',
            marginLeft: '-6px',

            '&:hover': {
              background: colors.galleryGray,
            },
          }}
          aria-disabled
        />
        <StyledText size={19} weight={600} lh={29}>
          {getSideBarTitle()}
        </StyledText>

        {isEditMode && (
          <>
            <StyledMoreVertBtn onClick={handleClickMoreActionsPopover}>
              <MoreVertIcon
                sx={{
                  width: '33px',
                  height: '33px',
                }}
              />
            </StyledMoreVertBtn>
            <StyledPopover
              id={idMoreActionsPopover}
              open={openMoreActionsPopover}
              anchorEl={anchorElMoreActionsPopover}
              onClose={handleCloseMoreActionsPopover}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              sx={{
                '& .MuiPopover-paper': {
                  overflow: 'hidden',
                },
              }}
            >
              <StyledFlex overflow="hidden">
                <StyledPopoverActionsBtn onClick={onDuplicateIntentClick}>
                  <StyledFlex
                    cursor="pointer"
                    p="8px 16px"
                    direction="row"
                    gap="10px"
                    alignItems="center"
                    width="138px"
                  >
                    <SvgIcon
                      component={DuplicateIcon}
                      sx={{
                        position: 'absolute',
                        top: '13px',
                        width: '23px',
                        height: '23px',
                        color: colors.primary,
                      }}
                    />
                    <StyledText ml={26}>Duplicate</StyledText>
                  </StyledFlex>
                </StyledPopoverActionsBtn>

                <StyledTooltip
                  title={isIntentInUseByAgents ? 'The intent cannot be deleted, as it is currently in use.' : ''}
                  arrow
                  placement="top"
                  p="10px"
                  maxWidth="auto"
                >
                  <StyledFlex>
                    <StyledPopoverActionsBtn onClick={onDeleteIntentClick} disabled={isIntentInUseByAgents}>
                      <StyledFlex
                        cursor="pointer"
                        p="8px 16px"
                        direction="row"
                        gap="10px"
                        alignItems="center"
                        width="138px"
                        opacity={isIntentInUseByAgents ? 0.45 : 1}
                      >
                        <SvgIcon
                          component={TrashBinIcon}
                          sx={{
                            position: 'absolute',
                            bottom: '13px',
                            width: '19px',
                            height: '19px',
                            left: '14px',
                            color: colors.primary,
                          }}
                        />
                        <StyledText ml={26}>Delete</StyledText>{' '}
                        {isIntentInUseByAgents && (
                          <SvgIcon
                            component={CircleQuestionMark}
                            sx={{
                              position: 'absolute',
                              bottom: '8px',
                              width: '22px',
                              height: '22px',
                              right: '8px',
                              color: 'transparent',

                              '&>path': {
                                stroke: colors.primary,
                              },
                            }}
                          />
                        )}
                      </StyledFlex>
                    </StyledPopoverActionsBtn>
                  </StyledFlex>
                </StyledTooltip>
              </StyledFlex>
            </StyledPopover>
          </>
        )}
      </StyledFlex>

      <StyledDivider borderWidth={1.5} color={colors.cardGridItemBorder} m="30px 0 0 0" />

      <IntentsCreateOrEditInputs
        values={values}
        setFieldValue={setFieldValue}
        errors={errors}
        touched={touched}
        isCurrentIntentGlobal={isCurrentIntentGlobal}
        submitIntentTrainingPhrases={submitIntentTrainingPhrases}
        isLoading={isLoading}
        isEditMode={isEditMode}
      />

      <IntentEditLocalConfirmationModal
        isOpen={getIsModalOpen(MODAL_TYPES.EDIT_LOCAL_INTENT)}
        closeModal={closeModal}
        handleSubmit={handleSubmit}
        values={values}
        isUpdateIntentApiLoading={isUpdateIntentApiLoading}
      />

      <IntentEditGlobalConfirmationModal
        isOpen={getIsModalOpen(MODAL_TYPES.EDIT_GLOBAL_INTENT)}
        closeModal={closeModal}
        handleSubmit={handleSubmit}
        values={values}
        isUpdateIntentApiLoading={isUpdateIntentApiLoading}
        clickedIntent={clickedIntent}
      />

      <IntentCreateGlobalConfirmationModal
        isOpen={getIsModalOpen(MODAL_TYPES.CREATE_GLOBAL_INTENT)}
        closeModal={closeModal}
        handleSubmit={handleSubmit}
        values={values}
        isCreateNewIntentApiLoading={isCreateNewIntentApiLoading}
      />

      <IntentDuplicateConfirmationModal
        isOpen={getIsModalOpen(MODAL_TYPES.DUPLICATE_INTENT)}
        closeModal={closeModal}
        handleDuplicateIntent={handleDuplicateIntent}
        duplicateIntentModalRadio={duplicateIntentModalRadio}
        setDuplicateIntentModalRadio={setDuplicateIntentModalRadio}
      />

      <IntentDeleteConfirmationModal
        isOpen={getIsModalOpen(MODAL_TYPES.DELETE_INTENT)}
        closeModal={closeModal}
        values={values}
        isDeleteIntentApiLoading={isDeleteIntentApiLoading}
        handleDeleteIntent={handleDeleteIntent}
      />

      <ConfirmationModal
        isOpen={isUnsavedChangesModalOpen}
        onCloseModal={() => setIsUnsavedChangesModalOpen(false)}
        onCancelClick={onDiscardUnSavedChanges}
        cancelBtnText="Discard"
        onSuccessClick={onSaveUnSaveChangesClick}
        successBtnText="Save Changes"
        alertType="WARNING"
        title="You Have Unsaved Changes"
        text="Do you want to save the changes you have made?"
      />
    </StyledStepItemSidebar>
  );
};

export default IntentsCreateOrEdit;
