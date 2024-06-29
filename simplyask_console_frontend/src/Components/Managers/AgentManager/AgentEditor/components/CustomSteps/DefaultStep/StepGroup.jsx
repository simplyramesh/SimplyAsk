import React, { Fragment, memo, useCallback } from 'react';
import GroupsContainer from './GroupsContainer';
import { StyledStepDropZone } from '../../../../../shared/components/CustomSteps/StyledStep';
import { useSetRecoilState } from 'recoil';
import { agentEditorContextMenu } from '../../../store';

const StepGroup = ({ stepDelegate, unifiedStepItems, isOver, draggingItem, stepId }) => {
  const { type } = stepDelegate;
  const groupItems = unifiedStepItems[type] || [];
  const setContextMenu = useSetRecoilState(agentEditorContextMenu);

  const onBlockContextMenu = useCallback((event, item, type) => {
    event.stopPropagation();
    event.preventDefault();

    setContextMenu(prev => ({
      ...prev,
      block: {
        stepId,
        data: item,
        type,
        top:  event.clientY,
        left: event.clientX,
      }
    }));
  }, [stepId]);

  return (
    <Fragment key={type}>
      {groupItems.length > 0 ? (
        <GroupsContainer type={type} groupItems={groupItems} onBlockContextMenu={onBlockContextMenu} />
      ) : (
        <StyledStepDropZone fullWidth canDrop={isOver && draggingItem?.type === stepDelegate.type} />
      )}
    </Fragment>
  )
};

export default memo(StepGroup);
