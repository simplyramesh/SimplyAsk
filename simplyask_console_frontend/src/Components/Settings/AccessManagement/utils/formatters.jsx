import moment from 'moment';

// date formatters
export const formatDateMonthDayYear = (date) => {
  return moment(date).format('MMMM DD, YYYY');
};

export const convertToISOStr = (date) => {
  return moment(date).format('YYYY-MM-DDTHH:MM:00');
};

// theme colors
const AVATAR_THEME_COLORS = {
  primary: 'primary',
  secondary: 'secondary',
  charcoal: 'charcoal',
  statusResolved: 'statusResolved',
  statusUnassigned: 'statusUnassigned',
  statusAssigned: 'statusAssigned',
};

export const randomColor = (theme) => {
  const colors = Object.keys(theme.colors)
    .map((key) => AVATAR_THEME_COLORS[key] === key && theme.colors[key])
    .filter(Boolean);

  return colors[Math.floor(Math.random() * colors.length)];
};

export const textColor = (value, colors) => {
  if (!value) return colors.information;

  return colors.primary;
};

// filter formatters
export const filterListArr = (filterList) => {
  return Object.keys(filterList).reduce((acc, key) => {
    if (filterList[key] == null || filterList[key] === '') return acc;

    if (Array.isArray(filterList[key])) {
      filterList[key].forEach((item) => {
        acc.push({
          filterName: key,
          filterValue: item,
        });
      });

      return acc;
    }

    return [...acc, { filterName: key, filterValue: filterList[key] }];
  }, []);
};

// url search string formatters
export const constructUrlSearchString = (object) => {
  const objKeys = Object.keys(object);

  const urlSearchParams = new URLSearchParams();

  if (objKeys.length === 0) return urlSearchParams.toString();

  objKeys.forEach((key) => {
    const isValueArray = Array.isArray(object[key]);
    const hasArrayValue = isValueArray && object[key].length >= 0;

    // urlSearchParams.append(key, object[key].join(','));

    if ((object[key] && object[key] !== '' && !isValueArray) || hasArrayValue) {
      urlSearchParams.append(key, object[key]);
    }
  });

  return urlSearchParams.toString();
};

// string formatters
export const toCamelCase = (str) => str
  .toLowerCase()
  .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
