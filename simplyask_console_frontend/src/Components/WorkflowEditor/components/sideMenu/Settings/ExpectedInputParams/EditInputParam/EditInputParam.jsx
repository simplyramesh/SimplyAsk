import { MultiDirectedGraph } from 'graphology';
import { React, useCallback, useMemo, useState } from 'react';
import Select from 'react-select';
import BaseTextInput from '../../../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';

import AddIcon from '@mui/icons-material/Add';
import { Slider } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import Switch from '../../../../../../SwitchWithText/Switch';
import { useHistoricalRecoilState } from '../../../../../hooks/useHistoricalRecoilState';
import { getNodesWithParam, updateNode } from '../../../../../services/graph';
import MigrateRenameParamModal from '../../../../WarningModals/MigrateRenameParamModal';
import { Button, InputField } from '../../../base';
import CustomDropdownIndicator from '../../../base/inputs/DropdownSelector/CustomDropdownIndicator';
import { STEP_INPUT_TYPE_KEYS, STEP_PARAM_TYPES } from '../../../SideMenu/keyConstants';
import { GROUPED_VALIDATION_TYPES_OPTIONS, VALIDATION_TYPES_OPTIONS } from '../../../SideMenu/validationTypes';
import { Heading } from '../../../sub';
import { Content, LabeledField, Scrollable } from '../../../wrappers';
import { dropdownStyles } from '../../dropdownStyles';
import SettingsHeading from '../../SettingsHeading/SettingsHeading';

import ChevronDown from '../../../../../../../Assets/icons/lexical/chevron-down.svg?component';
import { swapArrayElements } from '../../../../../../../utils/helperFunctions';
import classes from '../../../../../../Auth/CreateNewAccount/DataCollectionSteps/StepThreeBillingDetails/StepThreeBillingDetails.module.css';
import { VALIDATION_TYPES } from '../../../../../../PublicFormPage/constants/validationTypes';
import FormErrorMessage from '../../../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import {
  convertModelParamNodeToTextNode,
  updateModelNodes,
  updateModelParamNodeValue,
} from '../../../../../../shared/REDISIGNED/controls/lexical/utils/helpers';
import TreeOptions from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/options/TreeOptions';
import CustomSelect from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import DragAndDropIcon from '../../../../../Assets/Icons/DragAndDropIcon.svg?component';
import TrashIcon from '../../../../../Assets/Icons/trashIcon.svg?component';
import { COMPONENT_TYPES_OPTIONS } from '../../../SideMenu/componentTypes';
import { FILE_TYPES } from '../../../SideMenu/fileTypes';
import DynamicParamInput from '../../DynamicParamInput/DynamicParamInput';

export const INPUT_API_KEYS = {
  DYNAMIC_INPUT_PARAMS: 'dynamicInputParams',
  STATIC_INPUT_PARAMS: 'staticInputParams',
  PARAM_NAME: 'paramName',
  VALIDATION_TYPE: 'validationType',
  COMPONENT_TYPE: 'componentType',
  FILE_SIZE: 'fileSize',
  FILE_TYPE: 'fileType',
  FILE_TYPE_LIST: 'fileTypeList',
  OPTIONS: 'options',
  IS_REQUIRED: 'isRequired',
  IS_PROTECTED: 'isProtected',
  IS_MASKED: 'isMasked',
  VALUE: 'value',
  DESCRIPTION: 'description',
  DISPLAY_NAME: 'displayName',
  PLACEHOLDER: 'placeholder',
  SIGNATURE: 'signature',
};

const replaceParam = (inputParams, replacementParam, index) => {
  const updatedParam = inputParams.map((param, i) => (i === index ? replacementParam : param));

  return updatedParam;
};

const removeParam = (inputParams, index) => {
  const updatedParam = inputParams.filter((param, i) => i !== index);

  return updatedParam;
};

const LABELED_FIELD_MARGIN_BOTTOM = 10; // area between label and input field

const EditInputParam = ({ onBackClick, onConfirmClick, initParam, isTestEditor, paramSets, isScheduledExecution }) => {
  const [isStatic] = useState(initParam.staticDynamic === INPUT_API_KEYS.STATIC_INPUT_PARAMS);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [inputParamSet, setInputParamSet] = useState({
    [initParam.staticDynamic]: initParam.inputParams[initParam.staticDynamic][initParam.index],
  });
  const [valueError, setValueError] = useState(false);

  const [showMigrateParamModal, setShowMigrateParamModal] = useState(false);

  const { state, set } = useHistoricalRecoilState();
  const { workflow } = state;

  const graph = useMemo(() => new MultiDirectedGraph().import(workflow), [state]);

  const Separator = () => <StyledDivider borderWidth={2} orientation="horizontal" />;

  const staticOrDynamic = isStatic ? INPUT_API_KEYS.STATIC_INPUT_PARAMS : INPUT_API_KEYS.DYNAMIC_INPUT_PARAMS;

  const initialStaticDynamicKey = initParam?.staticDynamic;

  const isValidationTypeFile =
    inputParamSet?.[staticOrDynamic]?.[INPUT_API_KEYS.VALIDATION_TYPE] === VALIDATION_TYPES.FILE;
  const isSignatureType =
    inputParamSet?.[staticOrDynamic]?.[INPUT_API_KEYS.VALIDATION_TYPE] === VALIDATION_TYPES.SIGNATURE;

  const isProtectedToggleShown = useMemo(
    () => !isSignatureType && !isValidationTypeFile,
    [isSignatureType, isValidationTypeFile]
  );

  const paramNotEmpty = (param) => {
    return param !== '';
  };

  const isValueValid = () =>
    paramNotEmpty(inputParamSet[INPUT_API_KEYS.STATIC_INPUT_PARAMS][INPUT_API_KEYS.VALUE]) && !valueError;

  const isButtonDisabled = (params, isStatic) => {
    return !(
      paramNotEmpty(params[INPUT_API_KEYS.PARAM_NAME]) &&
      paramNotEmpty(params[INPUT_API_KEYS.VALIDATION_TYPE]) &&
      (!isStatic || isValueValid())
    );
  };

  const getInitialValueByType = (type) => {
    if (type === VALIDATION_TYPES.BOOLEAN) {
      return true;
    }

    return '';
  };

  const dynamicButtonEnabling = isButtonDisabled(inputParamSet[staticOrDynamic], isStatic);

  const getEditParamName = (param) => initParam.inputParams[param][initParam.index].paramName;

  const isNameChanged = () => inputParamSet[staticOrDynamic].paramName !== getEditParamName(initialStaticDynamicKey);

  const onChangeWithoutSpaces = useCallback(
    (e) => {
      const newValue = e.target ? e.target.value : e.value;
      const newName = e.target ? e.target.name : INPUT_API_KEYS.VALIDATION_TYPE;
      handleChangeWithType({ value: newValue.replace(/\s/g, '') }, newName);
    },
    [staticOrDynamic]
  );

  const syncDisplayNameWithParamName = () => {
    if (inputParamSet[staticOrDynamic]?.[INPUT_API_KEYS.DISPLAY_NAME]) return;

    handleChangeWithType(
      { value: inputParamSet[staticOrDynamic]?.[INPUT_API_KEYS.PARAM_NAME] || '' },
      INPUT_API_KEYS.DISPLAY_NAME
    );
  };

  const handleChangeWithType = useCallback(
    (e, newName) => {
      const newValue = e.target ? e.target.value : e.value;

      const payload = {
        ...inputParamSet[staticOrDynamic],
        [newName]: e.target?.type === 'radio' ? newValue === 'true' : newValue,
      };

      const isFileType = newValue === VALIDATION_TYPES.FILE;

      if (isFileType) {
        const { isProtected, ...restPayload } = payload;

        setInputParamSet({
          [staticOrDynamic]: restPayload,
        });
      } else {
        setInputParamSet({
          [staticOrDynamic]: payload,
        });
      }
    },
    [staticOrDynamic, inputParamSet?.[staticOrDynamic]]
  );

  const handleChangeMulti = useCallback(
    (e, newName) => {
      setInputParamSet((prev) => ({
        [staticOrDynamic]: {
          ...prev[staticOrDynamic],
          [newName]: JSON.stringify(e),
        },
      }));
    },
    [staticOrDynamic]
  );

  const multiValue = (value) => {
    if (value) {
      return JSON.parse(value);
    }
    return value;
  };

  const handleChange = useCallback(
    (e) => {
      const newName = e.target ? e.target.name : INPUT_API_KEYS.VALIDATION_TYPE;
      handleChangeWithType(e, newName);
    },
    [staticOrDynamic]
  );

  const handleMinMaxChange = useCallback(
    (e) => {
      const newName = e.target ? e.target.name : INPUT_API_KEYS.FILE_SIZE;
      const min = e.target ? e.target.min : 1;
      const max = e.target ? e.target.max : 1000;
      const value = Math.max(min, Math.min(max, Number(e.target.value)));
      handleChangeWithType({ value: value }, newName);
    },
    [staticOrDynamic]
  );

  const handleOptionAdd = useCallback(
    (params) => {
      const options = [...params[staticOrDynamic][INPUT_API_KEYS.OPTIONS]];
      options.push({ value: '' });

      setInputParamSet((prev) => ({
        [staticOrDynamic]: { ...prev[staticOrDynamic], [INPUT_API_KEYS.OPTIONS]: options },
      }));
    },
    [staticOrDynamic]
  );

  const showFilesContent = useCallback(
    (params) => {
      return params[INPUT_API_KEYS.VALIDATION_TYPE] === 'FILE';
    },
    [staticOrDynamic]
  );

  const showSignatureContent = useCallback(
    (params) => {
      return (
        staticOrDynamic === INPUT_API_KEYS.DYNAMIC_INPUT_PARAMS &&
        params[INPUT_API_KEYS.VALIDATION_TYPE] === 'SIGNATURE'
      );
    },
    [staticOrDynamic]
  );

  const enableComponentType = useCallback(
    (params) => {
      return (
        ['PHONE_NUMBER', 'BOOLEAN', 'JSON', 'ADDRESS', 'FILE', 'SIGNATURE'].indexOf(
          params[INPUT_API_KEYS.VALIDATION_TYPE]
        ) !== -1
      );
    },
    [staticOrDynamic]
  );

  const showPlaceholder = useCallback(
    (params) => {
      return ['DATE_OF_BIRTH', 'FILE', 'DATE'].indexOf(params[INPUT_API_KEYS.VALIDATION_TYPE]) === -1;
    },
    [staticOrDynamic]
  );

  const showOptions = useCallback(
    (params) => {
      return (
        ['ANYTHING'].indexOf(params[INPUT_API_KEYS.VALIDATION_TYPE]) !== -1 &&
        (params[INPUT_API_KEYS.COMPONENT_TYPE] === 'SINGLE_SELECT_DROPDOWN' ||
          params[INPUT_API_KEYS.COMPONENT_TYPE] === 'MULTI_SELECT_DROPDOWN')
      );
    },
    [staticOrDynamic]
  );

  const handleOnDragEnd = useCallback(
    (result, params) => {
      const options = [...params[staticOrDynamic][INPUT_API_KEYS.OPTIONS]];
      swapArrayElements(options, result.source.index, result.destination.index);

      setInputParamSet((prev) => ({
        [staticOrDynamic]: { ...prev[staticOrDynamic], [INPUT_API_KEYS.OPTIONS]: options },
      }));
    },
    [staticOrDynamic]
  );

  const deleteOption = useCallback(
    (index, param) => {
      const options = [...param[staticOrDynamic][INPUT_API_KEYS.OPTIONS]];
      options.splice(index, 1);
      setInputParamSet((prev) => ({
        [staticOrDynamic]: { ...prev[staticOrDynamic], [INPUT_API_KEYS.OPTIONS]: options },
      }));
    },
    [staticOrDynamic]
  );

  const handleOptionChange = useCallback(
    (e, index) => {
      const newValue = e.target ? e.target.value : e.value;

      setInputParamSet((prev) => ({
        ...prev,
        [staticOrDynamic]: {
          ...prev[staticOrDynamic],
          [INPUT_API_KEYS.OPTIONS]: prev[staticOrDynamic][INPUT_API_KEYS.OPTIONS].map((option, i) =>
            i === index ? { value: newValue } : option
          ),
        },
      }));
    },
    [staticOrDynamic]
  );

  const onConfirm = () => {
    if (staticOrDynamic === initParam.staticDynamic) {
      const updatedParamArray = !isTestEditor
        ? replaceParam(initParam.inputParams[staticOrDynamic], inputParamSet[staticOrDynamic], initParam.index)
        : replaceParam(
            paramSets[initParam.paramSetIndex][staticOrDynamic],
            inputParamSet[staticOrDynamic],
            initParam.index
          );

      !isTestEditor
        ? onConfirmClick((prev) => ({
            ...prev,
            inputParamSets: [
              {
                ...prev?.inputParamSets[0],
                name: 'Parameters',
                orderNumber: prev.inputParamSets.length,
                [staticOrDynamic]: updatedParamArray,
              },
            ],
          }))
        : onConfirmClick((prev) => ({
            ...prev,
            inputParamSets: [
              ...prev.inputParamSets.slice(0, initParam.paramSetIndex),
              {
                ...prev?.inputParamSets[initParam.paramSetIndex],
                [staticOrDynamic]: updatedParamArray,
              },
              ...prev.inputParamSets.slice(initParam.paramSetIndex + 1),
            ],
          }));
    }

    if (staticOrDynamic !== initParam.staticDynamic) {
      const otherStaticOrDynamic =
        staticOrDynamic === INPUT_API_KEYS.STATIC_INPUT_PARAMS
          ? INPUT_API_KEYS.DYNAMIC_INPUT_PARAMS
          : INPUT_API_KEYS.STATIC_INPUT_PARAMS;

      const removedParamArray = !isTestEditor
        ? removeParam([...initParam.inputParams[otherStaticOrDynamic]], initParam.index)
        : removeParam([...paramSets[initParam.paramSetIndex][otherStaticOrDynamic]], initParam.index);

      !isTestEditor
        ? onConfirmClick((prev) => ({
            ...prev,
            inputParamSets: [
              {
                ...prev?.inputParamSets[0],
                name: 'Parameters',
                orderNumber: prev.inputParamSets.length,
                [staticOrDynamic]: [
                  ...prev.inputParamSets[0]?.[staticOrDynamic],
                  { ...inputParamSet[staticOrDynamic] },
                ],
                [otherStaticOrDynamic]: removedParamArray,
              },
            ],
          }))
        : onConfirmClick((prev) => ({
            ...prev,
            inputParamSets: [
              ...prev.inputParamSets.slice(0, initParam.paramSetIndex),
              {
                ...prev?.inputParamSets[initParam.paramSetIndex],
                [staticOrDynamic]: [
                  ...prev.inputParamSets[initParam.paramSetIndex]?.[staticOrDynamic],
                  { ...inputParamSet[staticOrDynamic] },
                ],
                [otherStaticOrDynamic]: removedParamArray,
              },
              ...prev.inputParamSets.slice(initParam.paramSetIndex + 1),
            ],
          }));
    }

    if (isScheduledExecution) return;

    onBackClick((prev) => ({ current: prev.previous, previous: prev.current }));
  };

  const isParamUsedInWorkflow = () => {
    const nodesWithParam = getNodesWithParam(graph, getEditParamName(initialStaticDynamicKey));

    return nodesWithParam.length > 0;
  };

  const handleConfirmClick = () => {
    if (typeof onConfirmClick === 'function') {
      if (isNameChanged() && isParamUsedInWorkflow()) {
        setShowMigrateParamModal(true);
      } else {
        onConfirm();
      }
    }
  };

  const onMigrateParamSubmit = (shouldRename) => {
    migrateRenamedParam(shouldRename);

    onConfirm();
    setShowMigrateParamModal(false);
  };

  const migrateRenamedParam = (shouldRename) => {
    const paramName = getEditParamName(staticOrDynamic);
    const nodes = getNodesWithParam(graph, paramName);

    nodes.forEach((node) => {
      const nodeId = node.stepId;
      const nodeAttrs = graph.getNodeAttributes(nodeId);
      const stepInputParameters = updateParamSet(nodeAttrs.stepInputParameters, shouldRename);
      const stepOutputParameters = updateParamSet(nodeAttrs.stepOutputParameters, shouldRename);

      updateNode(graph, nodeId, { stepInputParameters, stepOutputParameters });
    });

    set({ ...state, workflow: graph.export() });
  };

  const updateParamName = (paramValue, shouldRename) => {
    const oldName = getEditParamName(staticOrDynamic);
    const newName = inputParamSet[staticOrDynamic].paramName;
    const newParam = shouldRename
      ? {
          ...paramValue,
          label: newName,
          value: {
            ...paramValue.value,
            paramName: newName,
          },
        }
      : '';

    return paramValue && paramValue.label === oldName ? newParam : paramValue;
  };

  const updateAutocompleteParam = (currentValue, shouldRename) => {
    if (!currentValue) return '';

    try {
      const jsonValue = JSON.parse(currentValue);
      const oldParamName = getEditParamName(initialStaticDynamicKey);
      const newParamName = inputParamSet[staticOrDynamic].paramName;

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

  const updateParamSet = (paramSet, shouldRename) =>
    paramSet.map((inputParam) => {
      const { currentValue } = inputParam;
      const stepType = inputParam.stepSettingTemplate.stepSettingsInputType;

      if (!STEP_PARAM_TYPES.includes(stepType)) {
        return inputParam;
      }

      let newValue;

      switch (stepType) {
        case STEP_INPUT_TYPE_KEYS.STATIC_DYNAMIC_PARAMETER_FIELD:
          newValue = updateParamName(currentValue, shouldRename);
          break;

        case STEP_INPUT_TYPE_KEYS.API_PARAMETER_LIST:
          newValue = shouldRename
            ? currentValue.map((param) => ({
                ...param,
                value: updateParamName(param.value),
              }))
            : currentValue.filter((param) => param.value?.label !== getEditParamName(staticOrDynamic));

          break;

        case STEP_INPUT_TYPE_KEYS.DROPDOWN_SELECTOR:
          newValue = inputParam.stepSettingTemplate?.stepSettingOptions?.shouldDisplayDynamicParameterValues
            ? updateParamName(currentValue, shouldRename)
            : inputParam;
          break;

        case STEP_INPUT_TYPE_KEYS.PARAMETER_AUTOCOMPLETE:
          newValue = updateAutocompleteParam(currentValue, shouldRename);
          break;

        default:
          break;
      }

      return {
        ...inputParam,
        currentValue: newValue,
      };
    });

  const filesContent = () => {
    return (
      <StyledFlex>
        <LabeledField label="Files Types Allowed" marginBottom={LABELED_FIELD_MARGIN_BOTTOM}>
          <RadioGroup
            row
            name="controlled-radio-buttons-group"
            value={inputParamSet[staticOrDynamic][INPUT_API_KEYS.FILE_TYPE]}
            onChange={(e) => handleChangeWithType(e, INPUT_API_KEYS.FILE_TYPE)}
          >
            <FormControlLabel
              value="true"
              control={
                <Radio
                  className={`${inputParamSet[staticOrDynamic][INPUT_API_KEYS.FILE_TYPE] && classes.colorRadio}`}
                />
              }
              label="All File Types"
            />
            <FormControlLabel
              value="false"
              control={
                <Radio
                  className={`${!inputParamSet[staticOrDynamic][INPUT_API_KEYS.FILE_TYPE] && classes.colorRadio}`}
                />
              }
              label="Allow only specific file types"
            />
          </RadioGroup>
          {!inputParamSet[staticOrDynamic][INPUT_API_KEYS.FILE_TYPE] && (
            <CustomSelect
              options={FILE_TYPES}
              placeholder="Select Workflow Parameter"
              name={INPUT_API_KEYS.VALIDATION_TYPE}
              value={multiValue(inputParamSet[staticOrDynamic][INPUT_API_KEYS.FILE_TYPE_LIST])}
              onChange={(e) => handleChangeMulti(e, INPUT_API_KEYS.FILE_TYPE_LIST)}
              components={{
                DropdownIndicator: CustomDropdownIndicator,
                Option: TreeOptions,
              }}
              styles={dropdownStyles}
              isOptionDisabled={(option) => option.disabled}
              isMulti
              closeMenuOnScroll
            />
          )}
        </LabeledField>

        <StyledFlex marginBottom={LABELED_FIELD_MARGIN_BOTTOM}>
          <Heading as="h2" promptText="The maximum file size must be from 1 to 1000 (MB)">
            File Size Limit (MB)
          </Heading>
          <StyledFlex flexDirection="row" gap="25px">
            <Slider
              min={1}
              max={1000}
              style={{ margin: 'auto' }}
              step={0.5}
              className={`${classes.colorRadio}`}
              value={inputParamSet[staticOrDynamic][INPUT_API_KEYS.FILE_SIZE]}
              onChange={(e) => handleChangeWithType(e, INPUT_API_KEYS.FILE_SIZE)}
            />
            <InputField
              name={INPUT_API_KEYS.FILE_SIZE}
              style={{ width: '80px' }}
              value={inputParamSet[staticOrDynamic][INPUT_API_KEYS.FILE_SIZE] || ''}
              type="number"
              min={1}
              max={1000}
              onChange={handleMinMaxChange}
            />
          </StyledFlex>
        </StyledFlex>
      </StyledFlex>
    );
  };

  const advancedContent = () => {
    return (
      <StyledFlex>
        {showFilesContent(inputParamSet[staticOrDynamic]) && filesContent()}

        <LabeledField label="Display Name" marginBottom={LABELED_FIELD_MARGIN_BOTTOM}>
          <BaseTextInput
            placeholder="Display Name"
            name={INPUT_API_KEYS.DISPLAY_NAME}
            value={inputParamSet[staticOrDynamic][INPUT_API_KEYS.DISPLAY_NAME] || ''}
            onChange={handleChange}
          />
        </LabeledField>
        <LabeledField label="Description" marginBottom={LABELED_FIELD_MARGIN_BOTTOM}>
          <InputField
            placeholder="Description"
            name={INPUT_API_KEYS.DESCRIPTION}
            value={inputParamSet[staticOrDynamic][INPUT_API_KEYS.DESCRIPTION] || ''}
            onChange={handleChange}
          />
        </LabeledField>
        {showPlaceholder(inputParamSet[staticOrDynamic]) && !showSignatureContent(inputParamSet[staticOrDynamic]) && (
          <LabeledField label="Placeholder" marginBottom={LABELED_FIELD_MARGIN_BOTTOM}>
            <InputField
              placeholder="Placeholder"
              name={INPUT_API_KEYS.PLACEHOLDER}
              value={inputParamSet[staticOrDynamic][INPUT_API_KEYS.PLACEHOLDER] || ''}
              onChange={handleChange}
            />
          </LabeledField>
        )}
        <LabeledField label="Component Type" marginBottom={LABELED_FIELD_MARGIN_BOTTOM}>
          <Select
            options={COMPONENT_TYPES_OPTIONS}
            placeholder="Component Type Parameter"
            name={INPUT_API_KEYS.COMPONENT_TYPE}
            value={COMPONENT_TYPES_OPTIONS.find(
              (v) => v.value === inputParamSet[staticOrDynamic][INPUT_API_KEYS.COMPONENT_TYPE]
            )}
            onChange={(e) => handleChangeWithType(e, INPUT_API_KEYS.COMPONENT_TYPE)}
            components={{ DropdownIndicator: CustomDropdownIndicator }}
            styles={dropdownStyles}
            isDisabled={enableComponentType(inputParamSet[staticOrDynamic])}
            closeMenuOnSelect
            closeMenuOnScroll
          />
        </LabeledField>

        {showOptions(inputParamSet[staticOrDynamic]) && (
          <StyledFlex>
            <StyledFlex justifyContent="space-between" flexDirection="row">
              <StyledText size={19} weight={500}>
                Dropdown Options
              </StyledText>

              <StyledFlex
                style={{ cursor: 'pointer' }}
                gap="2px"
                flexDirection="row"
                onClick={() => handleOptionAdd(inputParamSet)}
              >
                <StyledFlex width="35px" height="35px">
                  <AddIcon />
                </StyledFlex>
                <StyledText>Add</StyledText>
              </StyledFlex>
            </StyledFlex>
          </StyledFlex>
        )}
        {showOptions(inputParamSet[staticOrDynamic]) && (
          <DragDropContext onDragEnd={(result) => handleOnDragEnd(result, inputParamSet)}>
            <Droppable
              droppableId="paramsReorder"
              renderClone={(provided, snapshot, rubric) => {
                const index = rubric.source.index;

                return (
                  <StyledFlex
                    justifyContent="space-between"
                    flexDirection="row"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      boxShadow: '0 0 5px rgba(0,0,0,.1)',
                      background: 'white',
                      borderRadius: '10px',
                    }}
                  >
                    <DragAndDropIcon style={{ transform: 'rotate(90deg)', margin: 'auto 0 auto 0' }} />
                    <StyledText style={{ margin: 'auto 0 auto 0' }}>{index + 1}</StyledText>
                    <StyledFlex width="245px">
                      <InputField
                        name={index}
                        value={inputParamSet[staticOrDynamic][INPUT_API_KEYS.OPTIONS][index].value}
                      />
                    </StyledFlex>
                    <StyledFlex width="35px" height="35px">
                      <TrashIcon />
                    </StyledFlex>
                  </StyledFlex>
                );
              }}
            >
              {(provided) => (
                <div className="paramsReorder" ref={provided.innerRef} {...provided.droppableProps}>
                  {inputParamSet[staticOrDynamic][INPUT_API_KEYS.OPTIONS].map(({ value }, index) => {
                    return (
                      <Draggable draggableId={`${index}`} index={index} draggable={false} key={`${index}`}>
                        {(provided) => (
                          <StyledFlex
                            mb="5px"
                            justifyContent="space-between"
                            flexDirection="row"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <DragAndDropIcon style={{ transform: 'rotate(90deg)', margin: 'auto 0 auto 0' }} />
                            <StyledText style={{ margin: 'auto 0 auto 0' }}>{index + 1}</StyledText>
                            <StyledFlex width="245px">
                              <InputField
                                key={value}
                                name={index}
                                value={value}
                                onChange={(event) => handleOptionChange(event, index)}
                              />
                            </StyledFlex>
                            <StyledFlex width="35px" height="35px" onClick={() => deleteOption(index, inputParamSet)}>
                              <TrashIcon />
                            </StyledFlex>
                          </StyledFlex>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </StyledFlex>
    );
  };

  return (
    <>
      <SettingsHeading
        heading={`Edit ${initParam.inputParams[initParam.staticDynamic][initParam.index]?.paramName}`}
        onBackClick={() => onBackClick((prev) => ({ current: prev.previous, previous: prev.current }))}
        withIcon
      />
      <Scrollable>
        <Content variant="default">
          <StyledFlex gap="10px">
            <LabeledField label="Parameter Name" marginBottom={LABELED_FIELD_MARGIN_BOTTOM}>
              <InputField
                placeholder="Parameter Name"
                name={INPUT_API_KEYS.PARAM_NAME}
                value={inputParamSet[staticOrDynamic][INPUT_API_KEYS.PARAM_NAME] || ''}
                onChange={onChangeWithoutSpaces}
                onBlur={syncDisplayNameWithParamName}
              />
            </LabeledField>
          </StyledFlex>

          <LabeledField label="Expect Parameter Type" marginBottom={LABELED_FIELD_MARGIN_BOTTOM}>
            <CustomSelect
              options={GROUPED_VALIDATION_TYPES_OPTIONS}
              placeholder="Select Parameter Type"
              name={INPUT_API_KEYS.VALIDATION_TYPE}
              value={VALIDATION_TYPES_OPTIONS.find(
                (v) => v.value === inputParamSet[staticOrDynamic][INPUT_API_KEYS.VALIDATION_TYPE]
              )}
              onChange={(e) => {
                handleChangeWithType(e, INPUT_API_KEYS.VALIDATION_TYPE);
                setValueError(null);
                setInputParamSet((prev) => ({
                  [staticOrDynamic]: {
                    ...prev[staticOrDynamic],
                    [INPUT_API_KEYS.VALUE]: getInitialValueByType(inputParamSet[staticOrDynamic][INPUT_API_KEYS.TYPE]),
                  },
                }));
              }}
              components={{ DropdownIndicator: CustomDropdownIndicator }}
              filterOption={(o) =>
                staticOrDynamic === INPUT_API_KEYS.DYNAMIC_INPUT_PARAMS || o.value !== VALIDATION_TYPES.SIGNATURE
              }
              form
              closeMenuOnSelect
              closeMenuOnScroll
            />
          </LabeledField>
          {isStatic && (
            <LabeledField label="Parameter Value" marginBottom={LABELED_FIELD_MARGIN_BOTTOM}>
              <DynamicParamInput
                placeholder="Parameter Value"
                name={INPUT_API_KEYS.VALUE}
                type={inputParamSet[staticOrDynamic][INPUT_API_KEYS.VALIDATION_TYPE]}
                onChange={(value) => {
                  setInputParamSet((prev) => ({
                    [staticOrDynamic]: { ...prev[staticOrDynamic], [INPUT_API_KEYS.VALUE]: value },
                  }));
                }}
                isError={!!valueError}
                onError={(e) => setValueError(e)}
                value={inputParamSet[INPUT_API_KEYS.STATIC_INPUT_PARAMS][INPUT_API_KEYS.VALUE]}
              />
              {valueError && <FormErrorMessage>{valueError}</FormErrorMessage>}
            </LabeledField>
          )}

          {isProtectedToggleShown && (
            <StyledFlex gap="10px" mb={2}>
              <Heading as="h2" size="medium" promptText="The field is Protected">
                Protected
              </Heading>

              <StyledFlex display="flex" alignItems="center" gap="10px" alignSelf="stretch" flexDirection="row">
                <Switch
                  name={INPUT_API_KEYS.IS_PROTECTED}
                  id={INPUT_API_KEYS.IS_PROTECTED}
                  activeLabel=""
                  inactiveLabel=""
                  checked={!!inputParamSet[staticOrDynamic][INPUT_API_KEYS.IS_PROTECTED]}
                  onChange={(value) => {
                    setInputParamSet((prev) => ({
                      [staticOrDynamic]: { ...prev[staticOrDynamic], [INPUT_API_KEYS.IS_PROTECTED]: value },
                    }));
                  }}
                />
                <StyledText textAlign="right" weight="500" lh="24px">
                  Field is Protected
                </StyledText>
              </StyledFlex>
            </StyledFlex>
          )}

          {!isStatic && (
            <StyledFlex gap="25px">
              <StyledFlex gap="10px">
                <Heading as="h2" size="medium" promptText="The field is Required">
                  Required
                </Heading>

                <StyledFlex display="flex" alignItems="center" gap="10px" alignSelf="stretch" flexDirection="row">
                  <Switch
                    name={INPUT_API_KEYS.IS_REQUIRED}
                    id={INPUT_API_KEYS.IS_REQUIRED}
                    activeLabel=""
                    inactiveLabel=""
                    checked={inputParamSet[INPUT_API_KEYS.DYNAMIC_INPUT_PARAMS][INPUT_API_KEYS.IS_REQUIRED]}
                    onChange={(value) => {
                      setInputParamSet((prev) => ({
                        [staticOrDynamic]: { ...prev[staticOrDynamic], [INPUT_API_KEYS.IS_REQUIRED]: value },
                      }));
                    }}
                  />
                  <StyledText textAlign="right" weight="500" lh="24px">
                    Field is Required
                  </StyledText>
                </StyledFlex>
                {showSignatureContent(inputParamSet[INPUT_API_KEYS.DYNAMIC_INPUT_PARAMS]) &&
                inputParamSet[INPUT_API_KEYS.DYNAMIC_INPUT_PARAMS][INPUT_API_KEYS.IS_REQUIRED] ? (
                  <StyledFlex>
                    <StyledText as="p" size={14} weight={600} lh={20} themeColor="secondary">
                      {'Warning: '}
                      <StyledText display="inline" size={14} weight={400} lh={20} themeColor="primary">
                        {'Processes with '}
                        <StyledText display="inline" size={14} weight={600} lh={20} themeColor="primary">
                          {'required '}
                        </StyledText>
                        <StyledText display="inline" size={14} weight={400} lh={20} themeColor="primary">
                          signature input parameters can only be executed via Process Trigger or Public Submission
                          Forms.
                        </StyledText>
                      </StyledText>
                    </StyledText>
                  </StyledFlex>
                ) : null}
              </StyledFlex>
              <Separator />
              {!isTestEditor && (
                <StyledFlex>
                  <StyledFlex
                    style={{ cursor: 'pointer' }}
                    mb="15px"
                    flexDirection="row"
                    gap="10px"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    <ChevronDown
                      style={{
                        transform: showAdvanced ? 'rotate(180deg)' : 'rotate(270deg)',
                        width: '19px',
                        height: '19px',
                        margin: 'auto 0 auto 0',
                      }}
                    />
                    <StyledText size={19} weight={500}>
                      Advanced Configuration
                    </StyledText>
                  </StyledFlex>
                  {showAdvanced && advancedContent()}
                </StyledFlex>
              )}
            </StyledFlex>
          )}

          <Content variant="inner" centered>
            <Button
              type="button"
              variant={!dynamicButtonEnabling ? 'filled' : 'disabled'}
              radius="ten"
              text="Save"
              disabled={dynamicButtonEnabling}
              onClick={handleConfirmClick}
            />
          </Content>
        </Content>
      </Scrollable>

      <MigrateRenameParamModal
        open={showMigrateParamModal}
        onSubmit={onMigrateParamSubmit}
        onCancel={() => setShowMigrateParamModal(false)}
      />
    </>
  );
};

export default EditInputParam;
