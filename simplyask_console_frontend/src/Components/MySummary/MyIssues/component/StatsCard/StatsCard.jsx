import PropTypes from 'prop-types';
import React from 'react';

import CustomTableIcons from '../../../../shared/REDISIGNED/icons/CustomTableIcons';
import { StyledTooltip } from '../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledText } from '../../../../shared/styles/styled';
import {
  StyledStatsCard, StyledStatsCardCount, StyledStatsCardIcon, StyledStatsCardTitle,
} from './StyledStatsCard';
import Spinner from '../../../../shared/Spinner/Spinner';

const StatsCard = ({
  Icon, title, tooltip, count, isLoading,
}) => {

  return (
    <StyledStatsCard>
      { title && !isLoading
        ? (<>
          <StyledStatsCardIcon><Icon /></StyledStatsCardIcon>
          <StyledStatsCardTitle>
            <StyledText
              size={16}
              lh={24}
              weight={500}
              textAlign="center"
            >
              {title}
              <StyledTooltip
                title={tooltip}
                arrow
                placement="top"
                size="12px"
                lh="1.5"
                weight="500"
                radius="67px"
              >
                <CustomTableIcons icon="INFO" width={20} display="inline" margin="0 0 0 4px" />
              </StyledTooltip>
            </StyledText>
          </StyledStatsCardTitle>
          <StyledStatsCardCount>
            <StyledText as="h3" size={24} weight={600} lh={30}>{count}</StyledText>
          </StyledStatsCardCount>
        </>)
        : <Spinner inline medium/>
      }
    </StyledStatsCard>
  );
};

StatsCard.propTypes = {
  Icon: PropTypes.elementType,
  title: PropTypes.string,
  tooltip: PropTypes.string,
  count: PropTypes.number,
};

export default StatsCard;
