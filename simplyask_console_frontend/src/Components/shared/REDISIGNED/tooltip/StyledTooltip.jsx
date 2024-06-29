import { Tooltip, tooltipClasses } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

export const StyledTooltip = styled(
  ({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />,
  {
    shouldForwardProp: (prop) =>
      ![
        'maxWidth',
        'p',
        'ff',
        'size',
        'lh',
        'weight',
        'radius',
        'color',
        'bgTooltip',
        'textAlign',
        'boxShadow',
        'dropShadow',
      ].includes(prop),
  }
)(({ maxWidth, p, ff, size, lh, weight, radius, color, bgTooltip, textAlign, boxShadow, width, dropShadow }) => {
  const { colors } = useTheme();
  return {
    zIndex: 6001,

    [`& .${tooltipClasses.tooltip}`]: {
      width: width || 'auto',
      maxWidth: maxWidth || '214px',
      padding: p || '14px 22px',
      fontFamily: ff || 'Montserrat',
      fontSize: size || '14px',
      lineHeight: lh || 'inherit',
      fontWeight: weight || 400,
      color: color || colors.white,
      textAlign: textAlign || 'center',
      background: bgTooltip || colors.primary,
      borderRadius: radius || '10px',
      boxShadow: boxShadow || 'none',
      filter: dropShadow || 'none',
    },

    [`& .${tooltipClasses.arrow}`]: {
      color: bgTooltip || colors.primary,

      '&:before': {
        borderRadius: '0 0 5px 0',
      },
    },
  };
});
