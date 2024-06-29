import styled from '@emotion/styled';

export const StyledStepDelegates = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  background: #eaeff5;
  box-shadow: 1px 1px 5px 2px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;

  ${({ subMenu }) =>
    subMenu &&
    `
    position: absolute;
    top: -8px;
    left: calc(100% + 22px);
  `};

  ul {
    opacity: 0;
    pointer-events: none;
    transform: translateX(10px);
  }
`;

export const StyledStepDelegatesItem = styled.div`
  min-width: 170px;
  padding: 5px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.boxShadows.box};
  border-radius: 5px;
  cursor: ${({ canDrag }) => (canDrag ? 'grab' : 'pointer')};
  transition: all 0.3s ease;
  transform: translateX(0);

  &:hover {
    box-shadow: 1px 1px 7px 3px rgba(0, 0, 0, 0.15);
    transform: translateX(2px);
  }
`;

export const StyledStepDelegatesItemWrap = styled.div`
  position: relative;

  &:hover {
    &:before {
      content: '';
      position: absolute;
      left: 100%;
      top: 0;
      height: 100%;
      width: 22px;
    }

    & > ${StyledStepDelegates} {
      opacity: 1;
      pointer-events: all;
      transform: translateX(0);
    }

    & > ${StyledStepDelegatesItem} {
      box-shadow: 1px 1px 7px 3px rgba(0, 0, 0, 0.15);
      transform: translate(2px);
    }
  }
`;
