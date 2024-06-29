import React from 'react'
import { useRecoilValue } from 'recoil';
import { StyledFlex, StyledTextField } from '../../../../../../shared/styles/styled'
import InputLabel from '../../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel'
import { InfoOutlined } from '@mui/icons-material';
import CustomSelect from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomIndicatorArrow from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import { useUpdateSteps } from '../../../hooks/useUpdateSteps';
import { agentEditorStepItem } from '../../../store';
import { setIn } from '../../../../../../shared/REDISIGNED/utils/helpers';
import { StyledTooltip } from '../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { paramTypeOptions } from '../../../constants/common';
import { IconOption } from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/options/IconOption';
import { getErrors } from '../../../../../shared/utils/validation';
import { parameterSchema } from '../../../utils/validationSchemas';

const ParameterSidebar = ({ stepItem }) => {
  const stepItemOpened = useRecoilValue(agentEditorStepItem);
  const { updateStep } = useUpdateSteps();

  const handleParamsChange = (value, key) => {
    updateStep(stepItemOpened?.stepId, (prev) => setIn(prev, 'data.stepItems', prev.data.stepItems.map((item) => {
      if (item.id === stepItemOpened.stepItemId) {
        const errors = getErrors({
          schema: parameterSchema,
          data: { ...item.data, [key]: value },
        })

        return {
          ...item,
          data: {
            ...item.data,
            [key]: value,
            errors,
          }
        };
      }

      return item;
    })));
  };

  return (
    <StyledFlex gap="30px">
      <StyledFlex gap="30px">
        <StyledFlex
          display="flex"
          direction="row"
          alignItems="center"
          gap="10px"
        >
          <InputLabel
            label="Type"
            name="parameterType"
            size={16}
            weight={600}
            mb={0}
          />
          <StyledTooltip
            arrow
            placement="top"
            title="Parameter Type"
            p="10px 15px"
          >
            <InfoOutlined fontSize="inherit" />
          </StyledTooltip>
        </StyledFlex>
        <CustomSelect
          menuPlacement="auto"
          placeholder="Select Parameter Type"
          options={paramTypeOptions}
          getOptionValue={({ value }) => value}
          value={paramTypeOptions.find(({ value }) => value === stepItem.data.parameterType)}
          onChange={({ value }) => handleParamsChange(value, 'parameterType')}
          components={{
            DropdownIndicator: CustomIndicatorArrow,
            Option: IconOption,
          }}
          closeMenuOnSelect
          isClearable={false}
          isSearchable={false}
          maxHeight={30}
          menuPadding={0}
          controlTextHidden
          menuPortalTarget={document.body}
          form
          invalid={stepItem.data.errors?.parameterType}
        />
      </StyledFlex>
      <StyledFlex gap="30px">
        <StyledFlex
          display="flex"
          direction="row"
          alignItems="center"
          gap="10px"
        >
          <InputLabel
            label="Parameter Name"
            name="parameterName"
            size={16}
            weight={600}
            mb={0}
          />
          <StyledTooltip
            arrow
            placement="top"
            title="Parameter Name"
            p="10px 15px"
          >
            <InfoOutlined fontSize="inherit" />
          </StyledTooltip>
        </StyledFlex>
        <StyledTextField
          placeholder="Enter Parameter Name..."
          value={stepItem.data.parameterName}
          onChange={(e) => handleParamsChange(e.target.value, 'parameterName')}
          variant="standard"
          height="41px"
          p="4px 10px"
          invalid={stepItem.data.errors?.parameterName}
        />
      </StyledFlex>
      <StyledFlex gap="30px">
        <StyledFlex
          display="flex"
          direction="row"
          alignItems="center"
          gap="10px"
        >
          <InputLabel
            label="Parameter Value"
            name="parameterValue"
            size={16}
            weight={600}
            mb={0}
          />
          <StyledTooltip
            arrow
            placement="top"
            title="Parameter Value"
            p="10px 15px"
          >
            <InfoOutlined fontSize="inherit" />
          </StyledTooltip>
        </StyledFlex>
        <StyledTextField
          placeholder="Enter Parameter Value..."
          value={stepItem.data.parameterValue}
          onChange={(e) => handleParamsChange(e.target.value, 'parameterValue')}
          variant="standard"
          height="41px"
          p="4px 10px"
          invalid={stepItem.data.errors?.parameterValue}
        />
      </StyledFlex>
    </StyledFlex>
  )
}

export default ParameterSidebar
