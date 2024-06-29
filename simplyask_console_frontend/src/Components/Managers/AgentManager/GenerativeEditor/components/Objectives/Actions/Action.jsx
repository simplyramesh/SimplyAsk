import React, { memo } from 'react';
import { StyledAction, StyledActionDrag } from './StyledActions';
import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import { getActionIcon } from '../../../util/icons';
import { Draggable } from 'react-beautiful-dnd';
import { generativeEditorActionOpened, generativeEditorErrors } from '../../../store';
import { useRecoilValue } from 'recoil';
import { ACTION_TYPES_OPTIONS } from '../../../constants/core';
import { StyledTooltip } from '../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledStepErrorCircle } from '../../../../../shared/components/CustomSteps/StyledStep';

const Action = ({ type, name, purpose, designId, actionIndex, objectiveIndex, onActionClick }) => {
  const actionOpened = useRecoilValue(generativeEditorActionOpened);
  const defaultName = ACTION_TYPES_OPTIONS.find((action) => action.value === type)?.label;
  const finalName = name || defaultName;
  const errors = useRecoilValue(generativeEditorErrors);

  const errorsPath = `objectives[${objectiveIndex}].actions[${actionIndex}]`;
  const hasErrors = Object.keys(errors).filter((key) => key.includes(errorsPath)).length > 0;

  const isSelected = actionOpened && actionOpened.actionDesignId === designId;

  return (
    <Draggable draggableId={designId} index={actionIndex}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps} style={{ ...provided.draggableProps.style }}>
          <StyledAction onClick={() => onActionClick(designId)} selected={isSelected}>
            <StyledFlex flexShrink="0">{getActionIcon(type)}</StyledFlex>
            <StyledFlex minWidth="0px" flexGrow="1">
              {finalName ? (
                <StyledText ellipsis size={16} weight={600}>
                  {finalName}
                </StyledText>
              ) : (
                <StyledText size={16} weight={400}>
                  Select Action...
                </StyledText>
              )}
              {purpose && (
                <StyledText ellipsis size={14}>
                  {purpose}
                </StyledText>
              )}
            </StyledFlex>
            {hasErrors && (
              <StyledFlex marginLeft="auto">
                <StyledTooltip arrow placement="top" title="Contains Missing Fields" p="10px 15px">
                  <StyledFlex marginLeft="auto" flexShrink="0">
                    <StyledStepErrorCircle inline />
                  </StyledFlex>
                </StyledTooltip>
              </StyledFlex>
            )}
            <StyledFlex marginLeft="auto" {...provided.dragHandleProps}>
              <StyledActionDrag fontSize="large" />
            </StyledFlex>
          </StyledAction>
        </div>
      )}
    </Draggable>
  );
};

export default memo(Action);
