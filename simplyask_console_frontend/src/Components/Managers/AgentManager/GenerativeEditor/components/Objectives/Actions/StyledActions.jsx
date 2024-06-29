import styled from '@emotion/styled';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { StyledFlex } from '../../../../../../shared/styles/styled';

export const StyledActions = styled(StyledFlex, {
  shouldForwardProp: (prop) => prop !== 'isHighlighted',
})`
  &:empty {
    position: relative;
    min-height: 4px;

    &:after {
      content: '';
      position: absolute;
      top: -2px;
      left: 0;
      width: 100%;
      height: 100%;
      transition: background-color 0.2s;
      min-height: 4px;
      border-radius: 4px;
      background: ${({ theme, isHighlighted }) => (isHighlighted ? theme.colors.iconColorBlue : 'transparent')};
    }
  }
`;

export const StyledAction = styled('div', {
  shouldForwardProp: (prop) => prop !== 'selected',
})`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 5px 8px 10px;
  border-radius: 10px;
  border: 1px solid #dadfe8;
  background-color: ${({ theme }) => theme.colors.white};
  cursor: pointer;

  box-shadow: ${({ selected }) => (selected ? '0 0 0 2px #4299FF' : 'none')};
`;

export const StyledActionDrag = styled(DragIndicatorIcon)`
  margin-left: auto;
  color: ${({ theme }) => theme.colors.primary};
  cursor: grab;
`;
