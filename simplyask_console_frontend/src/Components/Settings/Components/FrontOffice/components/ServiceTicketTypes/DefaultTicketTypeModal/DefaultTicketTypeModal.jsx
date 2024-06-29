import { useFormik } from 'formik';
import { useEffect } from 'react';

import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import { IconControl } from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/controls/IconControl';
import CustomIndicatorArrow from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import { IconOption } from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/options/IconOption';
import CustomSelect from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';

const DefaultTicketTypeModal = ({ defaultValue, typeOptions, onSave }) => {
  const { setFieldValue, values, submitForm } = useFormik({
    enableReinitialize: true,
    initialValues: {
      issueType: null,
    },
    onSubmit: (val, meta) => {
      onSave(val);
      meta.resetForm({});
    },
  });

  useEffect(()=>{
    if (typeOptions.length && defaultValue) {
      const dropdownValue = typeOptions.find(({ value }) => value === defaultValue.id);

      setFieldValue('issueType', dropdownValue);
    }
  }, [defaultValue, typeOptions])

  return (
    <StyledFlex p="30px">
      <StyledFlex gap="12px 0">
        <StyledText size={16} lh={16} weight={600}>Select Ticket Type</StyledText>
        <StyledText size={14} lh={14} weight={400}>This is the default selected ticket type when creating a Service Ticket. </StyledText>
      </StyledFlex>
      <StyledFlex mt="17px">
        <CustomSelect
          options={typeOptions ?? []}
          value={values.issueType}
          getOptionValue={({ value }) => value}
          closeMenuOnSelect
          isClearable={false}
          isSearchable={false}
          onChange={(val) => setFieldValue('issueType', val)}
          components={{
            DropdownIndicator: CustomIndicatorArrow,
            Control: IconControl,
            Option: IconOption,
          }}
          maxHeight={30}
          menuPadding={0}
          form
          menuPortalTarget={document.body}
        />
      </StyledFlex>
      <StyledFlex mt="30px" direction="row" justifyContent="flex-end" width="100%">
        <StyledButton
          primary
          variant="contained"
          onClick={submitForm}
        >
          Save
        </StyledButton>
      </StyledFlex>
    </StyledFlex>
  );
};

export default DefaultTicketTypeModal;
