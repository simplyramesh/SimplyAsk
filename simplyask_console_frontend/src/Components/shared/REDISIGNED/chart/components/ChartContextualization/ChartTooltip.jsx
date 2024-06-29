import { useTheme } from '@emotion/react';
import { isValid } from 'date-fns';
import { useGetCurrentUser } from '../../../../../../hooks/useGetCurrentUser';
import { getInFormattedUserTimezone } from '../../../../../../utils/timeUtil';
import { addSpaceBetweenWords } from '../../../../../ConverseDashboard/utils/formatters';
import { StyledDivider, StyledFlex, StyledText } from '../../../../styles/styled';

const ChartTooltip = ({ active, payload, label }) => {
  const { colors, boxShadows } = useTheme();

  const { currentUser } = useGetCurrentUser();

  const showTooltip = active && isValid(new Date(label));

  const timeFormat = payload?.[0]?.payload?.timeFormat ?? 'LLL dd - HH:mm';
  const hasTooltipLabel =
    payload?.[0]?.payload?.tooltipLabel && payload?.[0]?.payload?.tooltipLabel !== 0
      ? payload?.[0]?.payload?.tooltipLabel
      : '';
  const tooltipLabel = hasTooltipLabel || 'minutes';

  const renderTooltip = () => (
    <StyledFlex
      backgroundColor={colors.white}
      borderRadius="5px"
      boxShadow={boxShadows.table}
      width="250px"
      height="fit-content"
      gap="4px 0"
    >
      <StyledFlex backgroundColor={colors.tertiary} width="100%" padding="8px 12px" borderRadius="5px 5px 0 0">
        <StyledText size={14} lh={17} weight={600} capitalize>
          {getInFormattedUserTimezone(label, currentUser?.timezone, timeFormat)}
        </StyledText>
      </StyledFlex>
      <StyledFlex p="0 6px">
        {payload.length < 2 ? (
          <>
            <StyledText as="p" size={14} lh={35} weight={700}>
              {payload.reduce((acc, p) => acc + p.payload[p.name], 0)}
              <StyledText display="inline" size={14} lh={17}>{` ${tooltipLabel}`}</StyledText>
            </StyledText>
            {/*  NOTE: When there are more than one channels, remove condition */}
            {hasTooltipLabel ? <StyledDivider borderWidth={1.5} color={`${colors.primary}66`} /> : null}
          </>
        ) : null}

        {payload.length > 1 &&
          payload.map((p, index) => (
            <StyledFlex
              key={index}
              direction="row"
              gap="0 12px"
              p="0 6px"
              alignItems="center"
              justifyContent="flex-start"
            >
              <StyledFlex as="span" width="14px" height="14px" borderRadius="50%" backgroundColor={p.color} />
              <StyledText as="p" size={14} lh={35} capitalize wrap="nowrap">
                {hasTooltipLabel && p.name !== 'movingAverage'
                  ? `${hasTooltipLabel}: `
                  : `${addSpaceBetweenWords(p.name)}: `}
                <StyledText as="span" display="inline" size={14} lh={35} weight={700}>
                  {+p.payload[p.name].toFixed(2)}
                </StyledText>
              </StyledText>
            </StyledFlex>
          ))}
      </StyledFlex>
    </StyledFlex>
  );

  return showTooltip ? renderTooltip() : <div />;
};

export default ChartTooltip;
