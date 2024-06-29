import { InfoOutlined } from '@mui/icons-material';
import React from 'react';
import InputLabel from '../../../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import CustomSelect from '../../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomIndicatorArrow from '../../../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import { StyledTooltip } from '../../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledFlex } from '../../../../../../../shared/styles/styled';

const ProcessSelect = ({ processOptions, value, onChange, invalid }) => {
  return (
    <StyledFlex>
      <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
        <InputLabel label="Process" name="processId" isOptional={false} size={15} weight={600} mb={0} lh={24} />
        <StyledTooltip
          arrow
          placement="top"
          title="Select a single, existing Process you would like to be executed"
          p="10px 15px"
        >
          <InfoOutlined fontSize="inherit" />
        </StyledTooltip>
      </StyledFlex>
      <CustomSelect
        menuPlacement="auto"
        placeholder="Select Process"
        options={processOptions}
        getOptionValue={({ value }) => value}
        closeMenuOnSelect
        isClearable={false}
        isSearchable
        value={processOptions?.find(({ value: val }) => val === value)}
        onChange={onChange}
        components={{
          DropdownIndicator: CustomIndicatorArrow,
        }}
        maxHeight={30}
        menuPadding={0}
        controlTextHidden
        withSeparator
        menuPortalTarget={document.body}
        form
        invalid={invalid}
      />
    </StyledFlex>
  );
};

export default ProcessSelect;
