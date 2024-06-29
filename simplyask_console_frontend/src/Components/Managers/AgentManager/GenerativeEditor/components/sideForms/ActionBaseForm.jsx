import React, { memo } from 'react';
import { StyledFlex, StyledTextareaAutosize } from '../../../../../shared/styles/styled';
import InputLabel from '../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import { StyledTooltip } from '../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { InfoOutlined } from '@mui/icons-material';
import CustomSelect from '../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomIndicatorArrow from '../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import { IconOption } from '../../../../../shared/REDISIGNED/selectMenus/customComponents/options/IconOption';
import { IconControl } from '../../../../../shared/REDISIGNED/selectMenus/customComponents/controls/IconControl';

const ActionBaseForm = ({ name, type, purpose, onChange, actionTypeOptions }) => {
  return (
    <StyledFlex gap="30px">
      <StyledFlex>
        <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
          <InputLabel label="Action Type" name="actionType" isOptional={false} size={15} weight={600} mb={0} lh={24} />
        </StyledFlex>
        <CustomSelect
          menuPlacement="auto"
          placeholder="Select Type"
          options={actionTypeOptions}
          getOptionValue={({ value }) => value}
          closeMenuOnSelect
          isClearable={false}
          isSearchable={false}
          value={actionTypeOptions?.find(({ value }) => value === type)}
          onChange={(val) => onChange(val.value, ['type'])}
          components={{
            DropdownIndicator: CustomIndicatorArrow,
            Control: IconControl,
            Option: IconOption,
          }}
          maxHeight={30}
          menuPadding={0}
          controlTextHidden
          menuPortalTarget={document.body}
          form
          invalid={false}
        />
      </StyledFlex>
      <StyledFlex>
        <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
          <InputLabel label="Action Name" name="actionName" size={15} weight={600} mb={0} lh={24} />
        </StyledFlex>
        <StyledTextareaAutosize
          placeholder="Enter Action Name..."
          value={name}
          onChange={(e) => onChange(e.target.value, ['name'])}
          variant="standard"
        />
      </StyledFlex>
      <StyledFlex>
        <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
          <InputLabel
            label="Action Purpose"
            name="outputParameterSource"
            isRecommended
            size={15}
            weight={600}
            mb={0}
            lh={24}
          />
          <StyledTooltip
            arrow
            placement="top"
            title="Describe the purpose of the action to provide the system more context for better decision making. For example, the action purpose could be “to search for product information and use cases specifically about Symphona.”"
            p="10px 15px"
          >
            <InfoOutlined fontSize="inherit" />
          </StyledTooltip>
        </StyledFlex>
        <StyledTextareaAutosize
          minRows={3}
          placeholder="Enter Purpose..."
          value={purpose}
          onChange={(e) => onChange(e.target.value, ['purpose'])}
          invalid={false}
        />
      </StyledFlex>
    </StyledFlex>
  );
};

export default memo(ActionBaseForm);
