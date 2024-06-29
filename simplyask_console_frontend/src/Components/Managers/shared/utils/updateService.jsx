const getFields = (step, flds) => typeof flds === 'function' ? flds(step) : flds;

export const updateStepById = (id, steps, fields) => steps.map((step) => {
  if (step.id !== id) return step;

  const updatedFields = getFields(step, fields);

  Object.keys(updatedFields).forEach((key) => {
    step[key] = updatedFields[key];
  });

  return step;
});

export const updateAllSteps = (steps, fields) => steps.map((step) => {
  const updatedFields = getFields(step, fields);

  Object.keys(updatedFields).forEach((key) => {
    step[key] = updatedFields[key];
  });

  return step;
});
