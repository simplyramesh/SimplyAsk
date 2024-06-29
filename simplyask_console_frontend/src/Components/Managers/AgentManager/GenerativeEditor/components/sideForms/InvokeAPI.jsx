import React, { memo } from 'react';
import {
  StyledDivider,
  StyledFlex,
  StyledTextareaAutosize,
  StyledTextField,
} from '../../../../../shared/styles/styled';
import InputLabel from '../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import { StyledTooltip } from '../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { InfoOutlined } from '@mui/icons-material';
import CustomSelect from '../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomIndicatorArrow from '../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import { HTTP_METHODS_OPTIONS } from '../../constants/core';
import ApiParameters from '../../../../shared/components/ApiParameters/ApiParameters';

const InvokeApi = ({ data, onChange }) => {
  const { requestMethod, requestUrl, headers, body } = data;

  return (
    <StyledFlex gap="30px">
      <StyledFlex>
        <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
          <InputLabel
            label="Request Method"
            name="requestMethod"
            isOptional={false}
            size={15}
            weight={600}
            mb={0}
            lh={24}
          />
          <StyledTooltip arrow placement="top" title="Request Method" p="10px 15px">
            <InfoOutlined fontSize="inherit" />
          </StyledTooltip>
        </StyledFlex>
        <CustomSelect
          menuPlacement="auto"
          placeholder="Select Request Method"
          options={HTTP_METHODS_OPTIONS}
          getOptionValue={({ value }) => value}
          closeMenuOnSelect
          isClearable={false}
          isSearchable
          value={HTTP_METHODS_OPTIONS?.find(({ value: val }) => val === requestMethod)}
          onChange={({ value }) => onChange(value, ['data', 'requestMethod'])}
          components={{
            DropdownIndicator: CustomIndicatorArrow,
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
          <InputLabel label="Request URL" name="requestUrl" isOptional={false} size={15} weight={600} mb={0} lh={24} />
          <StyledTooltip arrow placement="top" title="Request URL" p="10px 15px">
            <InfoOutlined fontSize="inherit" />
          </StyledTooltip>
        </StyledFlex>
        <StyledTextareaAutosize
          placeholder="e.g: abc/abc/abc/123"
          value={requestUrl}
          onChange={(e) => onChange(e.target.value, ['data', 'requestUrl'])}
          variant="standard"
        />
      </StyledFlex>

      <StyledDivider m="0 -20px" />

      <ApiParameters
        isOptional
        parameters={headers}
        label="Header Parameters"
        labelTooltipTitle="Header Parameters"
        onChange={(value) => onChange(value, ['data', 'headers'])}
      />

      <StyledDivider m="0 -20px" />

      <ApiParameters
        isOptional
        parameters={body}
        label="Body Parameters"
        labelTooltipTitle="Body Parameters"
        onChange={(value) => onChange(value, ['data', 'body'])}
      />
    </StyledFlex>
  );
};

export default memo(InvokeApi);
