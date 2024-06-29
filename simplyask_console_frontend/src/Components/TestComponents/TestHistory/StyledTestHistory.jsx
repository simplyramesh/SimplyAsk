import styled from '@emotion/styled';
import { LoadingButton } from '@mui/lab';

import { StyledFlex, StyledText } from '../../shared/styles/styled';

export const CustomLoadingButton = styled(LoadingButton)(() => ({
  height: '42px',
  border: '2px solid #C9C9C9',
  padding: '7px 24px 7px 34px',
  borderRadius: '10px',
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 15,
  fontWeight: 600,
  lineHeight: 1.5,
}));

export const TagsSideBarGreyBackgroundRounded = styled(StyledFlex)((props) => ({
  color: props.theme.colors.black,
  backgroundColor: props.theme.colors.athensGray,
  borderRadius: '7px',
  padding: '5px 10px',
  fontSize: '14px',
}));

export const RoundedGreyOnHoverEffect = styled(StyledFlex)((props) => ({
  '&:hover': {
    backgroundColor: props.theme.colors.stormyGrey,
    borderRadius: '10px',
  },
}));

export const StyledTextHoverUnderline = styled(StyledText)(() => ({
  '&:hover': {
    textDecoration: 'underline',
  },
}));
