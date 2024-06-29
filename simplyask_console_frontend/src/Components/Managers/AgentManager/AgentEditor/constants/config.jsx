import { MarkerType } from 'reactflow';

import StartStep from '../../../shared/components/CustomSteps/StartStep/StartStep';
import { STEP_TYPES, DELETE_STEP_KEY_CODE } from '../../../shared/constants/steps';
import DefaultStep from '../components/CustomSteps/DefaultStep/DefaultStep';
import SwitchStep from '../components/CustomSteps/SwitchStep/SwitchStep';

const nodeTypes = {
  [STEP_TYPES.START]: StartStep,
  [STEP_TYPES.DEFAULT]: DefaultStep,
  [STEP_TYPES.SWITCH]: SwitchStep,
};

export const edgeConfig = {
  type: 'step',
  data: {},
  markerEnd: {
    type: MarkerType.ArrowClosed,
  },
  style: {
    strokeWidth: 2.5,
    stroke: '#2D3A47',
    '*:hover': {
      stroke: 'red',
    },
  },
  updatable: 'target',
};

export const config = (theme) => ({
  nodeTypes,
  connectionLineStyle: {
    stroke: theme.colors.secondary,
    strokeWidth: 2.5,
  },
  connectionLineType: 'step',
  defaultMarkerColor: '#2D3A47',
  deleteKeyCode: DELETE_STEP_KEY_CODE,
  proOptions: {
    hideAttribution: true,
  },
});
