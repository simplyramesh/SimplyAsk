export const prepareData = (data) => {
  const withIds = data.map((item, index) => ({
    id: item?.priority || index + 1,
    move: item?.priority || index + 1,
    delete: item?.priority || index + 1,
    ...item,
  }));

  return withIds;
};
