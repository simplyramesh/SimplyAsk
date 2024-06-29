import { useTheme } from '@mui/material/styles';
import React from 'react';
import { StyledDivider, StyledFlex } from '../../../../../../shared/styles/styled';
import CustomAvailabilitySetting from './CustomAvailabilitySetting';
import { DAYS_OF_WEEK } from '../../../constants/common';

const CustomAvailability = ({
  weekStartTime,
  weekEndTime,
  setIsValidCustomAvailabilityTimeRange,
  isValidCustomAvailabilityTimeRange,
  onChange,
}) => {
  const { colors } = useTheme();

  return (
    <>
      <StyledFlex
        display="flex"
        flexDirection="column"
        gap="15px"
        alignSelf="stretch"
      >
        {weekStartTime.map((_, index) => (
          <React.Fragment key={index}>
            <CustomAvailabilitySetting
              day={DAYS_OF_WEEK[index]}
              index={index}
              weekStartTime={weekStartTime}
              weekEndTime={weekEndTime}
              setIsValidCustomAvailabilityTimeRange={setIsValidCustomAvailabilityTimeRange}
              isValidCustomAvailabilityTimeRange={isValidCustomAvailabilityTimeRange}
              onChange={onChange}
            />
            {index < DAYS_OF_WEEK.length - 1 && (
              <StyledDivider color={colors.platinum} borderWidth={1.5} orientation="horizontal" />
            )}
          </React.Fragment>
        ))}
      </StyledFlex>
    </>
  )
}

export default CustomAvailability;