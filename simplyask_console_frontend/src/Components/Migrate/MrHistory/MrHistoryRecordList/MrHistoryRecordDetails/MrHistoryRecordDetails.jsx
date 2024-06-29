import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import routes from '../../../../../config/routes';
import { useUser } from '../../../../../contexts/UserContext';
import { getExecutionRecordDetailById } from '../../../../../Services/axios/migrate';
import InfoList from '../../../../shared/REDISIGNED/layouts/InfoList/InfoList';
import InfoListGroup from '../../../../shared/REDISIGNED/layouts/InfoList/InfoListGroup';
import CustomSidebar from '../../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { getDateTimeUsingTimezone } from '../../../utils/helpers';
import { MR_HISTORY_RECORD_DETAILS_API_KEYS } from '../../../utils/mappers';
import RecordDataItem from './RecordDetailDataGroup/RecordDataItem/RecordDataItem';
import RecordDetailsLogGroup from './RecordDetailsLogGroup/RecordDetailsLogGroup';
import RecordDetailsLogItem from './RecordDetailsLogGroup/RecordDetailsLogItem/RecordDetailsLogItem';
import RecordDetailsMetadataGroup from './RecordDetailsMetadataGroup/RecordDetailsMetadataGroup';
import RecordDetailsProcessingStatusGroup from './RecordDetailsProcessingStatusGroup/RecordDetailsProcessingStatusGroup';

const MrHistoryRecordDetails = (props) => {
  const { open, recordId, executionId, onClose, onExpand, times } = props;

  const {
    user: { timezone },
  } = useUser();

  const navigate = useNavigate();

  const { colors } = useTheme();

  const { data: recordDetail } = useQuery({
    queryKey: ['getExecutionRecordDetailById', executionId, recordId],
    queryFn: () => getExecutionRecordDetailById(executionId, recordId),
    enabled: !!recordId,
  });

  const getLogLevelColor = (logLevel) => {
    switch (logLevel) {
      case 'WARNING':
        return colors.statusAssigned;
      case 'ERROR':
        return colors.validationError;
      default:
    }
  };

  const messageLink = (log) => {
    switch (log?.[MR_HISTORY_RECORD_DETAILS_API_KEYS.RECORD_LOG.LEVEL]) {
      case 'INFO':
        return {
          text: 'Execution ID',
          link: log?.[MR_HISTORY_RECORD_DETAILS_API_KEYS.RECORD_LOG.EXECUTION_ID],
          onId: () => {
            navigate({
              pathname: routes.MR_MANAGER,
              search: 'executions',
            });
          },
        };
      case 'ERROR':
        return {
          text: 'Fallout ID',
          link: log?.[MR_HISTORY_RECORD_DETAILS_API_KEYS.RECORD_LOG.FALLOUT_ID],
          onId: () => navigate(routes.FALLOUT_TICKETS),
        };
      default:
        return null;
    }
  };

  return (
    <CustomSidebar
      open={open}
      onClose={onClose}
      headerTemplate={
        <StyledFlex gap="13px 0" m="23px 0 12px 0">
          <StyledText
            size={19}
            lh={23}
          >{`# ${recordDetail?.[MR_HISTORY_RECORD_DETAILS_API_KEYS.RECORD_ID]}`}</StyledText>
          <StyledText size={36} lh={44} weight={600}>
            Record Details
          </StyledText>
        </StyledFlex>
      }
    >
      {() => (
        <InfoList p="58px 26px 158px 26px">
          <RecordDetailsProcessingStatusGroup
            recordDetail={recordDetail}
            onFallout={() => navigate(routes.FALLOUT_TICKETS)}
          />
          <RecordDetailsMetadataGroup
            recordDetail={recordDetail}
            onTransformBatchId={() =>
              navigate({
                pathname: routes.MR_MANAGER,
                search: 'executions',
              })
            }
            onLoadBatchId={() =>
              navigate({
                pathname: routes.MR_MANAGER,
                search: 'executions',
              })
            }
            times={times}
          />
          <RecordDetailsLogGroup>
            {recordDetail?.[MR_HISTORY_RECORD_DETAILS_API_KEYS.LOGS].map((log, index) => (
              <RecordDetailsLogItem
                key={index}
                date={getDateTimeUsingTimezone(
                  log?.[MR_HISTORY_RECORD_DETAILS_API_KEYS.RECORD_LOG.TIME],
                  timezone,
                  'MMM d, yyyy - h:mm:ss aa'
                )}
                level={log?.[MR_HISTORY_RECORD_DETAILS_API_KEYS.RECORD_LOG.LEVEL]}
                color={getLogLevelColor(log?.[MR_HISTORY_RECORD_DETAILS_API_KEYS.RECORD_LOG.LEVEL])}
                message={log?.[MR_HISTORY_RECORD_DETAILS_API_KEYS.RECORD_LOG.MESSAGE]}
                messageLink={messageLink(log)}
              />
            ))}
          </RecordDetailsLogGroup>

          <InfoListGroup title="Record Data">
            <StyledFlex gap="24px 0">
              <RecordDataItem
                title="Source Data"
                jsonData={recordDetail?.[MR_HISTORY_RECORD_DETAILS_API_KEYS.SOURCE_DATA] || []}
                onExpand={() =>
                  onExpand({
                    title: 'Source Data',
                    json: recordDetail?.[MR_HISTORY_RECORD_DETAILS_API_KEYS.SOURCE_DATA] || [],
                  })
                }
              />
              <RecordDataItem
                title="Target Data"
                jsonData={recordDetail?.[MR_HISTORY_RECORD_DETAILS_API_KEYS.TARGET_DATA] || []}
                onExpand={() =>
                  onExpand({
                    title: 'Target Data',
                    json: recordDetail?.[MR_HISTORY_RECORD_DETAILS_API_KEYS.TARGET_DATA] || [],
                  })
                }
              />
            </StyledFlex>
          </InfoListGroup>
        </InfoList>
      )}
    </CustomSidebar>
  );
};

export default MrHistoryRecordDetails;

MrHistoryRecordDetails.propTypes = {
  executionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  recordId: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onExpand: PropTypes.func,
  times: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string,
  }),
};
