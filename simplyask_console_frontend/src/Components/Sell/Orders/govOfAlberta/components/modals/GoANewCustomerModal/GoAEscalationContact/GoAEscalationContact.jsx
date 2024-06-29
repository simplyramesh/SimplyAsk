import { useState } from 'react';

import FormErrorMessage from '../../../../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import BaseTextInput from '../../../../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import InputLabel from '../../../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import RadioGroupSet from '../../../../../../../shared/REDISIGNED/controls/Radio/RadioGroupSet';
import CustomSelect from '../../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledFlex, StyledRadio } from '../../../../../../../shared/styles/styled';

const GoAEscalationContact = ({
  label, name, error, value, options, onChange, isOptional,
}) => {
  const [contact, setContact] = useState(options?.length > 0 ? 'PERSON' : 'PHONE');

  const renderPhoneInput = () => (
    <BaseTextInput
      name={name}
      placeholder="1 123 456 7890"
      type="text"
      value={value}
      onChange={(e) => {
        const isNumber = !Number.isNaN(Number(e.target.value));

        if (!isNumber || e.target.value.length > 10) return;

        onChange?.(e.target.value);
      }}
      invalid={!!error}
      autoComplete="off"
    />
  );

  const renderSelect = () => (
    <CustomSelect
      name={name}
      placeholder="Select Person to Contact"
      options={options || []}
      value={value}
      onChange={onChange}
      closeMenuOnSelect
      isClearable={false}
      isSearchable={false}
      invalid={!isOptional && error}
      mb={0}
      form
    />
  );

  return (
    <StyledFlex direction="column" flex="auto">
      <InputLabel label={label} isOptional={isOptional} />
      <RadioGroupSet
        row
        name={name}
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        sx={{
          gap: '0 4px',
          mb: '3px',
          '& .MuiFormControlLabel-label': {
            fontSize: '15px',
            lineHeight: '18px',
          },
        }}
      >
        <StyledRadio
          value="PERSON"
          label="Person"
          disabled={options?.length === 0}
        />
        <StyledRadio
          value="PHONE"
          label="Phone Number"
        />
      </RadioGroupSet>
      {contact === 'PERSON' ? renderSelect() : null}
      {contact === 'PHONE' ? renderPhoneInput() : null}
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </StyledFlex>
  );
};

export default GoAEscalationContact;
