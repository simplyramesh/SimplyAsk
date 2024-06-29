import React from 'react';
import { StyledFlowEditorHead, StyledFlowEditorHeadCenterControls, StyledFlowEditorHeadLeftControls, StyledFlowEditorHeadRightControls } from '../StyledFlowEditor';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';

const FlowEditorHead = ({ leftControls, centerControls, title, rightControls }) => {
  return (
    <StyledFlowEditorHead>
      <StyledFlex direction="row" flex="auto" justifyContent="space-between">
        <StyledFlowEditorHeadLeftControls>
          {leftControls}
        </StyledFlowEditorHeadLeftControls>
        <StyledFlowEditorHeadCenterControls>
          {centerControls}
          {title ? <StyledText size={16} weight={600}>{title}</StyledText> : null}
        </StyledFlowEditorHeadCenterControls>
        <StyledFlowEditorHeadRightControls>
          {rightControls}
        </StyledFlowEditorHeadRightControls>
      </StyledFlex>
    </StyledFlowEditorHead>
  );
};

export default FlowEditorHead;
