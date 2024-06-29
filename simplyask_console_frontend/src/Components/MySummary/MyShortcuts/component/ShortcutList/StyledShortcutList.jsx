import styled from '@emotion/styled';

export const StyledShortcutList = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin: ${({ margin = 0 }) => margin};
  max-height: ${({ maxHeight = 'auto' }) => maxHeight};
  padding: 0;
  overflow: auto;
`;
