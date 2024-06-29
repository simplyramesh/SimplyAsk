import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import moment from 'moment';
import { toast } from 'react-toastify';

import colors from '../config/colors';
import routes from '../config/routes';

import { FEATURE_FLAGS } from './featureFlags';

import momentTimezone from 'moment-timezone';

export const DEFAULT_RETURN_VALUE = '---';
export const OBJECT_WILD_CARD_KEY = ''; // returns the whole object

export const isNullOrUndefined = (val) => val === null || val === undefined;
export const isNotNullOrUndefined = (val) => !isNullOrUndefined(val);

export const getFullName = (user) => {
  if (user) {
    return `${user?.firstName} ${user?.lastName}`;
  }

  return 'user';
};

export const getNameInitials = (user, spaceBetween = false) => {
  if (!user?.firstName && !user?.lastName) return '';
  if (!user.lastName && user.firstName.length === 1)
    return `${user.firstName[0]}${spaceBetween ? ' ' : ''}${user.firstName[0]}`;
  if (!user.lastName) return `${user.firstName[0]}${spaceBetween ? ' ' : ''}${user.firstName[1]}`;
  return `${user.firstName[0]}${spaceBetween ? ' ' : ''}${user.lastName[0]}`;
};

export const getDayFromDateString = (str) => {
  const date = moment(str);
  return date.format('YYYY-MM-DD');
};

export const appendHashtag = (str, addSpace = true) => {
  if (addSpace) return `#${str}`;
  return `#${str}`;
};

export const accessObjectProperty = (object, key) => {
  if (key === OBJECT_WILD_CARD_KEY) return object;

  let result;
  // TODO: Should check for array (Array.isArray(object))
  if (typeof key === 'object') {
    const convertedSource = key.map((src) => src.split('.').reduce((o, i) => o[i], object));
    return convertedSource.join(' ');
  }
  try {
    result = key.split('.').reduce((o, i) => o[i], object);
  } catch (error) {}
  if (!result && result === null) return DEFAULT_RETURN_VALUE;
  return result;
};

export const getTimelineDataByActivity = (activities) =>
  activities?.map((activity) => ({
    description: activity?.activityMessageDto?.body,
    title: activity?.activityMessageDto?.header,
    color: getColorByActivityReason(activity?.reason),
    createdDate: activity?.createdDate,
  }));

const getColorByActivityReason = (reason) => {
  switch (reason) {
    case 'UNASSIGNED':
      return colors.statusUnassigned;
    case 'ASSIGNED':
      return colors.statusAssigned;
    case 'CREATED':
      return colors.secondary;
    case 'STATUS_CHANGED':
      return colors.statusResolved;
    case 'COMMENT':
      return colors.statusAssigned;
    default:
      return colors.primary;
  }
};

export const insertKeys = (objArr, startKey) => {
  const newObjArr = [];
  let key = startKey;
  for (let i = 0; i < objArr.length; i++) {
    newObjArr.push({ ...objArr[i], key: key++ });
  }
  return newObjArr;
};
// Note: base64ToFile is in src/utils/functions/fileImageFuncs.js
export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const _catchAPIError = (err) => {
  if (err.response && err.response.status === 400) {
    toast.error(err.response.data);
  } else {
    toast.error('Something went wrong!');
  }
};

export const _emptyInputVals = (e, keys) => {
  keys.forEach((key) => {
    e.target[key].value = '';
  });
};

export const formatPhoneNumber = (phoneNumberString) => {
  if (phoneNumberString?.length === 11) {
    return `(${phoneNumberString?.slice(1, 4)})-${phoneNumberString?.slice(4, 7)}-${phoneNumberString?.slice(7)}`;
  }
  if (phoneNumberString?.length === 12) {
    return `(${phoneNumberString?.slice(2, 5)})-${phoneNumberString?.slice(5, 8)}-${phoneNumberString?.slice(8)}`;
  }
  return phoneNumberString;
};

export const formatPhoneNumberCode = (phoneNumberCode) =>
  phoneNumberCode?.length === 11 ? `(${phoneNumberCode?.slice(0, 1)})` : `(${phoneNumberCode?.slice(0, 2)})`;

export const capitalizeFirstLetterOfRegion = (region) => {
  const regionStringLowerCase = region?.toLowerCase();
  return regionStringLowerCase?.slice(0, 1)?.toUpperCase() + regionStringLowerCase?.slice(1);
};

/*
  It converts string into camel case
  inputArray: string which we need to convert into camel case
  isCamel: if true then convert it into camel case or make first letter of every word as a capital Letter
*/
// export const toCamelCase = (inputArray, isCamel = true) => {
//   let result = "";

//   for (let i = 0; i < inputArray.length; i++) {
//     let currentStr = inputArray[i];
//     let temStr = currentStr.toLowerCase;
//     console.log("temStr :: ", temStr);
//     if (isCamel) {
//       if (i != 0) {
//         temStr = temStr.substr(0, 1).toUpperCase() + temStr.substr(1);
//       }
//     } else {
//       temStr = temStr.substr(0, 1).toUpperCase() + temStr.substr(1);
//     }

//     result += temStr;
//   }
//   return result;
// };

export const modifyStringENUMS = (name) => {
  if (name?.length < 1 || !name) return 'N/A';

  const replaceUnderscore = name.replaceAll('_', ' ');
  const changeToLowerCase = replaceUnderscore.toLowerCase();
  const sliceStringFromIndexOne = changeToLowerCase.slice(1);
  const finalString = replaceUnderscore[0].concat(sliceStringFromIndexOne);

  return finalString;
};

export const _reformatRoles = (roles) => {
  const frags = roles
    ?.split('_')
    .map((frag) => `${frag[0].toUpperCase()}${frag.slice(1).toLowerCase()}`)
    .join(' ');

  return frags;
};

export const getByString = (o, s) => {
  s = s.replace(/\[(\w+)\]/g, '.$1');
  s = s.replace(/^\./, '');
  const a = s.split('.');

  for (let i = 0, n = a.length; i < n; ++i) {
    const k = a[i];

    if (k in o) {
      o = o[k];
    } else {
      return;
    }
  }
  return o;
};

export const convertUserTimeZoneToAbbr = (userTimezone) => momentTimezone().tz(userTimezone)?.zoneAbbr();

export const getDescriptiveDateFromDateString = (str) => {
  if (!str || str === '---') return '---';

  const date = moment(str);
  return date.format('MMMM DD, YYYY');
};

export const isTwoTimeStampsEqual = (firstTime, secondTime) => {
  if (!firstTime || !secondTime) return false;

  const firstDate = moment(firstTime).format('MMMM DD, YYYY');
  const secondDate = moment(secondTime).format('MMMM DD, YYYY');
  return firstDate === secondDate;
};

export const modifyAppliedFilterTimeStampsWithoutTime = (startTime, endTime) => {
  if (!startTime || !endTime) return '---';
  const finalString = `${getDescriptiveDateFromDateString(startTime)}   To   ${getDescriptiveDateFromDateString(endTime)}`;
  return finalString;
};

export const modifyDateTimeToDescriptive = (time) => {
  let incidentDate = '---';
  let incidentTime = '---';

  if (time && time !== '---') {
    incidentDate = new Date(time);
    incidentTime = format(incidentDate, "hh:mm aaaaa'm'").toUpperCase();
  }

  return `${getDescriptiveDateFromDateString(time)} - ${incidentTime ?? '---'}`;
};

export const dynamicSortBasedOnKeys = (property) => {
  let sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  return (a, b) => {
    let result;

    if (a[property] < b[property]) {
      result = -1;
    } else if (a[property] > b[property]) {
      result = 1;
    } else {
      result = 0;
    }
    return result * sortOrder;
  };
};

export const sortReportingItemsByDateDesc = (reportingItems) => {
  if (Array.isArray(reportingItems)) {
    const sortedArray = [...reportingItems].sort((item1, item2) => (item1?.createdAt < item2?.createdAt ? 1 : -1));
    return sortedArray;
  }
};

// Could not ascertain which method was best to prevent the user from entering invalid characters thus both methods are available
// cleanSearchInput works but provides no user feedback (nothing happens if the user enters invalid characters)
export const firstLetterToUpperCase = (string) => {
  let modifiedString = '';
  const breakString = string?.split(',')?.map((item) => `${item.at(0).toUpperCase()}${item.slice(1, item.length)}`);

  breakString?.forEach((item) => {
    modifiedString = `${modifiedString.length > 0 ? `${modifiedString}, ${item}` : item}`;
  });

  return modifiedString ?? '---';
};

export const checkIfArrayContainsTrue = (array) => {
  if (!array || array.length < 1) return false;

  if (Array.isArray(array)) {
    return array?.includes(true || 'true');
  }
  return false;
};

export const extractStringsFromArrayOfObjects = (arrayOfObj, key) => {
  let finalString = '';
  if (arrayOfObj) {
    arrayOfObj?.forEach((item, index) => {
      if (index === 0) {
        finalString = `${item[key]}`;
        return;
      }
      finalString = `${finalString},${item[key]}`;
    });
  }

  return finalString;
};

export const removeSelectedString = (stringToBeRemoved = '', mainString = '') => {
  const stringArray = mainString.split(',');
  const getRemoveWordIndex = stringArray.indexOf(stringToBeRemoved);
  let finalString = '';

  if (stringArray.length === 1) {
    finalString = mainString.replace(stringToBeRemoved, '');
    return finalString;
  }

  if (getRemoveWordIndex === 0) {
    finalString = mainString.replace(`${stringToBeRemoved},`, '');
  } else {
    finalString = mainString.replace(`,${stringToBeRemoved}`, '');
  }

  return finalString;
};

export const getDateAndTimeDescription = (date, timezone) => {
  const modifiedDate = getDescriptiveDateFromDateString(date);
  let time = '---';

  // eslint-disable-next-line valid-typeof
  if (date && date !== '---') {
    const incidentDate = new Date(date);
    time = formatInTimeZone(incidentDate, timezone, "hh:mm aaaaa'm'").toUpperCase();
  }

  return `${modifiedDate} - ${time}`;
};

export const getIsManagerRoutesActivated = (location) => {
  if (
    location?.pathname === routes.PROCESS_MANAGER ||
    location?.pathname === routes.TEST_MANAGER ||
    location?.pathname === routes.AGENT_MANAGER ||
    location?.pathname.includes(routes.MR_MANAGER) ||
    location?.pathname === routes.SETTINGS_ACCESS_MANAGEMENT
  ) {
    return true;
  }
};

export const calculatePercentage = (numerator, denominator) => {
  if (!denominator) return 0;

  return Math.round((numerator / denominator) * 100);
};

export const groupBy = (items, key) =>
  items?.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});

export const checkPageFeatureFlags = (pages) => {
  const hideTopMenuItems = [];

  const grantedPages = { ...pages }?.grantedPages?.filter((page) => {
    if (page?.isHidden) {
      page?.isTopMenuItem && hideTopMenuItems.push(page?.topMenuItemId);

      return false;
    }

    return true;
  });

  const topMenuItems = { ...pages }?.topMenuItems?.filter((item) => !hideTopMenuItems.includes(item?.topMenuItemId));

  return {
    ...pages,
    grantedPages,
    topMenuItems,
  };
};

export const getMappedFeatureFlags = (flags = []) =>
  flags
    .filter((flag) => Boolean(FEATURE_FLAGS[flag]))
    .map((flag) => ({
      name: flag,
      isActive: false,
    }));

export const removeDuplicatesObjFromArrayByProperty = (arr, property) => {
  if (!arr || !Array.isArray(arr)) return [];

  const uniqueMap = new Map();
  arr.forEach((item) => uniqueMap?.set(item[property], item));

  return Array.from(uniqueMap.values());
};

export const swapArrayElements = (arr, pos1, pos2) => {
  const temp = arr[pos1];
  arr[pos1] = arr[pos2];
  arr[pos2] = temp;
  return arr;
};

// Need to find better solution
export const replaceDynamicUrl = (flag) => flag.replace('CA.svg', '{xx}.svg');

export const isValidJSON = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const isValidXML = (str) => {
  try {
    const dom = new DOMParser().parseFromString(str, 'text/xml');
    const errorNode = dom.querySelector('parsererror');

    return !errorNode;
  } catch (e) {
    return false;
  }
};

export const isValidHTML = (str) => {
  try {
    const dom = new DOMParser().parseFromString(str, 'text/html');
    const errorNode = dom.querySelector('parsererror');

    return !errorNode;
  } catch (e) {
    return false;
  }
};

export const isValidJavaScript = (str) => {
  try {
    new Function(str);
  } catch (e) {
    return false;
  }
  return true;
};
