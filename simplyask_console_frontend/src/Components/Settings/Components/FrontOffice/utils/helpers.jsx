import moment from 'moment-timezone';
import { parseISO, format, parse, isSameMinute, isAfter } from 'date-fns';
import { ISSUE_ENTITY_TYPE } from "../../../../Issues/constants/core";
import { DAYS_OF_WEEK, ELEVEN_FIFTY_NINE_PM, TWELVE_AM } from '../constants/common';
import { USER_IDENTIFICATION_BLOCK } from '../constants/defaultAgentAdvanceSettingsConstants';

export const SERVICE_TICKET_TYPES_FILTER_KEY = 'sideFilter';
export const CHAT_WIDGETS_FILTER_KEY = SERVICE_TICKET_TYPES_FILTER_KEY;
export const PHONE_NUMBER_MANAGEMENT_KEY = SERVICE_TICKET_TYPES_FILTER_KEY;

export const serviceTicketTypesFiltersMeta = {
  key: SERVICE_TICKET_TYPES_FILTER_KEY,
  formatter: {
    updatedDate: ({ v, k }) => ({
      label: 'Last Updated',
      value: v?.label || '',
      k,
    }),
    createdDate: ({ v, k }) => ({
      label: 'Created Date',
      value: v?.label || '',
      k,
    }),
  },
};

export const serviceTicketTypeFormatter = (values) => ({
  ...(values[SERVICE_TICKET_TYPES_FILTER_KEY].createdDate?.filterValue && values[SERVICE_TICKET_TYPES_FILTER_KEY].createdDate?.filterValue),
  ...(values[SERVICE_TICKET_TYPES_FILTER_KEY].updatedDate?.filterValue && values[SERVICE_TICKET_TYPES_FILTER_KEY].updatedDate?.filterValue),
  search: values[SERVICE_TICKET_TYPES_FILTER_KEY].searchText || '',
  timezone: values.timezone || '',
  category: values.category,
});

export const chatWidgetSearchFormatter = (values) => ({
  ...(values[CHAT_WIDGETS_FILTER_KEY].createdDate?.filterValue && values[CHAT_WIDGETS_FILTER_KEY].createdDate?.filterValue),
  ...(values[CHAT_WIDGETS_FILTER_KEY].updatedDate?.filterValue && values[CHAT_WIDGETS_FILTER_KEY].updatedDate?.filterValue),
  search: values[CHAT_WIDGETS_FILTER_KEY].searchText || '',
  timezone: values.timezone || '',
  agentIds: values[CHAT_WIDGETS_FILTER_KEY]?.agents?.map((item) => item.value)
});

export const phoneNumberManagementSearchFormatter = (values) => {
  const countryValue = values[PHONE_NUMBER_MANAGEMENT_KEY]?.country?.label?.split(' (+1)')
  return (
    {
      ...(values[PHONE_NUMBER_MANAGEMENT_KEY].createdDate?.filterValue && values[PHONE_NUMBER_MANAGEMENT_KEY].createdDate?.filterValue),
      search: values[PHONE_NUMBER_MANAGEMENT_KEY].searchText || '',
      timezone: values.timezone || '',
      country: countryValue ?  countryValue[0] : '',
      province: values[PHONE_NUMBER_MANAGEMENT_KEY]?.province?.value || '',
      region: values[PHONE_NUMBER_MANAGEMENT_KEY]?.region?.label?.toUpperCase() || '',
      isActive: true,
    })};

export const hasNonNullValue = (arr) => {
  return arr.some((element) => element !== undefined && element !== null);
}


export const get24HourFormatTimes = (timeStr, weekdaysOnly = false, timesArray = true) => {

  if (timeStr === undefined || timeStr === null) {
    return timeStr;
  }

  const inputTime = moment(timeStr, "h:mm A");

  if (timesArray) {
    const offsetTimes = [];
    for (let i = 0; i < (weekdaysOnly ? 5 : 7); i++) {
      const offsetTime = inputTime
        .clone()
        .format("HH:mm:ss");

      offsetTimes.push(offsetTime);
    }
    return offsetTimes;
  } else {
    return inputTime
      .clone()
      .format("HH:mm:ss");
  }
}

export const validateTimeRange = (startTimeObj, endTimeObj) => {
  // Parse start and end times
  const startTime = parse(startTimeObj.time, 'h:mm aa', new Date());
  const endTime = parse(endTimeObj.time, 'h:mm aa', new Date());

  // Validation 1: Start and end time should not be the same
  if (isSameMinute(startTime, endTime)) {
    return false;
  }

  // Validation 2: End time should not be more than 11:59 PM
  const maxEndTime = parse('11:59 PM', 'h:mm aa', new Date());
  if (isAfter(endTime, maxEndTime)) {
    return false;
  }

  // Validation 3: Start time should be less than end time
  if (isAfter(startTime, endTime)) {
    return false;
  }

  return true;
};


export const extractTimeInfo = (timeStr) => {
  if (timeStr === null || timeStr === undefined) {
    return null;
  }

  const timeStrParts = timeStr.split(' ');

  if (timeStrParts.length === 2) {
    const timePart = timeStrParts[0];
    const [hour, minute] = timePart.split(':');
    const amPm = timeStrParts[1];

    return {
      amPm,
      hour,
      minute
    };
  }

  return null;
}

export const getDefaultAvailableTransfers = () => {
  const defaultAvailableTransferStartTimes = get24HourFormatTimes(TWELVE_AM);
  const defaultAvailableTransferEndTimes = get24HourFormatTimes(ELEVEN_FIFTY_NINE_PM);
  const availableTransfers = defaultAvailableTransferStartTimes.map((_, index) => ({
    weekDay: DAYS_OF_WEEK[index].toUpperCase(),
    startTime: defaultAvailableTransferStartTimes[index],
    endTime: defaultAvailableTransferEndTimes[index],
    zoneId: Intl.DateTimeFormat().resolvedOptions().timeZone
  }));

  return availableTransfers;
}

export const getAgentConfigInitialData = (agentConfig) => {
  return {
    transferToHuman: false,
    autoIdentifyUserInfo: false,
    collectFullName: true,
    collectFirstName: false,
    collectLastName: false,
    collectEmail: true,
    collectPhoneNumber: true,
    collectionOption: USER_IDENTIFICATION_BLOCK.RADIO_INPUT_LABEL.UPON_TRANSFER_REQUEST,
    transferPhoneNumber: 'No phone number has been entered yet...',
    availableTransfers: agentConfig && agentConfig.availableTransfers?.length > 0
      ? agentConfig.availableTransfers
      : getDefaultAvailableTransfers(),
  }
}

export const isUndefined = (str) => {
  return str === undefined
}
export const convertTo12HourFormat = (inputUTCTimeStr) => {

  if (!inputUTCTimeStr) {
    return undefined;
  }

  const inputTimeStr = inputUTCTimeStr.replace('Z', '');
  const date = parseISO(`1970-01-01T${inputTimeStr}`);

  if (isNaN(date)) {
    return undefined;
  }

  return format(date, 'h:mm a');
}

export const chatWidgetsFiltersMeta = {
  key: CHAT_WIDGETS_FILTER_KEY,
  formatter: {
    updatedDate: ({ v, k }) => ({
      label: 'Last Updated',
      value: v?.label || '',
      k,
    }),
    createdDate: ({ v, k }) => ({
      label: 'Created Date',
      value: v?.label || '',
      k,
    }),
  },
};

export const phoneNumberManagementFiltersMeta = {
  key: PHONE_NUMBER_MANAGEMENT_KEY,
  formatter: {
    createdDate: ({ v, k }) => ({
      label: 'Created Date',
      value: v?.label || '',
      k,
    }),
  },
};

export const linkedAgentEntityMapper = (agent) => ({
  name: agent.name,
  agentId: agent.agentId,
  description: agent.agentId,
  type: ISSUE_ENTITY_TYPE.AGENT
})
