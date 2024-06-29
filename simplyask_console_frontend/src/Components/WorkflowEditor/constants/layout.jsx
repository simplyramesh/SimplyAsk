export const DIAGRAM_ID = 'diagramID';

export const MIN_SCALE = 0.25;
export const MAX_SCALE = 2;
export const STEP = 0.25;

const excluded = ['div', 'p', 'i', 'span', 'hr'];

const panningExcluded = [...excluded, 'section'];

export const panConfig = (config = {}) => ({
  initialScale: 1,
  minScale: MIN_SCALE,
  maxScale: MAX_SCALE,
  alignmentAnimation: { disabled: true },
  velocityAnimation: { disabled: true },
  pinch: { step: STEP, excluded },
  wheel: { disabled: false, excluded },
  panning: { excluded: panningExcluded },
  limitToBounds: true,
  centerOnInit: true,
  ...config,
});

export const ZOOM_VALUES = [
  { label: '25%', value: 0.25 },
  { label: '50%', value: 0.5 },
  { label: '75%', value: 0.75 },
  { label: '100%', value: 1 },
  { label: '125%', value: 1.25 },
  { label: '150%', value: 1.5 },
  { label: '175%', value: 1.75 },
  { label: '200%', value: 2 },
  { label: 'Zoom to Fit', value: null, custom: true },
];

export const EDIT_VALUES = [
  { label: 'Edit', value: null },
  {
    label: (
      <>
        <span>Undo</span>
        <b>Ctrl + Z</b>
      </>
    ),
    value: null,
    type: 'undo',
  },
  {
    label: (
      <>
        <span>Redo</span>
        <b>Ctrl + Y</b>
      </>
    ),
    value: null,
    type: 'redo',
  },
  { label: <span>Restore Previous Version of Workflow</span>, value: null, type: 'reset' },
];

export const WORKFLOW_EDITOR_SETTINGS_SIDE_MENU_TYPE = {
  SETTINGS: 'settings',
  GENERAL_SETTINGS: 'generalSettings',
  PROCESS_EDITOR: 'processEditor',
  NEW_PROCESS_INPUT_PARAM: 'newProcessInputParam',
  EDIT_PROCESS_INPUT_PARAM: 'editProcessInputParam',
  TEST_EDITOR: 'testEditor',
  PARAM_SET_NAME: 'paramSetName',
  NEW_TEST_INPUT_PARAM: 'newTestInputParam',
};

export const PARAM_TYPES = {
  FULLY_AVAILABLE: 'FULLY_AVAILABLE',
  POTENTIALLY_AVAILABLE: 'POTENTIALLY_AVAILABLE',
}

export const PARAM_SOURCES = {
  STEP_PARAMS: 'STEP_PARAMS',
  DEFAULT_PARAMS: 'DEFAULT_PARAMS',
  INPUT_PARAMS: 'INPUT_PARAMS',
  ENV_PARAMS: 'ENV_PARAMS',
  MULTIPLE_PLACES: 'MULTIPLE_PLACES', // ex. several API output in conditional branch
  MULTIPLE_STEPS: 'MULTIPLE_STEPS', // ex. several API output in conditional branch
}
