import styled from '@emotion/styled';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useTheme } from '@mui/system';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import {
  StyledFlex,
  StyledText,
  StyledAccordionDetails,
  StyledAccordion,
  StyledAccordionSummary,
} from '../../../../../../../styles/styled';
import { CopyBlock, atomOneLight } from 'react-code-blocks';

const StyledAnchor = styled.a`
  font-weight: 400;
  font-size: 14px;
  display: inline;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.linkColor};

  &:hover {
    text-decoration: underline;
  }
`;

const getBodyDivHTML = (widgetId, agentId) => `<div 
    class="simplyask-agent-widget" 
    data-iva-agent-id="${agentId}"
    data-widget-id="${widgetId}" >
</div>`;

const getHeadScriptHTML = () =>
  `<script async src="${import.meta.env.VITE_SIMPLYASK_CDN}/widget/${import.meta.env.VITE_CHAT_WIDGET_FILE_NAME}"></script>`;

const ConfigureChannelsWidgetAccordion = ({ widgetId, agentId }) => {
  const { colors } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const showToast = () => toast.success('Copied to clipboard!');

  return (
    <StyledAccordion expanded={isExpanded} onChange={() => setIsExpanded((prev) => !prev)}>
      <StyledAccordionSummary
        p="0"
        iconWidth="33px"
        iconColor={colors.linkColor}
        expandIcon={<KeyboardArrowDownRoundedIcon />}
        flexGrow="0"
        justifyContent="flex-start"
        margin="0 50px 0 0"
      >
        <StyledText weight={600} color={colors.linkColor}>
          Install Chat Widget
        </StyledText>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <StyledText weight={400} size={14}>
          1) Copy and paste this code into the {'<head>'} tag of your website.
        </StyledText>

        <StyledFlex
          border="2px solid"
          borderRadius="8px"
          borderColor={colors.altoGray}
          direction="row"
          marginTop="5px"
          marginBottom="25px"
        >
          <CopyBlock
            customStyle={{ width: '100%' }}
            language="html"
            text={getHeadScriptHTML()}
            showLineNumbers={false}
            codeBlock
            theme={atomOneLight}
            onCopy={showToast}
          />
        </StyledFlex>

        <StyledText weight={400} size={14}>
          2) Copy and paste this code into the {'<body>'} tag of your website to add the widget.
        </StyledText>

        <StyledFlex border="2px solid" borderRadius="8px" borderColor={colors.altoGray} direction="row" marginTop="5px">
          <CopyBlock
            customStyle={{ width: '100%' }}
            language="html"
            text={getBodyDivHTML(widgetId, agentId)}
            showLineNumbers={false}
            codeBlock
            theme={atomOneLight}
            onCopy={showToast}
          />
        </StyledFlex>

        <StyledText weight={400} size={14} mt={6} mb={10} display="block">
          Need help installing your chat widget? Refer to{' '}
          <StyledAnchor href="https://docs.symphona.ai/converse/how-to-install-website-chatbot" target="_blank">
            our guide
          </StyledAnchor>{' '}
          for in-depth assistance.
        </StyledText>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default ConfigureChannelsWidgetAccordion;
