import styled from '@emotion/styled';
import { StyledFlex } from '../../../styles/styled';

export const StyledSignatureWrapper = styled(StyledFlex, {
  shouldForwardProp: (prop) => !['error', 'editable'].includes(prop),
})(({ theme, error, editable }) => ({
  gap: '12px 0',
  marginTop: '12px',
  '& .signatureCanvas': {
    width: '75%',
    height: '100%',
    border: `1px solid ${error ? theme.colors.validationError : theme.colors.primary}`,
    borderRadius: '5px',
  },

  ...(editable && {
    justifyContent: 'flex-start',
    maxHeight: '75px',

    '& .signatureCanvas': {
      width: 'auto',
      height: '100%',
      border: `1px solid ${error ? theme.colors.validationError : theme.colors.linkColor}`,
      borderRadius: '5px',
    },
  }),
}));

export const StyledViewOnlySignature = styled('img')(() => ({
  height: '35px',
  width: 'auto',
  objectFit: 'contain',
}));