import React, { memo, useCallback } from 'react';
import Action from './Action';
import { Droppable } from 'react-beautiful-dnd';
import { StyledActions } from './StyledActions';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  generativeEditorActionDragging,
  generativeEditorActionOpened,
  generativeEditorObjectivesState,
} from '../../../store';

const Actions = ({ objectiveDesignId, objectiveIndex }) => {
  const setActionOpened = useSetRecoilState(generativeEditorActionOpened);
  const actionDragging = useRecoilValue(generativeEditorActionDragging);
  const objectives = useRecoilValue(generativeEditorObjectivesState);
  // const actionDragging = useRecoilValue(generativeEditorActionDragging);
  const actions = objectives.find((objective) => objective.designId === objectiveDesignId)?.actions || [];

  const handleActionClick = useCallback(
    (actionDesignId) => {
      setActionOpened({
        actionDesignId,
        objectiveDesignId,
      });
    },
    [objectiveDesignId]
  );

  return (
    <Droppable droppableId={objectiveDesignId}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          <StyledActions gap="10px" isHighlighted={actionDragging}>
            {actions.map((action, idx) => (
              <Action
                key={action.designId}
                actionIndex={idx}
                designId={action.designId}
                objectiveIndex={objectiveIndex}
                objectiveDesignId={objectiveDesignId}
                onActionClick={handleActionClick}
                name={action.name}
                type={action.type}
                purpose={action.purpose}
              />
            ))}
            {provided.placeholder}
          </StyledActions>
        </div>
      )}
    </Droppable>
  );
};

export default memo(Actions);
