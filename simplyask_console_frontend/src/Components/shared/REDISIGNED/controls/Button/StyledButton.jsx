import styled from '@emotion/styled';
import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';

const getBaseButtonStyles = ({
  theme,
  variant,
  primary,
  color,
  secondary,
  tertiary,
  grey,
  size,
  loading,
  fullWidth,
  danger,
  alignSelf,
  minWidth,
  fontWeight,
  fontSize,
  justifycontent,
  disabledbgcolor,
  transparent,
  textAlign,
  cursor,
  borderRadius,
}) => ({
  padding: '6px 20px',
  border: '2px solid',
  borderRadius: borderRadius || '10px',
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: fontSize || 15,
  fontWeight: 600,
  lineHeight: 1.5,
  textAlign: textAlign || 'unset',
  justifyContent: justifycontent || 'center',
  cursor: cursor || 'pointer',

  ...(variant === 'text' && {
    minWidth: 0,
    padding: 0,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    color: theme.colors.linkColor,
    alignSelf: alignSelf || 'unset',
    fontWeight: fontWeight || 500,

    ...(color === 'primary' && {
      color: theme.colors.primary,

      ...(loading && {
        color: 'transparent !important',

        '& > *': {
          color: `${theme.colors.primary} !important`,
        },
      }),
    }),

    '&:hover': {
      backgroundColor: 'transparent',
      opacity: 0.85,
    },
  }),

  // CONTAINED (FILLED) VARIANT
  ...(variant === 'contained' && {
    // PRIMARY
    ...(primary && {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
      color: theme.colors.white,

      '&:hover': {
        backgroundColor: theme.colors.white,
        borderColor: theme.colors.primary,
        color: theme.colors.primary,
        boxShadow: 'none',
      },

      ...(loading && {
        opacity: '1 !important',
        color: 'transparent !important',
        backgroundColor: `${theme.colors.primary} !important`,
        borderColor: `${theme.colors.primary} !important`,

        '& > *': {
          color: `${theme.colors.white} !important`,
        },
      }),
    }),

    // SECONDARY
    ...(secondary && {
      backgroundColor: theme.colors.secondary,
      borderColor: theme.colors.secondary,
      color: theme.colors.white,

      '&:hover': {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
        color: theme.colors.white,
        boxShadow: 'none',
      },

      ...(loading && {
        opacity: '1 !important',
        color: 'transparent !important',
        backgroundColor: `${theme.colors.secondary} !important`,
        borderColor: `${theme.colors.secondary} !important`,

        '& > *': {
          color: `${theme.colors.white} !important`,
        },
      }),
    }),

    // TERTIARY
    ...(tertiary && {
      backgroundColor: theme.colors.tertiary,
      borderColor: theme.colors.tertiary,
      color: theme.colors.primary,

      '&:hover': {
        backgroundColor: theme.colors.tertiaryHover,
        borderColor: theme.colors.tertiaryHover,
        color: theme.colors.primary,
        boxShadow: 'none',
      },

      ...(loading && {
        opacity: '1 !important',
        color: 'transparent !important',
        backgroundColor: `${theme.colors.tertiary} !important`,
        borderColor: `${theme.colors.tertiary} !important`,

        '& > *': {
          color: `${theme.colors.primary} !important`,
        },
      }),
    }),

    // DANGER
    ...(danger && {
      backgroundColor: theme.colors.statusOverdue,
      borderColor: theme.colors.statusOverdue,
      color: theme.colors.white,

      '&:hover': {
        backgroundColor: theme.colors.statusOverdue,
        borderColor: theme.colors.statusOverdue,
        color: theme.colors.white,
        boxShadow: 'none',
      },

      ...(loading && {
        opacity: '1 !important',
        color: 'transparent !important',
        backgroundColor: `${theme.colors.statusOverdue} !important`,
        borderColor: `${theme.colors.statusOverdue} !important`,

        '& > *': {
          color: `${theme.colors.white} !important`,
        },
      }),
    }),
  }),
  // OUTLINED VARIANT
  ...(variant === 'outlined' && {
    // PRIMARY
    ...(primary && {
      backgroundColor: theme.colors.white,
      borderColor: theme.colors.primary,
      color: theme.colors.primary,

      '&:hover': {
        border: '2px solid',
        backgroundColor: theme.colors.primary,
        color: theme.colors.white,
        boxShadow: 'none',
      },

      ...(loading && {
        opacity: '1 !important',
        color: 'transparent !important',
        backgroundColor: `${theme.colors.white} !important`,
        borderColor: `${theme.colors.primary} !important`,

        '& > *': {
          color: `${theme.colors.primary} !important`,
        },
      }),
    }),

    // SECONDARY
    ...(secondary && {
      backgroundColor: theme.colors.white,
      borderColor: theme.colors.secondary,
      color: theme.colors.secondary,

      '&:hover': {
        border: '2px solid',
        backgroundColor: theme.colors.secondary,
        borderColor: theme.colors.secondary,
        color: theme.colors.white,
        boxShadow: 'none',
      },

      ...(loading && {
        opacity: '1 !important',
        color: 'transparent !important',
        backgroundColor: `${theme.colors.white} !important`,
        borderColor: `${theme.colors.secondary} !important`,

        '& > *': {
          color: `${theme.colors.secondary} !important`,
        },
      }),
    }),

    // TERTIARY
    ...(tertiary && {
      backgroundColor: theme.colors.white,
      borderColor: theme.colors.tertiaryHover,
      color: theme.colors.tertiaryHover,

      '&:hover': {
        border: '2px solid',
        backgroundColor: theme.colors.tertiaryHover,
        borderColor: theme.colors.tertiaryHover,
        color: theme.colors.primary,
        boxShadow: 'none',
      },

      ...(loading && {
        opacity: '1 !important',
        color: 'transparent !important',
        backgroundColor: `${theme.colors.white} !important`,
        borderColor: `${theme.colors.tertiaryHover} !important`,

        '& > *': {
          color: `${theme.colors.tertiaryHover} !important`,
        },
      }),
    }),

    // GREY
    ...(grey && {
      backgroundColor: theme.colors.white,
      borderColor: theme.colors.lightGrey,
      color: theme.colors.primary,

      '&:hover': {
        border: '2px solid',
        backgroundColor: theme.colors.lightGrey,
        color: theme.colors.white,
        boxShadow: 'none',
      },
      ...(loading && {
        opacity: '1 !important',
        color: 'transparent !important',
        backgroundColor: `${theme.colors.white} !important`,
        borderColor: `${theme.colors.primary} !important`,
        '& > *': {
          color: `${theme.colors.primary} !important`,
        },
      }),
    }),

    // DANGER
    ...(danger && {
      backgroundColor: theme.colors.white,
      borderColor: theme.colors.statusOverdue,
      color: theme.colors.statusOverdue,

      '&:hover': {
        border: '2px solid',
        backgroundColor: theme.colors.statusOverdue,
        borderColor: theme.colors.statusOverdue,
        color: theme.colors.white,
        boxShadow: 'none',
      },

      ...(loading && {
        opacity: '1 !important',
        color: 'transparent !important',
        backgroundColor: `${theme.colors.white} !important`,
        borderColor: `${theme.colors.statusOverdue} !important`,

        '& > *': {
          color: `${theme.colors.statusOverdue} !important`,
        },
      }),
    }),
  }),

  // DISABLED
  ...(!danger && {
    ':disabled': {
      opacity: '0.5',
      pointerEvents: 'none',
      backgroundColor: `${disabledbgcolor || theme.colors.lightGray} !important`,
      borderColor: `${theme.colors.lightGray} !important`,
      color: `${theme.colors.primary} !important`,
    },

    ...(loading && {
      '& > span': {
        opacity: 1,
      },
    }),
  }),

  ...(danger && {
    ':disabled': {
      opacity: '0.5',
      pointerEvents: 'none',
      backgroundColor: theme.colors.statusOverdue,
      borderColor: theme.colors.statusOverdue,
      color: theme.colors.white,
    },

    ...(loading && {
      '& > span': {
        opacity: 0,
      },
    }),
  }),

  ...(variant === 'text' && {
    ':disabled': {
      opacity: '0.5',
      pointerEvents: 'none',
      color: theme.colors.lightGray,
    },

    ...(loading && {
      '& > span': {
        opacity: 0,
      },
    }),
  }),

  // SIZES
  ...(size === 'medium' && {
    fontSize: 14,

    ...(variant !== 'text' && {
      padding: '6px 16px',
    }),
  }),

  ...(size === 'small' && {
    fontSize: 12,

    ...(variant !== 'text' && {
      padding: '4px 10px',
    }),
  }),

  ...(minWidth && {
    minWidth,
  }),

  ...(fullWidth && {
    width: '100%',
  }),

  ...(minWidth && {
    minWidth,
  }),

  ...(transparent && {
    backgroundColor: 'transparent',
  }),
});

const options = {
  shouldForwardProp: (prop) =>
    ![
      'primary',
      'secondary',
      'tertiary',
      'grey',
      'alignSelf',
      'textAlign',
      'danger',
      'minWidth',
      'transparent',
      'borderRadius'
    ].includes(prop),
};

export const StyledButton = styled(
  Button,
  options
)((props) => ({
  ...getBaseButtonStyles(props),
}));

export const StyledLoadingButton = styled(
  LoadingButton,
  options
)((props) => ({
  ...getBaseButtonStyles(props),
}));

export const GreyStyledButton = styled(
  Button,
  options
)((props) => ({
  ...getBaseButtonStyles(props),
}));

export const StyledExpandButton = styled.button`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 55px;
  bottom: 90px;
  right: -4px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 15px 0 0 15px;
  border: 0;
  box-shadow: ${({ theme }) => theme.boxShadows.panelExpandButton};
  color: ${({ theme }) => theme.colors.primary};
  transition: color 0.3s;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;
