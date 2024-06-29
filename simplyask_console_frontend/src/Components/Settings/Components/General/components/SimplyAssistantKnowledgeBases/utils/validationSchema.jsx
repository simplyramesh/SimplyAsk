import * as Yup from 'yup';
import { MODAL_TYPE } from './constants';
import { removeProtocolFromUrl } from './helper';

export const parameterObjectSchema = Yup.object({
  parameterName: Yup.string().required('A Parameter Name is required'),
  parameterValue: Yup.string().required('A Parameter Value is required'),
});

const isDuplicateWebsiteSource = (currentValue, values, knowledgeSources, isEditMode) => {
  const urlDomainName = removeProtocolFromUrl(currentValue);

  const websiteSources = knowledgeSources?.filter((source) => source.type === MODAL_TYPE.WEBSITE) || [];

  const domainNamesWithId = websiteSources?.map(({ source, id }) => ({
    id,
    url: removeProtocolFromUrl(source.url),
  }));

  const updatedDomainNamesWithId = isEditMode ? domainNamesWithId.filter(({ id }) => id !== values.id) : domainNamesWithId;

  const updatedDomainNames = updatedDomainNamesWithId.map(({ url }) => url);

  return (updatedDomainNames).includes(urlDomainName);
}

export const createKnowledgeSourceValidationSchema = (values, knowledgeSources, isEditMode) => {
  const modalType = values.type;

  switch (modalType) {
    case MODAL_TYPE.WEBSITE:
      return Yup.object().shape({
        name: Yup.string().required('A valid Name is required'),
        source: Yup.object().shape({
          url: Yup.string()
            .url('A valid website URL in the "http://www.lorumipsum.com" format is required')
            .test('is-unique', 'A website source with this URL has already been created', (currentValue) =>
              !isDuplicateWebsiteSource(currentValue, values, knowledgeSources, isEditMode))
            .required('A url is required'),
        }),
      });
    case MODAL_TYPE.TEXT:
      return Yup.object().shape({
        name: Yup.string().required('A valid Name is required'),
        source: Yup.object().shape({
          plainText: Yup.string().required('Entering at least 1 character is required'),
        }),
      });
    case MODAL_TYPE.API:
      return Yup.object().shape({
        name: Yup.string().required('A valid Name is required'),
        source: Yup.object().shape({
          url: Yup.string()
            .url('A valid website URL in the "http://www.lorumipsum.com" format is required')
            .required('A url is required'),
        }),
        bodyParameter: Yup.array().of(parameterObjectSchema).required(),
        headerParameter: Yup.array().of(parameterObjectSchema).required(),
      });
    case MODAL_TYPE.FILE:
      return Yup.object().shape({
        name: Yup.string().required('A valid Name is required'),
        source: Yup.object().shape({
          fileId: Yup.array().min(1, 'A valid text file is required'),
        }),
      });
    default:
      return Yup.object().shape({
        name: Yup.string().required('A valid Name is required'),
      });
  }
};

export const createKnowledgeBaseValidationSchema = (knowledgeBasesNames, initialName, currentName) => {
  return Yup.object().shape({
    name: Yup.string()
      .required('A valid name is required')
      .test('is-unique', 'knowledge base name already exists', (value) =>
        initialName === currentName ? true : !knowledgeBasesNames.includes(value?.trim())
      ),
  });
};
