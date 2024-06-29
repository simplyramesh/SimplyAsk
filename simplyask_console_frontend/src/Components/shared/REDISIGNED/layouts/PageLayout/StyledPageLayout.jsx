import styled from '@emotion/styled';

export const StyledPageLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - ${({ theme, fullPage }) => (fullPage ? 0 : theme.sizes.headerHeight)}px);
  overflow: hidden;
  ${({ width }) => width && `width: ${width}`};
`;

export const StyledPageTop = styled.div`
  position: relative;
  z-index: 5;
  width: 100%;
`;

export const StyledPageWrapper = styled.div`
  display: flex;
  flex: 1 0;
  width: 100%;
`;

export const StyledPageMain = styled.div`
  flex: 1 0;
`;
