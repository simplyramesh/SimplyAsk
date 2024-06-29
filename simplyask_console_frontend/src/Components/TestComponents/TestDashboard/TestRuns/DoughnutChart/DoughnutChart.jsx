import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

import { StyledFlex } from '../../../../shared/styles/styled';
import DoughnutChartCenterText from './DoughnutChartCenterText/DoughnutChartCenterText';
import DoughnutChartTooltip from './DoughnutChartTooltip/DoughnutChartTooltip';

const applyChartSize = (chart, width) => {
  chart.canvas.parentNode.style.width = `${width}px`;
  chart.canvas.parentNode.style.height = `${width}px`;
};

/* re-arranging tooltip text - in the future, a function can be passed in as a prop to customize the tooltip text */
const getTooltipString = (context) => {
  const tooltipStr = context.body[0].lines?.join(' ').split(' ').filter((v) => v !== '').join(' ');
  const removedColon = tooltipStr.replace(':', '');

  return removedColon;
};

const getTooltipData = (tooltipStr) => {
  const tooltipData = tooltipStr.split(' ');
  const numberIndex = tooltipData.findIndex((item) => !Number.isNaN(Number(item)));

  const number = tooltipData.splice(numberIndex, 1);
  tooltipData.unshift(number[0]);

  return tooltipData;
};

const getTooltipTextData = (context) => {
  if (!context.body) return [];

  const tooltipStr = getTooltipString(context);
  const tooltipData = getTooltipData(tooltipStr);

  return formatTooltipData(tooltipData);
};

const formatTooltipData = (tooltipData) => {
  if (tooltipData[0] > 1) {
    tooltipData[1] = `${tooltipData[1]}s`;
  }

  tooltipData[0] = <strong>{`${tooltipData[0]}`}</strong>;

  return tooltipData;
};
/* end re-arranging tooltip text */

const newChartBgColors = (previous, arcIndex, bgColors, hoverBgColors) => {
  const clonedPrev = { ...previous };
  const newBgColors = bgColors.map((color, index) => (index !== arcIndex ? hoverBgColors[index] : color));

  return {
    ...clonedPrev,
    datasets: [
      {
        ...clonedPrev.datasets[0],
        backgroundColor: newBgColors,
      },
    ],
  };
};

// TODO: add a getTooltipData prop which allows for customizing the tooltip text
const DoughnutChart = ({ data, chartWidth, ...props }) => {
  const { colors } = useTheme();

  const dataItems = data.map((item) => item.dataItem);
  const bgColors = data.map((item) => item.bgColor);
  const hoverBgColors = data.map((item) => item.hoverBgColor);
  const labels = data.map((item) => item.label);
  const borderWidths = data.map(() => 5);
  const centerTextArr = data.map((item) => item.centerText);

  const [chartData, setChartData] = useState({
    labels,
    datasets: [
      {
        label: 'Passed',
        data: dataItems,
        backgroundColor: bgColors,
        hoverBackgroundColor: hoverBgColors,
        borderWidth: borderWidths,
        borderColor: colors.bgColorOptionTwo,
        cutoutPercentage: 25,
        offset: 50,
      },
    ],
  });

  // TODO: for reusability, implement a method to set whether there is always a center text or not
  const [centerText, setCenterText] = useState({ show: true, textArr: centerTextArr[0] });

  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipData, setTooltipData] = useState([]);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const doughnutChartRef = useRef(null);

  const chartSizePlugin = {
    id: 'chartSizePlugin',
    beforeInit(chart) {
      applyChartSize(chart, chartWidth || 130);
    },
  };

  const externalTooltipHandler = (context, chartRef) => {
    if (!chartRef.current) return;

    if (context.opacity === 0) {
      setIsTooltipVisible(false);
      setChartData(newChartBgColors(chartData, 0, bgColors, bgColors));

      return;
    }

    const { width, height } = chartRef.current.chartInstance;
    const {
      width: tooltipWidth, height: tooltipHeight, xAlign, yAlign, yPadding,
    } = context;

    const arcIndex = context.dataPoints[0]?.index;

    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const tipWidth = xAlign === 'center' ? tooltipWidth / 2 : tooltipWidth;
    const tipHeight = yAlign === 'center' ? tooltipHeight / 2 : tooltipHeight;

    const xQuadrant = context.caretX >= halfWidth ? context.x + tipWidth : context.x - tipWidth;
    const yQuadrant = context.caretY >= halfHeight ? context.y + tipHeight : context.y - tipHeight;

    const extraY = context.caretY >= halfHeight ? yPadding / 2 : -yPadding / 2;

    setChartData(newChartBgColors(chartData, arcIndex, bgColors, hoverBgColors));

    setIsTooltipVisible(true);
    setTooltipPosition({ top: yQuadrant + extraY, left: xQuadrant });
    setTooltipData(getTooltipTextData(context));

    setCenterText({ show: true, textArr: centerTextArr[arcIndex] });
  };

  const options = {
    interaction: { intersect: false },
    responsive: true,
    maintainAspectRatio: false,
    defaultFontColor: colors.primary,
    defaultFontFamily: 'Montserrat',
    defaultFontSize: 16,
    legend: {
      display: false,
    },
    tooltips: {
      mode: 'index',
      bodyFontColor: colors.white,
      bodyFontFamily: 'Montserrat',
      bodyFontSize: 16,
      caretSize: 0,
      enabled: false,
      custom: (context) => externalTooltipHandler(context, doughnutChartRef),
    },
    chartWidth,
  };

  return (
    <StyledFlex
      position="relative"
      flex={`1 1 ${chartWidth || 130}px`}
      onMouseLeave={() => {
        setIsTooltipVisible(false);
        setChartData(newChartBgColors(chartData, 0, bgColors, bgColors));
        setCenterText({ show: true, textArr: centerTextArr[0] });
      }}
    >
      <Doughnut
        options={options}
        data={chartData}
        plugins={[chartSizePlugin]}
        {...props}
        ref={doughnutChartRef}
      />
      <DoughnutChartTooltip isVisible={isTooltipVisible} data={tooltipData} position={tooltipPosition} />
      {centerText.show && <DoughnutChartCenterText textData={centerText.textArr} />}
    </StyledFlex>
  );
};

export default DoughnutChart;

DoughnutChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    dataItem: PropTypes.number,
    bgColor: PropTypes.string,
    label: PropTypes.string,
    centerText: PropTypes.array,
  })),
  chartWidth: PropTypes.number,
};
