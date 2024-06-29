import * as Yup from 'yup';
import { array, boolean, mixed, number, object, string } from 'yup';
import { ACTION_TYPES } from '../constants/core';

Yup.addMethod(Yup.array, 'unique', function (message, mapper = (a) => a) {
  return this.test('unique', message, function (list) {
    const filtered = list.map(mapper).filter(Boolean);

    return filtered.length === new Set(filtered).size;
  });
});

export const generativeEditorSchema = object({
  objectives: array()
    .of(
      object({
        id: number().nullable(),
        name: string().required('Objective name is required.'),
        guidance: string(),
        hasChanged: boolean(),
        actions: array()
          .of(
            object({
              id: number().nullable(),
              name: string().required('Action Name is required.'),
              type: string().required('Action Type is required.'),
              purpose: string(),
              data: object().when('type', (type, schema) => {
                if (type === ACTION_TYPES.QUERY_KNOWLEDGE_BASE) {
                  return object({
                    knowledgeBaseId: string().required('Knowledge Base is required.'),
                  });
                }

                if (type === ACTION_TYPES.EXECUTE_PROCESS) {
                  return object({
                    processId: string().required('Process is required.'),
                  });
                }

                if (type === ACTION_TYPES.TRANSFER_TO_AGENT) {
                  return object({
                    agentId: string().required('Agent is required.'),
                  });
                }

                if (type === ACTION_TYPES.INVOKE_API) {
                  return object({
                    requestMethod: string().required('Request Method is required.'),
                    requestUrl: string().required('Request URL is required.'),
                    headers: array().of(
                      object({
                        isValueHidden: boolean(),
                        name: string(),
                        value: string(),
                        description: string()
                      })
                    ),
                    body: array().of(
                      object({
                        isValueHidden: boolean(),
                        name: string(),
                        value: string(),
                        description: string()
                      })
                    ),
                  });
                }

                return schema;
              }),
              isDeleted: boolean(),
            })
          )
          .unique('Action names in scope of one objective must be unique', (action) =>
            action.name?.trim().toLowerCase()
          ),
      })
    )
    .unique('Objective names must be unique', (objective) => objective.name?.trim().toLowerCase()),

  topics: array().of(
    object({
      id: number().nullable(),
      topic: string(),
      isDeleted: boolean(),
    })
  ),
  modelConfig: object({
    id: number().nullable(),
    persona: string(),
    model: mixed().required(),
    enhanceQuery: boolean(),
    validateResponse: boolean(),
    includeReferences: boolean(),
    translateOutput: boolean(),
    maxResponseLength: number(),
    responseVariability: mixed(),
    isDeleted: boolean(),
  }),
  greetingEnabled: boolean(),
  greeting: string().when('greetingEnabled', {
    is: true,
    then: string().required('Greeting text is required.'),
    otherwise: string(),
  }),
});
