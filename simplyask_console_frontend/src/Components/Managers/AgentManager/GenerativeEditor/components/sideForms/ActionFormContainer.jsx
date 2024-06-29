import React, { memo } from 'react';
import ActionBaseForm from './ActionBaseForm';
import { useSetRecoilState } from 'recoil';
import { generativeEditorObjectivesState } from '../../store';
import { setIn } from '../../../../../shared/REDISIGNED/utils/helpers';
import { StyledDivider } from '../../../../../shared/styles/styled';
import { ACTION_TYPES, ACTION_TYPES_OPTIONS } from '../../constants/core';
import ExecuteProcess from './ExecuteProcess';
import InvokeApi from './InvokeAPI';
import TransferToAgent from './TransferToAgent';
import QueryKnowledgeBase from './QueryKnowledgeBase';

const ActionFormContainer = ({ action, actionIndex, objectiveIndex, errorsPath }) => {
  const setObjectives = useSetRecoilState(generativeEditorObjectivesState);

  if (!action) return null;

  const { type, name, purpose, data } = action;

  const handleChange = (value, keys) => {
    setObjectives((prev) => {
      return setIn(prev, [objectiveIndex, 'actions', actionIndex, ...keys], value);
    });
  };

  return (
    <>
      <ActionBaseForm
        type={type}
        name={name}
        purpose={purpose}
        onChange={handleChange}
        actionTypeOptions={ACTION_TYPES_OPTIONS}
        errorsPath={errorsPath}
      />
      <StyledDivider m="30px -20px" />

      {type === ACTION_TYPES.EXECUTE_PROCESS && (
        <ExecuteProcess errorsPath={errorsPath} data={data} onChange={handleChange} />
      )}
      {type === ACTION_TYPES.INVOKE_API && <InvokeApi errorsPath={errorsPath} data={data} onChange={handleChange} />}
      {type === ACTION_TYPES.TRANSFER_TO_AGENT && (
        <TransferToAgent errorsPath={errorsPath} data={data} onChange={handleChange} />
      )}
      {type === ACTION_TYPES.QUERY_KNOWLEDGE_BASE && (
        <QueryKnowledgeBase errorsPath={errorsPath} data={data} onChange={handleChange} />
      )}
    </>
  );
};

export default memo(ActionFormContainer);
