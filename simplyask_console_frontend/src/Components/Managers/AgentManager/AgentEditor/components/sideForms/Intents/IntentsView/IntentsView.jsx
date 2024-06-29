import { useTheme } from '@mui/material/styles';
import { useQueryClient } from '@tanstack/react-query';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { Portal } from 'react-portal';
import { toast } from 'react-toastify';
import { Transition } from 'react-transition-group';
import { useRecoilValue } from 'recoil';

import { useParams } from 'react-router-dom';
import BuiltBlockIcon from '../../../../../../../../Assets/icons/builtBlockIcon.svg?component';
import GlobalEarthIcon from '../../../../../../../../Assets/icons/globalEarthIcon.svg?component';
import LocationIcon from '../../../../../../../../Assets/icons/locationIcon.svg?component';
import { StyledButton } from '../../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomSelect from '../../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomIndicatorArrow from '../../../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import SearchBar from '../../../../../../../shared/SearchBar/SearchBar';
import Spinner from '../../../../../../../shared/Spinner/Spinner';
import {
  StyledDivider,
  StyledFlex,
  StyledText,
  TransitionSlidePrimaryContainer,
  TransitionSlideSecondaryContainer,
} from '../../../../../../../shared/styles/styled';
import { AGENT_QUERY_KEYS } from '../../../../../constants/core';
import {
  ALL_INTENTS_STRING,
  INTENTS_KEYS,
  INTENT_TYPE,
  TRANSITION_SCREEN,
  selectIntentsOptions,
} from '../../../../constants/common';
import { STEP_ITEM_TYPES } from '../../../../constants/steps';
import useAgentIntentsByFilter from '../../../../hooks/useAgentIntentsByFilter';
import useDeleteIntent from '../../../../hooks/useDeleteIntent';
import { agentEditorState } from '../../../../store';
import EditDeleteItemList from '../../../EditDeleteItemList/EditDeleteItemList';
import { selectIntentTypeDropDownStyles } from '../../inputs/TransitionBlockIntentDropdownStyles';
import IntentDeleteConfirmationModal from '../IntentModals/IntentDeleteConfirmationModal';
import IntentsCreateOrEdit from '../IntentsCreateOrEdit/IntentsCreateOrEdit';

const IntentsView = ({ customActionsRef }) => {
  const { colors } = useTheme();
  const { serviceTypeId } = useParams();
  const queryClient = useQueryClient();

  const [, setIsCreateEditFormDirtySync] = useState(false);
  const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] = useState(false);

  const [transitionType, setTransitionType] = useState(TRANSITION_SCREEN.PRIMARY);

  const [selectIntentValue, setSelectIntentValue] = useState(selectIntentsOptions[0]);
  const [clickedIntent, setClickedIntent] = useState(null);

  const isAllIntentsOptionSelected = selectIntentValue.value === ALL_INTENTS_STRING;

  const [searchName, setSearchName] = useState('');

  const { intents, isIntentLoading } = useAgentIntentsByFilter({ agentId: serviceTypeId, name: searchName });
  const { steps } = useRecoilValue(agentEditorState);

  const [showDeleteModal, setShowDeleteModal] = useState({ opened: false, value: null });

  const getIntents = useCallback((type) => intents?.filter((intent) => intent.intentType === type), [intents]);

  const localIntents = getIntents(INTENT_TYPE.LOCAL);
  const globalIntents = getIntents(INTENT_TYPE.GLOBAL);
  const preBuiltIntents = getIntents(INTENT_TYPE.PREBUILT);

  const localUtilizedIntents =
    useMemo(
      () =>
        localIntents?.map((currentIntent) => {
          currentIntent.isUtilized = steps.some((step) =>
            step.data.stepItems.some((stepItem) => {
              if (stepItem.type === STEP_ITEM_TYPES.TRANSITION) return stepItem.data.intent.name === currentIntent.name;
            })
          );
          return currentIntent;
        }),
      [localIntents, steps]
    ) || [];

  const slideToPrimaryMenu = useCallback(() => {
    setTransitionType(TRANSITION_SCREEN.PRIMARY);
    setClickedIntent();
  }, []);

  const slideToSecondaryMenu = useCallback(() => setTransitionType(TRANSITION_SCREEN.SECONDARY), []);

  const onEditIntentClick = useCallback((item) => {
    setClickedIntent(item);
    slideToSecondaryMenu();
  }, []);

  const { deleteIntentApi, isDeleteIntentApiLoading } = useDeleteIntent({
    onSuccess: () => {
      toast.success(`Intent ${showDeleteModal?.value?.name} has been deleted`);
      setShowDeleteModal({ opened: false });
      queryClient.invalidateQueries({
        queryKey: [AGENT_QUERY_KEYS.GET_AGENT_INTENTS],
      });
    },
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const onDeleteIntentClick = useCallback((item) => {
    setShowDeleteModal({ opened: true, value: item });
  }, []);

  const handleDeleteIntent = useCallback(() => {
    const payload = { intentId: showDeleteModal?.value?.intentId };
    deleteIntentApi(payload);
  }, [showDeleteModal]);

  return (
    <StyledFlex height="100%">
      {isIntentLoading && <Spinner fadeBgParent />}
      <Transition
        in={transitionType === TRANSITION_SCREEN.PRIMARY}
        timeout={700}
        classNames="settings-transition"
        unmountOnExit
      >
        {(state) => (
          <TransitionSlidePrimaryContainer state={state}>
            <StyledFlex display="flex" gap="30px" p="20px">
              <StyledText weight={600} size={19}>
                Intents
              </StyledText>
              <StyledDivider color={colors.cardGridItemBorder} m="0 -20px 0 -20px" />
              <StyledFlex
                display="flex"
                flexDirection="row"
                gap="25px"
                height="30px"
                alignItems="center"
                justifyContent="flex-end"
              >
                <SearchBar
                  placeholder="Search Intents..."
                  width="218px"
                  onChange={(e) => setSearchName(e.target.value)}
                  value={searchName}
                />
                <StyledFlex display="flex" flexDirection="row" alignItems="center" justifyContent="center">
                  <StyledText size={16} weight={600} mr={14}>
                    Show
                  </StyledText>
                  <CustomSelect
                    isSearchable={false}
                    components={{
                      DropdownIndicator: CustomIndicatorArrow,
                    }}
                    options={selectIntentsOptions}
                    value={selectIntentValue}
                    onChange={(val) => setSelectIntentValue(val)}
                    styles={selectIntentTypeDropDownStyles}
                    closeMenuOnSelect
                  />
                </StyledFlex>
              </StyledFlex>
              {(selectIntentValue.value === INTENTS_KEYS.LOCAL || isAllIntentsOptionSelected) && (
                <EditDeleteItemList
                  type={INTENTS_KEYS.LOCAL}
                  icon={<LocationIcon />}
                  description="Custom Local Intents are only available for use in this agent. Can be edited, duplicated, deleted or converted to Global Intents."
                  itemsArray={localUtilizedIntents}
                  disabledDeleteTooltipTitle="This Intent is currently being used in this agent. You cannot delete intents in use. Remove the intent from the agent first"
                  onEditIntentClick={onEditIntentClick}
                  onDeleteIntentClick={onDeleteIntentClick}
                />
              )}
              {isAllIntentsOptionSelected && <StyledDivider color={colors.cardGridItemBorder} />}
              {(selectIntentValue.value === INTENTS_KEYS.GLOBAL || isAllIntentsOptionSelected) && (
                <EditDeleteItemList
                  type={INTENTS_KEYS.GLOBAL}
                  icon={<GlobalEarthIcon />}
                  description="Custom Global Intents are available for use in all agents. Can be edited, duplicated, or deleted."
                  itemsArray={globalIntents}
                  disabledDeleteTooltipTitle="This Intent is currently being used in other agents. You cannot delete intents in use. Remove the intent from all agents first"
                  onEditIntentClick={onEditIntentClick}
                  onDeleteIntentClick={onDeleteIntentClick}
                />
              )}
              {isAllIntentsOptionSelected && <StyledDivider color={colors.cardGridItemBorder} />}
              {(selectIntentValue.value === INTENTS_KEYS.PREBUILT || isAllIntentsOptionSelected) && (
                <EditDeleteItemList
                  type={INTENTS_KEYS.PREBUILT}
                  icon={<BuiltBlockIcon />}
                  description="Pre-Built Intents are available for use in all agents and are provided by default in Symphona..."
                  itemsArray={preBuiltIntents}
                  isEditable
                  onEditIntentClick={onEditIntentClick}
                  onDeleteIntentClick={onDeleteIntentClick}
                />
              )}
              {transitionType === TRANSITION_SCREEN.PRIMARY && customActionsRef?.customActionsRef?.current && (
                <Portal node={customActionsRef?.customActionsRef?.current}>
                  <StyledButton primary variant="contained" onClick={slideToSecondaryMenu}>
                    Create New Intent
                  </StyledButton>
                </Portal>
              )}

              <IntentDeleteConfirmationModal
                isOpen={showDeleteModal?.opened}
                closeModal={() => setShowDeleteModal({ opened: false })}
                values={showDeleteModal?.value}
                isDeleteIntentApiLoading={isDeleteIntentApiLoading}
                handleDeleteIntent={handleDeleteIntent}
              />
            </StyledFlex>
          </TransitionSlidePrimaryContainer>
        )}
      </Transition>

      <Transition
        in={transitionType === TRANSITION_SCREEN.SECONDARY}
        timeout={700}
        classNames="settings-transition"
        unmountOnExit
      >
        {(state) => (
          <TransitionSlideSecondaryContainer state={state}>
            <IntentsCreateOrEdit
              setTransitionType={setTransitionType}
              customActionsRef={customActionsRef}
              slideToPrimaryMenu={slideToPrimaryMenu}
              isTransitionActive={transitionType === TRANSITION_SCREEN.SECONDARY}
              clickedIntent={clickedIntent}
              setClickedIntent={setClickedIntent}
              allIntents={intents}
              isUnsavedChangesModalOpen={isUnsavedChangesModalOpen}
              setIsUnsavedChangesModalOpen={setIsUnsavedChangesModalOpen}
              setIsCreateEditFormDirtySync={setIsCreateEditFormDirtySync}
            />
          </TransitionSlideSecondaryContainer>
        )}
      </Transition>
    </StyledFlex>
  );
};

export default memo(IntentsView);
