import React from 'react';
import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import {
  StyledStepErrorCircle,
  StyledStepGroupItem,
  StyledStepGroupItemIcon,
  StyledStepGroupItemWrap,
} from '../../../../../shared/components/CustomSteps/StyledStep';
import { StyledTooltip } from '../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { STEP_ITEM_TYPES } from '../../../constants/steps';

const GroupItem = ({
  sourceHandle,
  stepId,
  type,
  block,
  onClick,
  onContextMenu,
  selected,
  dragRef,
  style,
  ...rest
}) => {
  const { id, Icon, value, placeholder, item, hiddenMessages, errors } = block;

  const renderAdditionalInfo = () => {
    if (type === STEP_ITEM_TYPES.QUICK_REPLIES) {
      const quickReplyCount = value.reduce((acc, curr) => curr.value ? acc + 1 : acc, 0);

      return (
        <>
          <StyledText ellipsis size={14} weight={500}>
            Quick Replies
          </StyledText>
          <StyledText themeColor="information" size={12} lh={10}>{`${quickReplyCount} Replies Configured`}</StyledText>
        </>
      );
    }

    return (
      <>
        <StyledText ellipsis size={14}>
          {value || placeholder}
        </StyledText>
        {!!hiddenMessages && (
          <StyledText themeColor="information" size={12} lh={10}>
            + {hiddenMessages} variations
          </StyledText>
        )}
      </>
    );
  };

  return (
    <StyledStepGroupItemWrap>
      <StyledStepGroupItem
        ref={dragRef}
        key={id}
        hovered={false}
        selected={selected}
        onClick={() => onClick?.(stepId, id, type)}
        onContextMenu={(event) => onContextMenu?.(event, block, item.type)}
        style={style}
        {...rest}
      >
        <StyledFlex gap="12px" direction="row" alignItems="center" minWidth="0" width="100%">
          <StyledStepGroupItemIcon>
            <Icon />
          </StyledStepGroupItemIcon>
          <StyledFlex flexGrow="1" minWidth="0">
            {renderAdditionalInfo()}
          </StyledFlex>

          {Object.keys(errors || {}).length > 0 && (
            <StyledTooltip arrow placement="top" title="Contains Missing Fields" p="10px 15px">
              <StyledFlex marginLeft="auto" flexShrink="0">
                <StyledStepErrorCircle inline />
              </StyledFlex>
            </StyledTooltip>
          )}
        </StyledFlex>
      </StyledStepGroupItem>
      {sourceHandle}
    </StyledStepGroupItemWrap>
  );
};

export default GroupItem;
