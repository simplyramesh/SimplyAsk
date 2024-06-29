import React from 'react';
import {
  StyledStepDropZone,
  StyledStepGroup,
  StyledStepSourceHandle,
} from '../../../../../shared/components/CustomSteps/StyledStep';
import { STEP_ITEM_TYPES } from '../../../constants/steps';
import { useRecoilState } from 'recoil';
import { agentEditorStepItem } from '../../../store';
import { Position, useNodeId } from 'reactflow';
import { useUpdateSteps } from '../../../hooks/useUpdateSteps';
import { useCustomDrop } from '../../../../../shared/hooks/useCustomDrop';
import { setIn } from '../../../../../../shared/REDISIGNED/utils/helpers';
import GroupItem from './GroupItem';
import { getStepItemTemplate } from '../../../utils/defaultTemplates';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { StyledDivider } from '../../../../../../shared/styles/styled';

const GroupsContainer = ({ groupItems, type, onBlockContextMenu }) => {
  const stepId = useNodeId();
  const { updateStep } = useUpdateSteps();
  const [stepItemOpened, setStepItemOpened] = useRecoilState(agentEditorStepItem);

  const freezedGroupItem = groupItems.filter((item) =>
    [STEP_ITEM_TYPES.ACTION_ERROR, STEP_ITEM_TYPES.QUICK_REPLIES].includes(item.type)
  );
  const restGroupItem = groupItems.filter(
    (item) => ![STEP_ITEM_TYPES.ACTION_ERROR, STEP_ITEM_TYPES.QUICK_REPLIES].includes(item.type)
  );

  const { dropRef, canDrop, isOverCurrent } = useCustomDrop({
    accept: type,
    onDrop: () => {
      updateStep(stepId, (prev) =>
        setIn(prev, 'data.stepItems', prev.data.stepItems.concat(getStepItemTemplate(type)))
      );
    },
  });

  const handleItemClick = (stepId, stepItemId, stepType) => {
    setStepItemOpened({
      stepId,
      stepType,
      stepItemId,
    });
  };

  const isSelected = (id) => stepItemOpened?.stepItemId === id;

  const renderHandler = (id, type) =>
    [STEP_ITEM_TYPES.TRANSITION, STEP_ITEM_TYPES.ACTION_ERROR].includes(type) && (
      <StyledStepSourceHandle id={id} type="source" position={Position.Right} isConnectable transition />
    );

  return (
    <Droppable
      type={type}
      droppableId={`${stepId}-${type}`}
      renderClone={(provided, snapshot, rubric) => {
        const block = groupItems[rubric.source.index];

        if (!block) return null;

        return (
          <GroupItem
            key={block.id}
            stepId={stepId}
            block={block}
            selected={isSelected(block.id)}
            type={block.type}
            onClick={handleItemClick}
            onContextMenu={onBlockContextMenu}
            sourceHandle={renderHandler(block.id, block.type)}
            dragRef={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
              boxShadow: '0 0 5px rgba(0,0,0,.1)',
              background: 'white',
              borderRadius: '10px',
            }}
          />
        );
      }}
    >
      {(provided) => (
        <StyledStepGroup ref={dropRef}>
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {restGroupItem.map((block, index) => (
              <Draggable key={block.id} draggableId={block.id} index={index}>
                {(provided) => (
                  <GroupItem
                    key={block.id}
                    stepId={stepId}
                    block={block}
                    selected={isSelected(block.id)}
                    type={block.type}
                    onClick={handleItemClick}
                    onContextMenu={onBlockContextMenu}
                    sourceHandle={renderHandler(block.id, block.type)}
                    dragRef={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={provided.draggableProps.style}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
          {freezedGroupItem.length > 0 && (
            <>
              <StyledDivider color="#DADFE8" />
              {freezedGroupItem.map((block) => (
                <GroupItem
                  key={block.id}
                  stepId={stepId}
                  block={block}
                  selected={isSelected(block.id)}
                  type={block.type}
                  onClick={handleItemClick}
                  onContextMenu={onBlockContextMenu}
                  sourceHandle={renderHandler(block.id, block.type)}
                />
              ))}
            </>
          )}
          <StyledStepDropZone canDrop={canDrop && isOverCurrent} />
        </StyledStepGroup>
      )}
    </Droppable>
  );
};

export default GroupsContainer;
