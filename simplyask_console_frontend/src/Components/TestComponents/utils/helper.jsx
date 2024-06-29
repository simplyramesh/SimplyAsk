import {
  BASE_DATE_FORMAT,
  BASE_TIME_FORMAT,
  convertDateStringToUTCFormat,
  getInFormattedUserTimezone,
} from '../../../utils/timeUtil';
import {
  TEST_CASE_EXECUTION_STATUS,
  TEST_ENTITY_TYPE,
  TEST_SUITE_EXECUTION_STATUS,
} from '../../Managers/TestManager/constants/constants';
import {
  getPercentage,
  testStatusToColorMapper,
  testStatusToLabelMapper,
} from '../../Managers/TestManager/utils/helpers';
import BaseTicketStatus from '../../shared/REDISIGNED/layouts/BaseTicketStatus/BaseTicketStatus';
import ProgressBar from '../../shared/REDISIGNED/progressBar/ProgressBar';
import { StyledFlex, StyledText } from '../../shared/styles/styled';

export const renderTime = (props, defaultValue = '') => {
  const { table, cell } = props;
  const dateTimeValue = cell.getValue();
  const timezone = table.options.meta.user?.timezone;

  const UTCTime = convertDateStringToUTCFormat(dateTimeValue);

  return (
    <StyledText size={15} weight={400} lh={22}>
      {UTCTime ? (
        <>
          <StyledFlex>{getInFormattedUserTimezone(UTCTime, timezone, BASE_DATE_FORMAT)}</StyledFlex>
          <StyledFlex>{getInFormattedUserTimezone(UTCTime, timezone, BASE_TIME_FORMAT)}</StyledFlex>
        </>
      ) : (
        defaultValue
      )}
    </StyledText>
  );
};

const renderStatusMessage = ({
  bgColor, color, label, message,
}) => (
  <StyledFlex direction="row" gap={2}>
    <BaseTicketStatus bgColor={bgColor} color={color}>
      {label}
    </BaseTicketStatus>
    <StyledText weight={500}>
      {message}
    </StyledText>
  </StyledFlex>
);

const prepareProgressData = (rowData, theme) => {
  const {
    status: currentStatus, type, testCaseCount, executionMap,
  } = rowData;

  const mapStatus = (status, count) => ({
    count,
    color: testStatusToColorMapper(status, theme),
    label: testStatusToLabelMapper(status),
  });

  if (type === TEST_ENTITY_TYPE.CASE) {
    return [mapStatus(currentStatus, 1)];
  }

  if (currentStatus === TEST_SUITE_EXECUTION_STATUS.PREPARING) {
    return [mapStatus(TEST_SUITE_EXECUTION_STATUS.PREPARING, testCaseCount)];
  }

  return [
    mapStatus(TEST_CASE_EXECUTION_STATUS.FAILED, executionMap?.FAILED || 0),
    mapStatus(TEST_CASE_EXECUTION_STATUS.EXECUTING, executionMap?.EXECUTING || 0),
    mapStatus(TEST_CASE_EXECUTION_STATUS.FINALIZING, executionMap?.FINALIZING || 0),
    mapStatus(TEST_CASE_EXECUTION_STATUS.STOPPED, executionMap?.STOPPED || 0),
    mapStatus(TEST_CASE_EXECUTION_STATUS.DONE, executionMap?.DONE || 0),
  ];
};

export const renderExecutionStatusCell = ({ table, row }) => {
  const { theme } = table.options.meta;
  const { original: rowData } = row || {};
  const {
    executionMap: statusMap, type, testCaseCount: total, status,
  } = rowData || {};
  const singleStatus = type === TEST_ENTITY_TYPE.CASE;

  const progressData = prepareProgressData(rowData, theme);

  const isCompletedStatus = status === TEST_CASE_EXECUTION_STATUS.DONE || status === TEST_CASE_EXECUTION_STATUS.FAILED;
  const isExecutionStarted = statusMap?.DONE > 0 || statusMap?.FAILED > 0;
  const executedPercentage = getPercentage((statusMap?.DONE || 0) + (statusMap?.FAILED || 0), total);
  const passedPercentage = getPercentage(statusMap?.DONE || 0, total);

  const stoppedCondition = status === TEST_SUITE_EXECUTION_STATUS.STOPPED;

  return (
    <StyledFlex gap="6px">
      {stoppedCondition ? renderStatusMessage({
        bgColor: theme.iconColors.charcoal.bg,
        color: theme.iconColors.charcoal.color,
        label: 'Canceled',
        message: 'Canceled Before Finished Executing',
      }) : (
        <StyledFlex alignItems="flex-start">
          <ProgressBar
            data={progressData}
            entityName="Execution Status"
            disableTooltip={singleStatus}
            hideNulls={singleStatus}
          />
          { singleStatus ? (
            <StyledFlex direction="row" width="100%">
              <StyledFlex width="40%">
                <StyledText textAlign="left" weight={isCompletedStatus ? 600 : 400}>
                  { isCompletedStatus
                    ? `${status === TEST_CASE_EXECUTION_STATUS.DONE ? '100%' : '0%'} Passed`
                    : testStatusToLabelMapper(status)}
                </StyledText>
              </StyledFlex>
              <StyledFlex alignItems="flex-end" width="60%">
                { isCompletedStatus && (
                  <StyledText textAlign="right">
                    100% Test Cases Executed
                  </StyledText>
                ) }
              </StyledFlex>
            </StyledFlex>
          ) : (
            <StyledFlex direction="row" width="100%">
              <StyledFlex width="40%">
                <StyledText textAlign="left" weight={isExecutionStarted ? 600 : 400}>
                  { isExecutionStarted
                    ? `${passedPercentage}% Passed`
                    : testStatusToLabelMapper(status)}
                </StyledText>
              </StyledFlex>
              <StyledFlex alignItems="flex-end" width="60%">
                { isExecutionStarted && (
                  <StyledText textAlign="right">
                    { `${executedPercentage}%` }
                    {' '}
                    Test Cases Executed
                  </StyledText>
                ) }
              </StyledFlex>
            </StyledFlex>
          )}
        </StyledFlex>
      )}
    </StyledFlex>
  );
};
