import styled from '@emotion/styled';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export const StyledAdditionalInfoHeadIcon = styled(KeyboardArrowDownIcon)``;

export const StyledAdditionalInfoHead = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const StyledAdditionalInfoHeadText = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: var(--primaryColor);
`;

export const StyledAdditionalInfoList = styled.div`
  position: relative;
  margin-top: 10px;
`;

export const StyledAdditionalInfoListItem = styled.div`
  position: relative;
  padding-left: 24px;

  &:before {
    content: '';
    position: absolute;
    left: 5px;
    top: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #eae1e1;
  }

  &:after {
    content: '';
    position: absolute;
    left: 10px;
    top: 0;
    width: 2px;
    height: calc(100% + 12px);
    background-color: #eae1e1;
  }

  &:last-child:after {
    height: calc(100% + 5px);
  }

  & + & {
    margin-top: 10px;
  }
`;

export const StyledAdditionalInfoListItemSub = styled.div`
  padding: 5px 0;

  & + & {
    border-top: 1px solid #aaaeb6;
  }
`;

export const StyledAdditionalInfo = styled.div`
  margin-top: 5px;

  ${StyledAdditionalInfoHeadIcon} {
    transform: scale(${({ opened }) => (opened ? 1 : -1)});
  }

  ${StyledAdditionalInfoList} {
    display: ${({ opened }) => (opened ? 'block' : 'none')};
  }
`;
