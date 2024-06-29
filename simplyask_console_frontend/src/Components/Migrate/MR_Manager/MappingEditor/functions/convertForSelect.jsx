export const convertToLabelValue = (data, accessor, id) => {
  if (!data) return [{}];

  return data?.map((item) => ({ label: item[accessor], value: item[id] }));
};
