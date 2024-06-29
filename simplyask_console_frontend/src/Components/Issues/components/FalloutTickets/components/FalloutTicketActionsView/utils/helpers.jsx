import { removeProperty } from '../../../../../../shared/REDISIGNED/utils/helpers';

export const updateParameterItem = (data, id, value) => {
  return data.map((item) => {
    if (item.id === id) {
      if (item.initialValue === value) {
        return { ...item, ...{ currentValue: value } };
      }
      return { ...item, ...{ currentValue: value } };
    }

    return item;
  });
};

export const revertParameterItem = (params, id) => {
  return params.map((item) => {
    if (item.id === id) {
      return { ...item, ...{ currentValue: item.initialValue } };
    }

    return item;
  });
};

export const revertAllParameters = (params) => {
  return params.map((item) => ({ ...item, currentValue: item.initialValue }));
};

export const getInitialParameters = (params = {}) => {
  const requestParams = params.REQUEST_DATA?.value?.params || {};
  const executionParams = removeProperty('REQUEST_DATA')(params);

  const requestParamsArr = Object.keys(requestParams).map((key) => ({
    dataType: ['String'],
    title: key,
    initialValue: requestParams[key],
    currentValue: requestParams[key],
    isRequest: true,
  }));

  const executionParamsArr = Object.keys(executionParams).map((key) => ({
    dataType: [executionParams[key].type],
    title: key,
    initialValue: executionParams[key].value,
    currentValue: executionParams[key].value,
  }));

  const mergedParams = [...requestParamsArr, ...executionParamsArr];

  return mergedParams.map((item, i) => {
    return {
      ...item,
      id: i,
    };
  });
};
