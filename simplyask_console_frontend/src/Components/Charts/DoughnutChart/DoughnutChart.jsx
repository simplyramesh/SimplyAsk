import { Chart } from 'chart.js';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import classes from './DoughnutChart.module.css';

const DoughnutChart = ({
  config, chartSize = 180, centerTextManually,
}) => {
  const chartRef = React.createRef();

  useEffect(() => {
    const ctx = chartRef.current;

    // round corners
    Chart.pluginService.register({
      afterUpdate(chart) {
        if (chart.config.options.elements.arc.roundedCornersFor !== undefined) {
          const arc = chart.getDatasetMeta(0).data[
            chart.config.options.elements.arc.roundedCornersFor
          ];
          arc.round = {
            x: (chart.chartArea.left + chart.chartArea.right) / 2,
            y: (chart.chartArea.top + chart.chartArea.bottom) / 2,
            radius: (chart.outerRadius + chart.innerRadius) / 2,
            thickness: (chart.outerRadius - chart.innerRadius) / 2 - 1,
            backgroundColor: arc._model.backgroundColor,
          };
        }
      },

      afterDraw(chart) {
        if (chart.config.options.elements.arc.roundedCornersFor !== undefined) {
          const { ctx } = chart.chart;
          const arc = chart.getDatasetMeta(0).data[
            chart.config.options.elements.arc.roundedCornersFor
          ];
          const startAngle = Math.PI / 2 - arc._view.startAngle;
          const endAngle = Math.PI / 2 - arc._view.endAngle;

          ctx.save();
          ctx.translate(arc.round.x, arc.round.y);

          ctx.fillStyle = arc.round.backgroundColor;
          ctx.beginPath();
          ctx.arc(
            arc.round.radius * Math.sin(startAngle),
            arc.round.radius * Math.cos(startAngle),
            arc.round.thickness,
            0,
            2 * Math.PI,
          );
          ctx.arc(
            arc.round.radius * Math.sin(endAngle),
            arc.round.radius * Math.cos(endAngle),
            arc.round.thickness,
            0,
            2 * Math.PI,
          );
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      },
    });

    // write text plugin
    Chart.pluginService.register({
      beforeDraw(chart) {
        if (chart.config.options.elements.center) {
          // Get ctx from string
          const { ctx } = chart.chart;

          // Get options from the center object in options
          const centerConfig = chart.config.options.elements.center;
          const fontStyle = 'bold';
          const txt = centerConfig.text;
          const color = centerConfig.color || '#000';
          const maxFontSize = centerConfig.maxFontSize || 75;
          const sidePadding = centerConfig.sidePadding || 20;
          const sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2);
          // Start with a base font of 30px

          ctx.font = `30px ${fontStyle}`;

          // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
          const stringWidth = ctx.measureText(txt).width;
          const elementWidth = chart.innerRadius * 2 - sidePaddingCalculated;

          // Find out how much the font can grow in width.
          const widthRatio = elementWidth / stringWidth;
          const newFontSize = Math.floor(30 * widthRatio);
          const elementHeight = chart.innerRadius * 2;

          // Pick a new font size so it will not be larger than the height of label.
          let fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
          let { minFontSize } = centerConfig;
          const lineHeight = centerConfig.lineHeight || 25;
          let wrapText = false;

          if (minFontSize === undefined) {
            minFontSize = 20;
          }

          if (minFontSize && fontSizeToUse < minFontSize) {
            fontSizeToUse = minFontSize;
            wrapText = true;
          }

          // Set font settings to draw it correctly.
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
          let centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
          ctx.font = `${fontSizeToUse}px ${fontStyle}`;
          ctx.fillStyle = color;

          if (!wrapText) {
            ctx.fillText(txt, centerX, centerY);
            return;
          }

          const words = txt.split(' ');
          let line = '';
          const lines = [];

          // Break words up into multiple lines if necessary
          for (let n = 0; n < words.length; n++) {
            const testLine = `${line + words[n]} `;
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > elementWidth && n > 0) {
              lines.push(line);
              line = `${words[n]} `;
            } else {
              line = testLine;
            }
          }

          // Move the center up depending on line height and number of lines
          centerY -= (lines.length / 2) * lineHeight;

          for (let n = 0; n < lines.length; n++) {
            ctx.fillText(lines[n], centerX, centerY);
            centerY += lineHeight;
          }
          // Draw text in center
          ctx.fillText(line, centerX, centerY);
        }
      },
    });

    new Chart(ctx, config);
  }, []);

  return (
    <div className={classes.relative}>
      <canvas
        ref={chartRef}
        id="myChart"
        width={chartSize}
        height={chartSize}
      />
      {centerTextManually?.value && (
        <div className={`${classes.absolute_center} ${classes.text_center}`}>
          <p className={classes.text}>{centerTextManually?.label}</p>
          <p className={classes.textLabel}>{centerTextManually?.labelText}</p>
        </div>
      )}
    </div>
  );
};

export default React.memo(DoughnutChart);

DoughnutChart.propTypes = {
  chartSize: PropTypes.number,
  centerTextManually: PropTypes.shape({
    value: PropTypes.bool,
    label: PropTypes.string,
    labelText: PropTypes.string,
  }),
  config: PropTypes.shape({
    type: PropTypes.string,
    data: PropTypes.shape({
      labels: PropTypes.arrayOf(PropTypes.string),
      datasets: PropTypes.arrayOf(
        PropTypes.shape({
          data: PropTypes.arrayOf(PropTypes.number),
          backgroundColor: PropTypes.arrayOf(PropTypes.string),
          borderWidth: PropTypes.arrayOf(PropTypes.number),
        }),
      ),
    }),
    options: PropTypes.shape({
      cutoutPercentage: PropTypes.number,
      devicePixelRatio: PropTypes.number,
      legend: PropTypes.shape({
        display: PropTypes.bool,
        position: PropTypes.string,
      }),
      elements: PropTypes.shape({
        arc: PropTypes.shape({
          roundedCornersFor: PropTypes.number,
        }),
      }),
      tooltips: PropTypes.shape({
        bodyFontFamily: PropTypes.string,
        bodyFontSize: PropTypes.number,
        callbacks: PropTypes.object, // assuming keys in this object change, otherwise label: PropTypes.func,
        caretSize: PropTypes.number,
        caretPadding: PropTypes.number,
        cornerRadius: PropTypes.number,
        xPadding: PropTypes.number,
        yPadding: PropTypes.number,
      }),
    }),
  }),

};
