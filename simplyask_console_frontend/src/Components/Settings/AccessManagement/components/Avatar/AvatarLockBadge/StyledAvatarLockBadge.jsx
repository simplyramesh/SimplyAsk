import styled from '@emotion/styled';

export const StyledAvatarLockBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.tertiary};
  border-radius: 50%;
  width: 54px;
  height: 54px;
  border: 6px solid ${({ theme }) => theme.colors.white};
`;
