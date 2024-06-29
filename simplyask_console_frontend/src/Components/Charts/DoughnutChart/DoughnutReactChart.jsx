import PropTypes from 'prop-types';
import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { Doughnut } from 'react-chartjs-2';

import useUpdateEffect from '../../../hooks/useUpdateEffect';
import classes from './DoughnutChart.module.css';
import DoughnutTooltip from './DoughnutTooltip';

// CSS values from DoughnutTooltip.module.css
const PADDING_Y = 8;
const PADDING_X = 12;

const chartRefColors = { GREEN: '#5F9936', RED: '#E03B24', BLUE: '#3865A3' };
const fadedChartRefColors = { GREEN: '#A1CF91', RED: '#EE9B8F', BLUE: '#B5C7DF' };
const backgroundColor = [
  chartRefColors.GREEN, chartRefColors.RED, chartRefColors.BLUE, chartRefColors.BLUE, chartRefColors.RED, chartRefColors.RED, chartRefColors.BLUE,
];
const fadedChartColors = [
  fadedChartRefColors.GREEN, fadedChartRefColors.RED, fadedChartRefColors.BLUE, fadedChartRefColors.BLUE, fadedChartRefColors.RED, fadedChartRefColors.RED, fadedChartRefColors.BLUE,
];

const chooseColor = (hoveringData, chartBreakDownOrder = false) => {
  if (chartBreakDownOrder) {
    return chartBreakDownOrder.map((c, i) => {
      if (i === hoveringData.index) return hoveringData.color;
      return c.fadedBackgroundColor;
    });
  }

  return backgroundColor.map((c, i) => {
    if (i === hoveringData.index) return hoveringData.color;
    return fadedChartColors[i];
  });
};

const ReactDoughnut = ({
  config,
  chartSize,
  centerTextManually = { labelText: '', value: false, label: '' },
  chartBreakDownOrder,
  hideCenterTextTransitions = false,
  unBoldTooltipText = false,
  showCursorOnHover = false,
  showTooltipWithoutCenterTextManuallyDependency = false,
  ShowNewCenteredComponent,
}) => {
  const { options, data } = config;

  // tooltip states
  const [text, setText] = useState(centerTextManually);
  const [initCenterTextManually, setInitCenterTextManually] = useState({ value: false, label: '', labelText: '' });
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipData, setTooltipData] = useState(['', '', '']);
  const [tooltipPos, setTooltipPos] = useState(null);
  const [align, setAlign] = useState({ x: 'left', y: 'center' });
  // chart background color on hover states
  const [hoveringData, setHoveringData] = useState({ index: -1, color: '' });
  const [newData, setNewData] = useState(data);

  const doughnutRef = useRef(null);
  const [isHoveringOnChart, setIsHoveringOnChart] = useState(false);

  useEffect(() => {
    if (centerTextManually) setInitCenterTextManually(centerTextManually);
  }, []);

  useEffect(() => {
    if (!isHoveringOnChart) {
      setIsTooltipVisible(false);
    }
  }, [isHoveringOnChart]);

  // normal useEffect will render an empty tooltip on the chart, on initial render.
  useUpdateEffect(() => {
    const { value, label, labelText } = initCenterTextManually;

    if (
      centerTextManually.value !== value
      || centerTextManually.label !== label
      || centerTextManually.labelText !== labelText
    ) {
      setText(centerTextManually);
      setIsTooltipVisible(true);
    }

    if (showTooltipWithoutCenterTextManuallyDependency && isHoveringOnChart) {
      setIsTooltipVisible(true);
    } else if (
      centerTextManually.value === value
      && centerTextManually.label === label
      && centerTextManually.labelText === labelText && !showTooltipWithoutCenterTextManuallyDependency
    ) {
      setIsTooltipVisible(false);
    }
  }, [centerTextManually, isHoveringOnChart]);

  // useCallback with empty array dependency is essential for custom tooltip to work.
  const customTooltip = useCallback((context) => {
    if (!doughnutRef.current) return;

    if (context.opacity === 0) {
      setIsTooltipVisible(false);
      return;
    }

    // caretX and caretY point to center of arc.
    let x = context.caretX;
    let y = context.caretY;

    if (
      context.x < doughnutRef.current.chartInstance.width / 2
      && context.x !== doughnutRef.current.chartInstance.width / 2
    ) {
      x -= context.width - PADDING_X;
      y -= context.height - PADDING_Y;
      setAlign({ x: 'left', y: 'top' });
    }

    if (context.caretX === (doughnutRef.current.chartInstance.width / 2)) {
      x = context.x;
      setAlign({ x: 'center', y: 'center' });
    }

    if (context.caretY > (doughnutRef.current.chartInstance.height / 2)) y += context.height - PADDING_Y;

    if (context.caretX > (doughnutRef.current.chartInstance.width / 2)) {
      x += (context.width) - PADDING_X;
      setAlign({ x: 'right', y: 'bottom' });
    }

    setTooltipPos({ top: y, left: x });
    setTooltipData(context.body[0].lines?.join(' ').split(' ').filter((v) => v !== ''));
  }, []);

  const handleOnHover = (e, elements, showCursorOnHover) => {
    if (showCursorOnHover) { e.target.style.cursor = 'pointer'; }

    if (elements[0]?._model.label === centerTextManually?.labelText) return;

    if (elements[0] === undefined || elements[0]?._index !== hoveringData.index) {
      setNewData(({
        ...data,
        datasets: [{
          backgroundColor,
          ...data.datasets[0],
        }],
      }));
      setIsTooltipVisible(false);
      setText(initCenterTextManually);
    }

    setHoveringData(({
      index: elements[0]?._index >= 0 ? elements[0]._index : -1,
      color: elements[0]?._model.backgroundColor
        ? elements[0]._model.backgroundColor
        : '',
    }));
  };

  useEffect(() => {
    if (hoveringData.index >= 0) {
      setNewData(({
        ...data,
        datasets: [{ ...data.datasets[0], backgroundColor: chooseColor(hoveringData, chartBreakDownOrder) }],
      }));
    }
  }, [hoveringData.index]);

  const opts = useMemo(() => ({
    ...options,
    interaction: { mode: 'index', intersect: false },
    onHover: (event, elements) => (handleOnHover(event, elements, showCursorOnHover)),
    tooltips: {
      ...options.tooltips,
      enabled: false,
      xAlign: align.x,
      yAlign: align.y,
      custom: customTooltip,
    },
  }));

  return (
    <>
      <div
        className={classes.relative}
        onMouseEnter={() => setIsHoveringOnChart(true)}
        onMouseLeave={() => setIsHoveringOnChart(false)}
      >
        <Doughnut
          ref={doughnutRef}
          id="myChart"
          width={chartSize}
          height={chartSize}
          data={newData}
          options={opts}
        />

        {(() => {
          if (ShowNewCenteredComponent) return <ShowNewCenteredComponent />;

          if (!hideCenterTextTransitions && centerTextManually?.value) {
            return (
              <div className={`${classes.absolute_center} ${classes.text_center} ${classes.fadeIn}`}>
                <p className={classes.text}>{text?.label}</p>
                <p className={classes.textLabel}>{text?.labelText}</p>
              </div>
            );
          }

          if (hideCenterTextTransitions && centerTextManually?.value) {
            return (
              <div className={`${classes.absolute_center} ${classes.text_center} ${classes.fadeIn}`}>
                <p className={`${classes.text} ${classes.largeText}`}>{text?.label}</p>
              </div>
            );
          }
        })()}

        <DoughnutTooltip isVisible={isTooltipVisible} data={tooltipData} position={tooltipPos} unBoldTooltipText={unBoldTooltipText} />
      </div>
    </>
  );
};
export default ReactDoughnut;

ReactDoughnut.defaultProps = {
  chartSize: 180,
};

ReactDoughnut.propTypes = {
  config: PropTypes.object,
  chartSize: PropTypes.number,
  centerTextManually: PropTypes.object,
  chartBreakDownOrder: PropTypes.array,
  hideCenterTextTransitions: PropTypes.bool,
  unBoldTooltipText: PropTypes.bool,
  showCursorOnHover: PropTypes.bool,
  showTooltipWithoutCenterTextManuallyDependency: PropTypes.bool,
  ShowNewCenteredComponent: PropTypes.func,
};
