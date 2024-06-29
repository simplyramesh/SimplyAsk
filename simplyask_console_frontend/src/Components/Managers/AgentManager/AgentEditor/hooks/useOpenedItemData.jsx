import { useRecoilState, useRecoilValue } from 'recoil';
import { agentEditorStepItem, agentEditorStepsUpdate } from '../store';
import { stepDelegates } from '../constants/stepDelegates';
import { useStepItemValidation } from './useStepItemValidation';

export const useOpenedItemData = () => {
  const steps = useRecoilValue(agentEditorStepsUpdate);
  const [stepItemOpened, setStepItemOpened] = useRecoilState(agentEditorStepItem);

  const { data } = steps.find((step) => step.id === stepItemOpened?.stepId);
  const stepItem = data?.stepItems?.find(stepItem => stepItem.id === stepItemOpened.stepItemId);
  const typeName = stepDelegates.find((delegate) => delegate.type === stepItemOpened?.stepType)?.name;

  const validationData = stepItem?.data || data; // for switch step we take data, for other - stepItem.data

  const { totalRequiredFields } = useStepItemValidation(validationData, stepItemOpened.stepType);

  return {
    typeName,
    totalRequiredFields,
    stepItem,
    stepItemOpened,
    setStepItemOpened,
    data
  }
}
