import { MultiDirectedGraph } from 'graphology';
import PropTypes from 'prop-types';
import React, { memo, useEffect, useMemo, useState } from 'react';

import BaseTextInput from '../../../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import {
  convertModelParamNodeToTextNode,
  updateModelNodes,
  updateModelParamNodeValue,
} from '../../../../../../shared/REDISIGNED/controls/lexical/utils/helpers';
import { useHistoricalRecoilState } from '../../../../../hooks/useHistoricalRecoilState';
import { getNodesWithParam, updateNode } from '../../../../../services/graph';
import MigrateRenameParamModal from '../../../../WarningModals/MigrateRenameParamModal';
import { STEP_INPUT_TYPE_KEYS, STEP_PARAM_TYPES } from '../../../SideMenu/keyConstants';
import InputFieldMultiple from '../InputFieldMultiple/InputFieldMultiple';
import RadioGroup from '../RadioInput/RadioGroup';
import RadioInput from '../RadioInput/RadioInput';
import WorkflowParamDropdown from '../WorkflowParamDropdown/WorkflowParamDropdown';
import { InputField } from '../index';

const getParamTypeByValue = (value) => {
  const isArray = Array.isArray(value);
  const isObject = value instanceof Object;
  const isString = typeof value === 'string';

  if (isArray || isString) {
    return 'static';
  }
  if (isObject) {
    return 'dynamic';
  }
};

const StaticDynamicParamField = (props) => {
  const {
    value,
    placeholder = '',
    subheading = '',
    isList = false,
    isHiddenStaticValue = false,
    isOutputParam = false,
    error,
    onChange,
  } = props;

  const [paramType, setParamType] = useState(getParamTypeByValue(value));
  const [persistedValue, setPersistedValue] = useState({
    static: '',
    dynamic: null,
    ...{ [getParamTypeByValue(value)]: value },
  });
  const [showMigrateParamModal, setShowMigrateParamModal] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [onFocusValue, setOnFocusValue] = useState();
  const [onBlurValue, setOnBlurValue] = useState();

  const { set, state } = useHistoricalRecoilState();
  const { workflow } = state;
  const graph = useMemo(() => new MultiDirectedGraph().import(workflow), [state]);

  useEffect(() => {
    if (getParamTypeByValue(value) === 'dynamic' && getParamTypeByValue(localValue) === 'static') {
      setParamType('dynamic');
    } else if (getParamTypeByValue(value) === 'static' && getParamTypeByValue(localValue) === 'dynamic') {
      setParamType('static');
    }

    setLocalValue(value);
  }, [value]);

  const isParamUsedInWorkflow = () => {
    const nodesWithParam = getNodesWithParam(graph, onFocusValue);

    return nodesWithParam.length > 0;
  };

  const onStaticParamNameChange = (newValue) => {
    if (isParamUsedInWorkflow() && onFocusValue !== newValue) {
      setShowMigrateParamModal(true);
    }
  };

  const onMigrateParamSubmit = (shouldRename) => {
    migrateRenamedParam(shouldRename);
    setShowMigrateParamModal(false);
  };

  const onMigrateParamCancel = () => {
    setLocalValue(onFocusValue);
    onChange(onFocusValue);
    setShowMigrateParamModal(false);
  };

  const migrateRenamedParam = (shouldRename) => {
    const nodes = getNodesWithParam(graph, onFocusValue);

    nodes.forEach((node) => {
      const nodeId = node.stepId;
      const nodeAttrs = graph.getNodeAttributes(nodeId);
      const stepInputParameters = updateParamSet(nodeAttrs.stepInputParameters, shouldRename);
      const stepOutputParameters = updateParamSet(nodeAttrs.stepOutputParameters, shouldRename);

      updateNode(graph, nodeId, { stepInputParameters, stepOutputParameters });
    });

    set({ ...state, workflow: graph.export() });
  };

  const updateParamSet = (paramSet, shouldRename) => {
    return paramSet.map((inputParam) => {
      const currentValue = inputParam.currentValue;
      const stepType = inputParam.stepSettingTemplate.stepSettingsInputType;

      if (!STEP_PARAM_TYPES.includes(stepType)) {
        return inputParam;
      }

      let newValue;

      switch (stepType) {
        case STEP_INPUT_TYPE_KEYS.PARAMETER_AUTOCOMPLETE:
          newValue = updateAutocompleteParam(currentValue, shouldRename);
          break;
        case STEP_INPUT_TYPE_KEYS.STATIC_DYNAMIC_PARAMETER_FIELD:
          newValue = updateParam(currentValue, shouldRename);
          break;

        case STEP_INPUT_TYPE_KEYS.API_PARAMETER_LIST:
          newValue = shouldRename
            ? currentValue.map((param) => ({
                ...param,
                value: updateParam(param.value),
              }))
            : currentValue.filter((param) => param?.value?.label !== onFocusValue);
          break;

        case STEP_INPUT_TYPE_KEYS.DROPDOWN_SELECTOR:
          newValue = inputParam.stepSettingTemplate?.stepSettingOptions?.shouldDisplayDynamicParameterValues
            ? updateParam(currentValue, shouldRename)
            : inputParam;
          break;

        default:
          break;
      }

      return {
        ...inputParam,
        currentValue: newValue,
      };
    });
  };

  const updateParam = (paramValue, shouldRename) => {
    const oldName = onFocusValue;
    const newParam = shouldRename
      ? {
          label: onBlurValue,
          value: onBlurValue,
        }
      : '';

    return paramValue && paramValue.label === oldName ? newParam : paramValue;
  };

  const updateAutocompleteParam = (paramValue, shouldRename) => {
    if (!paramValue) {
      return '';
    }

    try {
      const jsonValue = JSON.parse(paramValue);
      const oldParamName = onFocusValue;
      const newParamName = onBlurValue;

      const updatedValue = updateModelNodes(jsonValue, (node) => {
        if (node.paramName !== oldParamName) return node;

        const newNode = shouldRename
          ? updateModelParamNodeValue(node, newParamName)
          : convertModelParamNodeToTextNode(node, oldParamName);

        return newNode;
      });

      return JSON.stringify(updatedValue);
    } catch (e) {
      console.error(e);
      return paramValue;
    }
  };

  const isParamDynamic = () => paramType === 'dynamic';
  const isParamStatic = () => paramType === 'static';

  const WorkflowParamDropdownInput = ({ isMulti, onChange }) => (
    <WorkflowParamDropdown
      placeholder="Select Workflow Parameter"
      value={value}
      error={error}
      isMulti={isMulti}
      onChange={(value) => {
        setPersistedValue((prev) => ({ ...prev, [paramType]: value }));
        onChange(value);
      }}
    />
  );

  return (
    <>
      <MigrateRenameParamModal
        open={showMigrateParamModal}
        onSubmit={onMigrateParamSubmit}
        onCancel={onMigrateParamCancel}
      />

      <RadioGroup orientation="row">
        <RadioInput
          label={isOutputParam ? 'New' : 'Static'}
          checked={isParamStatic()}
          value="static"
          onChange={(e) => {
            setPersistedValue((prev) => ({ ...prev, dynamic: value }));
            onChange(persistedValue.static || '');
            setParamType(e.target.value);
          }}
        />
        <RadioInput
          label={isOutputParam ? 'Existing' : 'Dynamic'}
          checked={isParamDynamic()}
          value="dynamic"
          onChange={(e) => {
            setPersistedValue((prev) => ({ ...prev, static: value }));
            onChange(persistedValue.dynamic || '');
            setParamType(e.target.value);
          }}
        />
      </RadioGroup>

      {isParamDynamic() && !isList && <WorkflowParamDropdownInput isMulti={false} onChange={onChange} />}

      {isParamStatic() && !isList && (
        <BaseTextInput
          subheading={subheading}
          placeholder={placeholder}
          value={localValue}
          onChange={(e) => onChange(e.target.value)}
          onFocus={(e) => setOnFocusValue(e.target.value)}
          onBlur={(e) => {
            const newValue = e.target.value;

            setOnBlurValue(newValue);
            onStaticParamNameChange(newValue);
          }}
          invalid={error}
          type={isHiddenStaticValue ? 'password' : 'text'}
        />
      )}

      {isList && (
        <InputFieldMultiple value={value} onChange={(value) => onChange(value)}>
          {({ handleAdd, setState, state }) => (
            <>
              {isParamDynamic() && <WorkflowParamDropdownInput isMulti={true} onChange={onChange} />}
              {isParamStatic() && (
                <InputField
                  subheading={subheading}
                  placeholder={placeholder}
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  error={error}
                  onIconClick={handleAdd}
                  onEnterKeyPress={handleAdd}
                  plusIcon={isList}
                />
              )}
            </>
          )}
        </InputFieldMultiple>
      )}
    </>
  );
};

export default memo(StaticDynamicParamField);

StaticDynamicParamField.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  subheading: PropTypes.string,
  error: PropTypes.shape({
    type: PropTypes.string,
    message: PropTypes.string,
  }),
  isList: PropTypes.bool,
};
