import styled from '@emotion/styled';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';

export const StyledAccordionHead = styled(AccordionSummary)`
  padding: 0;
  border-bottom: 1px solid transparent;
  min-height: 63px;

  &.Mui-expanded {
    border-bottom: 1px solid #dadfe8;
    min-height: 63px;
  }
`;

export const StyledAccordionBody = styled(AccordionDetails)`
  padding: 0;
`;

export const StyledAccordion = styled(Accordion)`
  border: 1px solid #dadfe8;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: none;
  background-color: #f8f9fa;

  &.MuiAccordion-root {
    border-radius: 15px;

    &:before {
      display: none;
    }
  }
`;
