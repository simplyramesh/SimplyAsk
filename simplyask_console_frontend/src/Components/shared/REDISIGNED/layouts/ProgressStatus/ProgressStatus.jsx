import { Popover } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { React } from 'react';

import { usePopoverToggle } from '../../../../../hooks/usePopoverToggle';
import { StyledDivider, StyledFlex, StyledText } from '../../../styles/styled';

const ProgressStatus = ({ readings, label, status, showLegend, executionType, showPercentExecuted = true }) => {
  const theme = useTheme();
  const executedList = ['Passed', 'Failed', 'Canceled'];
  const {
    id: idDetailsPopover,
    open: openDetailsPopover,
    anchorEl: anchorElDetailsPopover,
    handleClick: handleClickDetailsPopover,
    handleClose: handleCloseDetailsPopover,
  } = usePopoverToggle('export-popover');

  const color = (name) => {
    switch (name) {
      case 'Passed':
        theme.colorSchemes;
        return theme.colors.success;
      case 'Failed':
        return theme.colors.danger;
      case 'Canceled':
        return theme.colors.primary;
      case 'Executing':
        return theme.colors.statusAssigned;
      default: {
        return theme.colors.lighterColor;
      }
    }
  };

  const isShowLegend = () => showLegend !== 'none';

  const totalCases = () => accumulate(readings);

  const accumulate = (data) =>
    data.map((item) => item.value).reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const percentage = (value) => {
    const totalItems = totalCases();
    return Math.round((value / totalItems) * 100);
  };

  const executed = () => {
    const readingNames = readings.filter((item) => executedList.includes(item.name));
    const executedItems = accumulate(readingNames);
    const totalItems = totalCases();

    return Math.round((executedItems / totalItems) * 100);
  };

  const bars = () =>
    readings.map(
      (item, i) =>
        item.value > 0 && <StyledFlex key={i} backgroundColor={color(item.name)} width={`${percentage(item.value)}%`} />
    );

  const legend = (readings) =>
    readings.map((item, index) => (
      <StyledFlex direction="row" key={index}>
        <StyledText lh="25" size={30} weight={600} color={color(item.name)}>
          ●
        </StyledText>
        <StyledFlex direction="row" ml="1px" justifyContent="center">
          <StyledText>{item.name}:</StyledText>
          <StyledText ml="3px" mr="3px" weight={600}>
            {item.value}
          </StyledText>
          <StyledText>
            ({percentage(item.value)}
            %)
          </StyledText>
        </StyledFlex>
      </StyledFlex>
    ));

  const popoverDetails = () => (
    <Popover
      id={idDetailsPopover}
      open={openDetailsPopover}
      anchorEl={anchorElDetailsPopover}
      onClose={handleCloseDetailsPopover}
      sx={{
        top: 10,
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <StyledFlex p={3}>
        <StyledFlex direction="row" gap="2px">
          <StyledText>Total Test Case Executions:</StyledText>
          <StyledText weight={600}>{totalCases()}</StyledText>
        </StyledFlex>
        <StyledDivider borderWidth="2x" color={theme.colors.black} />
        <StyledFlex mt={2}>{legend(readings)}</StyledFlex>
      </StyledFlex>
    </Popover>
  );

  return (
    <StyledFlex>
      {popoverDetails()}
      <StyledText size={20} weight={600}>
        {label}
      </StyledText>
      <StyledFlex
        height={30}
        borderRadius="30px 30px 30px 30px"
        overflow="auto"
        onClick={handleClickDetailsPopover}
        direction="row"
      >
        {bars()}
      </StyledFlex>
      <StyledFlex mt={1} direction="row" justifyContent="space-between">
        <StyledFlex>
          <StyledText>{status}</StyledText>
        </StyledFlex>
        <StyledFlex direction="row" gap="2px">
          {showPercentExecuted && (
            <>
              <StyledText weight={600}>{executed()}%</StyledText>
              <StyledText>{executionType} Executed</StyledText>
            </>
          )}
        </StyledFlex>
      </StyledFlex>
      {isShowLegend() && (
        <StyledFlex mt={2} direction={showLegend}>
          {legend(readings)}
        </StyledFlex>
      )}
    </StyledFlex>
  );
};

export default ProgressStatus;
