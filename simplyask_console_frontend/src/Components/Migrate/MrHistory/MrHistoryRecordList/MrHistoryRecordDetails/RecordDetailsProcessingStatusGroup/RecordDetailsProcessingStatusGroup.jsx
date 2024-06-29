import PropTypes from 'prop-types';

import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InfoListGroup from '../../../../../shared/REDISIGNED/layouts/InfoList/InfoListGroup';
import InfoListItem from '../../../../../shared/REDISIGNED/layouts/InfoList/InfoListItem';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { sidebarStagesSharedProps } from '../../../../utils/helpers';
import { MR_HISTORY_RECORD_DETAILS_API_KEYS } from '../../../../utils/mappers';
import CurrentStageDiagram from './StageInfoListItem/CurrentStageDiagram/CurrentStageDiagram';
import StageInfoListItem from './StageInfoListItem/StageInfoListItem';

const RecordDetailsProcessingStatusGroup = ({ recordDetail, onFallout = () => { } }) => {
  const sidebarStages = [
    {
      title: 'Extraction',
      stageColor: 'violet',
      borderRadius: '25px 0 0 25px',
      ...sidebarStagesSharedProps(recordDetail?.[MR_HISTORY_RECORD_DETAILS_API_KEYS.RECORD_STAGE]),
    },
    {
      title: 'Transformation',
      stageColor: 'blueberry',
      borderRadius: '0',
      ...sidebarStagesSharedProps(recordDetail?.[MR_HISTORY_RECORD_DETAILS_API_KEYS.RECORD_STAGE]),
    },
    {
      title: 'Loading',
      stageColor: 'marinerBlue',
      borderRadius: '0',
      ...sidebarStagesSharedProps(recordDetail?.[MR_HISTORY_RECORD_DETAILS_API_KEYS.RECORD_STAGE]),
    },
    {
      title: 'Post-Loading',
      stageColor: 'easternBlue',
      borderRadius: '0',
      ...sidebarStagesSharedProps(recordDetail?.[MR_HISTORY_RECORD_DETAILS_API_KEYS.RECORD_STAGE]?.replace(/_/g, '-')),
    },
    {
      title: 'Result',
      stageColor: 'greenOnion',
      borderRadius: '0 25px 25px 0',
      ...sidebarStagesSharedProps(recordDetail?.[MR_HISTORY_RECORD_DETAILS_API_KEYS.RECORD_STAGE]),
    },
  ];

  return (
    <InfoListGroup title="Processing Status">
      <InfoListItem name="Status">
        <StyledText capitalize textAlign="right">
          {recordDetail?.[MR_HISTORY_RECORD_DETAILS_API_KEYS.RECORD_STATUS]?.toLowerCase()}
        </StyledText>
      </InfoListItem>
      <InfoListItem name="Status Details">
        {
          recordDetail?.[MR_HISTORY_RECORD_DETAILS_API_KEYS.RECORD_STATUS]?.toLowerCase() === 'fallout'
            ? (
              <StyledFlex alignItems="flex-end">
                <StyledButton variant="text" onClick={onFallout}>View Fallout</StyledButton>
              </StyledFlex>
            )
            : '---'
        }
      </InfoListItem>
      {/* InfoListItem for Stage */}
      <StageInfoListItem name="Stage">
        <CurrentStageDiagram positions={sidebarStages} />
      </StageInfoListItem>
    </InfoListGroup>
  );
};

export default RecordDetailsProcessingStatusGroup;

RecordDetailsProcessingStatusGroup.propTypes = {
  recordDetail: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  onFallout: PropTypes.func,
};
