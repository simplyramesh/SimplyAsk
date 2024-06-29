import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

import { getRecentCalls } from '../../../Services/axios/widgetAxios';
import Spinner from '../../shared/Spinner/Spinner';
import classes from './LineChart.module.css';

const LineChart = () => {
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const result = await getRecentCalls();
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

  return (
    <div className={classes.lineChart}>
      {loading ? (
        <Spinner className={classes.spinner} />
      ) : (
        <Line
          data={{
            labels: response.labels,
            datasets: [
              {
                label: 'Number of Calls',
                fill: true,
                lineTension: 0.1,
                backgroundColor: 'rgba(245, 123, 32, 0.8)',
                borderColor: 'silver',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: '#fff',
                pointBackgroundColor: 'rgba(245, 123, 32, 1)',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(245, 123, 32, 1)',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: response.data,
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    callback(value) {
                      if (value % 1 === 0) {
                        return value;
                      }
                    },
                  },
                  scaleLabel: {
                    display: true,
                    labelString: 'Total Number of Calls',
                  },
                },
              ],
              xAxes: [
                {
                  type: 'time',
                  ticks: {
                    autoSkip: true,
                    maxTicksLimit: 15,
                  },
                  scaleLabel: {
                    display: true,
                    labelString: 'Days',
                  },
                },
              ],
            },
          }}
        />
      )}
    </div>
  );
};

export default LineChart;
