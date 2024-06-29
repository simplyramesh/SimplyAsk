import { STEP_ENTITY_TYPE } from '../../AgentManager/AgentEditor/constants/steps';
import { stepDelegates } from '../../AgentManager/AgentEditor/constants/stepDelegates';

export const isPasteDisabled = ({
  step,
  copyBuffer
}) => {
  if (!copyBuffer.data) {
    return true;
  }

  if (copyBuffer.type === STEP_ENTITY_TYPE.BLOCK && step) {
    const stepItemType = copyBuffer.data.type;
    const stepDelegateModel = stepDelegates.find(stepDelegate => stepDelegate.type === stepItemType);

    if (!stepDelegateModel.multi && step.data.stepItems.some(item => item.type === stepItemType)) {
      return true;
    }
  }

  return false;
}
