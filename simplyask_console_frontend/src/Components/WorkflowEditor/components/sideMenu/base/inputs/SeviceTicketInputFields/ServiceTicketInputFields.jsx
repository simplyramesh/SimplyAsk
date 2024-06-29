import { memo, useEffect, useState } from 'react';
import { useGetIssueTypeByParam } from '../../../../../../../hooks/issue/useGetIssueTypeByParam';
import InputFieldsControl from '../../../../../../Managers/shared/components/InputFieldsControl/InputFieldsControl';
import ConfirmationModal from '../../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';

// A better solution will be applied in the future
const TEMP_FILTER_PARAM_KEY = 'displayName';

const ServiceTicketInputFields = ({ value: params, stepSettings, param, onChange, error }) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const inputParams = params || [];

  const dependentSettingsTemplateId =
    param?.stepSettingOptions?.dependentSettingsTemplateId || 'a01a8d0c-b672-4583-94e0-c1dbbb4eb5da'; // Ticket Type template id

  const ticketTypeValue = stepSettings?.filter(
    ({ stepSettingTemplate }) => stepSettingTemplate?.stepSettingTemplateId === dependentSettingsTemplateId
  )?.[0]?.currentValue;

  const ticketTypeDisplayName = ticketTypeValue.value;

  const issueTypeFilterParams = {
    [TEMP_FILTER_PARAM_KEY]: ticketTypeDisplayName,
  };

  const {
    data: issueTypeParams,
    isFetching,
    isSuccess,
  } = useGetIssueTypeByParam({
    filterParams: issueTypeFilterParams,
    options: {
      enabled: !!ticketTypeDisplayName,
      select: (data) => {
        const parameters = data?.content?.reduce((acc, field) => {
          if (ticketTypeDisplayName !== field.name) return acc;

          return field?.parameters ? [...acc, ...field.parameters] : acc;
        }, []);

        const visibleParams = parameters.reduce((acc, field) => {
          if (!field.isVisible) return acc;

          const currentFieldValue = [].concat(params).find((val) => val.id === field.id);
          const updatedFields = {
            ...field,
            value: currentFieldValue?.value || field?.defaultValue || '',
          };

          return [...acc, updatedFields];
        }, []);

        return visibleParams;
      },
    },
  });

  useEffect(() => {
    if (!isFetching && isSuccess) {
      onChange?.(issueTypeParams);
    }
  }, [isFetching, isSuccess, issueTypeParams]);

  return (
    <>
      <InputFieldsControl
        value={inputParams}
        onSave={onChange}
        modalTextEnum="SERVICE_TICKET"
        errors={error}
        isAutocompleteDefault={true}
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onCloseModal={() => setIsConfirmModalOpen(false)}
        cancelBtnText="Go Back"
        onSuccessClick={() => setIsConfirmModalOpen(false)}
        successBtnText="Confirm"
        alertType="WARNING"
        title="You Have Unsaved Changes"
        text="All changes you have made will be lost, and the ticket type will not be created."
      />
    </>
  );
};

export default memo(ServiceTicketInputFields);
