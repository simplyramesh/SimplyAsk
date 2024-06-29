import { useEffect, useState } from 'react';
import { calculateFullDaysBetweenDates } from '../../../utils/initialValuesHelpers';
import { calculateIndexBoundsByFrequency } from '../utils/helpers';

const useChartBrush = ({ filters }) => {
  const numOfDays = calculateFullDaysBetweenDates(
    filters?.timeFrame?.filterValue?.startTime,
    filters?.timeFrame?.filterValue?.endTime
  );
  const { endIndex } = calculateIndexBoundsByFrequency({ numOfDays, frequency: filters?.frequency?.value });

  const [indices, setIndices] = useState({ startIndex: 0, endIndex });

  useEffect(() => {
    setIndices({ startIndex: 0, endIndex });
  }, [endIndex]);

  const handleBrushUpdate = ({ startIndex, endIndex: endIdx }) => {
    setIndices({ startIndex, endIndex: endIdx });
  };

  return {
    startIndex: indices.startIndex,
    endIndex: indices.endIndex,
    handleBrushUpdate,
    isBrushUpdating: endIndex !== indices.endIndex,
  };
};

export default useChartBrush;
