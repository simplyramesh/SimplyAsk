// calculates the height to fill the column
export const calculateColumnHeight = (response) => {
  const max = Math.max(...response.data);
  let pad = 5;

  return response.data.map((num) => {
    if (max > 30) {
      pad = 40;
    } else if (max > 10) {
      pad = 10;
    }
    return max + pad - num;
  });
};
export const graphDataSet = (response) => {
  return [
    {
      barThickness: 13,
      backgroundColor: 'rgba(245, 123, 32, 1)',
      data: response.data,
    },
    {
      // background colour bars (light orange)
      label: '',
      barThickness: 13,
      backgroundColor: 'rgba(254, 242, 233, 1)',
      hoverBackgroundColor: 'rgba(254, 242, 233, 1)',
      // calculates the height to fill the column
      data: calculateColumnHeight(response),
    },
  ];
};
