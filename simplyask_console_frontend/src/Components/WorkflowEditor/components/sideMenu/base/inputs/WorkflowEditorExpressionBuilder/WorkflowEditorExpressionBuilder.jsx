import React, { memo } from 'react';
import { useRecoilValue } from 'recoil';
import { fullyAndPotentiallyParams } from '../../../../../store/selectors';
import ExpressionBuilder from '../../../../../../shared/REDISIGNED/controls/lexical/ExpressionBuilder';

const WorkflowEditorExpressionBuilder = (props) => {
  const { flatParams } = useRecoilValue(fullyAndPotentiallyParams);

  const formattedParams = flatParams.map(({ label, value, ...rest }) => ({ label, value: value?.value?.paramName || label, ...rest }));

  return (
    <ExpressionBuilder {...props} autocompleteParams={formattedParams} />
  );
};

export default memo(WorkflowEditorExpressionBuilder);
