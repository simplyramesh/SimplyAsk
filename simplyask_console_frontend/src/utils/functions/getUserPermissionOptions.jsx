export const getUserPermissionOptions = (permissions) => {
  return permissions?.map((item) => ({
    value: item?.id,
    label: item?.role,
  }));
};
