import {
  Bar, Brush, Line, Rectangle,
} from 'recharts';

import BrushTrackerIcon from '../icons/BrushTrackerIcon';

export const renderBar = ({
  dataKey, color, hoverColor, ...props
}) => (
  <Bar
    {...props}
    barSize={12}
    dataKey={dataKey}
    fill={color}
    background={false}
    legendType="circle"
    activeBar={(activeProps) => <Rectangle {...activeProps} fill={hoverColor} />}
  />
);

export const renderLine = ({
  dataKey, color, colors, ...props
}) => (
  <Line
    {...props}
    type="monotone"
    dataKey={dataKey}
    stroke={color}
    strokeWidth="2px"
    dot={false}
    activeDot={{ fill: colors.white, stroke: color, strokeWidth: 4 }}
  />
);

export const renderAvgLine = ({ dataKey, colors }) => (
  <Line
    type="monotone"
    dataKey={dataKey}
    stroke={colors.statusUnassigned}
    strokeWidth="4px"
    dot={false}
    activeDot={{ fill: colors.white, stroke: colors.statusUnassigned, strokeWidth: 4 }}
  />
);

export const renderBrushSlide = ({
  data, dataKey, colors, ...props
}) => (
  <Brush
    {...props}
    data={data}
    dataKey={dataKey}
    height={32}
    stroke={colors.tertiary}
    traveller={(<BrushTrackerIcon />)}
    alwaysShowText
  />
);
