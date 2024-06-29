import styled from '@emotion/styled';
import { Tooltip, tooltipClasses } from '@mui/material';

import BaseTextInput from '../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';

export const StyledAddActivityInput = styled(BaseTextInput, {
  shouldForwardProp: (prop) => !['borderColor'].includes(prop),
})`
  border: none;
  background-color: transparent;
  border-radius: 0;
  height: 33px;
  padding: 0;
  font-size: 14px;
  cursor: pointer;

  &:focus,
  &:active {
    border: none;
    outline: none;
    cursor: text;
  }

  ::placeholder {
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 17px;
    color: ${({ theme }) => `${theme.colors.black}50`};
  }
`;

export const StyledFalloutDetailsStatusTooltip = styled(
  ({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />,
  {
    shouldForwardProp: (prop) => !['isResolved'].includes(prop),
  }
)(({ theme, isResolved }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    width: isResolved ? '319px' : '457px',
    maxWidth: '457px',
    boxShadow: theme.boxShadows.box,
    borderRadius: '25px',
    padding: isResolved ? '7px 12px' : '12px 8px 15px 19px',
    backgroundColor: theme.colors.bgColorOptionTwo,
    color: theme.colors.primary,
    fontFamily: 'Montserrat',
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '21px',
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.colors.bgColorOptionTwo,
    width: '22px',
    height: '17px',

    '&::before': {
      content: '""',
      borderRadius: '5px 0 5px 0',
      // boxShadow: theme.boxShadows.box,
    },
  },

  '&[data-popper-placement*="top"]': {
    [`& .${tooltipClasses.arrow}`]: {
      bottom: '-7.8px',
    },
  },
}));
