import { Legend, Tooltip } from 'recharts';

import { addSpaceBetweenWords } from '../../../../../ConverseDashboard/utils/formatters';
import { getTimezoneAbbreviation } from '../../../../../Migrate/utils/helpers';
import { StyledFlex, StyledText } from '../../../../styles/styled';

import ChartTooltip from './ChartTooltip';

export const renderChartLegend = ({ timezone, legendLabels }) => {
  const renderLegendFormatter = (value, entry, index) => {
    const customLabel = legendLabels?.find((item) => item.value === value)?.label;

    return (
      <>
        {index === 0 ? (
          <StyledFlex position="absolute" top="calc(100% - 56px - 5px - 28px)">
            <StyledText size={14} weight={600} lh={35} textAlign="center">
              {`Date/Time (${getTimezoneAbbreviation(timezone)})`}
            </StyledText>
          </StyledFlex>
        ) : null}
        <StyledText display="inline" as="span" weight={500} size={14} lh={14} textAlign="center" mr="4" capitalize>
          {addSpaceBetweenWords(customLabel || value)}
        </StyledText>
      </>
    );
  };

  return (
    <Legend
      formatter={renderLegendFormatter}
      height={56}
      wrapperStyle={{
        top: 'calc(100% - 56px - 5px + 28px)',
      }}
    />
  );
};

export const renderChartTooltip = () => (
  <Tooltip
    wrapperStyle={{
      border: 'none',
      outline: 'none',
      '&:focusVisible': {
        outline: 'none',
      },
    }}
    content={<ChartTooltip />}
    cursor={false}
    isAnimationActive={false}
    allowEscapeViewBox={{ x: false, y: false }}
  />
);
