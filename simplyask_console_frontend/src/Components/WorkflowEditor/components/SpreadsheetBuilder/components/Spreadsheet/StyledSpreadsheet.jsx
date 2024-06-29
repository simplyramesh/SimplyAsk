import styled from '@emotion/styled';

import QuestionMark from '../../../../../../Assets/icons/questionMark.svg?component';
import { StyledFlex } from '../../../../../shared/styles/styled';

export const StyledSpreadsheet = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
`;

export const StyledSpreadsheetHead = styled.div`
  display: flex;
  align-items: center;
  height: 70px;
  padding: 0 35px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.boxShadows.box};
  z-index: 1;
`;

export const StyledSpreadsheetQuestionIcon = styled(QuestionMark)`
  cursor: pointer;
`;

export const StyledSpreadsheetTable = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% - 70px);

  & > div {
    display: flex;
    flex-grow: 1;
    width: 100%;
  }

  .dsg-container {
    flex-grow: 1;
    height: auto !important;
  }

  .dsg-cell-header,
  .dsg-cell-gutter {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.colors.grayBg};
    color: ${({ theme }) => theme.colors.charcoal};
    font-size: 16px;
    font-weight: 500;
    text-align: center;
  }
`;

export const StyledRevertSpreadsheet = styled(StyledFlex)`
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.dropdownOptionBgHover};
  }
`;
