import styled from '@emotion/styled';
import Select from 'react-select';

export const ShortcutsManageHolder = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  gap: 30px;
`;

export const ShortcutsManageHandler = styled.div`
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 30px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardGridItemBorder};

  & > * {
    padding-left: 30px;
    padding-right: 30px;
  }
`;

export const StyledShortcutsFiltersHolder = styled('div', {
  shouldForwardProp: (prop) => prop !== 'shown',
})`
  padding: 0;
  max-height: ${({ shown }) => (shown ? '400px' : 0)};
  background: ${({ theme }) => theme.colors.background};
  overflow: ${({ shown }) => !shown && 'hidden'};
  transition: max-height 0.5s ease;
`;

export const StyledShortcutsFilters = styled.div`
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.cardGridItemBorder};
`;

export const StyledLabel = styled.label`
  font-weight: 600;
`;

export const StyledSelectChapter = styled(Select)`
  width: 100%;

  [class*='control'] {
    padding: 0 10px;
    min-height: 30px;
    font-size: 15px;
    line-height: 18px;
    border: 1px solid ${({ theme }) => theme.colors.charcoal};
    border-radius: 20px;
    box-shadow: none;
    outline: none;
    cursor: pointer;

    &:hover,
    &:focus-within {
      border: 1px solid ${({ theme }) => theme.colors.charcoal};
      outline: none;
    }
  }

  [class*='StyledSearchBarInput'] {
    font-size: 15px;
    line-height: 18px;
  }

  [class*='indicatorSeparator'] {
    display: none;
  }
`;

export const StyledShortcutsFilterResult = styled.div`
  overflow: auto;
`;
