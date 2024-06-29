import moment from 'moment';

export const dateCriteriaKeys = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  LAST7DAYS: 'last7days',
  LAST30DAYS: 'last30days',
  THISMONTH: 'thismonth',
  LASTMONTH: 'lastmonth',
  THISYEAR: 'thisyear',
  LASTYEAR: 'lastyear',
  ALLDAYS: 'alldays',
  CUSTOMRANGE: 'customrange',
};

export const calendarDataSet = [
  {
    dateTypeKey: dateCriteriaKeys.TODAY,
    currentStartDateApply: moment().format('YYYY-MM-DD'),

    currentEndDateApply: moment().format('YYYY-MM-DD'),
  },
  {
    dateTypeKey: dateCriteriaKeys.YESTERDAY,
    currentStartDateApply: moment().subtract(1, 'days').format('YYYY-MM-DD'),

    currentEndDateApply: moment().format('YYYY-MM-DD'),
  },
  {
    dateTypeKey: dateCriteriaKeys.LAST7DAYS,
    currentStartDateApply: moment().subtract(6, 'days').format('YYYY-MM-DD'),

    currentEndDateApply: moment().format('YYYY-MM-DD'),
  },

  {
    dateTypeKey: dateCriteriaKeys.LAST30DAYS,
    currentStartDateApply: moment().subtract(29, 'days').format('YYYY-MM-DD'),

    currentEndDateApply: moment().format('YYYY-MM-DD'),
  },
  {
    dateTypeKey: dateCriteriaKeys.THISMONTH,
    currentStartDateApply: moment().format('YYYY-MM-01'),

    currentEndDateApply: moment().format('YYYY-MM-DD'),
  },
  {
    dateTypeKey: dateCriteriaKeys.LASTMONTH,
    currentStartDateApply: moment().subtract(1, 'months').format('YYYY-MM-01'),

    currentEndDateApply: moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD'),
  },
  {
    dateTypeKey: dateCriteriaKeys.THISYEAR,
    currentStartDateApply: moment().format('YYYY-01-01'),

    currentEndDateApply: moment().format('YYYY-MM-DD'),
  },
  {
    dateTypeKey: dateCriteriaKeys.LASTYEAR,
    currentStartDateApply: moment().subtract(1, 'years').format('YYYY-01-01'),

    currentEndDateApply: moment().subtract(1, 'years').format('YYYY-12-31'),
  },
  {
    dateTypeKey: dateCriteriaKeys.ALLDAYS,
    currentStartDateApply: moment().subtract(10, 'years').format('YYYY-MM-DD'),

    currentEndDateApply: moment().format('YYYY-MM-DD'),
  },
  {
    dateTypeKey: dateCriteriaKeys.CUSTOMRANGE,
    //   currentStartDateLocal: selectedCustomRangeStart,
    // currentEndDateLocal: selectedCustomRangeEnd,
  },
];
