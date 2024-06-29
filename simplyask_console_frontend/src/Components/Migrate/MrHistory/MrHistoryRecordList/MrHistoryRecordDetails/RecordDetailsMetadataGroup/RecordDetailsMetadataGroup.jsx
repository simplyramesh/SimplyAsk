import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

import { useUser } from '../../../../../../contexts/UserContext';
import InfoListGroup from '../../../../../shared/REDISIGNED/layouts/InfoList/InfoListGroup';
import InfoListItem from '../../../../../shared/REDISIGNED/layouts/InfoList/InfoListItem';
import { StyledText } from '../../../../../shared/styles/styled';
import { getDateTimeUsingTimezone, getTimezoneAbbreviation } from '../../../../utils/helpers';
import { MR_HISTORY_RECORD_LIST_API_KEYS } from '../../../../utils/mappers';

const RecordDetailsMetadataGroup = (props) => {
  const {
    recordDetail,
    times,
    onTransformBatchId = () => { },
    onLoadBatchId = () => { },
  } = props;

  const { user: { timezone } } = useUser();

  const { colors } = useTheme();

  const transformBatchId = recordDetail?.[MR_HISTORY_RECORD_LIST_API_KEYS.TRANSFORM_BATCH_ID] || '---';
  const transformBatchIdColor = recordDetail?.[MR_HISTORY_RECORD_LIST_API_KEYS.TRANSFORM_BATCH_ID]
    ? colors.linkColor
    : colors.primary;

  const loadBatchId = recordDetail?.[MR_HISTORY_RECORD_LIST_API_KEYS.LOAD_BATCH_ID] || '---';
  const loadBatchIdColor = recordDetail?.[MR_HISTORY_RECORD_LIST_API_KEYS.LOAD_BATCH_ID]
    ? colors.linkColor
    : colors.primary;

  return (
    <InfoListGroup title="Record Metadata">
      <InfoListItem name="Transform Batch ID">
        <StyledText textAlign="right" color={transformBatchIdColor} cursor="pointer" onClick={onTransformBatchId}>
          {`${transformBatchId}`}
        </StyledText>
      </InfoListItem>
      <InfoListItem name="Load Batch ID">
        <StyledText textAlign="right" color={loadBatchIdColor} cursor="pointer" onClick={onLoadBatchId}>
          {`${loadBatchId}`}
        </StyledText>
      </InfoListItem>
      <InfoListItem name={`Start Time (${getTimezoneAbbreviation(timezone)})`}>
        {getDateTimeUsingTimezone(times?.start, timezone)}
      </InfoListItem>
      <InfoListItem name={`End Time (${getTimezoneAbbreviation(timezone)})`}>
        {getDateTimeUsingTimezone(times?.end, timezone)}
      </InfoListItem>
    </InfoListGroup>
  );
};

export default RecordDetailsMetadataGroup;

RecordDetailsMetadataGroup.propTypes = {
  recordDetail: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  times: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string,
  }),
  onTransformBatchId: PropTypes.func,
  onLoadBatchId: PropTypes.func,
};
