import { noop } from 'lodash';
import { MarkerType } from 'reactflow';

import StartStep from '../../../shared/components/CustomSteps/StartStep/StartStep';
import { MODES as outerModes } from '../../../shared/constants/processOrchesEditor';
import { STEP_TYPES, DELETE_STEP_KEY_CODE } from '../../../shared/constants/steps';
import DefaultStep from '../components/CustomSteps/DefaultStep';

export const MODES = outerModes;

const nodeTypes = {
  [STEP_TYPES?.START]: StartStep,
  [STEP_TYPES?.DEFAULT]: DefaultStep,
};

export const edgeConfig = {
  data: {},
  markerEnd: {
    type: MarkerType.ArrowClosed,
  },
  style: {
    strokeWidth: 2.5,
    stroke: '#2D3A47',
  },
  updatable: 'target',
};

export const config = (mode, theme) => ({
  connectionLineStyle: {
    stroke: theme.colors.secondary,
    strokeWidth: 2.5,
  },
  proOptions: {
    hideAttribution: true,
  },
  nodeTypes,
  selectNodesOnDrag: false,
  selectionOnDrag: true,
  multiSelectionKeyCode: null,
  defaultMarkerColor: theme.colors.primary,
  deleteKeyCode: DELETE_STEP_KEY_CODE,
  elementsSelectable: ([MODES.DESIGN, MODES.HISTORY].includes(mode)),
  ...([MODES.VIEW, MODES.HISTORY].includes(mode) && {
    nodesDraggable: false,
    nodesConnectable: false,
    nodesFocusable: false,
    edgesFocusable: false,
    disabledKeyboardA11y: true,
    onNodeContextMenu: noop,
    onPaneContextMenu: noop,
    onPaneClick: noop,
  }),
});
