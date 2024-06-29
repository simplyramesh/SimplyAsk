import styled from '@emotion/styled';

import BaseTextInput from '../../../../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import { StyledFlex } from '../ChatWidgetPreview/ChatWidgetView/components/shared/styles/styled';

export const StyledColorPickerRoot = styled(StyledFlex)((props) => ({
  borderRadius: '10px',
  '&:hover': {
    backgroundColor: props.theme.colors.bgColorOptionTwo,
  },
}));

export const StyledColorTextInput = styled(BaseTextInput)((props) => ({
  justifyContent: 'flex-start',
  textTransform: 'uppercase',
  border: `1px solid ${props.theme.colors.lightGrey}`,
  fontSize: 15,
  fontWeight: 600,
  borderRadius: '10px',
  lineHeight: 1.5,
  paddingLeft: '45px',
  backgroundColor: 'transparent',
  height: '41px',

  '&:hover': {
    color: props.theme.colors.black,
    boxShadow: 'none',
    textTransform: 'uppercase',
  },
}));

export const StyledColorInput = styled.input`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 20px;
  left: 0;
  opacity: 0;
  z-index: 1;
  pointer-events: none;
`;
