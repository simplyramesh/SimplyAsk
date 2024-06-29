import PropTypes from 'prop-types';
import React, { memo, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { updateScheduler } from '../../../../../../Services/axios/reporting';
import { getParsedFrequencyItems } from '../../../../../../utils/timeUtil';
import ReportingForm from '../ReportingForm/ReportingForm';

const EditReportingForm = ({ initialValues, onSuccess, onInitialFormValuesChanged }) => {
  const queryClient = useQueryClient();

  const formValues = {
    ...initialValues,
    name: initialValues.name.name,
    ...getParsedFrequencyItems(initialValues.cronExpression),
  };

  const { mutate: updateReporting, isLoading } = useMutation({
    mutationFn: updateScheduler,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reporting'] });
    },
  });

  const handleUpdateReporting = useCallback(async (values) => {
    const { name, schedulerTaskType, parameters, cronExpression } = values;

    try {
      await updateReporting({
        name,
        schedulerTaskType,
        parameters,
        cronExpression,
      });

      toast.success('Reporting was successfully updated!');

      onSuccess();
    } catch {
      toast.error('Something went wrong');
    }
  }, []);

  return (
    <ReportingForm
      initialValues={formValues}
      onSubmit={handleUpdateReporting}
      onInitialFormValuesChanged={onInitialFormValuesChanged}
      isSubmitting={isLoading}
    />
  );
};

export default memo(EditReportingForm);

EditReportingForm.propTypes = {
  initialValues: PropTypes.shape({
    name: PropTypes.shape({
      name: PropTypes.string,
    }),
    schedulerTaskType: PropTypes.string,
    parameters: PropTypes.shape({
      reportTo: PropTypes.arrayOf(PropTypes.string),
    }),
    cronExpression: PropTypes.string,
  }),
  onSuccess: PropTypes.func,
  onInitialFormValuesChanged: PropTypes.func,
};
