import PropTypes from 'prop-types';
import React, { memo, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { createScheduler } from '../../../../../../Services/axios/reporting';
import ReportingForm from '../ReportingForm/ReportingForm';

const CreateReportingForm = ({ onSuccess, onInitialFormValuesChanged }) => {
  const queryClient = useQueryClient();

  const { mutate: createReporting, isLoading } = useMutation({
    mutationFn: createScheduler,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reporting'] });

      toast.success('Reporting was successfully created!');

      onSuccess();
    },
    onError: () => toast.error('Something went wrong'),
  });

  const handleCreateReporting = useCallback(async (values) => {
    const { name, schedulerTaskType, parameters, cronExpression } = values;

    await createReporting({
      name,
      schedulerTaskType,
      parameters,
      cronExpression,
    });
  }, []);

  return (
    <ReportingForm
      onSubmit={handleCreateReporting}
      onInitialFormValuesChanged={onInitialFormValuesChanged}
      isSubmitting={isLoading}
    />
  );
};

export default memo(CreateReportingForm);

CreateReportingForm.propTypes = {
  onSuccess: PropTypes.func,
  onInitialFormValuesChanged: PropTypes.func,
};
