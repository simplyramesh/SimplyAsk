import styled from '@emotion/styled';
import Scrollbars from 'react-custom-scrollbars-2';

export const StyledTr = styled.tr`
    height: 40px;
    font-size: 15px;
    border-bottom: ${({ theme }) => `1px solid ${theme.colors.stormySilver}`};
`;

export const StyledTh = styled.th`
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    border-bottom: ${({ theme }) => `1px solid ${theme.colors.stormySilver}`};
    padding: 13px;
    font-weight: 500;

    &:nth-of-type(n+2):not(:nth-last-of-type(-n+1)),
    &:last-of-type {
        border-left: ${({ theme }) => `1px solid ${theme.colors.stormySilver}`};
    }
`;

export const StyledTableHead = styled.thead`
    display: table-header-group;
`;

export const StyledTableBody = styled.tbody`
    display: table-header-group;
`;

export const StyledTableRoot = styled.table`
    border: ${({ theme }) => `1px solid ${theme.colors.stormySilver}`};
    height: fit-content;
    font-size: 14px;
    width: 100%;
    overflow: hidden;
    border-radius: 15px;
    margin-top: 2px;
    margin-bottom: 10px;
    padding-right: 18px;
    border-spacing: 0;
`;

export const StyledTdOdd = styled.td`
    background: ${({ theme }) => theme.colors.skyLightBlue};
    border-collapse: collapse !important;
    border-bottom: ${({ theme }) => `1px solid ${theme.colors.stormySilver}`};
    padding: 8px 10px;

    &:nth-of-type(n+2):not(:nth-last-of-type(-n+1)),
    &:last-of-type {
        border-left: ${({ theme }) => `1px solid ${theme.colors.stormySilver}`};
    }
`;

export const StyledTdEven = styled(StyledTdOdd)`
    background: ${({ theme }) => theme.colors.white};
`;

export const StyledPaddedScrollbar = styled(Scrollbars)`
  & > div:nth-of-type(2){
    height: 18px !important;
    background-color: ${({ theme }) => `${theme.colors.tableScrollBg} !important`};
    box-shadow: ${({ theme }) => `${theme.boxShadows.contentLayoutScrollbar} !important`};
    bottom: 0 !important;
    border-radius: 0 0 0 15px !important;
    border: ${({ theme }) => `1px solid ${theme.colors.inputBorder}`};

    & > div {
      height: 6px !important;
      margin-top: 5px !important;
      background-color: ${({ theme }) => `${theme.colors.tableScrollThumb} !important`};
      border-radius: 10px !important;
      margin-left: 4px !important;
    }
  }

  & > div:nth-of-type(3){
    width: 18px !important;
    background-color: ${({ theme }) => `${theme.colors.tableScrollBg} !important`};
    box-shadow: ${({ theme }) => `${theme.boxShadows.contentLayoutScrollbar} !important`};
    right: 0 !important;
    border-radius: 0 15px 15px 0 !important;
    border: ${({ theme }) => `1px solid ${theme.colors.inputBorder}`};

    &::before {
        content:'';
        background: ${({ theme }) => theme.colors.background};
        width: 15px;
        height: 8px;
        position: absolute;
        right: -4px;
        top: -7px;
        border-radius: 50%;
    }

    &::after {
        content:'';
        background: ${({ theme }) => theme.colors.background};
        width: 15px;
        height: 8px;
        position: absolute;
        right: -8px;
        top: -3px;
        border-radius: 71%;
        transform: rotate(67deg);
    }

    & > div {
      width: 6px !important;
      margin-left: 5px !important;
      background-color: ${({ theme }) => `${theme.colors.tableScrollThumb} !important`};
      border-radius: 10px !important;
      margin-top: 4px !important;
    }
  }
`;
