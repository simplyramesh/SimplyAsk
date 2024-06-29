import styled from '@emotion/styled';

import { StyledFlex } from '../../../../shared/styles/styled';

export const StyledEndProcessInfo = styled.div`
  position: absolute;
  top: calc(100% + 76px);
  left: calc(50% - 106px);
  width: 212px;
  padding: 10px;
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.boxShadows.box};
  background-color: ${({ theme }) => theme.colors.white};
`;

export const StyledEndProcessHead = styled(StyledFlex)`
  margin-bottom: 5px;
`;

export const StyledEndProcessIcon = styled.div`
  display: flex;
  flex: 0 0 auto;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  border-radius: 5px;
  background-color: #ffecdf;
  color: #f57b20;
`;

export const StyleEdnProcessTitle = styled.div``;

export const StyleEndProcessArrow = styled.div`
  position: absolute;
  left: calc(50% - 1.5px);
  bottom: 100%;
  width: 3px;
  height: 71px;
  background-color: #2d3a47;
  z-index: -1;

  &:after {
    content: '';
    position: absolute;
    right: -5.4px;
    top: -12px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 7px 7px 14px 7px;
    border-color: transparent transparent #2d3a47 transparent;
  }

  &:before {
    content: '';
    position: absolute;
    right: -5.4px;
    bottom: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 7px 7px 12px 7px;
    border-color: transparent transparent #2d3a47 transparent;
  }
`;
