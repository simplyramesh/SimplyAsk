import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import {
  StyledSwitchHolder,
  StyledSwitchLabel,
} from '../../../../../../../MySummary/MyActivity/MyActivitySection/StyledMyActivitySection';
import { StyledButton } from '../../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import {
  EXPRESSION_BUILDER_DEFAULT_VALUE,
  getExpressionBuilderValueWithStr,
} from '../../../../../../../shared/REDISIGNED/controls/lexical/ExpressionBuilder';
import CenterModalFixed from '../../../../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import TableV2 from '../../../../../../../shared/REDISIGNED/table-v2/Table-v2';
import { StyledFlex, StyledText } from '../../../../../../../shared/styles/styled';
import Switch from '../../../../../../../SwitchWithText/Switch';
import { INPUT_FIELDS_COLUMNS } from '../../../../utils/formatters';
import { getErrors } from '../../../../../../shared/utils/validation';
import { additionalFieldsSchema } from '../../../../../../../Settings/Components/FrontOffice/utils/validationSchemas';

const InputFieldsModal = ({
  initialFields,
  open,
  onClose,
  onSave,
  modalTitle,
  modalDescription,
  isAutocompleteDefault = false,
}) => {
  const [fields, setFields] = useState({ content: [] });
  const [fieldsError, setFieldsError] = useState({});
  const [showMandatoryOnly, setShowMandatoryOnly] = useState(false);
  const [sorting, setSorting] = useState([
    {
      desc: true,
    },
  ]);

  useEffect(() => {
    if (initialFields) {
      const filteredFields = initialFields.filter((field) => !showMandatoryOnly || field.fieldCriteria === 'M');

      setFields({ content: filteredFields });
    }
  }, [initialFields, showMandatoryOnly]);

  useEffect(() => {
    if (initialFields) {
      let initialFieldsError = {};
      initialFields.forEach((field) => {
        initialFieldsError[field.fieldName] = '';
      });

      setFieldsError((prev) => ({ ...prev, ...initialFieldsError }));
    }
  }, [initialFields]);

  const validateInputValue = async (field) => {
    const { fieldName, fieldValidationType, value } = field;
    if (!value) {
      return '';
    }
    const { defaultValue: error } = getErrors({
      schema: additionalFieldsSchema,
      data: { name: fieldName, type: fieldValidationType, defaultValue: value },
    });
    return error || '';
  };

  const handleValueChange = (value, index) => {
    const updatedFields = fields.content.map((field, i) => ({
      ...field,
      value: i === index ? value : field.value,
    }));

    setFields({ content: updatedFields });

    updatedFields.forEach(async (field) => {
      const error = await validateInputValue(field);
      setFieldsError((prev) => ({ ...prev, [field.fieldName]: error || '' }));
    });
  };

  const onSaveButtonClickHandler = () => {
    const isFieldsError = Object.values(fieldsError).some((error) => error.length);
    const isEmptyMandatoryField = fields.content.some(
      (field) =>
        field.fieldCriteria === 'M' &&
        (!field.value ||
          field.value === EXPRESSION_BUILDER_DEFAULT_VALUE ||
          getExpressionBuilderValueWithStr('') === field.value)
    );

    if (isFieldsError) {
      toast.error('Could Not Save Due to Invalid Field value');
      return;
    }

    if (isEmptyMandatoryField) {
      toast.error('Could Not Save Due to Incomplete Mandatory Fields');
      return;
    }

    onSave(fields.content);
  };

  return (
    <CenterModalFixed
      open={open}
      onClose={onClose}
      bodyPadding="0"
      maxWidth="1075px"
      enableScrollbar={false}
      title={
        <StyledFlex p="20px 0 10px">
          <StyledFlex>{modalTitle}</StyledFlex>
          <StyledText size={16} weight={400}>
            {modalDescription}
          </StyledText>
        </StyledFlex>
      }
      actions={
        <StyledFlex mt="12px" direction="row" justifyContent="flex-end" width="100%" gap="20px">
          <StyledButton primary variant="contained" onClick={onSaveButtonClickHandler}>
            Save
          </StyledButton>
        </StyledFlex>
      }
    >
      <StyledFlex overflow="hidden">
        <StyledFlex p="20px 30px">
          <StyledSwitchHolder>
            <Switch
              id="showMandatoryFieldsOnly"
              activeLabel=""
              inactiveLabel=""
              checked={showMandatoryOnly}
              onChange={() => setShowMandatoryOnly(!showMandatoryOnly)}
            />
            <StyledSwitchLabel htmlFor="showMandatoryFieldsOnly">Show Mandatory Fields Only</StyledSwitchLabel>
          </StyledSwitchHolder>
        </StyledFlex>
        <StyledFlex direction="row" overflow="hidden">
          <TableV2
            emptyTableTitle="Process Input Fields"
            emptyTableDescription="There are no Process Input Fields"
            entityName="items"
            columns={INPUT_FIELDS_COLUMNS}
            meta={{
              onChange: handleValueChange,
              isAutocompleteDefault,
              fieldsError,
            }}
            data={fields}
            setSorting={setSorting}
            sorting={sorting}
            isLoading={false}
            headerActions={null}
            enableRowSelection={false}
            enableHeader={false}
            enableFooter={false}
            enableShowFiltersButton={false}
          />
        </StyledFlex>
      </StyledFlex>
    </CenterModalFixed>
  );
};

export default InputFieldsModal;
