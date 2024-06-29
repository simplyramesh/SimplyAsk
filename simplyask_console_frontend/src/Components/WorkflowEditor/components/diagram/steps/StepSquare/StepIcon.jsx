import PropTypes from 'prop-types';
import React from 'react';

import BatchPrepIcon from '../../../../../shared/REDISIGNED/icons/svgIcons/BatchPrepIcon';
import EndExtractIcon from '../../../../../shared/REDISIGNED/icons/svgIcons/EndExtractIcon';
import EndLoadingIcon from '../../../../../shared/REDISIGNED/icons/svgIcons/EndLoadingIcon';
import EndTransformIcon from '../../../../../shared/REDISIGNED/icons/svgIcons/EndTransformIcon';
import EvaluateExpressionIcon from '../../../../../shared/REDISIGNED/icons/svgIcons/EvaluateExpressionIcon';
import ExtractInputIcon from '../../../../../shared/REDISIGNED/icons/svgIcons/ExtractInputIcon';
import ParameterValueIcon from '../../../../../shared/REDISIGNED/icons/svgIcons/ParameterValueIcon';
import SimplyAssistantIcon from '../../../../../shared/REDISIGNED/icons/svgIcons/SimplyAssistantIcon';
import SpreadsheetIcon from '../../../../../shared/REDISIGNED/icons/svgIcons/SpreadsheetIcon';
import StartLoadingIcon from '../../../../../shared/REDISIGNED/icons/svgIcons/StartLoadingIcon';
import TransformIcon from '../../../../../shared/REDISIGNED/icons/svgIcons/TransformIcon';
import TriggerProcessIcon from '../../../../../shared/REDISIGNED/icons/svgIcons/TriggerProcessIcon';
import CloseIcon from '../../../../Assets/Icons/closeIcon.svg?component';
import EndProcessIcon from '../../../../Assets/Icons/endProcess.svg?component';
import LoopIcon from '../../../../Assets/Icons/loopIcon.svg?component';
import LoopIconEarly from '../../../../Assets/Icons/loopIconEarly.svg?component';
import StepUpdateIcon from '../../../../Assets/Icons/serviceTicketSideModalIcon.svg?component';
import StepCreateIcon from '../../../../Assets/Icons/serviceTicketUpdateSideModalIcon.svg?component';
import StepBangIcon from '../../../../Assets/Icons/stepBangIcon.svg?component';
import StepBubbleTipIcon from '../../../../Assets/Icons/stepBubbleTipIcon.svg?component';
import StepConditionalIcon from '../../../../Assets/Icons/stepConditionalIcon.svg?component';
import StepDateTimeIcon from '../../../../Assets/Icons/stepDateTime.svg?component';
import StepDragIcon from '../../../../Assets/Icons/stepDragIcon.svg?component';
import StepEditIcon from '../../../../Assets/Icons/stepEditIcon.svg?component';
import StepGivenIcon from '../../../../Assets/Icons/stepGivenIcon.svg?component';
import StepLinkIcon from '../../../../Assets/Icons/stepLinkIcon.svg?component';
import StepMailIcon from '../../../../Assets/Icons/stepMailIcon.svg?component';
import RpaIcon from '../../../../Assets/Icons/stepRPAIcon.svg?component';
import StepThenIcon from '../../../../Assets/Icons/stepThenIcon.svg?component';
import StepWhenIcon from '../../../../Assets/Icons/stepWhenIcon.svg?component';

import { DEFAULT_STEP_TYPE_ICON } from '../../../../constants/graph';

const stepIcons = {
  CREATE_SERVICE_TICKET: StepUpdateIcon,
  GENERIC_SERVICE_TICKET: StepCreateIcon,
  FALLOUT_TICKET: StepCreateIcon,
  CUSTOM: StepConditionalIcon,
  MAIL: StepMailIcon,
  LINK: StepLinkIcon,
  close: CloseIcon,
  drag: StepDragIcon,
  edit: StepEditIcon,
  bang: StepBangIcon,
  bubbleTip: StepBubbleTipIcon,
  TEST_WHEN: StepWhenIcon,
  TEST_GIVEN: StepGivenIcon,
  TEST_THEN: StepThenIcon,
  MESSAGE: StepMailIcon,
  GET_DATE_TIME: StepDateTimeIcon,
  LOOP_START: LoopIcon,
  LOOP_END: LoopIconEarly,
  LOOP_END_EARLY: LoopIconEarly,
  EVALUATE_EXPRESSION: EvaluateExpressionIcon, // viewbox="0 0 24 24", base svg: width="16.208px" height="18px"
  SET_PARAMETER_VALUE: ParameterValueIcon,
  SOCR_DATA_EXTRACTION: StepConditionalIcon,
  CREATE_EXCEL_SPREADSHEET: SpreadsheetIcon,
  EXTRACT_EXCEL_DATA: SpreadsheetIcon,
  UPDATE_EXCEL_DATA: SpreadsheetIcon,
  END_PROCESSING: EndProcessIcon,
  EXTRACT_DATA: ExtractInputIcon,
  START_EXTRACTION: BatchPrepIcon,
  SAVE_RECORD: ExtractInputIcon,
  BATCH_PREPARATION: BatchPrepIcon,
  END_EXTRACTION: EndExtractIcon,
  START_TRANSFORMATION: TransformIcon,
  RECORD_TRANSFORM: TransformIcon,
  END_TRANSFORMATION: EndTransformIcon,
  START_LOADING: StartLoadingIcon,
  END_LOADING: EndLoadingIcon,
  TQ_EXTRACT_TRANSFORMATION: EndLoadingIcon,
  TQ_VALIDATION_TASK: EndLoadingIcon,
  SIMPLYASSISTANT: SimplyAssistantIcon,
  TRIGGER_PROCESS_DELEGATE: TriggerProcessIcon,
  RPA_START: RpaIcon,
};

const StepIcon = ({ iconName, ...restProps }) => {
  const Icon = stepIcons[iconName] || stepIcons[DEFAULT_STEP_TYPE_ICON];

  return <>{Icon && <Icon {...restProps} />}</>;
};

export default StepIcon;

StepIcon.defaultProps = {
  iconName: 'update',
};

StepIcon.propTypes = {
  iconName: PropTypes.string,
};
