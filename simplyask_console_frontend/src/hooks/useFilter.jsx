import { useFormik } from 'formik';

export const useFilter = ({
  formatter,
  selectedFiltersMeta, // {formatter, key}
  formikProps: {
    ...props
  },
  onSubmit,
}) => {
  const getFormattedValue = (val, formatter) => {
    return formatter ? Object.fromEntries(
      Object.entries(val).map(
        ([k, v], i) => [k, formatter[k] ? formatter[k]({
          v, k, i, obj: val,
        }) : val[k]],
      ),
    ) : val;
  };

  const deepValue = (o, p) => p.split('.').reduce((a, v) => a[v], o);

  const isFormatterFn = typeof formatter === 'function';
  const getFinalFilterVal = (v, formatter) => (isFormatterFn ? formatter(v) : getFormattedValue(v, formatter));

  const getSelectedFilters = (v, formatter, key) => (formatter ? getFormattedValue(key ? deepValue(v, key) : v, formatter) : null);

  const {
    values: sourceFilterValue,
    setFieldValue: setFilterFieldValue,
    resetForm: resetFilter,
    submitForm: submitFilterValue,
    initialValues,
    ...rest
  } = useFormik({
    validateOnMount: false,
    validateOnBlur: false,
    onSubmit: (v) => onSubmit({
      filterValue: getFinalFilterVal(v, formatter),
      selectedFilters: getSelectedFilters(v, selectedFiltersMeta.formatter, selectedFiltersMeta.key),
    }),
    ...props,
  });

  const filterValue = getFinalFilterVal(sourceFilterValue, formatter);
  const initialFilterValues = getFinalFilterVal(initialValues, formatter);

  return {
    sourceFilterValue,
    filterValue,
    initialFilterValues,
    setFilterFieldValue,
    resetFilter,
    submitFilterValue,
    ...rest,
  };
};
