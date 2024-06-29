// start and end angles are necessary to ensure the arc starts
// from the top of the circle
export const calculateStartAngle = (total, usedValue, remaining) => {
  const angle = ((360 * usedValue) / total - 90) * -1;

  return remaining < 0 ? -90 : angle;
};

export const calculateEndAngle = (startAngle) => (-startAngle >= 0 ? 360 : startAngle + 360);

export const getYDomainMax = (dataMax, limit = 0, numOfTicks = 6) => {
  const maxWithTwentyFivePercent = dataMax + (dataMax * 0.25);
  const limitWithTwentyFivePercent = limit + (limit * 0.25);

  const adjustedMax = dataMax > limit
    ? maxWithTwentyFivePercent
    : limitWithTwentyFivePercent;

  return Math.round(Math.max(adjustedMax, numOfTicks));
};
