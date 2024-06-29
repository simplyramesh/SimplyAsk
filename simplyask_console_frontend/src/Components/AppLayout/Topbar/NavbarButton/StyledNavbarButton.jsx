import styled from '@emotion/styled';

export const StyledNavbarButton = styled('div')((props) => ({
  position: 'relative',
  height: '44px',
  width: '44px',
  borderRadius: '100%',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'background-color 0.3s',

  '&:hover': {
    backgroundColor: props.theme.colors.accordionBgHover,

    '&:before': {
      borderColor: props.theme.colors.accordionBgHover,
    },
  },

  ...(props.disabled && {
    opacity: 0.5,
    pointerEvents: 'none',
  }),

  ...(props.unread && {
    '&:before': {
      content: '""',
      position: 'absolute',
      height: '12px',
      width: '12px',
      right: '6px',
      top: '6px',
      borderRadius: '100%',
      border: `2px solid ${props.theme.colors.white}`,
      backgroundColor: props.theme.colors.iconColorOrange,
      transition: 'border-color 0.3s',
    },
  }),
}));
