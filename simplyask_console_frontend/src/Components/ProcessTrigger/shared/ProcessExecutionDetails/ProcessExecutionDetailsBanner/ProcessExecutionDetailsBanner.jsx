import { useTheme } from '@mui/material';
import moment from 'moment';

import { isNotNullOrUndefined } from '../../../../../utils/helperFunctions';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import {
  EXECUTES_ON, EXECUTION_FREQUENCY, getDayOfWeekLabel, getMonthNameFromNumber, getWeekNumberLabel,
} from '../../../utils/constants';

const ProcessExecutionDetailsBanner = ({ details, frequency, isOrchestratorMode }) => {
  const { colors } = useTheme();

  const getBannerDateFormat = (date) => `${moment(date).format('MMMM DD, YYYY')} at ${moment(date).format('hh:mm A')}`;

  const getWeekDaysRepeaterLabel = () => {
    const subrepeater = details?.repeater?.subrepeater;
    const value = subrepeater?.value;

    if (!value?.length) {
      return '';
    }

    if (value.length === 7) {
      return 'every day of week';
    } if (value.length === 1) {
      return value[0];
    }
    const daysOfWeek = [...value];
    const lastElement = daysOfWeek.pop();
    const restElements = daysOfWeek.join(', ');

    return `${restElements} and ${lastElement}`;
  };

  const getMonthRepeaterLabel = () => {
    const repeater = details?.repeater;
    const subrepeater = repeater?.subrepeater;

    if (!subrepeater) {
      return;
    }

    if (subrepeater.type === EXECUTES_ON.DAY_OF_MONTH) {
      const dayNumber = subrepeater.value;

      return `day ${dayNumber}`;
    }
    const [dayOfWeekRepeater, dayOfWeek] = subrepeater.value;

    return isNotNullOrUndefined(dayOfWeekRepeater) && isNotNullOrUndefined(dayOfWeek)
      ? `the ${getWeekNumberLabel(dayOfWeekRepeater)} ${getDayOfWeekLabel(dayOfWeek)} `
      : '';
  };

  const getYearRepeaterLabel = () => {
    const repeater = details?.repeater;
    const subrepeater = repeater?.subrepeater;

    if (!subrepeater) {
      return;
    }

    if (subrepeater.type === EXECUTES_ON.DAY_OF_MONTH) {
      const [dayNumber, monthNumber] = subrepeater.value;

      return monthNumber >= 0 && dayNumber >= 0
        ? `${getMonthNameFromNumber(monthNumber)} ${dayNumber} of the year`
        : '';
    }
    const [dayOfWeekRepeater, dayOfWeek] = subrepeater.value;

    return isNotNullOrUndefined(dayOfWeekRepeater) && isNotNullOrUndefined(dayOfWeek)
      ? `the ${getWeekNumberLabel(dayOfWeekRepeater)} ${getDayOfWeekLabel(dayOfWeek)} of the year`
      : '';
  };

  const getRepeaterLabel = () => {
    const repeaterValue = details?.repeater?.value;

    if (!repeaterValue && frequency !== EXECUTION_FREQUENCY.ONCE && frequency !== EXECUTION_FREQUENCY.YEARLY) {
      return;
    }

    switch (frequency) {
    case EXECUTION_FREQUENCY.ONCE:
      return 'only once';
    case EXECUTION_FREQUENCY.DAILY:
      return `every ${repeaterValue > 1 ? `${repeaterValue} days` : 'day'}`;
    case EXECUTION_FREQUENCY.WEEKLY:
      return `every week on ${getWeekDaysRepeaterLabel()},`;
    case EXECUTION_FREQUENCY.MONTHLY:
      return `every ${repeaterValue > 1 ? `${repeaterValue} months` : 'month'} on ${getMonthRepeaterLabel()} of the month,`;
    case EXECUTION_FREQUENCY.YEARLY:
      return `every year on ${getYearRepeaterLabel()},`;
    default:
      return <></>;
    }
  };

  return (
    <StyledFlex backgroundColor={colors.lightGrayBlue} p="15px" borderRadius="8px">
      <StyledText size={16}>
        Your
        {' '}
        {isOrchestratorMode ? 'orchestration' : 'process'}
        {' '}
        will execute&nbsp;
        <StyledText weight={700} display="inline-block">{getRepeaterLabel()}</StyledText>
        &nbsp;starting on the&nbsp;
        <StyledText weight={700} display="inline-block">
          {
            details.startsNow
              ? 'date and time you submit this execution'
              : getBannerDateFormat(details.startDate)
          }

        </StyledText>
        { frequency !== EXECUTION_FREQUENCY.ONCE && (
          <>
            &nbsp;and
            {' '}
            {details.neverEnds ? 'continue' : 'ending on'}
&nbsp;
            <StyledText weight={700} display="inline-block">
              {
                details.neverEnds
                  ? 'indefinitely'
                  : getBannerDateFormat(details.endDate)
              }

            </StyledText>
          </>
        )}
        <StyledText weight={700} display="inline-block">.</StyledText>
      </StyledText>
    </StyledFlex>
  );
};

export default ProcessExecutionDetailsBanner;
