import { format } from 'date-fns';

import { getDescriptiveDateFromDateString, OBJECT_WILD_CARD_KEY } from '../../utils/helperFunctions';
import { processHistoryKeys } from '../../utils/serviceRequests';
import { StyledText } from '../shared/styles/styled';
import { modifyExecutionParameters } from './BulkPreviewFullView/requestHeadersSchema';
import classes from './ProcessHistory.module.css';
import TicketsStatus from './ProcessHistoryStatus/TicketsStatus';

export const uniqueId = OBJECT_WILD_CARD_KEY;

export const tableHeaderKeys = {
  EXECUTION_DETAILS: 'Execution Details',
  EXECUTION_PARAMETERS: 'Parameters',
  START_AND_END_TIME: 'Start & End Time',
  CURRENT_TASK: 'Current Task',
  STATUS: 'Status',
};

export const modifyTimeStamp = (val) => {
  if (!val) return <p>---</p>;

  const startTime = val[processHistoryKeys.START_TIME];
  const endTime = val[processHistoryKeys.END_TIME];
  const status = val[processHistoryKeys.STATUS_ONLY];

  let timeStart;
  let timeEnd;
  let incidentDate;

  if (startTime && startTime !== '---') {
    incidentDate = new Date(startTime);
    timeStart = format(incidentDate, "hh:mm aaaaa'm'").toUpperCase();
  }

  if (endTime && endTime !== '---') {
    incidentDate = new Date(endTime);

    timeEnd = format(incidentDate, "hh:mm aaaaa'm'").toUpperCase();
  }

  return (
    <div className={classes.flex_col}>
      <p className={classes.no_wrap}>
        {getDescriptiveDateFromDateString(startTime)} - {timeStart ?? '---'}
      </p>
      <p className={classes.timeToBold}>to</p>
      {(() => {
        if (status === processHistoryKeys.FAILED) {
          return <p>---</p>;
        }
        if (status === processHistoryKeys.EXECUTING) {
          return <p className={classes.no_wrap}>TBD (In Progress)</p>;
        }
        return (
          <p className={classes.no_wrap}>
            {getDescriptiveDateFromDateString(endTime)} - {timeEnd ?? '---'}
          </p>
        );
      })()}
    </div>
  );
};

const modifyExecutionDetails = (val) => {
  if (!val) return <p>---</p>;

  const projectName = val[processHistoryKeys.PROJECT_NAME];
  const id = val[processHistoryKeys.PROCESS_INSTANCE_ID];

  const businessKey = val[processHistoryKeys.BUSINESS_KEY];
  const source = businessKey?.[processHistoryKeys.SOURCE];

  return (
    <div className={classes.flex_col}>
      <p className={classes.tableProjectName}>{projectName ?? '---'}</p>
      <p className={classes.tableProjectSource}>{source ?? '---'}</p>
      <p className={classes.tableProjectSource}>{`#${id}` ?? '---'}</p>
    </div>
  );
};

const processViewTableHeaders = [
  {
    name: tableHeaderKeys.EXECUTION_DETAILS,
    source: OBJECT_WILD_CARD_KEY,
    formatter: modifyExecutionDetails,
  },
  {
    name: tableHeaderKeys.EXECUTION_PARAMETERS,
    source: processHistoryKeys.INPUT_DATA,
    formatter: modifyExecutionParameters,
  },
  {
    name: tableHeaderKeys.START_AND_END_TIME,
    source: OBJECT_WILD_CARD_KEY,
    formatter: modifyTimeStamp,
  },
  {
    name: tableHeaderKeys.CURRENT_TASK,
    source: processHistoryKeys.CURRENT_TASK,
  },
  {
    name: 'Environment',
    source: 'environment',
    formatter: (val) => {
      return <StyledText textAlign="center">{val}</StyledText>;
    },
  },
  {
    name: tableHeaderKeys.STATUS,
    source: processHistoryKeys.STATUS,
    alignCenter: true,
    formatter: (val) => {
      return <TicketsStatus status={val} />;
    },
  },
];

export default processViewTableHeaders;
