export const transformToSelectOptions = (data) => data?.map((optionData) => ({
  label: optionData.name,
  value: optionData.id,
  ...optionData,
})) || []