import PropTypes from 'prop-types';
import React from 'react';

import { StyledText } from '../../../../../../../shared/styles/styled';
import {
  StyledActionsExecutionContent,
  StyledActionsExecutionHeader,
  StyledActionsExecutionSection,
} from './StyledActionsExecutionSection';

const ActionsExecutionSection = (props) => {
  const {
    width,
    title,
    headerHeight,
    headerPadding,
    headerAction,
    children,
  } = props;

  return (
    <StyledActionsExecutionSection {...{ width }}>
      <StyledActionsExecutionHeader
        height={headerHeight}
        padding={headerPadding}
      >
        <StyledText
          size={19}
          lh={24}
          weight={600}
        >
          {title}
        </StyledText>

        {headerAction ?? headerAction}
      </StyledActionsExecutionHeader>
      <StyledActionsExecutionContent>
        {children}
      </StyledActionsExecutionContent>
    </StyledActionsExecutionSection>
  );
};

export default ActionsExecutionSection;

ActionsExecutionSection.propTypes = {
  width: PropTypes.string,
  title: PropTypes.string,
  headerHeight: PropTypes.string,
  headerPadding: PropTypes.string,
  headerAction: PropTypes.node,
  children: PropTypes.node,
};
