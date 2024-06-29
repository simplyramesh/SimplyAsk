import React from 'react';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { ContextMenuItem } from '../StyledContextMenus';
import { StyledSvgIconWrap } from '../../StyledFlowEditor';

const ItemsToAdd = ({ items, label, onClick }) => {
  return (
    <>
      <StyledFlex p="5px 15px">
        <StyledText size={16} lh={16} weight={600}>{label}</StyledText>
      </StyledFlex>
      {items.map(({ type, name, Icon }) => (
        <ContextMenuItem
          startIcon={(
            <StyledSvgIconWrap width="16px" height="16px">
              <Icon />
            </StyledSvgIconWrap>
          )}
          onClick={() => onClick(type, name)}
          key={type}
        >
          <StyledText size={16} lh={16}>{name}</StyledText>
        </ContextMenuItem>
      ))}
    </>
  );
};

export default ItemsToAdd;
