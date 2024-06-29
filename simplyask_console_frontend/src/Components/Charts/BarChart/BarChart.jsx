import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

import { getRecentCalls } from '../../../Services/axios/widgetAxios';
import { graphDataSet } from '../../../utils/functions/chart/barStatsGraph';
import Spinner from '../../shared/Spinner/Spinner';
import classes from './BarChart.module.css';

// TODO: showMonth prop is included in AllStats, uncomment propType when prop is added.
const BarChart = ({ channel }) => {
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getRecentCalls(channel);
      const chartLabels = [];
      const chartData = [];

      for (let i = 0; i < result.data.length; i++) {
        chartLabels.push(result.data[i].date);
        chartData.push(result.data[i].count);
      }
      setResponse({
        labels: chartLabels,
        data: chartData,
      });
      setLoading(false);
    };

    fetchData();
  }, [channel]);

  return (
    <div className={classes.barChart}>
      {(() => {
        if (loading) {
          return (
            <Spinner className={classes.spinner} />
          );
        } if (response.data.length === 0) {
          return (
            <p>Data not available</p>
          );
        }
        return (
          <Bar
            data={{
              labels: response.labels,
              datasets: graphDataSet(response),
            }}
            options={{
              tooltips: {
              // dynamically generate label based on channel
                callbacks: {
                  label(context) {
                    if (channel === 'voice') {
                      return `${context.value} voice calls`;
                    } if (channel === 'chat') {
                      return `${context.value} chats`;
                    }
                    return `${context.value} total inquiries`;
                  },
                },

                // ensure hover over is only on for dark orange bars
                filter(tooltipItem) {
                  return tooltipItem.datasetIndex === 0;
                },

                mode: 'index',
                intersect: false,
              },
              hover: {
                mode: 'index',
                intersect: false,
              },

              layout: {
                padding: {
                  top: 40,
                },
              },

              legend: {
                display: false,
              },

              maintainAspectRatio: false,

              scales: {
                yAxes: [
                  {
                  // axis 0-1800
                    stacked: true,
                    display: true,
                    gridLines: {
                      display: false,
                    },
                    ticks: {
                      fontStyle: 'bold',
                      fontSize: 14,
                      callback(value) {
                        if (value % 1 === 0) {
                          return value;
                        }
                      },
                    },
                  },
                  // outer axis we dont want to show
                  {
                    display: false,
                    gridLines: {
                      display: false,
                    },
                  },
                ],

                xAxes: [
                  {
                    stacked: true,
                    display: true,
                    gridLines: {
                      display: false,
                    },
                    ticks: {
                    // ticks for each day
                      fontStyle: 'bold',
                      callback(label) {
                        return label.split('-')[2];
                      },
                    },
                  },
                  {
                  // additional x axis to display the month
                    id: 'xAxisMonth',
                    type: 'category',
                    gridLines: {
                      display: false,
                    },
                    ticks: {
                      fontSize: 14,
                      fontStyle: 'bold',
                      // ensures that month label is horizontal
                      maxRotation: 0,
                      minRotation: 0,

                      callback(label) {
                        const date = new Date(label);
                        const formattedDate = format(date, 'MMMM d');
                        const day = formattedDate.split(' ')[1];
                        const month = formattedDate.split(' ')[0];

                        // aligns month with certain date on second axis
                        let currMonth = null;
                        if (currMonth !== month) {
                          if (day === '29' || day === '16') {
                            currMonth = month;
                            return month;
                          }
                        } else {
                          return '';
                        }
                      },
                    },
                  },
                  // outer axis we dont want to show
                  {
                    display: false,
                    gridLines: {
                      display: false,
                    },
                  },
                ],
              },
            }}
          />
        );
      })()}
    </div>
  );
};

export default BarChart;

BarChart.propTypes = {
  channel: PropTypes.string,
  // TODO: uncomment when showMonth prop is included in this component.
  // showMonth: PropTypes.bool,
};
