import { useTheme } from '@mui/material';
import React from 'react';

import { getPercentage } from '../../../Managers/TestManager/utils/helpers';
import { StyledDivider, StyledFlex, StyledText } from '../../styles/styled';
import { StyledTooltip } from '../tooltip/StyledTooltip';

const ProgressBar = ({
  data = [], entityName, disableTooltip = false, hideNulls,
}) => {
  const { colors, boxShadows } = useTheme();

  const total = data.reduce((acc, item) => acc + item.count, 0);

  const filterFn = hideNulls ? (item) => item.count > 0 : () => true;
  const filteredData = data.filter(filterFn);

  const getTooltipTemplate = () => (
    <StyledFlex>
      <StyledText weight={500} size={15} lh={15}>
        Total
        {' '}
        {entityName}
        :
        <StyledText size={15} weight={700} lh={15} display="inline">
          {total}
        </StyledText>
      </StyledText>

      <StyledDivider height="1px" color={colors.cardGridItemBorder} m="16px 0" />

      <StyledFlex gap={1.25}>
        { filteredData.map((item, index) => (
          <StyledFlex key={index} direction="row" alignItems="center">
            <StyledFlex width="10px" height="10px" borderRadius="100%" backgroundColor={item.color} mr={1} />
            <StyledText size={15} weight={500} lh={15} color={colors.primary}>
              {item.label}
              :
              <StyledText size={15} weight={700} lh={15} display="inline">
                {item.count}
                  &nbsp;
              </StyledText>
              (
              {getPercentage(item.count, total, 2)}
              %)
            </StyledText>
          </StyledFlex>
        ))}
      </StyledFlex>
    </StyledFlex>
  );

  return (
    <StyledTooltip
      title={getTooltipTemplate()}
      maxWidth="280px"
      p="15px"
      bgTooltip={colors.white}
      placement="top"
      arrow
      boxShadow={boxShadows.box}
      disableHoverListener={disableTooltip}
    >
      <StyledFlex width="100%" height="25px" borderRadius="60px" direction="row" overflow="hidden">
        { filteredData.map((item, index) => (
          <StyledFlex
            key={index}
            width={`${getPercentage(item.count, total, 2)}%`}
            backgroundColor={item.color}
            height="100%"
          />
        ))}
      </StyledFlex>
    </StyledTooltip>
  );
};

export default ProgressBar;
