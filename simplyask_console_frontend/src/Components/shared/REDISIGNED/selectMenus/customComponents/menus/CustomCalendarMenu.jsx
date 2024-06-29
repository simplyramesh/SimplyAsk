import { format, isValid, parse } from 'date-fns';
import moment from 'moment';
import { useEffect, useState } from 'react';
import Select, { components } from 'react-select';

import RadioGroup from '../../../../../Settings/AccessManagement/components/inputs/radio/RadioGroup';
import RadioInput from '../../../../../Settings/AccessManagement/components/inputs/radio/RadioInput';
import {
  StyledDivider, StyledFlex, StyledText,
} from '../../../../styles/styled';
import { StyledButton } from '../../../controls/Button/StyledButton';
import CustomRangeCalendar from '../../../CustomCalendar/CustomRangeCalendar';

import CalendarTimeRange from './CalendarTimeRange/CalendarTimeRange';
import { StyledDateRangeText, StyledSelectMenuCalendarContainer } from './StyledCustomCalendarMenu';

const MAX_FUTURE_DATE = '2028-01-01';

export const CUSTOM_CALENDAR_WITHOUT_TIME_MOMENT = 'MMMM Do, YYYY';
export const CUSTOM_CALENDAR_WITH_TIME_MOMENT = `${CUSTOM_CALENDAR_WITHOUT_TIME_MOMENT} hh:mma`;

export const QUICK_RANGE = [
  {
    label: 'Today',
    value: [
      moment().startOf('day').format('YYYY-MM-DDTHH:00:00'),
      moment().endOf('day').format('YYYY-MM-DDTHH:59:00'),
    ],
  },
  {
    label: 'Yesterday',
    value: [
      moment().subtract(1, 'days').startOf('day').format('YYYY-MM-DDTHH:00:00'),
      moment().subtract(1, 'days').endOf('day').format('YYYY-MM-DDTHH:59:00'),
    ],
  },
  {
    label: 'Last 7 days',
    value: [
      moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DDTHH:00:00'),
      moment().endOf('day').format('YYYY-MM-DDTHH:59:00'),
    ],
  },
  {
    label: 'Last 30 days',
    value: [
      moment().subtract(30, 'days').startOf('day').format('YYYY-MM-DDTHH:00:00'),
      moment().endOf('day').format('YYYY-MM-DDTHH:59:00'),
    ],
  },
  {
    label: 'This Month',
    value: [
      moment().startOf('month').format('YYYY-MM-DDTHH:00:00'),
      moment().endOf('day').format('YYYY-MM-DDTHH:59:00'),
    ],
  },
  {
    label: 'Last Month',
    value: [
      moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DDTHH:00:00'),
      moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DDTHH:59:00'),
    ],
  },
  {
    label: 'All Days',
    value: [
      moment('2020-01-01').startOf('day').format('YYYY-MM-DDTHH:00:00'),
      moment().endOf('day').format('YYYY-MM-DDTHH:59:00'),
    ],
  },
  {
    label: 'Custom Range',
    value: [
      moment().startOf('day').format('YYYY-MM-DDTHH:00:00'),
      moment().endOf('day').format('YYYY-MM-DDTHH:59:00'),
    ],
  },
];

const QUICK_RANGE_FUTURE = [
  {
    label: 'Today',
    value: [
      moment().startOf('day').format('YYYY-MM-DDTHH:00:00'),
      moment().endOf('day').format('YYYY-MM-DDTHH:59:00'),
    ],
  },
  {
    label: 'Tomorrow',
    value: [
      moment().add(1, 'days').startOf('day').format('YYYY-MM-DDTHH:00:00'),
      moment().add(1, 'days').endOf('day').format('YYYY-MM-DDTHH:59:00'),
    ],
  },
  {
    label: 'Next 7 days',
    value: [
      moment().startOf('day').format('YYYY-MM-DDTHH:00:00'),
      moment().add(7, 'days').startOf('day').format('YYYY-MM-DDTHH:59:00'),
    ],
  },
  {
    label: 'Next 30 days',
    value: [
      moment().startOf('day').format('YYYY-MM-DDTHH:00:00'),
      moment().add(30, 'days').startOf('day').format('YYYY-MM-DDTHH:59:00'),
    ],
  },
  {
    label: 'This Month',
    value: [
      moment().startOf('day').format('YYYY-MM-DDTHH:00:00'),
      moment().endOf('month').format('YYYY-MM-DDTHH:59:00'),
    ],
  },
  {
    label: 'Next Month',
    value: [
      moment().add(1, 'month').startOf('month').format('YYYY-MM-DDTHH:00:00'),
      moment().add(1, 'month').endOf('month').format('YYYY-MM-DDTHH:59:00'),
    ],
  },
  {
    label: 'All Days',
    value: [
      moment().startOf('day').format('YYYY-MM-DDTHH:00:00'),
      moment(MAX_FUTURE_DATE).endOf('day').format('YYYY-MM-DDTHH:59:00'),
    ],
  },
  {
    label: 'Custom Range',
    value: [
      moment().startOf('day').format('YYYY-MM-DDTHH:00:00'),
      moment().endOf('day').format('YYYY-MM-DDTHH:59:00'),
    ],
  },
];

const defaultRadioLabels = [
  {
    label: 'Last Edited Date',
    value: ['editedBefore', 'editedAfter'],
    default: true,
  },
  {
    label: 'Created Date',
    value: ['createdBefore', 'createdAfter'],
    default: false,
  },
];

export const singleDateOrRangeOutput = (dateArray, momentOutputFormatStr, withTimeRange = false) => {
  const [startDate, endDate] = dateArray;
  if (moment(startDate).isSame(endDate, 'day') && !withTimeRange) {
    return moment(startDate).format(momentOutputFormatStr);
  }

  return `${moment(startDate).format(momentOutputFormatStr)} - ${moment(endDate).format(momentOutputFormatStr)}`;
};

const getAddedTimeString = (newTime, oldDate) => {
  const parsedOldDateTime = parse(oldDate, 'yyyy-MM-dd\'T\'HH:mm:ss', new Date());
  const parsedTime = parse(newTime, 'hh:mm a', new Date());

  if (!isValid(parsedTime)) {
    return format(parsedOldDateTime, 'yyyy-MM-dd\'T\'HH:mm:ss');
  }

  return `${format(parsedOldDateTime, 'yyyy-MM-dd')}T${format(parsedTime, 'HH:mm:ss')}`;
};
/* NOTE: When using Time Range, the menu open must be controlled otherwise it will close when interacting with inputs

Copy/Paste props:

onMenuInputFocus={(v) => setIsFocused(v)}
{...{
  menuIsOpen: isFocused || undefined,
  isFocused: isFocused || undefined,
}}
  onBlur={() => setIsFocused(false)}
  withTimeRange
*/

const CustomCalendarMenu = (props) => {
  const {
    selectOption,
    selectProps,
    innerRef,
  } = props;

  const { customTheme: { colors }, isFutureCalendar } = selectProps;

  const [radioInput, setRadioInput] = useState(selectProps?.radioLabels?.filter((item) => item.default)[0] || defaultRadioLabels[0]);

  useEffect(() => {
    if (selectProps?.value?.filterValue && selectProps?.radioLabels) {
      const matchingRadioInput = selectProps.radioLabels.filter((item) => {
        const [firstKey, secondKey] = item.value;

        return selectProps.value.filterValue[firstKey] && selectProps.value.filterValue[secondKey];
      })[0];

      if (matchingRadioInput) {
        setRadioInput(matchingRadioInput);
      }
    }
  }, [selectProps.value]);

  const emptyFilterValues = selectProps?.radioLabels?.reduce((acc, curr) => ({ ...acc, [curr.value[0]]: '', [curr.value[1]]: '' }), {});

  const radioGroup = selectProps?.radioLabels || defaultRadioLabels;

  const [selectedQuickSelect, setSelectedQuickSelect] = useState(
    { ...QUICK_RANGE[0] },
  );

  const [startDateTime, endDateTime] = selectedQuickSelect.value;
  const [beforeDateTime, afterDateTime] = radioInput.value;

  const timeFormat = !selectProps?.withTimeRange ? CUSTOM_CALENDAR_WITHOUT_TIME_MOMENT : CUSTOM_CALENDAR_WITH_TIME_MOMENT;

  const getQuickRange = () => (isFutureCalendar ? QUICK_RANGE_FUTURE : QUICK_RANGE);

  return (
    <components.Menu {...props}>
      <StyledSelectMenuCalendarContainer selectProps={selectProps} ref={innerRef}>
        {selectProps?.showDateFilterType && (
          <StyledFlex mb="38px" gap="16px 0">
            <StyledText size={15} lh={18} weight={600}>Select Date Filter Type:</StyledText>
            <RadioGroup name="dateRangeType">
              {radioGroup.map((radio) => (
                <RadioInput
                  key={radio.label}
                  id={radio.label}
                  label={radio.label}
                  checked={radioInput.label === radio.label}
                  value={radio.label}
                  onChange={() => setRadioInput({ ...radio })}
                />
              ))}
            </RadioGroup>
          </StyledFlex>
        )}
        <StyledFlex mb="21px">
          <StyledText size={15} lh={18} weight={600}>Select Date Range:</StyledText>
        </StyledFlex>

        <StyledFlex direction="row" gap="0 21px" mb="35px">
          <StyledFlex gap={2} flex="0 0 121px">
            {getQuickRange()?.map((range) => (
              <StyledDateRangeText
                as="p"
                key={range.label}
                isActive={range.label === selectedQuickSelect.label}
                onClick={() => setSelectedQuickSelect({ ...range })}
              >
                {range.label}
              </StyledDateRangeText>
            ))}
          </StyledFlex>

          <StyledDivider orientation="vertical" flexItem />

          <StyledFlex gap="14px 0" flex="1 1 auto">
            <StyledText size={15} lh={18} weight={600} textAlign="center">
              {singleDateOrRangeOutput(selectedQuickSelect.value, CUSTOM_CALENDAR_WITHOUT_TIME_MOMENT)}
            </StyledText>
            <CustomRangeCalendar
              calendarValue={selectedQuickSelect.value}
              onChange={(value) => setSelectedQuickSelect({ label: 'Custom Range', value })}
              selectRange
              // Max date must be changed nearing the year 2028
              {...(isFutureCalendar && {
                minDate: moment().startOf('day').toDate(),
                maxDate: moment(MAX_FUTURE_DATE).startOf('day').toDate(),
              })}
            />
          </StyledFlex>
        </StyledFlex>
        {selectProps?.withTimeRange && (
          <StyledFlex mb="35px">
            <StyledFlex width="100%" mt="-35px" mb="21px">
              <StyledDivider color={colors.inputBorder} flexItem />
            </StyledFlex>
            <StyledFlex gap="21px 0">
              <StyledText size={15} weight={600} lh={18}>
                Select Time Range:
              </StyledText>

              <StyledFlex direction="row" alignItems="center" justifyContent="space-between">
                <CalendarTimeRange
                  selectProps={selectProps}
                  dateTimeRange={startDateTime}
                  onChange={(time) => {
                    setSelectedQuickSelect((prev) => {
                      const [prevStartDateTime, preEndDateTime] = prev.value;

                      return {
                        ...prev,
                        value: [
                          `${getAddedTimeString(time, prevStartDateTime)}`,
                          preEndDateTime,
                        ],
                      };
                    });
                  }}
                  borderColor={colors.primary}
                />
                <StyledText size={16} weight={600} lh={18}>to</StyledText>
                <CalendarTimeRange
                  selectProps={selectProps}
                  dateTimeRange={endDateTime} // endDateTime
                  onChange={(time) => {
                    setSelectedQuickSelect((prev) => {
                      const [prevStartDateTime, prevEndDateTime] = prev.value;

                      return {
                        ...prev,
                        value: [
                          prevStartDateTime,
                          `${getAddedTimeString(time, prevEndDateTime)}`,
                        ],
                      };
                    });
                  }}
                  borderColor={colors.primary}
                />
              </StyledFlex>
            </StyledFlex>
          </StyledFlex>
        )}

        <StyledButton
          secondary
          variant="contained"
          onClick={() => {
            selectOption({
              label: singleDateOrRangeOutput(selectedQuickSelect.value, timeFormat, selectProps?.withTimeRange),
              value: selectedQuickSelect.value,
              filterValue: {
                ...emptyFilterValues,
                [beforeDateTime]: endDateTime,
                [afterDateTime]: startDateTime,
              },
            });

            selectProps.onMenuClose();
            selectProps?.onMenuInputFocus?.(false);
          }}
        >
          Apply Filters
        </StyledButton>
      </StyledSelectMenuCalendarContainer>
    </components.Menu>
  );
};

export default CustomCalendarMenu;

CustomCalendarMenu.propTypes = Select.propTypes;
