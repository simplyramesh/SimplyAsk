import styled from '@emotion/styled';
import { Stack, Tooltip, tooltipClasses } from '@mui/material';

import { media } from '../../../shared/styles/media';
import { StyledFlex } from '../../../shared/styles/styled';

export const StyledIconWrapper = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'iconWidth' && prop !== 'cursor',
})`
  flex-direction: ${({ direction }) => direction || 'row'};
  justify-content: ${({ justifyContent }) => justifyContent || 'center'};
  align-items: ${({ alignItems }) => alignItems || 'center'};

  & svg {
    width: ${({ iconWidth }) => (iconWidth ? `${iconWidth}px` : '24px')};
    height: ${({ iconWidth }) => (iconWidth ? `${iconWidth}px` : '24px')};
    cursor: ${({ cursor }) => cursor || 'pointer'};
  }
`;

export const StyledTruncateTextWrapper = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'maxLines' && prop !== 'isFullText',
})`
  display: -webkit-box;
  max-height: ${({ maxHeight, isFullText }) => (isFullText ? 'unset' : maxHeight || '80px')};
  -webkit-line-clamp: ${({ maxLines, isFullText }) => (isFullText ? 'unset' : maxLines || 2)};
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  & span:last-of-type {
    display: inline;
  }
`;

export const StyledTestRunsInfo = styled(StyledFlex)`
  ${media.md} {
    flex-direction: column;
  }
`;

export const StyledTestRunsInfoData = styled(StyledFlex)`
  ${media.md} {
    flex-basis: auto;
  }
`;

export const StyledTestCasesTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: '382px',
    width: '382px',
    boxShadow: theme.boxShadows.box,
    borderRadius: '25px',
    padding: '12px 18px 14px 12px',
    backgroundColor: theme.colors.bgColorOptionTwo,
    color: theme.colors.primary,
    fontSize: '14px',
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.colors.bgColorOptionTwo,
    width: '46px',
    height: '20px',

    '&::before': {
      content: '""',
      borderRadius: '5px 0 5px 0',
      boxShadow: theme.boxShadows.box,
    },
  },

  '&[data-popper-placement*="top"]': {
    [`& .${tooltipClasses.arrow}`]: {
      bottom: '-10px',
    },
  },
}));
