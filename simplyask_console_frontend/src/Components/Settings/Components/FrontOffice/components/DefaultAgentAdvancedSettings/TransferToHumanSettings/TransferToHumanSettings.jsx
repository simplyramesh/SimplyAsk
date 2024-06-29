import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import CanadianFlagIcon from '../../../../../../../Assets/icons/canadianFlag.svg?component';
import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomSidebar from '../../../../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import {
  ALL_DAY_STRING,
  CUSTOM_STRING,
  DAYS_OF_WEEK,
  ELEVEN_FIFTY_NINE_PM,
  FIVE_PM,
  NINE_AM,
  STANDARD_BUSINESS_HOUR_STRING,
  TWELVE_AM,
} from '../../../constants/common';
import { convertTo12HourFormat, get24HourFormatTimes, hasNonNullValue, isUndefined } from '../../../utils/helpers';
import CustomAvailabilityUnsavedChangesModal from '../CustomAvailabilityUnsavedChangesModal/CustomAvailabilityUnsavedChangesModal';
import EditHumanTransferAvailability from '../EditHumanTransferAvailability/EditHumanTransferAvailability';
import EditPhoneNumberModal from '../EditPhoneNumberModal/EditPhoneNumberModal';

const TransferToHumanSettings = ({ agentConfig, onChange, isPanelView }) => {
  const { colors } = useTheme();
  const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [availabilityState, setAvailabilityState] = useState({
    timezone: defaultTimezone,
    availabilityType: ALL_DAY_STRING,
    weekStartTime: Array.from({ length: 7 }),
    weekEndTime: Array.from({ length: 7 }),
    shouldUpdate: false,
  });
  const [localAvailabilityState, setLocalAvailabilityState] = useState(availabilityState);

  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [isEditPhoneNumberModalOpen, setIsEditPhoneNumberModalOpen] = useState(false);
  const [isEditAvailabilityOpen, setIsEditAvailabilityOpen] = useState(false);

  const [isValidAvailabilityTimeRange, setIsValidAvailabilityTimeRange] = useState(
    Array.from({ length: 7 }, () => true)
  );

  useEffect(() => {
    presetSavedAvailabilityData(agentConfig?.availableTransfers);
  }, [agentConfig?.availableTransfers]);

  useEffect(() => {
    const { availabilityType: type } = availabilityState;

    setLocalAvailabilityState(availabilityState);

    if (type === ALL_DAY_STRING || type === STANDARD_BUSINESS_HOUR_STRING) {
      saveDefaultAllDayOrStandardHoursSetting(type);
    }

    if (type === CUSTOM_STRING) {
      if (!isValidAvailabilityTimeRange.includes(false)) {
        saveCustomAvailabilitySetting();
      } else {
        toast.error('Cannot save changes. Please select valid time range');
      }
    }
  }, [availabilityState]);

  const getWeekTimeData = (time, availableTransfers) => {
    const timesArray = Array.from({ length: 7 });

    availableTransfers.forEach((obj) => {
      const capitalizedWeekDay = obj?.weekDay.charAt(0) + obj?.weekDay.slice(1).toLowerCase();
      timesArray[DAYS_OF_WEEK.indexOf(capitalizedWeekDay)] = convertTo12HourFormat(obj?.[time]);
    });
    return timesArray;
  };

  const presetSavedAvailabilityData = (availableTransfers) => {
    if (!availableTransfers || availableTransfers.length === 0) {
      return;
    }

    const timezone = availableTransfers[0]?.zoneId;

    if (availableTransfers.length === 5) {
      setAvailabilityState((prev) => ({
        ...prev,
        timezone,
        availabilityType: STANDARD_BUSINESS_HOUR_STRING,
        shouldUpdate: false,
      }));

      return;
    }

    if (
      availableTransfers.some(
        (transfer) =>
          convertTo12HourFormat(transfer.startTime) !== TWELVE_AM ||
          convertTo12HourFormat(transfer.endTime) !== ELEVEN_FIFTY_NINE_PM
      )
    ) {
      setAvailabilityState((prev) => ({
        ...prev,
        timezone,
        availabilityType: CUSTOM_STRING,
        weekStartTime: getWeekTimeData('startTime', availableTransfers),
        weekEndTime: getWeekTimeData('endTime', availableTransfers),
        shouldUpdate: false,
      }));
    }
  };

  const getAvailableTransfersPayload = (availableTransferStartTimes, availableTransferEndTimes) =>
    availableTransferStartTimes.map((time, index) => ({
      weekDay: DAYS_OF_WEEK[index].toUpperCase(),
      startTime: isUndefined(time) ? undefined : availableTransferStartTimes[index],
      endTime: isUndefined(time) ? undefined : availableTransferEndTimes[index],
      zoneId: availabilityState.timezone,
    }));

  const saveDefaultAllDayOrStandardHoursSetting = (timeString) => {
    let availableTransferStartTimes;
    let availableTransferEndTimes;

    if (timeString === ALL_DAY_STRING) {
      availableTransferStartTimes = get24HourFormatTimes(TWELVE_AM);
      availableTransferEndTimes = get24HourFormatTimes(ELEVEN_FIFTY_NINE_PM);
    } else {
      availableTransferStartTimes = get24HourFormatTimes(NINE_AM, true);
      availableTransferEndTimes = get24HourFormatTimes(FIVE_PM, true);
    }

    const availableTransfers = getAvailableTransfersPayload(availableTransferStartTimes, availableTransferEndTimes);

    if (availabilityState.shouldUpdate) {
      onEditTransferAvailabilitySave(availableTransfers);
    }
  };

  const saveCustomAvailabilitySetting = () => {
    const { weekStartTime, weekEndTime } = availabilityState;

    const availableTransfersStartTime = weekStartTime.map((element) => get24HourFormatTimes(element, true, false));
    const availableTransfersEndTime = weekEndTime.map((element) => get24HourFormatTimes(element, true, false));
    const availableTransfers = getAvailableTransfersPayload(availableTransfersStartTime, availableTransfersEndTime);

    if (availabilityState.shouldUpdate) {
      onEditTransferAvailabilitySave(availableTransfers);
    }
  };

  const onEditTransferAvailabilitySave = (availableTransfers) => {
    onChange({ availableTransfers });
  };

  const onEditPhoneNumberSave = (transferPhoneNumber) => {
    onChange({ transferPhoneNumber });
  };

  const onLocalStateSave = () => {
    setAvailabilityState({
      ...localAvailabilityState,
      shouldUpdate: true,
    });
    setIsEditAvailabilityOpen(false);
  };

  const onAvailabilityStateUpdate = (event) => {
    setAvailabilityState((prev) => ({
      ...prev,
      ...event,
      shouldUpdate: true,
    }));
  };

  const onLocalAvailabilityStateUpdate = (event) => {
    setLocalAvailabilityState((prev) => ({
      ...prev,
      ...event,
    }));
  };

  return (
    <StyledFlex>
      <StyledDivider m="30px 0" color={colors.platinum} borderWidth={1.5} orientation="horizontal" />
      <StyledFlex display="flex" flexDirection="column" alignItems="flex-start" gap="15px" alignSelf="stretch">
        <StyledFlex
          display="flex"
          width="100%"
          height="60px"
          flexDirection="column"
          justifyContent="space-between"
          mb="16px"
        >
          <StyledText weight="600" size={19} lh={28}>
            Human Transfer Availability
          </StyledText>
          <StyledText>Select the time and days when transferring to a live agent is available for users</StyledText>
        </StyledFlex>

        {!isPanelView && (
          <>
            <StyledFlex
              display="flex"
              width="530px"
              padding="15px"
              flex-direction="column"
              justify-content="center"
              align-items="flex-start"
              gap="15px"
              backgroundColor={colors.lightGrayBlue}
              borderRadius="10px"
            >
              <StyledText weight="600">Current Availability</StyledText>
              <StyledDivider color={colors.platinum} borderWidth={1.5} orientation="horizontal" />
              <StyledFlex display="flex" alignItems="flex-start" gap="10px" alignSelf="stretch">
                <CustomAvailabilityValue
                  savedCurrentAvailabilityLabel={availabilityState.availabilityType}
                  timeZoneValue={availabilityState.timezone}
                  customStartTimesArray={availabilityState.weekStartTime}
                  customEndTimesArray={availabilityState.weekEndTime}
                />
              </StyledFlex>
            </StyledFlex>
            <StyledButton variant="contained" tertiary onClick={() => setIsEditAvailabilityOpen(true)}>
              Edit
            </StyledButton>
          </>
        )}

        {isPanelView && (
          <EditHumanTransferAvailability
            availabilityState={availabilityState}
            isValidCustomAvailabilityTimeRange={isValidAvailabilityTimeRange}
            setIsValidCustomAvailabilityTimeRange={setIsValidAvailabilityTimeRange}
            onChange={onAvailabilityStateUpdate}
          />
        )}
      </StyledFlex>

      <StyledFlex
        display="flex"
        flex-direction="column"
        align-items="flex-start"
        gap="15px"
        alignSelf="stretch"
        marginTop="30px"
      >
        <StyledFlex display="flex" flex-direction="column" align-items="flex-start" gap="5px" maxWidth="810px">
          <StyledText weight="600">Transfer Phone Number</StyledText>
          <StyledText>
            Enter the phone number to transfer calls to when within available hours. Currently, only North American
            phone numbers are supported for transferring.
            <StyledText mt="24">
              <StyledText display="inline" weight="600" color={colors.statusOverdue}>
                Warning:{' '}
              </StyledText>
              Transfers on voice channel conversations will fail if Transfer Phone Number is not entered.
            </StyledText>
          </StyledText>
        </StyledFlex>
        <StyledFlex display="flex" alignItems="center" gap="15px" alignSelf="stretch" direction="row">
          <StyledFlex
            display="flex"
            width="457px"
            height="40px"
            backgroundColor={colors.accordionHover}
            direction="row"
          >
            <StyledFlex margin="12px">
              <CanadianFlagIcon width="28px" height="15px" />
            </StyledFlex>
            <StyledText weight="500" size="15" width="348px" height="23px" color={colors.sonicSilver} mt="8" mb="9">
              {agentConfig?.transferPhoneNumber}
            </StyledText>
          </StyledFlex>

          <StyledButton variant="contained" tertiary onClick={() => setIsEditPhoneNumberModalOpen(true)}>
            Edit
          </StyledButton>
        </StyledFlex>
      </StyledFlex>

      {!isPanelView && (
        <CustomSidebar
          open={isEditAvailabilityOpen}
          onClose={() => {
            if (
              availabilityState.availabilityType === CUSTOM_STRING &&
              hasNonNullValue(availabilityState.weekStartTime)
            ) {
              setShowUnsavedModal(true);
            } else {
              setIsEditAvailabilityOpen(false);
            }
          }}
          headStyleType="filter"
          width={720}
          sx={{ paddingTop: '18px' }}
          customHeaderActionTemplate={
            <StyledButton primary variant="contained" onClick={onLocalStateSave}>
              Save
            </StyledButton>
          }
        >
          {() => (
            <StyledFlex margin="0px 0px 30px 0px">
              <StyledFlex display="flex" width="600px" padding="0px 30px" marginTop="10px">
                <StyledText size={19} weight={600} lh={28}>
                  Edit Human Transfer Availability
                </StyledText>
              </StyledFlex>
              <StyledDivider m="30px 0" color={colors.platinum} height="2px" orientation="horizontal" />
              <StyledFlex p="0 30px">
                <EditHumanTransferAvailability
                  availabilityState={localAvailabilityState}
                  isValidCustomAvailabilityTimeRange={isValidAvailabilityTimeRange}
                  setIsValidCustomAvailabilityTimeRange={setIsValidAvailabilityTimeRange}
                  onChange={onLocalAvailabilityStateUpdate}
                />
              </StyledFlex>
            </StyledFlex>
          )}
        </CustomSidebar>
      )}

      <EditPhoneNumberModal
        isOpen={isEditPhoneNumberModalOpen}
        onClose={setIsEditPhoneNumberModalOpen}
        onSave={onEditPhoneNumberSave}
      />

      <CustomAvailabilityUnsavedChangesModal
        isPortalOpen={showUnsavedModal}
        onStay={() => {
          if (!isValidAvailabilityTimeRange.includes(false)) {
            saveCustomAvailabilitySetting();
          } else {
            toast.error('Cannot save changes. Please select valid time range');
            return;
          }

          setIsEditAvailabilityOpen(false);
          setShowUnsavedModal(false);
        }}
        onDiscard={() => {
          setShowUnsavedModal(false);
          setIsEditAvailabilityOpen(false);
        }}
        onClose={() => setShowUnsavedModal(false)}
        hasBgColor={false}
        yellowWarningIcon
      />
    </StyledFlex>
  );
};

const CustomAvailabilityValue = ({
  savedCurrentAvailabilityLabel,
  timeZoneValue,
  customStartTimesArray,
  customEndTimesArray,
}) => {
  const returnCustomAvailabilityValue = (index, timeZoneValue) => {
    const timeStr = `${customStartTimesArray[index]} - ${customEndTimesArray[index]}`;
    if (timeStr === `${TWELVE_AM} - ${ELEVEN_FIFTY_NINE_PM}`) {
      return 'All day';
    }
    return `${customStartTimesArray[index]} - ${customEndTimesArray[index]}, ${timeZoneValue}`;
  };

  return savedCurrentAvailabilityLabel === CUSTOM_STRING ? (
    <>
      {DAYS_OF_WEEK.map((day, index) => (
        <React.Fragment key={day}>
          <StyledText lh="24">
            <StyledText size="16" weight="600" display="inline">
              {day}:{' '}
            </StyledText>
            <StyledText display="inline">
              {customStartTimesArray[index] === undefined
                ? 'unavailable'
                : returnCustomAvailabilityValue(index, timeZoneValue)}
            </StyledText>
          </StyledText>
        </React.Fragment>
      ))}
    </>
  ) : (
    <>
      <StyledText lh="24">{savedCurrentAvailabilityLabel}</StyledText>
      <StyledText lh="24">{timeZoneValue}</StyledText>
    </>
  );
};

export default TransferToHumanSettings;
