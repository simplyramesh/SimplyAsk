import React from 'react'
import { StyledFlex, StyledIconButton, StyledTextField } from '../../../../../../shared/styles/styled'
import CustomSelect from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect'
import { StyledTooltip } from '../../../../../../shared/REDISIGNED/tooltip/StyledTooltip'
import TrashBinIcon from '../../../../../../shared/REDISIGNED/icons/svgIcons/TrashBinIcon'
import { useTheme } from '@mui/material/styles'
import CustomIndicatorArrow from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow'
import { formStyles } from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect'
import { CONDITION_RULE_TYPE, selectOperatorOptions } from '../../../constants/common'

const ConditionParamOperatorVal = ({
  onDelete,
  isDeleteDisabled,
  updateDataInConditionRule,
  stepItem,
  item,
  index
}) => {
  const { colors } = useTheme();

  const getSelectValue = (operand) => selectOperatorOptions.find(opt => opt.value === operand);

  const isCustomConditionSelected = stepItem.data.ruleType === CONDITION_RULE_TYPE.CUSTOM

  return (
    <StyledFlex
      display="flex"
      gap="10px"
      flexDirection="row"
      alignItems="center"
    >
      <StyledTextField
        width="207px"
        sx={{
          height: '41px',
          display: 'flex',
          justifyContent: 'center',
          background: isCustomConditionSelected ? colors.accordionHover : colors.white,
        }}
        fontSize="15px"
        borderColor={colors.primary}
        placeholder="Parameter..."
        value={item.parameter.name}
        onChange={(e) => {
          updateDataInConditionRule({
            parameter: { ...item.parameter, name: e.target.value },
            operand: item.operand,
            value: item.value
          }, index);
        }}
        variant="standard"
        disabled={isCustomConditionSelected}
        invalid={stepItem.data?.errors?.conditions}
      />
      <CustomSelect
        placeholder="Operator"
        value={item.operand && getSelectValue(item.operand)}
        options={selectOperatorOptions}
        onChange={(selectedOption) => {
          updateDataInConditionRule({
            parameter: item.parameter,
            operand: selectedOption.value,
            value: item.value
          }, index);
        }}
        form
        closeMenuOnSelect
        styles={{
          control: (provided, state) => ({
            ...provided,
            ...formStyles.control(provided, state),
            width: '110px',
            padding: '0px',
            fontSize: '15px',
            border: `1px solid ${colors.primary}`,
            background: isCustomConditionSelected ? colors.accordionHover : colors.white,
          }),
          indicatorSeparator: () => ({
            display: 'none',
          }),
        }}
        components={{
          DropdownIndicator: CustomIndicatorArrow,
        }}
        isDisabled={isCustomConditionSelected}
        invalid={stepItem.data?.errors?.conditions}
      />
      <StyledTextField
        width="76px"
        sx={{
          height: '41px',
          display: 'flex',
          justifyContent: 'center',
          background: isCustomConditionSelected ? colors.accordionHover : colors.white,
        }}
        fontSize="15px"
        borderColor={colors.primary}
        placeholder="Value..."
        value={item.value}
        onChange={(e) => {
          updateDataInConditionRule({
            parameter: item.parameter,
            operand: item.operand,
            value: e.target.value
          }, index);
        }}
        variant="standard"
        disabled={isCustomConditionSelected}
        invalid={stepItem.data?.errors?.conditions}
      />
      <StyledTooltip
        arrow
        placement="top"
        title={!isDeleteDisabled ? 'Delete' : ''}
        p="10px 15px"
      >
        <StyledFlex as="span">
          <StyledIconButton
            size="34px"
            iconSize="22px"
            onClick={onDelete}
            disabled={isCustomConditionSelected || isDeleteDisabled}
          >
            <TrashBinIcon />
          </StyledIconButton>
        </StyledFlex>
      </StyledTooltip>
    </StyledFlex>
  )
}

export default ConditionParamOperatorVal
