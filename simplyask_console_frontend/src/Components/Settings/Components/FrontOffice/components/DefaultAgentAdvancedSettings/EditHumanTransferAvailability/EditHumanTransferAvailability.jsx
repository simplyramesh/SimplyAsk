import { StyledAccordion, StyledAccordionDetails, StyledDivider, StyledFlex, StyledText } from "../../../../../../shared/styles/styled";
import CustomSelect from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomIndicatorArrow from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import { IconControl } from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/controls/IconControl';
import { IconOption } from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/options/IconOption';
import RadioGroup from '../../../../../AccessManagement/components/inputs/radio/RadioGroup';
import RadioInput from '../../../../../AccessManagement/components/inputs/radio/RadioInput';
import moment from 'moment';
import CustomAvailability from '../CustomAvailability/CustomAvailability';
import { ALL_DAY_STRING, CUSTOM_STRING, STANDARD_BUSINESS_HOUR_STRING } from '../../../constants/common';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from "react";

const EditHumanTransferAvailability = ({
  availabilityState,
  isValidCustomAvailabilityTimeRange,
  setIsValidCustomAvailabilityTimeRange,
  onChange,
}) => {
  const { timezone, availabilityType, weekStartTime, weekEndTime } = availabilityState;
  const { colors } = useTheme();

  const createOptions = (data) => {
    const options = data?.map((item) => ({ value: item, label: item }));
    return options;
  };
  const timeZoneOptions = createOptions(moment.tz.names());
  const [timezoneValue, setTimezoneValue] = useState({ value: timezone, label: timezone });

  useEffect(() => {
    setTimezoneValue({ value: timezone, label: timezone })
  }, [availabilityState]);

  const onTimeZoneChange = (timeZoneOption) => {
    onChange({ timezone: timeZoneOption.value });
  }

  const onAvailabilityChange = (event) => {
    onChange({ availabilityType: event.target.value });
  }

  const onTimeChange = (event) => {
    const { startTime, endTime } = event;

    onChange({
      ...(startTime && { weekStartTime: startTime } ),
      ...(endTime && { weekEndTime: endTime } ),
    })
  }

  return (
    <>
      <StyledFlex
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        alignSelf="stretch"
      >
        <StyledFlex
          display="flex"
          width="100%"
          flexDirection="column"
          alignItems="flex-start"
          gap="12px"
        >
          <StyledFlex
            display="flex"
            alignItems="flex-start"
            gap="10px"
            alignSelf="stretch"
          >
            <StyledText weight="600" lh="24px">
              Time Zone
            </StyledText>
            <StyledText>
              Select the timezone you want the availability to be in
            </StyledText>
          </StyledFlex>
          <StyledFlex width="100%" weight="41px">
            <CustomSelect
              value={timezoneValue}
              options={timeZoneOptions ?? []}
              onChange={onTimeZoneChange}
              isClearable={false}
              isSearchable={true}
              components={{
                DropdownIndicator: CustomIndicatorArrow,
                Control: IconControl,
                Option: IconOption,
              }}
              closeMenuOnSelect
              form
            />
          </StyledFlex>
        </StyledFlex>
      </StyledFlex>
      <StyledDivider m="30px 0" color={colors.platinum} height="2px" width="100%" orientation="horizontal" />
      <StyledFlex
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        alignSelf="stretch"
      >
        <StyledAccordion
          expanded={availabilityState.availabilityType === CUSTOM_STRING || false}
        >
          <StyledFlex
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            gap="15px"
            align-self="stretch"
            width="660px"
            marginBottom="30px"
          >
            <StyledFlex
              display="flex"
              alignItems="flex-start"
              gap="10px"
              alignSelf="stretch"
            >
              <StyledText weight="600" lh="24">
                Availability
              </StyledText>
            </StyledFlex>

            <RadioGroup
              name="availability"
              orientation="column"
            >
              <RadioInput
                label={ALL_DAY_STRING}
                checked={availabilityType === ALL_DAY_STRING}
                value={ALL_DAY_STRING}
                onChange={onAvailabilityChange}
              />
              <RadioInput
                label={STANDARD_BUSINESS_HOUR_STRING}
                checked={availabilityType === STANDARD_BUSINESS_HOUR_STRING}
                value={STANDARD_BUSINESS_HOUR_STRING}
                onChange={onAvailabilityChange}
              />
              <RadioInput
                label={CUSTOM_STRING}
                checked={availabilityType === CUSTOM_STRING}
                value={CUSTOM_STRING}
                onChange={onAvailabilityChange}
              />
            </RadioGroup>
          </StyledFlex>
          <StyledAccordionDetails>
            <CustomAvailability
              weekStartTime={weekStartTime}
              weekEndTime={weekEndTime}
              setIsValidCustomAvailabilityTimeRange={setIsValidCustomAvailabilityTimeRange}
              isValidCustomAvailabilityTimeRange={isValidCustomAvailabilityTimeRange}
              onChange={onTimeChange}
            />
          </StyledAccordionDetails>
        </StyledAccordion>
      </StyledFlex>
    </>
  )
}

export default EditHumanTransferAvailability;
