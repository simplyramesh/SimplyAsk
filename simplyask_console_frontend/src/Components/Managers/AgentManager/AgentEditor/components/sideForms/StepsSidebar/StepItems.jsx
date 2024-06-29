import React from 'react';
import { StyledSidebarItem, StyledSidebarItemIcon } from '../../../../../shared/components/StyledFlowSidebar';
import { StyledText } from '../../../../../../shared/styles/styled';
import { useStepItems } from '../../../hooks/useStepItems';
import { stepDelegates } from '../../../constants/stepDelegates';
import { agentEditorShowIncomplete, agentEditorStepItem } from '../../../store';
import { useRecoilState, useRecoilValue } from 'recoil';
import { STEP_ENTITY_TYPE, STEP_ITEM_TYPES } from '../../../constants/steps';

const StepItems = ({ stepId, stepItems, onContextMenu }) => {
  const { unifiedStepItems } = useStepItems({ stepItems });
  const [stepItemOpened, setStepItemOpened] = useRecoilState(agentEditorStepItem);
  const isShowIncomplete = useRecoilValue(agentEditorShowIncomplete);


  const handleItemClick = (stepId, stepItemId, stepType) => {
    setStepItemOpened({
      stepId,
      stepType,
      stepItemId
    })
  }

  const renderItem = ({ value, placeholder, type }) => {

    if (type === STEP_ITEM_TYPES.QUICK_REPLIES) {
      return `Quick Replies - ${value?.length} Replies`;
    }

    return value || placeholder
  }

  return stepDelegates.map(delegate => {
    const groupItems = unifiedStepItems[delegate.type] || [];

    return groupItems.map((item) => {
      const { id, Icon, value, placeholder, errors, type } = item;

      const isSelected = stepItemOpened?.stepId === stepId && stepItemOpened?.id === id;

      if (isShowIncomplete && Object.keys(errors || {}).length === 0) return null;

      return (
        <StyledSidebarItem
          key={id}
          direction="row"
          alignItems="center"
          gap="10px"
          p="10px 15px 10px 42px"
          selected={isSelected}
          onClick={() => handleItemClick(stepId, id, type)}
          onContextMenu={(event) => onContextMenu(event, {
            data: item,
            dataType: STEP_ENTITY_TYPE.BLOCK,
            stepId,
            stepItemType: delegate.type
          })}
        >
          <StyledSidebarItemIcon><Icon /></StyledSidebarItemIcon>
          <StyledText maxLines={1}>
            {renderItem({ value, placeholder, type })}
          </StyledText>
        </StyledSidebarItem>
      )
    });
  }).flat();
};

export default StepItems;
