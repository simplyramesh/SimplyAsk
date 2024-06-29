import { useDrag } from 'react-dnd';
import React from 'react';
import { StyledStepDelegatesItem } from './StyledStepDelegates';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import DragIcon from '../../../../../Assets/icons/agent/steps/drag.svg?component';
import ArrowIcon from '../../../../../Assets/icons/agent/steps/arrow.svg?component';

const StepDelegatesItem = ({ item }) => {
  const { type, name, Icon, children } = item;
  const canDrag = !children;

  const [{ opacity }, drag] = useDrag(
    () => ({
      type,
      item,
      canDrag,
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
        isDragging: monitor.isDragging(),
      }),
    }),
    []
  );

  return (
    <StyledStepDelegatesItem ref={drag} style={{ opacity }} canDrag={canDrag}>
      <StyledFlex direction="row" gap="10px" alignItems="center">
        <Icon />
        <StyledText size={14} weight={600} wrap="nowrap">
          {name}
        </StyledText>
        <StyledFlex marginLeft="auto">{children ? <ArrowIcon /> : <DragIcon />}</StyledFlex>
      </StyledFlex>
    </StyledStepDelegatesItem>
  );
};

export default StepDelegatesItem;
