import React, { memo } from 'react';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';

const GenerativeEditorCardsHeader = ({ title, description, icon, actions }) => {
  return (
    <StyledFlex gap="20px" direction="row" alignItems="center">
      <StyledFlex as="span">{icon}</StyledFlex>
      <StyledFlex>
        <StyledText size={19} weight={600} lh={24} mb={10}>
          {title}
        </StyledText>
        <StyledText lh={19}>{description}</StyledText>
      </StyledFlex>
      {actions}
    </StyledFlex>
  );
};

export default memo(GenerativeEditorCardsHeader);
