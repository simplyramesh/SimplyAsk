export const STEP_DRAG_HANDLE_CLASS = 'step-head-drag-handle';

export const STEP_TYPES = {
  START: 'START',
  DEFAULT: 'DEFAULT',
  SWITCH: 'SWITCH',
};
export const defaultStartStepConfig = {
  id: 'step-id-start',
  position: { x: 100, y: (window.innerHeight - 50) / 2 },
  type: STEP_TYPES.START,
  deletable: false,
};

export const DELETE_STEP_KEY_CODE = ['Delete', 'Backspace'];
