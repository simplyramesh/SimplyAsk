import React, { memo } from 'react';
import { useTheme } from '@mui/material/styles';
import { StyledFlex, StyledText, StyledDivider } from '../../../../../../shared/styles/styled';
import { StyledTooltip } from '../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import PencilEditIcon from '../../../../../../../Assets/icons/pencilEditIcon.svg?component';
import CustomIndicatorArrow from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import { components } from 'react-select';
import { dropdownStyles } from '../inputs/TransitionBlockIntentDropdownStyles';
import CustomSelect from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import LocationIcon from '../../../../../../../Assets/icons/locationIcon.svg?component';
import GlobalEarthIcon from '../../../../../../../Assets/icons/globalEarthIcon.svg?component';
import BuiltBlockIcon from '../../../../../../../Assets/icons/builtBlockIcon.svg?component';
import EditIcon from '../../../../../../../Assets/icons/EditIcon.svg?component';
import { DIVIDER_STRING, INTENTS_KEYS } from '../../../constants/common';
import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import { useSetRecoilState } from 'recoil';
import { agentEditorSidebars } from '../../../store';
import { SIDEBAR_TYPES } from '../../../utils/sidebar';

const TransitionBlockIntentOnly = ({ intents, isIntentLoading, stepItem, onChange }) => {
  const { colors } = useTheme();
  let selectIntentOptions = [];
  const setSidebarOpened = useSetRecoilState(agentEditorSidebars);

  const onIntentSelectHandler = (selectedIntent) => {
    onChange(
      {
        name: selectedIntent.value,
        intentType: selectedIntent.valueType,
        intentId: selectedIntent.valueId,
        trainingPhrases: selectedIntent.valueTrainingPhrases,
      },
      'intent'
    );
  };
  const createSelectOptionValue = (val) => {
    return {
      value: val.name,
      label: val.name,
      icon: (
        <StyledTooltip
          title={
            <StyledFlex alignItems="center">
              <StyledText size="14" weight="500" textAlign="center" color={colors.white}>
                {INTENTS_KEYS[val.intentType]}
              </StyledText>
            </StyledFlex>
          }
          arrow
          placement="top"
          p="10px 15px"
          maxWidth="auto"
        >
          <>
            {INTENTS_KEYS[val.intentType] === INTENTS_KEYS.LOCAL && (
              <LocationIcon style={{ height: '18px', width: '16px' }} />
            )}
            {INTENTS_KEYS[val.intentType] === INTENTS_KEYS.GLOBAL && (
              <GlobalEarthIcon style={{ height: '18px', width: '16px' }} />
            )}
            {INTENTS_KEYS[val.intentType] === INTENTS_KEYS.PREBUILT && (
              <BuiltBlockIcon style={{ height: '18px', width: '16px' }} />
            )}
          </>
        </StyledTooltip>
      ),
      // TODO: need to integrate edit global intent sidebar here later when developed
      button:
        INTENTS_KEYS[val.intentType] === INTENTS_KEYS.LOCAL || INTENTS_KEYS[val.intentType] === INTENTS_KEYS.GLOBAL ? (
          <EditIcon style={{ height: '18px', width: '18px' }} onClick={() => {}} />
        ) : null,
      valueType: val.intentType,
      valueTrainingPhrases: val.trainingPhrases,
      valueId: val.intentId,
    };
  };

  const createSelectIntentOption = () => {
    if (!intents) return;
    selectIntentOptions = intents.reduce((acc, currentVal) => {
      const intentTypeLabel = INTENTS_KEYS[currentVal.intentType];
      const existingOption = acc.find((element) => element.key === intentTypeLabel);

      if (existingOption) {
        existingOption.options.push(createSelectOptionValue(currentVal));
      } else {
        acc.push(
          {
            key: INTENTS_KEYS[currentVal.intentType],
            label: (
              <StyledFlex display="flex" gap="10px" flexDirection="row">
                {INTENTS_KEYS[currentVal.intentType] === INTENTS_KEYS.LOCAL && (
                  <LocationIcon style={{ height: '18px', width: '16px' }} />
                )}
                {INTENTS_KEYS[currentVal.intentType] === INTENTS_KEYS.GLOBAL && (
                  <GlobalEarthIcon style={{ height: '18px', width: '16px' }} />
                )}
                {INTENTS_KEYS[currentVal.intentType] === INTENTS_KEYS.PREBUILT && (
                  <BuiltBlockIcon style={{ height: '18px', width: '16px' }} />
                )}
                <>{INTENTS_KEYS[currentVal.intentType]}</>
              </StyledFlex>
            ),
            options: [createSelectOptionValue(currentVal)],
          },
          {
            label: DIVIDER_STRING,
            value: DIVIDER_STRING,
          }
        );
      }
      return acc;
    }, []);
    selectIntentOptions.pop();
  };

  if (!isIntentLoading) {
    createSelectIntentOption();
  }

  const getSelectDefaultValue = () => selectIntentOptions.find((val) => val.key === INTENTS_KEYS.PREBUILT)?.options[0];

  const selectOptionHandler = (props) => {
    return props.value === DIVIDER_STRING ? (
      <StyledDivider m="0px 0px 20px 0px" height="1.5px" color={colors.cardGridItemBorder} orientation="horizontal" />
    ) : (
      <components.Option {...props} />
    );
  };

  const selectSingleValueHandler = (props) => {
    return (
      <StyledFlex display="flex" gap="10px" flexDirection="row">
        {props.data.icon}
        {props.children}
        {props.data.button}
      </StyledFlex>
    );
  };

  return (
    <StyledFlex display="flex" alignItems="flex-start" gap="17px" alignSelf="stretch">
      <StyledFlex display="flex" width="460px" flexDirection="row" alignItems="center" gap="10px" alignSelf="stretch">
        <StyledText weight={600} size={16}>
          Intent
        </StyledText>
      </StyledFlex>
      <StyledFlex width="100%">
        <CustomSelect
          placeholder="Select an intent..."
          options={selectIntentOptions}
          value={
            stepItem.data.intent.name
              ? createSelectOptionValue(stepItem.data.intent)
              : getSelectDefaultValue() && onIntentSelectHandler(getSelectDefaultValue())
          }
          onChange={onIntentSelectHandler}
          isSearchable={true}
          components={{
            DropdownIndicator: CustomIndicatorArrow,
            SingleValue: selectSingleValueHandler,
            Option: selectOptionHandler,
          }}
          closeMenuOnSelect
          form
          withSeparator
          menuPortalTarget={document.body}
          styles={dropdownStyles}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}
        />
      </StyledFlex>
      <StyledFlex display="flex" flexDirection="row" alignItems="center" height="19px">
        {/* TODO: need to integrate intent side modal here later when developed*/}
        <StyledButton variant="text" onClick={() => setSidebarOpened({ type: SIDEBAR_TYPES.INTENT })}>
          <PencilEditIcon style={{ height: '14px', width: '14px', marginRight: '12px' }} />
          <StyledText weight={600} color={colors.linkColor}>
            Create and Manage Custom Intents
          </StyledText>
        </StyledButton>
      </StyledFlex>
    </StyledFlex>
  );
};

export default memo(TransitionBlockIntentOnly);
