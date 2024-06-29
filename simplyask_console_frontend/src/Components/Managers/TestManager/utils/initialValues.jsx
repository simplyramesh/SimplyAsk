import { EXPRESSION_BUILDER_DEFAULT_VALUE } from '../../../shared/REDISIGNED/controls/lexical/ExpressionBuilder';
import { DUPLICATE_NAME_COPY } from '../../AgentManager/GenerativeEditor/constants/core';
import { EXECUTION_FRAMEWORK_OPTIONS } from '../constants/constants';
import { getUniqueTestCaseNameRecursively } from './helpers';

export const importTestCaseInitialValues = (importModeData = {}) => ({
  displayName: importModeData.attributes?.displayName,
  description: importModeData.attributes?.description,
  tags: importModeData.attributes?.tags?.map((tag) => tag.name) || [],
  type: EXECUTION_FRAMEWORK_OPTIONS.find((framework) => framework.value === importModeData.processType),
  assignTests: [],
});

export const duplicateTestCaseInitialValues = (duplicateTestData = {}, allTestCasesOptions = []) => {
  const name = duplicateTestData?.displayName;

  let getUniqueName = '';

  if (name?.includes(DUPLICATE_NAME_COPY)) {
    const removeCopyString = name.split(DUPLICATE_NAME_COPY)[0];
    getUniqueName = getUniqueTestCaseNameRecursively(removeCopyString, allTestCasesOptions);
  } else {
    getUniqueName = getUniqueTestCaseNameRecursively(name, allTestCasesOptions);
  }

  return {
    displayName: getUniqueName,
    description: duplicateTestData?.description,
    tags: duplicateTestData?.tags,
    type: EXECUTION_FRAMEWORK_OPTIONS.find((framework) => framework.value === duplicateTestData?.processType),
    assignTests: [],
  };
};

export const createTestCaseInitialValues = () => ({
  displayName: '',
  description: EXPRESSION_BUILDER_DEFAULT_VALUE,
  tags: [],
  type: '',
  assignTests: [],
});
