import { useTheme } from '@mui/material/styles';

import { StyledFlex, StyledText } from '../../../../shared/styles/styled';

const UsageChartTooltip = ({ payload, yPos }) => {
  const { colors } = useTheme();

  const renderTooltip = () => {
    return (
      <StyledFlex
        backgroundColor={colors.white}
        borderRadius="5px"
        boxShadow="0px 0px 4px 2px rgba(0, 0, 0, 0.15)"
        width="170px"
        height="fit-content"
        gap="4px 0"
        transform={`translate(0, ${yPos / 2}px)`}
      >
        <StyledFlex
          backgroundColor={colors.tertiary}
          width="100%"
          padding="8px 12px"
          borderRadius="5px 5px 0 0"
        >
          <StyledText size={14} lh={17} weight={600}>{payload?.[0]?.payload?.date}</StyledText>
        </StyledFlex>
        <StyledFlex p="0 6px">
          <StyledFlex
            as="p"
            direction="row"
            gap="0 4px"
            alignItems="center"
            justifyContent="flex-"
            p="0 6px"
          >
            <StyledText as="span" size={14} lh={35} weight={700}>{payload?.[0]?.value}</StyledText>
            <StyledText as="span" size={14} lh={17}>{payload?.[0]?.payload?.totalUsageUnits}</StyledText>
          </StyledFlex>
          {/* <StyledDivider borderWidth={1.5} color={colors.primary} /> // For future use
          <StyledFlex
            direction="row"
            gap="0 4px"
            p="0 6px"
            alignItems="center"
            justifyContent="flex-start"
          >
            <StyledFlex
              as="span"
              width="14px"
              height="14px"
              borderRadius="50%"
              backgroundColor={colors.mistyRose}
            />
            <StyledText as="span" size={14} lh={35}>IVA Handled:</StyledText>
            <StyledText as="span" size={14} lh={35} weight={700}>610</StyledText>
          </StyledFlex>
          <StyledFlex
            direction="row"
            gap="0 4px"
            p="0 6px"
            alignItems="center"
            justifyContent="flex-start"
            mt="-8px"
          >
            <StyledFlex
              as="span"
              width="14px"
              height="14px"
              borderRadius="50%"
              backgroundColor={colors.secondary}
              mr="3px"
            />
            <StyledText as="span" size={14} lh={35}>Transferred:</StyledText>
            <StyledText as="span" size={14} lh={35} weight={700}>310</StyledText>
          </StyledFlex> */}
        </StyledFlex>
      </StyledFlex>
    );
  };

  return (
    <>
      {yPos ? renderTooltip() : <div />}
    </>
  );
};

export default UsageChartTooltip;
