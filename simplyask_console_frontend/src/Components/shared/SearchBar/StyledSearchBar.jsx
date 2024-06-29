import styled from '@emotion/styled';

export const StyledSearchBarContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  position: relative;
  margin: 0;
  padding: 0;
  max-width: ${({ maxWidth }) => maxWidth || '100%'};
  width: ${({ width }) => width || 'auto'};
`;

export const StyledSearchBarInput = styled.input`
  flex: 1 1 auto;
  width: 100%;
  padding: 6px 30px 6px 18px;
  border: 1px solid #334150;
  border-radius: 25px;
  outline: none;
  font-family: 'Montserrat', serif;
  font-size: ${({ fontSize }) => fontSize || '16'}px;
  font-style: normal;
  font-weight: 400;
  line-height: ${({ lineHeight }) => lineHeight || '18'}px;
`;

export const StyledSearchBarIcon = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 4px;
  top: 4px;
  padding: 4px;
  border-radius: 100%;
  background: #334150;
  color: #ffffff;
  cursor: pointer;

  & > svg {
    width: 16px;
    height: 16px;
  }
`;
