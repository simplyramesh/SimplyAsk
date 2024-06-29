import { css } from '@emotion/css';
import styled from '@emotion/styled';

import { StyledFlex } from '../../../styles/styled';

export const expressionBuilderInput = css`
  width: 100%;
  min-height: 41px;
  padding: 4px 10px;
  border-radius: 10px;
  outline: none;

  &:hover {
    cursor: text;
  }

  & > * {
    font-size: 14px;
    font-weight: 500;
    line-height: 2.2;
  }
`;
export const StyledExpressionBuilder = styled.div`
  position: relative;
  border-radius: 10px;

  ${({ error, theme }) =>
    error &&
    `
    border: 1px solid ${theme.colors.validationError} !important;
  `};

  overflow: ${({ overflow }) => overflow || 'unset'};
  min-height: ${({ minHeight }) => minHeight || '41px'};
  max-height: ${({ maxHeight }) => maxHeight || 'unset'};
  width: ${({ width }) => width || '100%'};
  background-color: ${({ theme, readOnly }) => (readOnly ? 'transparent' : theme.colors.white)};
  border: ${({ theme, isFocused }) => `1px solid ${isFocused ? theme.colors.primary : theme.colors.inputBorder}`};

  ${({ readOnly }) =>
    readOnly &&
    `
    border: none !important;
    padding: 0 !important;
  `};
  ${({ maxLines }) =>
    maxLines &&
    `& .editor-input[contenteditable="false"] { 
    display: -webkit-box;
    -webkit-line-clamp: ${maxLines};
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis; }
    `};
`;

export const expressionBuilderParam = css`
  padding: 2px;
  color: #3865a3;
  background-color: #e6ecf4;
  border: 2px solid #3865a3;
  border-radius: 5px;
`;

export const StyledParamsDropdown = styled.div`
  position: absolute;
  left: 0;
  top: calc(100% + 5px);
  width: 100%;
  box-shadow: ${({ theme }) => theme.boxShadows.box};
  border-radius: 5px;
  background: ${({ theme }) => theme.colors.white};
  z-index: 9999;
  overflow: hidden;
`;

export const StyledParamsDropdownBody = styled.div``;

export const StyledParamsDropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  padding: 8px 15px;
  background-color: ${({ selected, theme }) => (selected ? theme.colors.galleryGray : theme.colors.white)};
`;

export const StyledParamsDropdownDot = styled('div', {
  shouldForwardProp: (prop) => !['green'].includes(prop),
})`
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${({ theme, green }) => (green ? theme.colors.statusResolved : theme.colors.statusAssigned)};
`;

export const StyledSearchableButton = styled(StyledFlex)`
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
  cursor: pointer;
`;

export const StyledIconWrapper = styled(StyledFlex)`
  color: ${({ theme, color }) => color || theme.colors.white};
  background-color: ${({ theme, backgroundColor }) => backgroundColor || theme.colors.primary};
  border-radius: 50%;
  width: 18px;
  height: 18px;
  justify-content: center;
  align-items: center;
  font-size: 13px;
`;

export const StyledExpressionBuilderPlaceholder = styled.div`
  position: absolute;
  left: 10px;
  top: 12px;
  opacity: 0.5;
  font-size: 14px;
  font-weight: 500;
  pointer-events: none;
`;
