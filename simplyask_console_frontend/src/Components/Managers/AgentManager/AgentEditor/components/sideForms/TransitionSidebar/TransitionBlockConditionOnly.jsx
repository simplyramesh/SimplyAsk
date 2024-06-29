import React from 'react';
import { StyledFlex, StyledText, StyledTextField } from '../../../../../../shared/styles/styled';
import RadioInput from '../../../../../../Settings/AccessManagement/components/inputs/radio/RadioInput';
import { CUSTOM_STRING } from '../../../../../../Settings/Components/FrontOffice/constants/common';
import { useTheme } from '@mui/material/styles';
import ConditionParamOperatorVal from './ConditionParamOperatorVal';
import AddIcon from '../../../../../../../Assets/icons/addIcon.svg?component';
import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import { TRANSITION_STEP_ITEM_PATHS } from '../../../constants/steps';
import { CONDITION_RULE_TYPE } from '../../../constants/common';
import { transitionConditionsTemplate } from '../../../utils/defaultTemplates';
import { generateUUID } from '../../../../../../Settings/AccessManagement/utils/helpers';
import { useUpdateStepItem } from '../../../hooks/useUpdateStepItem';

const TransitionBlockConditionOnly = ({ stepItemOpened, stepItem, onChange }) => {
  const { colors } = useTheme();
  const { removeDataFromStepItem } = useUpdateStepItem();

  const conditionPathSegment = TRANSITION_STEP_ITEM_PATHS.CONDITION;

  const handleDelete = (stepItem, index) =>
    removeDataFromStepItem(stepItemOpened.stepId, stepItem.id, index, conditionPathSegment);

  const updateDataInConditionRule = (condition, conditionIdx) => {
    onChange(condition, `conditions[${conditionIdx}]`);
  };

  const onConditionFieldChangeHandler = (conditionRuleType) => {
    onChange(conditionRuleType, 'ruleType');
  };

  const onCustomConditionChangeHandler = (customConditionVal) => {
    onChange(customConditionVal, 'customCondition');
  };

  const handleAddRule = () => {
    onChange([...stepItem?.data?.conditions, transitionConditionsTemplate(generateUUID())], 'conditions');
  };

  const renderConditionParamOperatorVal = (stepItemConditions) => {
    const isDeleteDisabled = stepItemConditions.length < 2;

    return stepItemConditions.map((item, conditionIdx) => (
      <ConditionParamOperatorVal
        key={item?.parameter.parameterId}
        isDeleteDisabled={isDeleteDisabled}
        onDelete={() => handleDelete(stepItem, conditionIdx)}
        updateDataInConditionRule={updateDataInConditionRule}
        stepItem={stepItem}
        item={item}
        index={conditionIdx}
      />
    ));
  };

  return (
    <StyledFlex display="flex" gap="30px">
      <StyledFlex display="flex" gap="17px" alignItems="flex-start" alignSelf="stretch">
        <StyledText weight={600}>Condition</StyledText>
        <StyledFlex display="flex" gap="20px" flexDirection="row">
          <RadioInput
            label={
              <StyledText size={15}>
                Match
                <StyledText size={15} weight={700} display="inline">
                  {' '}
                  at least one{' '}
                </StyledText>
                rule
              </StyledText>
            }
            checked={stepItem.data.ruleType === CONDITION_RULE_TYPE.MATCH_ONE}
            onChange={() => {
              onConditionFieldChangeHandler(CONDITION_RULE_TYPE.MATCH_ONE);
            }}
            withButton
            style={{ height: '18px', width: '18px' }}
          />
          <RadioInput
            label={
              <StyledText size={15}>
                Match
                <StyledText size={15} weight={700} display="inline">
                  {' '}
                  every{' '}
                </StyledText>
                rule
              </StyledText>
            }
            checked={stepItem.data.ruleType === CONDITION_RULE_TYPE.MATCH_ALL}
            onChange={() => {
              onConditionFieldChangeHandler(CONDITION_RULE_TYPE.MATCH_ALL);
            }}
            withButton
            height="18px"
            style={{ height: '18px', width: '18px' }}
          />
        </StyledFlex>
        {renderConditionParamOperatorVal(stepItem?.data?.conditions)}
        <StyledFlex display="flex" height="17px" justifyContent="center">
          <StyledButton
            startIcon={<AddIcon />}
            variant="text"
            onClick={() => handleAddRule()}
            disabled={stepItem.data.ruleType === CONDITION_RULE_TYPE.CUSTOM}
          >
            <StyledText weight={600} color={colors.linkColor} size={16}>
              Add rule
            </StyledText>
          </StyledButton>
        </StyledFlex>
      </StyledFlex>
      <StyledFlex display="flex" gap="17px" alignItems="flex-start" alignSelf="stretch">
        <RadioInput
          label={<StyledText size={15}>{CUSTOM_STRING}</StyledText>}
          checked={
            stepItem.data.ruleType !== CONDITION_RULE_TYPE.MATCH_ONE &&
            stepItem.data.ruleType !== CONDITION_RULE_TYPE.MATCH_ALL
          }
          onChange={() => {
            onConditionFieldChangeHandler(CONDITION_RULE_TYPE.CUSTOM);
          }}
          withButton
          style={{ height: '18px', width: '18px' }}
        />
        <StyledTextField
          width="460px"
          placeholder="Enter custom condition..."
          value={stepItem.data.customCondition}
          onChange={(e) => {
            onCustomConditionChangeHandler(e.target.value);
          }}
          disabled={
            stepItem.data.ruleType === CONDITION_RULE_TYPE.MATCH_ONE ||
            stepItem.data.ruleType === CONDITION_RULE_TYPE.MATCH_ALL
          }
          variant="standard"
          fontSize="15px"
          borderColor={colors.inputBorder}
          sx={{
            height: '41px',
            background:
              stepItem.data.ruleType === CONDITION_RULE_TYPE.MATCH_ONE ||
              stepItem.data.ruleType === CONDITION_RULE_TYPE.MATCH_ALL
                ? colors.accordionHover
                : colors.white,
            cursor: 'not-allowed',
            display: 'flex',
            justifyContent: 'center',
          }}
          invalid={stepItem.data.errors?.customCondition}
        />
      </StyledFlex>
    </StyledFlex>
  );
};

export default TransitionBlockConditionOnly;
