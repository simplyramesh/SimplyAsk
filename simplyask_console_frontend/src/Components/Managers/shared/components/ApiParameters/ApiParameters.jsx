import React, { Fragment } from 'react';
import {
  StyledDivider,
  StyledFlex,
  StyledIconButton,
  StyledRadio,
  StyledText,
  StyledTextareaAutosize,
} from '../../../../shared/styles/styled';
import InputLabel from '../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import { StyledTooltip } from '../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { AddRounded, InfoOutlined } from '@mui/icons-material';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import RadioGroupSet from '../../../../shared/REDISIGNED/controls/Radio/RadioGroupSet';
import TrashBinIcon from '../../../../shared/REDISIGNED/icons/svgIcons/TrashBinIcon';
import HideIcon from '../../../../../Assets/icons/eyeIcon.svg?component';
import { setIn } from '../../../../shared/REDISIGNED/utils/helpers';
import { paramTypeOptions } from "../../../AgentManager/AgentEditor/constants/common";
import CustomIndicatorArrow from "../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow";
import { IconOption } from "../../../../shared/REDISIGNED/selectMenus/customComponents/options/IconOption";
import CustomSelect from "../../../../shared/REDISIGNED/selectMenus/CustomSelect";

const defaultParamTemplate = {
  isStatic: true,
  name: '',
  value: '',
  description: '',
  isValueSecured: false
};

const ApiParameters = ({ label, labelTooltipTitle, isOptional, parameters = [], onChange }) => {
  const handleAddParameter = () => {
    onChange([...parameters, defaultParamTemplate]);
  };

  const handleRemoveParameters = (index) => {
    onChange(parameters.filter((_, i) => i !== index));
  };

  const handleChange = (value, path) => {
    onChange(setIn(parameters, path, value));
  };

  const handleStaticDynamicChange = (value, index) => {

    onChange(setIn(parameters, [index], {
      ...defaultParamTemplate,
      isStatic: value === 'static',
    }));
  };

  return (
    <StyledFlex gap="10px">
      <StyledFlex direction="column" flex="auto">
        <StyledFlex direction="row" alignItems="center" justifyContent="space-between" fontSize="15px">
          <StyledFlex direction="row" alignItems="center" justifyContent="center" gap="0 10px">
            <InputLabel
              label={label}
              name={label?.toLowerCase()}
              isOptional={isOptional}
              size={15}
              weight={600}
              mb={0}
              lh={24}
            />
            <StyledTooltip arrow placement="top" title={labelTooltipTitle} maxWidth="auto" p="10px 15px">
              <InfoOutlined fontSize="inherit" />
            </StyledTooltip>
          </StyledFlex>
          <StyledButton startIcon={<AddRounded />} variant="text" onClick={handleAddParameter}>
            Add Parameter
          </StyledButton>
        </StyledFlex>
      </StyledFlex>
      {parameters.length > 0 ? (
        parameters?.map(({ isStatic, name, value, description, isValueSecured }, index) => (
          <Fragment key={index}>
            <StyledFlex gap="10px">
              <StyledFlex direction="row" alignItems="center" justifyContent="space-between">
                <RadioGroupSet
                  row
                  name="executeOn"
                  value={true}
                  onChange={(e) => handleStaticDynamicChange(e.target.name, index)}
                >
                  <StyledRadio label="Static" checked={isStatic} name="static" size={15} />
                  <StyledRadio label="Dynamic" checked={!isStatic} name="dynamic" size={15} />
                </RadioGroupSet>
                <StyledIconButton size="34px" iconSize="22px" onClick={() => handleRemoveParameters(index)}>
                  <TrashBinIcon />
                </StyledIconButton>
              </StyledFlex>
              <StyledFlex gap="10px">
                <StyledFlex direction="row" alignItems="stretch" gap="10px">
                  <StyledFlex width="50%" gap="5px">
                    <InputLabel
                      label="Parameter Name"
                      name="requestMethod"
                      isOptional={false}
                      size={15}
                      weight={600}
                      mb={0}
                      lh={24}
                    />
                    <StyledTextareaAutosize
                      placeholder="Parameter Name..."
                      value={name}
                      onChange={(e) => handleChange(e.target.value, [index, 'name'])}
                      variant="standard"
                    />
                  </StyledFlex>
                  <StyledFlex width="50%" gap="5px">
                    <InputLabel
                      label="Parameter Value"
                      name="parameterType"
                      isOptional={false}
                      size={15}
                      weight={600}
                      mb={0}
                      lh={24}
                    />
                    {isStatic ? (
                      <StyledFlex position="relative">
                        <StyledTextareaAutosize
                          placeholder="Parameter Value..."
                          value={value}
                          onChange={(e) => handleChange(e.target.value, [index, 'value'])}
                          variant="standard"
                          secured={isValueSecured}
                          p="9px 35px 10px 9px"
                        />
                        <StyledFlex
                          position="absolute"
                          right="10px"
                          top="8px"
                          cursor="pointer"
                          onClick={() => handleChange(!isValueSecured, [index, 'isValueSecured'])}
                        >
                          <HideIcon />
                        </StyledFlex>

                      </StyledFlex>

                    ) : (
                      <CustomSelect
                        menuPlacement="auto"
                        placeholder="Select Type"
                        options={paramTypeOptions}
                        getOptionValue={({ value }) => value}
                        closeMenuOnSelect
                        isClearable={false}
                        isSearchable={false}
                        value={paramTypeOptions.find(({ value: val }) => val === value)}
                        onChange={({ value: val }) => handleChange(val, [index, 'value'])}
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
                    )}

                  </StyledFlex>
                </StyledFlex>
                {!isStatic && (
                  <StyledFlex gap="5px">
                    <InputLabel
                      label="Parameter Description"
                      name="paramDescription"
                      isOptional={false}
                      size={15}
                      weight={600}
                      mb={0}
                      lh={24}
                    />
                    <StyledTextareaAutosize
                      placeholder="Parameter Description..."
                      value={description}
                      onChange={(e) => handleChange(e.target.value, [index, 'description'])}
                      variant="standard"
                      minRows={3}
                    />
                  </StyledFlex>
                )}

              </StyledFlex>
            </StyledFlex>
            {index < parameters.length - 1 && <StyledDivider m="20px 0 15px" />}
          </Fragment>
        ))
      ) : (
        <StyledText textAlign="center" weight={600} size={14}>
          There Are Currently No Parameters.
        </StyledText>
      )}
    </StyledFlex>
  );
};

export default ApiParameters;
