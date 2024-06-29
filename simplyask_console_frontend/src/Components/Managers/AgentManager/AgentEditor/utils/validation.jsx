import { STEP_ITEM_TYPES } from '../constants/steps';
import { actionSchema, inquirySchema, parameterSchema, speakSchema, switchSchema, transitionSchema } from './validationSchemas';

export const validationSchemasMap = {
  [STEP_ITEM_TYPES.PARAMETER]: parameterSchema,
  [STEP_ITEM_TYPES.SPEAK]: speakSchema,
  [STEP_ITEM_TYPES.ACTION]: actionSchema,
  [STEP_ITEM_TYPES.INQUIRY]: inquirySchema,
  [STEP_ITEM_TYPES.TRANSITION]: transitionSchema,
  [STEP_ITEM_TYPES.SWITCH]: switchSchema,
}
