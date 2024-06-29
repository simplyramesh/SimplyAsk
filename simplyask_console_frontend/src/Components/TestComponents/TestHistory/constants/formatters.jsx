export const calculateDuration = (startTimeString, endTimeString) => {
  const startTime = new Date(startTimeString);
  const endTime = endTimeString.trim() ? new Date(endTimeString) : new Date();

  const durationInSeconds = Math.floor((endTime - startTime) / 1000);

  if (durationInSeconds < 60) {
    return `${durationInSeconds} seconds`;
  }

  const durationInMinutes = Math.floor(durationInSeconds / 60);
  const remainingSeconds = durationInSeconds % 60;

  if (durationInMinutes < 60) {
    return `${durationInMinutes} minutes ${remainingSeconds} seconds`;
  }

  const durationInHours = Math.floor(durationInMinutes / 60);
  const remainingMinutes = durationInMinutes % 60;

  return `${durationInHours} hours ${remainingMinutes} minutes ${remainingSeconds} seconds`;
};
