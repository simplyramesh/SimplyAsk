import { CloseRounded } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import CustomScrollbar from 'react-custom-scrollbars-2';

import { StyledDivider, StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import { SWITCH_TYPES, SWITCH_INPUT_KEYS, STEP_ITEM_TYPES } from '../../../constants/steps';
import { useOpenedItemData } from '../../../hooks/useOpenedItemData';
import ActionErrorSidebar from '../ActionErrorSidebar/ActionErrorSidebar';
import ActionsSidebar from '../ActionsSidebar/ActionsSidebar';
import InquirySidebar from '../InquirySidebar/InquirySidebar';
import ParameterSidebar from '../ParameterSidebar/ParameterSidebar';
import QuickRepliesSidebar from '../QuickRepliesSidebar/QuickRepliesSidebar';
import SpeakSidebar from '../SpeakSidebar/SpeakSidebar';
import SwitchSidebar from '../SwitchSidebar/SwitchSidebar';
import TransitionSidebar from '../TransitionSidebar/TransitionSidebar';

import { StyledStepItemSidebar } from './StyledStepItemSidebar';

const StepItemSidebar = () => {
  const { colors } = useTheme();
  const {
    typeName,
    totalRequiredFields,
    stepItem,
    setStepItemOpened,
    stepItemOpened,
    data,
  } = useOpenedItemData();

  const renderRequiredFields = () => {
    if ([STEP_ITEM_TYPES.QUICK_REPLIES, STEP_ITEM_TYPES.ACTION_ERROR].includes(stepItem?.type)
     || data?.[SWITCH_INPUT_KEYS.SWITCH_TYPE] === SWITCH_TYPES.HUMAN) return null;

    const errorsCount = data?.switchType ? Object.keys(data?.errors || {}).length
      : Object.keys(stepItem?.data?.errors || {}).length;

    const validFieldsCount = (stepItem?.data?.errors || (data?.switchType && data?.errors))
      ? totalRequiredFields - errorsCount
      : 0;

    return (
      <StyledText
        size={15}
        lh={23}
        weight={600}
        color={validFieldsCount === totalRequiredFields ? colors.statusResolved : colors.statusOverdue}
      >
        {`${validFieldsCount} / ${totalRequiredFields} Required Fields Completed`}
      </StyledText>
    );
  };

  return (
    <StyledStepItemSidebar>
      <StyledFlex
        as="span"
        onClick={() => setStepItemOpened(null)}
        cursor="pointer !important"
        fontSize="31px"
        padding="13px 0 3px 13px"
        width="32px"
      >
        <CloseRounded fontSize="inherit" />
      </StyledFlex>
      <StyledFlex p="20px" flexGrow="1">
        <StyledFlex>
          <StyledText size={19} weight={600} lh={29}>{`${data.label} / ${typeName}`}</StyledText>
          {renderRequiredFields()}
        </StyledFlex>
        <StyledDivider borderWidth={1.5} color={colors.cardGridItemBorder} m="30px -20px 0 -20px" />
        <StyledFlex m="0 -20px" flexGrow="1">
          <CustomScrollbar
            autoHeight
            autoHide
            autoHeightMax={window.innerHeight - 310}
          >
            <StyledFlex p="30px 20px">
              {stepItemOpened?.stepType === STEP_ITEM_TYPES.PARAMETER && (<ParameterSidebar stepItem={stepItem} />)}
              {stepItemOpened?.stepType === STEP_ITEM_TYPES.SPEAK && (<SpeakSidebar stepItem={stepItem} />)}
              {stepItemOpened?.stepType === STEP_ITEM_TYPES.QUICK_REPLIES && (<QuickRepliesSidebar stepItem={stepItem} />)}
              {stepItemOpened?.stepType === STEP_ITEM_TYPES.ACTION && (<ActionsSidebar stepItem={stepItem} />)}
              {stepItemOpened?.stepType === STEP_ITEM_TYPES.ACTION_ERROR && (<ActionErrorSidebar stepItem={stepItem} />)}
              {stepItemOpened?.stepType === STEP_ITEM_TYPES.INQUIRY && (<InquirySidebar stepItem={stepItem} />)}
              {stepItemOpened?.stepType === STEP_ITEM_TYPES.TRANSITION && (<TransitionSidebar stepItem={stepItem} />)}
              {stepItemOpened?.stepType === STEP_ITEM_TYPES.SWITCH && (<SwitchSidebar data={data} />)}
            </StyledFlex>
          </CustomScrollbar>
        </StyledFlex>
      </StyledFlex>
    </StyledStepItemSidebar>
  );
};

export default StepItemSidebar;
