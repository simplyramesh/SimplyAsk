import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import { StyledMenuItem, StyledTimeRangeInput } from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/menus/CalendarTimeRange/StyledCalendarTimeRange';
import { StyledCustomAvailabilityAmPmSelect } from '../StyledDefaultAgentAdvancedSettings';
import { useTheme } from '@mui/material/styles';
import { useRef } from 'react';

const CustomAvailabilityTimeRange = ({
  onHourChange,
  onMinuteChange,
  onAmPmChange,
  hours,
  minutes,
  amPm,
  onMinutesBlur,
  disabled,
  isCurrentTimeRangeValid
}) => {
  const { colors } = useTheme();
  const anchorRef = useRef(null);

  return (
    <StyledFlex
      direction="row"
      gap="0 6px"
    >
      <StyledFlex
        direction="row"
        alignItems="center"
        justifyContent="center"
        border={`1px solid ${isCurrentTimeRangeValid ? colors.inputBorder : colors.danger}`}
        borderRadius="10px"
        width="81px"
        height="40px"
        gap="0 10px"
        p="10px 0"
        sx={{
          '&:hover': {
            borderColor: colors.primary
          },
          '&:focus-within': {
            borderColor: colors.primary
          }
        }}
      >
        <StyledTimeRangeInput
          autoComplete="off"
          tabIndex="-1"
          placeholder="00"
          value={hours}
          disabled={disabled}
          onChange={onHourChange}
          textAlign="right"
        />
        <StyledText size={15} lh={18} weight={600}>:</StyledText>
        <StyledTimeRangeInput
          tabIndex="-1"
          autoComplete="off"
          placeholder="00"
          value={minutes}
          disabled={disabled}
          onChange={onMinuteChange}
          onBlur={onMinutesBlur}
        />
      </StyledFlex>
      <StyledFlex ref={anchorRef}>
        <StyledCustomAvailabilityAmPmSelect
          tabIndex="-1"
          value={amPm}
          onChange={onAmPmChange}
          isCurrentTimeRangeValid={isCurrentTimeRangeValid}
          disabled={disabled}
          MenuProps={{
            PopoverClasses: {
              root: 'panel-popover'
            },
          }}
        >
          <StyledMenuItem value="AM">AM</StyledMenuItem>
          <StyledMenuItem value="PM">PM</StyledMenuItem>
        </StyledCustomAvailabilityAmPmSelect>
      </StyledFlex>
    </StyledFlex>
  );
};

export default CustomAvailabilityTimeRange;
