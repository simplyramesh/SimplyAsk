import React from 'react';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';

const PublishTooltip = () => {
  // const { colors } = useTheme();

  return (
    <StyledFlex gap="20px 0">
      <StyledText lh={24}>
        You have steps with incomplete fields. These must be completed in order to publish this workflow.
      </StyledText>
      {/* <StyledFlex as="p" display="inline">
        <StyledText
          as="span"
          display="inline"
          lh={24}
          weight={500}
          color={colors.linkColor}
          cursor="pointer"
          onClick={onClick}
        >
          {'Click here '}
        </StyledText>
        <StyledText as="span" display="inline" lh={20}>to open the “Incomplete Fields” modal to view the missing fields.</StyledText>
      </StyledFlex> */}
    </StyledFlex>
  );
};

export default PublishTooltip;
