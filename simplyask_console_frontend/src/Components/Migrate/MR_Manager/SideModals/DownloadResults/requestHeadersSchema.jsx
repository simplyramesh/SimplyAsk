import { format } from 'date-fns';

import MR_Manager_download_icon from '../../../../../Assets/icons/MR_Manager_download_icon.svg';
import {
  DEFAULT_RETURN_VALUE,
  getDescriptiveDateFromDateString,
  OBJECT_WILD_CARD_KEY,
} from '../../../../../utils/helperFunctions';
import classes from './DownloadResults.module.css';

export const tableHeaderKeys = {
  EXECUTION_ID: 'Execution ID',
  START_AND_END_TIME: 'Start & End Time',
};

export const DOWNLOAD_REPORTS_KEYS = {
  executionId: 'id',
  startTime: 'startedAt',
  endTime: 'finishedAt',
};

const modifyTimeStamp = (val) => {
  if (!val) return <div>---</div>;

  const startTime = val[DOWNLOAD_REPORTS_KEYS.startTime];
  const endTime = val[DOWNLOAD_REPORTS_KEYS.endTime];

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

  if (getDescriptiveDateFromDateString(startTime) === getDescriptiveDateFromDateString(endTime)) {
    return (
      <div className={classes.flex_col}>
        <div className={classes.no_wrap}>
          <strong>{getDescriptiveDateFromDateString(startTime)}</strong>
        </div>
        <div>
          {timeStart} - {timeEnd}
        </div>
      </div>
    );
  }

  return (
    <div className={classes.flex_col}>
      <div className={classes.no_wrap}>
        <strong>{getDescriptiveDateFromDateString(startTime)}</strong> - {timeStart ?? '---'}
      </div>
      <div>to</div>
      {getDescriptiveDateFromDateString(endTime) !== DEFAULT_RETURN_VALUE ? (
        <div className={classes.no_wrap}>
          <strong>{getDescriptiveDateFromDateString(endTime)}</strong> - {timeEnd ?? '---'}
        </div>
      ) : (
        <div className={classes.no_wrap}>
          <strong>In Progress</strong>
        </div>
      )}
    </div>
  );
};

const tableHeaders = (downloadReport = () => {}) => [
  {
    name: tableHeaderKeys.EXECUTION_ID,
    source: DOWNLOAD_REPORTS_KEYS.executionId,
  },
  {
    name: tableHeaderKeys.START_AND_END_TIME,
    source: OBJECT_WILD_CARD_KEY,
    formatter: modifyTimeStamp,
  },
  {
    name: '',
    source: OBJECT_WILD_CARD_KEY,
    formatter: (val) => (
      <div className={classes.tableIconHover} onClick={() => downloadReport(val)}>
        <img src={MR_Manager_download_icon} alt="" className={classes.downloadIconTable} />
      </div>
    ),
  },
];

export default tableHeaders;
