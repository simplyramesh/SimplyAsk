import styled from '@emotion/styled';
import PhoneInput from 'react-phone-number-input';

export const StyledPhoneNumberInput = styled(PhoneInput, {
  shouldForwardProp: (prop) => ![
    'height',
    'borderColor',
    'textAlign',
    'invalid',
    'fontSize',
    'borderRadius',
  ].includes(prop),
})(({
  theme,
  height,
  borderColor,
  textAlign,
  invalid,
  fontSize,
  borderRadius,
}) => ({
  display: 'flex',
  gap: '0 10px',
  flex: '1 1 auto',
  alignItems: 'center',
  width: '100%',
  height: height || '42px',
  padding: '10px 16px 10px 0px',
  border: borderColor
    ? `1px solid ${borderColor}`
    : `1px solid ${theme.colors.borderNoError}`,
  borderRadius: borderRadius || '10px',
  backgroundColor: theme.colors.white,
  fontFamily: 'Montserrat',
  fontSize: fontSize || '16px',
  fontWeight: 400,
  fontStyle: 'normal',
  color: theme.colors.primary,
  textAlign: textAlign || 'left',

  '& .PhoneInputCountry': {
    pointerEvents: 'none',

    '& .PhoneInputCountryIcon': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: `${borderRadius || '10px'} 0 0 ${borderRadius || '10px'}`,
      backgroundColor: theme.colors.phonePlusOneBg,
      width: '47px',
      height: `${height ? parseInt(height, 10) - 2 : 39}px`,

      '& .PhoneInputCountryIconImg': {
        width: '28px',
      },
    },

    '& .PhoneInputCountrySelect': {
      display: 'none',

      '& option': {
        fontFamily: 'Montserrat',
        fontSize: '16px',
      },

      '& .PhoneInputCountrySelectArrow': {
        display: 'none',
      },
    },
  },

  '& .PhoneInputInput': {
    appearance: 'none',
    resize: 'none',
    fontSize: 'inherit',
    fontWeight: 'inherit',
    fontStyle: 'inherit',
    color: 'inherit',
    width: '100%',
    height: '100%',
    border: 'none',
    outline: 'none',
    background: 'transparent',
  },

  '&::placeholder': {
    color: theme.colors.optional,
  },

  '&:focus-within': {
    border: borderColor
      ? `1px solid ${borderColor}`
      : `1px solid ${theme.colors.primary}`,
  },

  ...(invalid ? { border: `1px solid ${theme.colors.validationError} !important` } : {}),
}));
