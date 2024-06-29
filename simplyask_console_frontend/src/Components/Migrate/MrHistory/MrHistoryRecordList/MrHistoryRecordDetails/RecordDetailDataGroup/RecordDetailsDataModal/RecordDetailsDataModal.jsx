import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

import JsonViewer from '../../../../../../shared/REDISIGNED/layouts/JsonViewer/JsonViewer';
import CenterModalFixed from '../../../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import { StyledTooltip } from '../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledFlex } from '../../../../../../shared/styles/styled';
import CopyIcon from '../../../../CopyIcon/CopyIcon';
import { StyledCopyIconWrapper, StyledIconButton } from '../StyledRecordDetailsDataGroup';

const RecordDetailsDataModal = ({
  open, onClose, title, jsonData,
}) => {
  const { colors } = useTheme();

  return (
    <CenterModalFixed
      open={open}
      onClose={onClose}
      maxWidth="908px"
      title={title}
      actions={(
        <StyledTooltip
          title="Copy Data"
          arrow
          placement="top"
        >
          <StyledCopyIconWrapper
            onClick={() => navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2))}
          >
            <StyledIconButton disableRipple>
              <CopyIcon />
            </StyledIconButton>
          </StyledCopyIconWrapper>
        </StyledTooltip>
      )}
    >
      <StyledFlex
        p="26px 30px 21px 30px"
      >
        <StyledFlex
          position="relative"
          border={`2px solid ${colors.altoGray}`}
          borderRadius="10px"
        >
          <StyledFlex flex="1 1 auto" pr="18px" pb="18px" maxWidth="849px">
            <JsonViewer
              jsonData={jsonData}
              collapseStringsAfterLength={100}
            />
          </StyledFlex>
        </StyledFlex>
      </StyledFlex>
    </CenterModalFixed>
  );
};

export default RecordDetailsDataModal;

RecordDetailsDataModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  jsonData: PropTypes.arrayOf(PropTypes.object),
};
