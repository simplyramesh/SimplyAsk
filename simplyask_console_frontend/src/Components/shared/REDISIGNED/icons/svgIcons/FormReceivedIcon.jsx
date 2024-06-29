/* eslint-disable max-len */
import { useTheme } from '@emotion/react';
import { SvgIcon } from '@mui/material';

/*
  The <path>'s without a fill attribute, (line 17 and line 20), will inherit the color from the parent <SvgIcon> component.
*/

const FormReceivedIcon = (props) => {
  const { colors } = useTheme();

  return (
    <SvgIcon {...props}>
      <path fill={colors.white} d="M23.22 9.5h-.01l-10.94 4.67a.2.2 0 0 1-.16 0l-6.52-2.7L.86 9.5H.85a.28.28 0 0 0-.29.28v12.23a.28.28 0 0 0 .28.29h22.38a.28.28 0 0 0 .28-.29V9.78a.28.28 0 0 0-.28-.28z" />
      <path fill={colors.gunPowder} d="M23.24 9.58h-.03L12.08 1.81a.2.2 0 0 0-.23 0L.8 9.57a.04.04 0 0 1-.04-.06L11.8 1.75a.28.28 0 0 1 .32 0l11.13 7.76a.04.04 0 0 1-.02.07z" />
      <path fill={colors.gray2} d="m1.44 9.85 10.54-7.81 10.63 8.37-10.08 5.98-5.48-1.25z" />
      <path d="M7.51 20.08h-5.2a.24.24 0 1 1 0-.49h5.2a.24.24 0 1 1 0 .49zm-3.34-1.05H2.3a.24.24 0 0 1 0-.49h1.87a.24.24 0 0 1 .23.34.24.24 0 0 1-.23.15z" />
      <path fill={colors.white} d="M12.06 14.25a.3.3 0 0 1-.11-.02l-6.5-2.7V3.08a.28.28 0 0 1 .27-.28H18.2a.28.28 0 0 1 .28.28v8.46h-.01l-6.29 2.69a.3.3 0 0 1-.12.02z" />
      <path fill={colors.gunPowder} d="M12.13 14.23a.24.24 0 0 1-.12-.03l-6.52-2.7V3.04a.3.3 0 0 1 .3-.3h12.48a.3.3 0 0 1 .3.3v8.46l-6.31 2.7a.33.33 0 0 1-.13.03zm-6.56-2.79 6.47 2.69c.06.02.12.02.18 0l6.27-2.68V3.04a.22.22 0 0 0-.22-.22H5.79a.22.22 0 0 0-.22.22z" />
      <path fill={colors.gunPowder} d="M23.16 9.5h-.01l-10.94 4.67a.2.2 0 0 1-.16 0l-6.52-2.7L.8 9.5H.79a.28.28 0 0 0-.29.28v12.23a.28.28 0 0 0 .28.29h22.38a.28.28 0 0 0 .28-.29V9.78a.28.28 0 0 0-.28-.28zm.2 12.51a.2.2 0 0 1-.2.2H.78a.2.2 0 0 1-.2-.2V9.78a.2.2 0 0 1 .2-.2l11.24 4.66c.07.03.15.03.22 0l6.29-2.68 4.64-1.98a.2.2 0 0 1 .19.2z" />
      <path d="M12.07 11.53a3.06 3.06 0 1 0 0-6.12 3.06 3.06 0 0 0 0 6.12z" />
      <path fill={colors.white} d="m11.78 9.76-.92-1.17.54-.42.43.56 1.47-1.55.49.47z" />
    </SvgIcon>
  );
};

export default FormReceivedIcon;
