import React from 'react';
import { StyledFlex, StyledRadio, StyledTextField } from '../../../../../../shared/styles/styled';
import RadioGroupSet from '../../../../../../shared/REDISIGNED/controls/Radio/RadioGroupSet';
import CustomSelect from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { TIME_TYPE_OPTIONS, TIME_TYPES } from '../../../constants/steps';
import CustomIndicatorArrow from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import { IconOption } from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/options/IconOption';

const CustomTimoutDelay = ({
  job,
  valueKey,
  typeKey,
  onChange,
  customChecked,
}) => {
  const handleRadioGroupChange = (e, valueKey, typeKey) => {
    if (e.target.name === 'custom') {
      onChange(valueKey, 1);
      onChange(typeKey, TIME_TYPES.SECONDS);
    } else {
      onChange(valueKey, 0);
      onChange(typeKey, TIME_TYPES.SECONDS);
    }
  };

  const handleUnclearableControlsChange = (e) => {
    const value = e.target.value;

    if (value) {
      onChange(valueKey, value);
    }
  };

  const renderCustomControls = () => {
    return (
      <StyledFlex direction="row" gap="10px" alignItems="center">
        <StyledFlex width="104px">
          <StyledTextField
            value={job[valueKey]}
            onChange={handleUnclearableControlsChange}
            variant="standard"
            height="41px"
            p="4px 10px"
          />
        </StyledFlex>
        <StyledFlex width="140px">
          <CustomSelect
            menuPlacement="auto"
            placeholder="Select Type"
            options={TIME_TYPE_OPTIONS}
            getOptionValue={({ value }) => value}
            closeMenuOnSelect
            isClearable={false}
            isSearchable={false}
            value={TIME_TYPE_OPTIONS.find(({ value }) => value === job[typeKey])}
            onChange={({ value }) => onChange(typeKey, value)}
            components={{
              DropdownIndicator: CustomIndicatorArrow,
              Option: IconOption,
            }}
            maxHeight={30}
            menuPadding={0}
            controlTextHidden
            menuPortalTarget={document.body}
            form
          />
        </StyledFlex>
      </StyledFlex>
    )
  };

  return (
    <StyledFlex gap="10px">
      <StyledFlex>
        <RadioGroupSet
          name="delay"
          onChange={(e) => handleRadioGroupChange(e, valueKey, typeKey)}
        >
          <StyledRadio
            checked={!customChecked}
            name="none"
            label="None"
          />
          <StyledRadio
            checked={customChecked}
            name="custom"
            label="Custom"
          />
        </RadioGroupSet>
      </StyledFlex>
      <StyledFlex>
        {customChecked && renderCustomControls()}
      </StyledFlex>
    </StyledFlex>
  )
};

export default CustomTimoutDelay;
