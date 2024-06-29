import styled from '@emotion/styled';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import Scrollbars from 'react-custom-scrollbars-2';

import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';

export const StyledFilePreviewContainer = styled.div`
  display: flex;
  height: 100%;
  border: 1px solid ${({ theme }) => theme.colors.black};
  margin-top: 10px;
  margin-bottom: 25px;
  border-radius: 8px;
  width: 95%;
  background: ${({ theme }) => theme.colors.background};
  justify-content: center;
  height: 315px;

  ${({ isLoading }) =>
    isLoading &&
    `
    border: 0;
    align-items: center;
    justify-content: center;
  `}
`;
export const StyledScrollbars = styled(Scrollbars)`
  .bulk_contentHeightModal {
    border: 1px solid ${({ theme }) => theme.colors.black};
    border-radius: 10px;
    background: ${({ theme }) => theme.colors.white};
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }
`;

export const StyledLoadingPreviewLine = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  text-align: center;
  width: 100%;
`;

export const StyledPreviewTable = styled.table`
  height: fit-content !important;
  font-size: 12px !important;
  font-family: 'Montserrat', sans-serif !important;
  width: 100%;

  &.bulk_preview_table_noDisplay {
    display: none;
  }
`;

export const StyledTableHeader = styled.thead`
  display: table-header-group;
`;

export const StyledTableRow = styled.tr`
  height: 40px;
  font-size: 14px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.stormySilver};
`;

export const StyledTableHeaderCell = styled.th`
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.stormySilver};
`;

export const StyledTableCell = styled.td`
  &.bulk_table_row_even {
    background: ${({ theme }) => theme.colors.white};
    border-collapse: collapse !important;
    padding: 2px 5px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.stormySilver};
  }

  &.bulk_table_row_odd {
    background: rgba(235, 237, 244, 1);
    border-collapse: collapse !important;
    padding: 2px 5px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.stormySilver};
  }
`;

export const CustomBlackStyledButton = styled(StyledButton)((props) => ({
  borderWidth: props.borderwidthleft,
  borderStyle: 'solid',
  borderColor: props.theme.colors.black,
  color: props.theme.colors.black,
  borderRadius: props.borderradiusleft,
  height: '35px',
}));

export const CustomOrangeStyledButton = styled(StyledButton)((props) => ({
  borderWidth: props.borderwidthleft,
  borderStyle: 'solid',
  borderColor: props.theme.colors.secondary,
  color: props.theme.colors.secondary,
  borderRadius: props.borderradiusleft,
  height: '35px',
  backgroundColor: props.theme.colors.secondaryBg,
}));

export const StyledQuestionsMarkHover = styled(HelpOutlineRoundedIcon)`
  &:hover {
    color: white;
  }
`;

export const StyledProcessEditorHead = styled.div`
  display: flex;
  align-items: center;
  height: 70px;
  padding: 0 35px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.boxShadows.box};
  z-index: 1;
`;
