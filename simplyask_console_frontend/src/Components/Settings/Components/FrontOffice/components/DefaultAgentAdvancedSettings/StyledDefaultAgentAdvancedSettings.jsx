import styled from '@emotion/styled';
import { StyledBaseTextInput } from '../../../../../shared/REDISIGNED/controls/BaseTextInput/StyledBaseTextInput';
import { StyledFlex, StyledCard } from '../../../../../shared/styles/styled';
import { StyledAmPmSelect } from '../../../../../shared/REDISIGNED/selectMenus/customComponents/menus/CalendarTimeRange/StyledCalendarTimeRange';

export const StyledFlagPhoneNumberInput = styled(StyledBaseTextInput)`
  padding: 10px 16px 10px 55px;
`;

export const StyledDefaultAgentSettingsIconWrapper = styled(StyledFlex)(({ theme }) => ({
  position: 'absolute',
  top: '1px',
  left: '1px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '40px',
  width: '49px',
  border: theme.colors.phonePlusOneBg,
  borderRadius: '10px 0px 0px 10px',
  background: theme.colors.phonePlusOneBg,
  '& svg': {
    width: '28px',
    height: '15px',
  },
}));

export const StyledCustomAvailabilityAmPmSelect = styled(StyledAmPmSelect, {
  shouldForwardProp: (prop) => prop !== 'isCurrentTimeRangeValid',
})`
  width: 70px;
  height: 40px;
  & .MuiInputBase-input {
    padding: 0px 6px 0px 10px;
  }
  & .MuiOutlinedInput-notchedOutline {
    border-radius: inherit;
    border: ${({ theme, isCurrentTimeRangeValid }) =>
      isCurrentTimeRangeValid ? `1px solid ${theme.colors.inputBorder}` : `1px solid ${theme.colors.danger}`};
    &:hover {
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export const StyledUserInfoCollectCard = styled(StyledCard)`
  border: 2px solid ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  border-color: ${({ theme, isChecked }) => (isChecked ? theme.colors.secondary : theme.colors.primary)};
  &:hover {
    background: ${({ theme }) => theme.colors.paleGrayBlue};
  }
`;
