import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';
import Scrollbars from 'react-custom-scrollbars-2';

export const StyledContentSide = styled('div', {
  shouldForwardProp: (prop) => isPropValid(prop) && !['sideWidth'].includes(prop),
})`
  flex: 0 0 ${({ theme, sideWidth }) => sideWidth || theme.sizes.pageAside}px;
  border: 2px solid #dfdfdf;
  border-top: none;
  border-left: 1px solid #dfdfdf;
`;

export const StyledContentContainer = styled('div', {
  shouldForwardProp: (prop) => isPropValid(prop) && !['containerDirection'].includes(prop),
})`
  display: flex;
  height: 100%;
  flex-direction: ${({ containerDirection }) => containerDirection || 'row'};
`;

export const StyledContentMain = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1 0;
  padding: ${({ noPadding }) => (noPadding ? 0 : '34px 36px')};
  height: ${({ fullHeight }) => (fullHeight ? '100%' : 'auto')};
  ${({ disableScroll }) => disableScroll && 'overflow: hidden;'}
`;

export const StyledPaddedScrollbar = styled(Scrollbars)`
  & > div:nth-of-type(3) {
    width: 18px !important;
    background-color: ${({ theme }) => `${theme.colors.tableScrollBg} !important`};
    box-shadow: ${({ theme }) => `${theme.boxShadows.contentLayoutScrollbar} !important`};
    right: 0 !important;
    border-radius: 0px !important;

    & > div {
      width: 6px !important;
      margin-left: 7px !important;
      background-color: ${({ theme }) => `${theme.colors.tableScrollThumb} !important`};
      border-radius: 10px !important;
    }
  }
`;
