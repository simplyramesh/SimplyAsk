import cronstrue from 'cronstrue';
import moment from 'moment';

import { taskTypesMap } from '../../../../utils/reporting';
import { getCronExpressionInterval } from '../../../../utils/timeUtil';
import ReportingTableIcon from '../../../shared/REDISIGNED/icons/CustomTableIcons';
import buttons from '../../../shared/styles/buttons.module.css';
import containers from '../../../shared/styles/containers.module.css';
import ReportingMails from './ReportingMails/ReportingMails';

export const reportingUniqueId = 'id';

export const getReportingHeaders = (editButtonHandler, deleteButtonHandler) => [
  {
    name: 'Report and Workflow Name',
    source: 'name',
    formatter: ({ name, schedulerTaskType }) => (
      <>
        <strong>{name}</strong>
        <div>{taskTypesMap[schedulerTaskType]}</div>
      </>
    ),
  },
  {
    name: 'Email Addresses',
    source: 'emails',
    formatter: (mails) => <ReportingMails mails={mails} />,
  },
  {
    name: 'Sending Frequency',
    source: 'sendingFrequency',
    formatter: ({ time, rest }) => (
      <>
        {time && <div>{time}</div>}
        {rest && <div>{rest}</div>}
      </>
    ),
  },
  {
    name: 'Previous Days Data Included',
    source: 'reportDaysToInclude',
    formatter: (val) => {
      if (val === 0) { return 'All'; }
      return `${val} Days`;
    },
  },
  {
    name: 'Date Next Report is Sent',
    source: 'dateNewReport',
  },
  {
    name: 'Action',
    source: 'action',
    formatter: (val) => (
      <div className={containers.flexContainer}>
        <div className={buttons.tableButton} onClick={(e) => editButtonHandler(val.id, 'edit', e)}>
          <ReportingTableIcon icon="EDIT" width={32} />
        </div>
        <div className={buttons.tableButton} onClick={(e) => deleteButtonHandler(e, val.name.name)}>
          <ReportingTableIcon icon="BIN" width={32} />
        </div>
      </div>
    ),
  },
];

export const getMappedReportingItems = (reportingItems = []) => reportingItems?.map((report) => {
  const interval = getCronExpressionInterval(report.cronExpression);
  let dateNewReport = new Date();

  if (interval) {
    dateNewReport = moment(interval.next().toString()).format('YYYY-MM-DD');
  }

  const getSendingFrequency = () => {
    const fr = cronstrue.toString(report.cronExpression).split(',');
    const time = `${fr[0]} UTC`;
    const rest = fr.slice(1).join(',');

    return {
      time,
      rest,
    };
  };

  const mappedReport = {
    ...report,
    name: {
      name: report.name,
      schedulerTaskType: report.schedulerTaskType,
    },
    emails: report.parameters.reportTo,
    sendingFrequency: getSendingFrequency(),
    reportDaysToInclude: report.parameters.reportDaysToInclude,
    dateNewReport,
  };

  return {
    ...mappedReport,
    action: mappedReport,
  };
});
