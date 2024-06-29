import styled from '@emotion/styled';

export const StyledActivityLog = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const StyledMyActivityInfo = styled.div`
  font-size: 14px;
  line-height: 17px;
`;

export const StyledMyActivityAction = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledStatusIcon = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isNew',
})`
  position: absolute;
  width: 18px;
  height: 18px;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  border-width: 2px;
  border-style: solid;
  border-color: ${({ theme, isNew }) => (isNew ? theme.colors.tertiaryHover : theme.colors.lightGray)};
  border-radius: 50%;
  cursor: ${({ isNew }) => (isNew ? 'pointer' : 'default')};

  &:after {
    position: absolute;
    content: '';
    top: 50%;
    left: 50%;
    width: 12px;
    height: 12px;
    transform: translate(-50%, -50%);
    background: ${({ theme, isNew }) => (isNew ? theme.colors.iconColorOrange : theme.colors.charcoal)};
    border-radius: 50%;
  }
`;

export const StyledDropdownContent = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.charcoal};
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.boxShadows.box};
`;
export const StyledDropdownItem = styled.span`
  padding: 12px 16px;
  font-size: 14px;
  line-height: 17px;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.bgColorOptionTwo};
  }
`;
