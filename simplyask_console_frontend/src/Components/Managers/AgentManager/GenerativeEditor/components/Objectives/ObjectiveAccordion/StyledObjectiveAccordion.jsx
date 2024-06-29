import styled from '@emotion/styled';

export const StyledObjectiveAccordion = styled.div`
  border: 1px solid #dadfe8;
  border-radius: 10px;
  overflow: hidden;
`;

export const StyledObjectiveAccordionContent = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.accordionBgHover};
  background: ${({ theme }) => theme.colors.accordionBg};
`;
