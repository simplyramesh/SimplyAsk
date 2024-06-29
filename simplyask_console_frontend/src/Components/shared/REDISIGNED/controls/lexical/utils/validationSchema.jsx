import * as Yup from 'yup';

export const richTextExpressionSchema = Yup.object({
  root: Yup.object({
    children: Yup.array().required(),
    direction: Yup.mixed().nullable(true),
    format: Yup.string().nullable(true),
    indent: Yup.number().required(),
    type: Yup.string().required(),
    version: Yup.number().required(),
  }).required(),
}).noUnknown(true, 'Object contains unknown keys').strict();
