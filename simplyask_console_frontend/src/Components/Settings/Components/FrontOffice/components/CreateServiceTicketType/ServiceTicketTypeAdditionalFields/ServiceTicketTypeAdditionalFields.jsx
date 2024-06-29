import { AddRounded } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { rowDragHandleProps } from '../../../../../../Issues/utills/formatters';
import { getErrors } from '../../../../../../Managers/shared/utils/validation';
import { VALIDATION_TYPES } from '../../../../../../PublicFormPage/constants/validationTypes';
import { generateUUID } from '../../../../../../Settings/AccessManagement/utils/helpers';
import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import ConfirmationModal from '../../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import TableV2 from '../../../../../../shared/REDISIGNED/table-v2/Table-v2';
import { HEADER_ACTIONS_POSITION } from '../../../../../../shared/REDISIGNED/table-v2/TableHeader/TableHeader';
import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import { INPUT_API_KEYS } from '../../../../../../WorkflowEditor/components/sideMenu/Settings/ExpectedInputParams/EditInputParam/EditInputParam';
import { ADDITIONAL_FIELDS_COLUMNS } from '../../../utils/formatters';
import { additionalFieldsSchema } from '../../../utils/validationSchemas';
import AddFieldModal from './AddFieldModal/AddFieldModal';
import { useGetCurrentUser } from '../../../../../../../hooks/useGetCurrentUser';

const HeaderActions = ({ onClick }) => (
  <StyledFlex direction="row">
    <StyledButton variant="contained" tertiary startIcon={<AddRounded />} onClick={onClick}>
      Set Field
    </StyledButton>
  </StyledFlex>
);

const ServiceTicketTypeAdditionalFields = ({ setFieldValue, values, issueType }) => {
  const { currentUser } = useGetCurrentUser();

  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [data, setData] = useState({ content: values });
  const [isAddressToggleWarningModalOpen, setIsAddressToggleWarningModalOpen] = useState(false);
  const [shouldToggleAddressField, setShouldToggleAddressField] = useState(false);
  const [isFullAddressFieldActivating, setIsFullAddressFieldActivating] = useState(false);
  const [addressFieldActivating, setAddressFieldActivating] = useState('');

  useEffect(() => {
    setData((prev) => ({ ...prev, content: [...values] }));
  }, [values]);

  useEffect(() => {
    if (shouldToggleAddressField) {
      if (isFullAddressFieldActivating) {
        const updatedParameters = values.map((parameter) => {
          if (parameter.name !== 'Full Address' && parameter.name.includes('Address')) {
            return { ...parameter, isVisible: false };
          }
          if (parameter.name === 'Full Address') return { ...parameter, isVisible: true };
          return parameter;
        });

        setFieldValue('parameters', updatedParameters);
        setShouldToggleAddressField(false);
      } else {
        const updatedParameters = values.map((parameter) => {
          if (parameter.name === 'Full Address' && parameter.isVisible) return { ...parameter, isVisible: false };
          if (parameter.name === addressFieldActivating) return { ...parameter, isVisible: true };
          return parameter;
        });
        setFieldValue('parameters', updatedParameters);
        setShouldToggleAddressField(false);
      }
    }
  }, [shouldToggleAddressField]);

  const onDelete = (row) => {
    const updatedData = data.content.filter((field) => field.id !== row.id);
    setFieldValue('parameters', updatedData);
  };

  const onMandatoryHiddenChange = (row, value, isHidden = false) => {
    const updatedData = data.content.map((field) => {
      if (field.orderNumber === row.orderNumber) {
        return { ...field, ...(isHidden ? { isMasked: value } : { isMandatory: value }) };
      }

      return field;
    });

    setFieldValue('parameters', updatedData);
  };

  const validateParameter = (row, value) => {
    if (value) {
      const dataToValidate = { ...row, defaultValue: value };

      const { defaultValue: error } = getErrors({ schema: additionalFieldsSchema, data: dataToValidate });

      if (error) {
        toast.error(error);
        return true;
      }

      return false;
    }
  };

  const onDefaultValueChange = (row, value, oldValue) => {
    if (value !== oldValue) {
      const isError = validateParameter(row, value);

      if (!isError) {
        const updatedContent = data.content.map((field) => {
          if (field.orderNumber === row.orderNumber) {
            return { ...field, defaultValue: value };
          }
          return field;
        });

        setFieldValue('parameters', updatedContent);
      }
    }
  };

  const onNameChange = (row, value) => {
    const updatedName = data.content.map((field) => {
      if (field.orderNumber === row.orderNumber) {
        if (value.length > 0) {
          return { ...field, name: value };
        }
        return field;
      }
      return field;
    });
    setFieldValue('parameters', updatedName);
  };

  const onFieldTypeChange = (row, value) => {
    const originalData = issueType?.parameters?.find((field) => field.orderNumber === row.orderNumber);

    const updatedName = data.content.map((field) => {
      if (field.orderNumber === row.orderNumber) {
        return {
          ...field,
          type: value,
          defaultValue: '',
          [INPUT_API_KEYS.IS_MASKED]:
            value === VALIDATION_TYPES.FILE ? false : !!originalData?.[INPUT_API_KEYS.IS_MASKED],
        };
      }
      return field;
    });
    setFieldValue('parameters', updatedName);
  };

  const tableMeta = {
    setFieldValue,
    setIsFullAddressFieldActivating,
    setAddressFieldActivating,
    setIsAddressToggleWarningModalOpen,
    setShouldToggleAddressField,
    onFieldDelete: (field) => onDelete(field),
    onMandatoryHiddenChange: (row, value, isHidden) => onMandatoryHiddenChange(row, value, isHidden),
    onDefaultValueChange: (row, value, oldValue) => onDefaultValueChange(row, value, oldValue),
    onNameChange: (row, value) => onNameChange(row, value),
    onFieldTypeChange: (row, value) => onFieldTypeChange(row, value),
    user: currentUser,
  };

  return (
    <>
      <TableV2
        title="Additional Fields"
        titleDescription="Set additional fields for your ticket type that will appear for this type"
        data={data}
        columns={ADDITIONAL_FIELDS_COLUMNS}
        isEmbedded
        enableFooter={false}
        enableSearch={false}
        enableShowFiltersButton={false}
        enableRowSelection={false}
        headerActions={<HeaderActions onClick={() => setIsAddFieldModalOpen(true)} />}
        headerActionsPosition={HEADER_ACTIONS_POSITION.TITLE_BAR}
        tableProps={{
          enableGlobalFilter: false,
          enableEditing: true,
          muiTableBodyRowDragHandleProps: ({ table }) => ({
            onDragEnd: () => {
              const { draggingRow, hoveredRow } = table.getState();
              if (hoveredRow && draggingRow) {
                data.content.splice(hoveredRow.index, 0, data.content.splice(draggingRow.index, 1)[0]);

                const newContent = data.content.map((param, index) => ({ ...param, orderNumber: index + 1 }));

                setFieldValue('parameters', newContent);
              }
            },
          }),
          ...rowDragHandleProps,
        }}
        meta={tableMeta}
        pinRowHoverActionColumns={['delete', 'edit']}
      />
      <AddFieldModal
        isOpen={isAddFieldModalOpen}
        onClose={() => setIsAddFieldModalOpen(false)}
        onCreate={(newAdditionalField, resetForm) => {
          const lastOrderNumber = values.length > 0 ? values[values.length - 1].orderNumber : 0;

          setFieldValue('parameters', [
            ...values,
            {
              ...newAdditionalField,
              orderNumber: lastOrderNumber + 1,
              id: generateUUID(),
            },
          ]);
          resetForm();
          setIsAddFieldModalOpen(false);
        }}
      />
      <ConfirmationModal
        isOpen={isAddressToggleWarningModalOpen}
        onCloseModal={() => setIsAddressToggleWarningModalOpen(false)}
        onCancelClick={() => setIsAddressToggleWarningModalOpen(false)}
        cancelBtnText="Cancel"
        onSuccessClick={() => {
          setShouldToggleAddressField(true);
          setIsAddressToggleWarningModalOpen(false);
        }}
        successBtnText="Confirm"
        alertType="WARNING"
        title="Are You Sure?"
      >
        <StyledText textAlign="center">
          You currently have {isFullAddressFieldActivating ? 'at least 1 Address fields' : '"Full Address"'} activated.
          By turning on {isFullAddressFieldActivating ? '"Full Address"' : `"${addressFieldActivating}"`},
          {isFullAddressFieldActivating ? (
            <>
              <StyledText display="inline" weight={600}>
                {' '}
                all
              </StyledText>{' '}
              Address Fields{' '}
            </>
          ) : (
            ' Full Address '
          )}
          will be{' '}
          <StyledText display="inline" weight={600}>
            deactivated
          </StyledText>
          . Any data associated with the {isFullAddressFieldActivating ? 'Address Lines ' : '"Full Address" '}
          will be saved, and retrieved if you active {isFullAddressFieldActivating ? 'them' : 'it'} again.
        </StyledText>

        <StyledText textAlign="center">
          Click "Confirm" below to activate the{' '}
          {isFullAddressFieldActivating ? '"Full Address"' : `"${addressFieldActivating}"`} field
        </StyledText>
      </ConfirmationModal>
    </>
  );
};

export default ServiceTicketTypeAdditionalFields;
