import styled from '@emotion/styled';
import { StyledText } from '../../../../../shared/styles/styled';
import { media } from '../../../../../shared/styles/media';

export const StyledGenerativeEditorAgenda = styled('div')`
  position: absolute;
  left: 36px;
  top: 36px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: ${({ theme }) => theme.colors.tableScrollBg};
  z-index: 1;
  cursor: pointer;

  ${media.md} {
    display: none;
  }
`;

export const StyledGenerativeEditorAgendaItem = styled(StyledText)`
  position: relative;
  font-weight: 600;
  transition: all 0.3s ease;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 4px;
    height: 16px;
    width: 3px;
    background: ${({ theme }) => theme.colors.secondary};
    opacity: 0;
    transform: translateX(-5px);
  }

  &:hover {
    color: ${({ theme, active }) => !active && theme.colors.lightGray};
  }

  ${({ theme, active }) =>
    active &&
    `
    color: ${theme.colors.secondary};
    transform: translateX(10px);

    &:before {
      opacity: 1;
      transform: translateX(-10px);
    }
  `}
`;
