import { FREQUENCY_TYPES, FREQUENCY_TYPE_VALUES } from "../../../utils/constants";

// NOTE: Please refer to https://simplyask.atlassian.net/browse/SC-2047: Frequency and Slider Rules, for clarification of the numbers
export const calculateIndexBoundsByFrequency = ({ numOfDays, frequency }) => {
  const NUM_OF_HOURS_IN_DAY = 24;
  const NUM_OF_HOURS_IN_TWO_DAYS = NUM_OF_HOURS_IN_DAY * 2;
  const NUM_OF_HOURS_IN_FIVE_DAYS = NUM_OF_HOURS_IN_DAY * 5;

  switch (frequency) {
    case FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.ONE_MINUTE]:
      return { min: 60, max: 120, endIndex: 120 };
    case FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.HOURLY]: {
      const shortPeriodHours = numOfDays > 1 && numOfDays < 6 ? NUM_OF_HOURS_IN_TWO_DAYS : NUM_OF_HOURS_IN_DAY;
      const max = numOfDays >= 6 ? NUM_OF_HOURS_IN_FIVE_DAYS : shortPeriodHours;

      return { min: 1, max, endIndex: max };
    }
    case FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.THIRTY_MINUTE]: {
      const max = numOfDays > 1 ? NUM_OF_HOURS_IN_TWO_DAYS * 2 : NUM_OF_HOURS_IN_DAY * 2;

      return { min: 4, max, endIndex: max };
    }
    case FREQUENCY_TYPE_VALUES[FREQUENCY_TYPES.DAILY]:
      return { min: 1, max: 5, endIndex: 5 };
    default:
      return { min: 1, max: 1, endIndex: 1 };
  }
};
