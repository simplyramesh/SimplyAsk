import styled from '@emotion/styled';
import { StyledIconButton } from '../../../../../shared/styles/styled';

export const StyledAgentEditorHeadIconWrapper = styled(StyledIconButton, {
  shouldForwardProp: (prop) => !['icon', 'isDisabled', 'active'].includes(prop),
})(({ theme, isDisabled, active }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  backgroundColor: !active ? 'transparent' : theme.colors.tableEditableCellBg,
  color: !isDisabled ? theme.colors.primary : `${theme.colors.primary}40`,
  cursor: !isDisabled ? 'pointer' : 'default',

  '&:hover': {
    ...(!isDisabled && { backgroundColor: theme.colors.tableEditableCellBg }),
  },

  '& svg': {
    width: '22px',
    height: '22px',
  },

  '& .MuiSvgIcon-root': {
    fontSize: '22px',
  },
}));
