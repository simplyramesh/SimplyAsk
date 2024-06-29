import ZoomOutMapRoundedIcon from '@mui/icons-material/ZoomOutMapRounded';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

import CustomScrollbar from '../../../../../../shared/REDISIGNED/layouts/CustomScrollbar/CustomScrollbar';
import JsonViewer from '../../../../../../shared/REDISIGNED/layouts/JsonViewer/JsonViewer';
import { StyledTooltip } from '../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledCard, StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import CopyIcon from '../../../../CopyIcon/CopyIcon';
import { StyledIconButton } from '../StyledRecordDetailsDataGroup';

const RecordDataItem = ({ jsonData = {}, title, onExpand }) => {
  const { colors } = useTheme();

  return (
    <StyledFlex mt="11px">
      <StyledFlex mb="25px">
        <StyledText weight={500} lh={18}>{title}</StyledText>
      </StyledFlex>
      <StyledCard>
        <StyledFlex direction="row" position="relative" maxHeight="288px">
          <StyledFlex flex="1 1 auto" mr="-14px">
            <CustomScrollbar
              autoHeight
              autoHeightMin="244px"
              autoHeightMax="244px"
              thumbWidth="8px"
              thumbColor={colors.scrollThumbBgAlt}
              trackColor={colors.white}
              radius="15px"
            >
              <StyledFlex flex="1 1 200px" pr="18px" pb="16px" maxWidth="476px">
                <JsonViewer
                  jsonData={jsonData}
                  collapseStringsAfterLength={35}
                  styles={{
                    backgroundColor: colors.white,
                  }}
                />
              </StyledFlex>
            </CustomScrollbar>
          </StyledFlex>
          <StyledFlex direction="row" gap="0 20px" position="absolute" top="0" right="0">
            <StyledTooltip
              title="Copy Data"
              arrow
              placement="top"
            >
              <StyledIconButton
                edge="start"
                disableRipple
                onClick={() => navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2))}
              >
                <CopyIcon />
              </StyledIconButton>
            </StyledTooltip>
            <StyledIconButton
              edge="start"
              disableRipple
              onClick={onExpand}
            >
              <ZoomOutMapRoundedIcon />
            </StyledIconButton>
          </StyledFlex>
        </StyledFlex>
      </StyledCard>
    </StyledFlex>
  );
};

export default RecordDataItem;

RecordDataItem.propTypes = {
  title: PropTypes.string,
  jsonData: PropTypes.arrayOf(PropTypes.object),
  onExpand: PropTypes.func,
};
