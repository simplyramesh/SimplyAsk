import styled from '@emotion/styled';
import { StyledFlex } from '../../../../../../../shared/styles/styled';

export const StyledFieldMapping = styled(StyledFlex, {
  shouldForwardProp: (prop) => !['error', 'removeTopMargin'].includes(prop),
})(({ error, removeTopMargin, theme }) => ({
  ...(removeTopMargin ? { marginTop: '-14px' } : {}),
  padding: '15px',
  borderRadius: '10px',
  backgroundColor: theme.colors.lightGray2,
  border: `2px solid ${error ? theme.colors.validationError : theme.colors.lightGray2}`,
  gap: '15px',
}));
