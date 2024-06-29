import { useCallback, useMemo, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { Slider } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import ChevronDown from '../../../../../../../Assets/icons/lexical/chevron-down.svg?component';
import { swapArrayElements } from '../../../../../../../utils/helperFunctions';
import classes from '../../../../../../Auth/CreateNewAccount/DataCollectionSteps/StepThreeBillingDetails/StepThreeBillingDetails.module.css';
import { VALIDATION_TYPES } from '../../../../../../PublicFormPage/constants/validationTypes';
import FormErrorMessage from '../../../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import Switch from '../../../../../../SwitchWithText/Switch';
import BaseTextInput from '../../../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import InputLabel from '../../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import CustomSelect from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import TreeOptions from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/options/TreeOptions';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import DragAndDropIcon from '../../../../../Assets/Icons/DragAndDropIcon.svg?component';
import TrashIcon from '../../../../../Assets/Icons/trashIcon.svg?component';
import { COMPONENT_TYPES, COMPONENT_TYPES_OPTIONS } from '../../../SideMenu/componentTypes';
import { FILE_TYPES } from '../../../SideMenu/fileTypes';
import { GROUPED_VALIDATION_TYPES_OPTIONS, VALIDATION_TYPES_OPTIONS } from '../../../SideMenu/validationTypes';
import { Button, InputField } from '../../../base';
import CustomDropdownIndicator from '../../../base/inputs/DropdownSelector/CustomDropdownIndicator';
import { Content, Scrollable } from '../../../wrappers';
import DynamicParamInput from '../../DynamicParamInput/DynamicParamInput';
import SettingsHeading from '../../SettingsHeading/SettingsHeading';

const PARAM_PROPS_KEYS = {
  PARAM_NAME: 'paramName',
  VALIDATION_TYPE: 'validationType',
  COMPONENT_TYPE: 'componentType',
  FILE_SIZE: 'fileSize',
  FILE_TYPE: 'fileType',
  FILE_TYPE_LIST: 'fileTypeList',
  OPTIONS: 'options',
  IS_REQUIRED: 'isRequired',
  IS_PROTECTED: 'isProtected',
  VALUE: 'value',
  DESCRIPTION: 'description',
  DISPLAY_NAME: 'displayName',
  PLACEHOLDER: 'placeholder',
  SIGNATURE: 'signature',
};

const STATIC_DEFAULT_PARAM = {
  paramName: '',
  validationType: '',
  value: '',
};

export const DYNAMIC_DEFAULT_PARAM = {
  paramName: '',
  description: '',
  displayName: '',
  placeholder: '',
  validationType: '',
  isRequired: 'true',
  isProtected: '',
  fileSize: 50,
  fileType: 'true',
  fileTypeList: '',
  signature: '',
  componentType: COMPONENT_TYPES.SINGLE_VALUE_ENTRY,
  options: [],
};

const DYNAMIC_PARAM_SET_KEY = 'dynamicInputParams';
const STATIC_PARAM_SET_KEY = 'staticInputParams';

const NewWorkflowInputParam = ({ onBackClick, onConfirmClick, headingPromptText, isScheduledExecution, isDynamic }) => {
  const isStatic = !isDynamic;
  const paramSetKey = isStatic ? STATIC_PARAM_SET_KEY : DYNAMIC_PARAM_SET_KEY;

  const [param, setParam] = useState(isStatic ? STATIC_DEFAULT_PARAM : DYNAMIC_DEFAULT_PARAM);
  const [valueError, setValueError] = useState(false);

  const [showAdvancedConfig, setShowAdvancedConfig] = useState(false);

  const isValidationTypeFile = param?.[PARAM_PROPS_KEYS.VALIDATION_TYPE] === VALIDATION_TYPES.FILE;
  const isSignatureType = param?.[PARAM_PROPS_KEYS.VALIDATION_TYPE] === VALIDATION_TYPES.SIGNATURE;

  const isProtectedToggleShown = useMemo(
    () => !isSignatureType && !isValidationTypeFile,
    [isSignatureType, isValidationTypeFile]
  );

  const paramNotEmpty = (param) => {
    return param !== '';
  };

  const isValueValid = () => paramNotEmpty(param[PARAM_PROPS_KEYS.VALUE]) && !valueError;

  const isButtonDisabled = () => {
    return !(
      paramNotEmpty(param[PARAM_PROPS_KEYS.PARAM_NAME]) &&
      paramNotEmpty(param[PARAM_PROPS_KEYS.VALIDATION_TYPE]) &&
      (isDynamic || isValueValid())
    );
  };

  const getInitialValueByType = (type) => {
    if (type === VALIDATION_TYPES.BOOLEAN) {
      return true;
    }

    return '';
  };

  const handleChangeWithType = useCallback((e, newName) => {
    const newValue = e.target ? e.target.value : e.value;

    setParam((prev) => ({
      ...prev,
      [newName]: e.target?.type === 'radio' ? newValue === 'true' : newValue,
    }));
  }, []);

  const handleChangeMulti = useCallback((e, newName) => {
    setParam((prev) => ({
      ...prev,
      [newName]: JSON.stringify(e),
    }));
  }, []);

  const syncDisplayNameWithParamName = () => {
    if (param[PARAM_PROPS_KEYS.DISPLAY_NAME]) return;

    handleChangeWithType({ value: param[PARAM_PROPS_KEYS.PARAM_NAME] }, PARAM_PROPS_KEYS.DISPLAY_NAME);
  };

  const handleChangeWithoutSpaces = useCallback((e) => {
    const newValue = e.target ? e.target.value : e.value;
    const newName = e.target ? e.target.name : PARAM_PROPS_KEYS.VALIDATION_TYPE;

    const value = newValue.replace(/\s/g, '');

    handleChangeWithType({ value: value }, newName);
  }, []);

  const handleChange = useCallback((e) => {
    const newName = e.target ? e.target.name : PARAM_PROPS_KEYS.VALIDATION_TYPE;

    handleChangeWithType(e, newName);
  }, []);

  const handleStaticValueChange = useCallback((value) => {
    setParam((prev) => ({
      ...prev,
      [PARAM_PROPS_KEYS.VALUE]: value,
    }));
  }, []);

  const handleChangeValidationType = useCallback((e, newName) => {
    const { value } = e;

    const isFileType = value === VALIDATION_TYPES.FILE;

    setParam((prev) => ({
      ...prev,
      [newName]: value,
      [PARAM_PROPS_KEYS.VALUE]: getInitialValueByType(value),
      ...(isDynamic && { [PARAM_PROPS_KEYS.COMPONENT_TYPE]: COMPONENT_TYPES.SINGLE_VALUE_ENTRY }),
      ...(isFileType && { [PARAM_PROPS_KEYS.IS_PROTECTED]: DYNAMIC_DEFAULT_PARAM.isProtected }),
    }));

    setValueError(false);
  }, []);

  const handleMinMaxChange = useCallback((e) => {
    const newName = e.target ? e.target.name : PARAM_PROPS_KEYS.FILE_SIZE;
    const min = e.target ? e.target.min : 1;
    const max = e.target ? e.target.max : 1000;
    const value = Math.max(min, Math.min(max, Number(e.target.value)));

    handleChangeWithType({ value }, newName);
  }, []);

  const handleOptionChange = useCallback((e, index) => {
    const newValue = e.target ? e.target.value : e.value;

    setParam((prev) => ({
      ...prev,
      [PARAM_PROPS_KEYS.OPTIONS]: prev[PARAM_PROPS_KEYS.OPTIONS].map((option, i) =>
        i === index ? { value: newValue } : option
      ),
    }));
  }, []);

  const deleteOption = useCallback((index) => {
    setParam((prev) => ({
      ...prev,
      [PARAM_PROPS_KEYS.OPTIONS]: prev[PARAM_PROPS_KEYS.OPTIONS].filter((_, i) => index !== i),
    }));
  }, []);

  const showSignatureContent = useCallback(
    (params) => {
      return isDynamic && params[PARAM_PROPS_KEYS.VALIDATION_TYPE] === VALIDATION_TYPES.SIGNATURE;
    },
    [isDynamic]
  );
  const enableComponentType = useCallback((params) => {
    return [
      VALIDATION_TYPES.PHONE_NUMBER,
      VALIDATION_TYPES.BOOLEAN,
      VALIDATION_TYPES.JSON,
      VALIDATION_TYPES.ADDRESS,
      VALIDATION_TYPES.FILE,
      VALIDATION_TYPES.SIGNATURE,
    ].includes(params[PARAM_PROPS_KEYS.VALIDATION_TYPE]);
  }, []);

  const showPlaceholder = useCallback((params) => {
    return [VALIDATION_TYPES.DATE_OF_BIRTH, VALIDATION_TYPES.FILE, VALIDATION_TYPES.DATE].includes(
      params[PARAM_PROPS_KEYS.VALIDATION_TYPE]
    );
  }, []);

  const showOptions = useCallback((params) => {
    return (
      params[PARAM_PROPS_KEYS.VALIDATION_TYPE] === VALIDATION_TYPES.ANYTHING &&
      (params[PARAM_PROPS_KEYS.COMPONENT_TYPE] === COMPONENT_TYPES.SINGLE_SELECT_DROPDOWN ||
        params[PARAM_PROPS_KEYS.COMPONENT_TYPE] === COMPONENT_TYPES.MULTI_SELECT_DROPDOWN)
    );
  }, []);

  const handleOnDragEnd = useCallback((result, parameter) => {
    const options = [...parameter[PARAM_PROPS_KEYS.OPTIONS]];

    swapArrayElements(options, result.source.index, result.destination.index);

    setParam((prev) => ({
      ...prev,
      [PARAM_PROPS_KEYS.OPTIONS]: options,
    }));
  }, []);

  const filesContent = () => {
    return (
      <StyledFlex gap={2}>
        <StyledFlex>
          <InputLabel label="Files Types Allowed" size={16} weight={600} />

          <RadioGroup
            row
            name="controlled-radio-buttons-group"
            value={param[PARAM_PROPS_KEYS.FILE_TYPE]}
            onChange={(e) => handleChangeWithType(e, PARAM_PROPS_KEYS.FILE_TYPE)}
          >
            <FormControlLabel
              value="true"
              control={<Radio className={`${param[PARAM_PROPS_KEYS.FILE_TYPE] && classes.colorRadio}`} />}
              label="All File Types"
            />
            <FormControlLabel
              value="false"
              control={<Radio className={`${!param[PARAM_PROPS_KEYS.FILE_TYPE] && classes.colorRadio}`} />}
              label="Allow only specific file types"
            />
          </RadioGroup>
        </StyledFlex>
        {!param[PARAM_PROPS_KEYS.FILE_TYPE] && (
          <CustomSelect
            options={FILE_TYPES}
            placeholder="Select Workflow Parameter"
            name={PARAM_PROPS_KEYS.FILE_TYPE_LIST}
            value={FILE_TYPES.find((v) => v.value === param[PARAM_PROPS_KEYS.FILE_TYPE_LIST])}
            onChange={(e) => handleChangeMulti(e, PARAM_PROPS_KEYS.FILE_TYPE_LIST)}
            components={{
              DropdownIndicator: CustomDropdownIndicator,
              Option: TreeOptions,
            }}
            isOptionDisabled={(option) => option.disabled}
            form
            isMulti
            closeMenuOnScroll
          />
        )}

        <StyledFlex>
          <InputLabel
            label="File Size Limit (MB)"
            size={16}
            weight={600}
            hint="The maximum file size must be from 1 to 1000 (MB)"
          />
          <StyledFlex flexDirection="row" gap="25px">
            <Slider
              min={1}
              max={1000}
              style={{ margin: 'auto' }}
              step={0.5}
              className={`${classes.colorRadio}`}
              value={param[PARAM_PROPS_KEYS.FILE_SIZE]}
              onChange={(e) => handleChangeWithType(e, PARAM_PROPS_KEYS.FILE_SIZE)}
            />
            <InputField
              name={PARAM_PROPS_KEYS.FILE_SIZE}
              style={{ width: '80px' }}
              value={param[PARAM_PROPS_KEYS.FILE_SIZE] || ''}
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
      <StyledFlex gap={2}>
        {param[PARAM_PROPS_KEYS.VALIDATION_TYPE] === VALIDATION_TYPES.FILE && filesContent()}

        <StyledFlex>
          <InputLabel label="Display Name" size={16} weight={600} />
          <BaseTextInput
            placeholder="Display Name"
            name={PARAM_PROPS_KEYS.DISPLAY_NAME}
            value={param[PARAM_PROPS_KEYS.DISPLAY_NAME] || ''}
            onChange={handleChange}
          />
        </StyledFlex>

        <StyledFlex>
          <InputLabel label="Description" size={16} weight={600} />
          <BaseTextInput
            placeholder="Description"
            name={PARAM_PROPS_KEYS.DESCRIPTION}
            value={param[PARAM_PROPS_KEYS.DESCRIPTION] || ''}
            onChange={handleChange}
          />
        </StyledFlex>

        {showPlaceholder(param) && (
          <StyledFlex>
            <InputLabel label="Placeholder" size={16} weight={600} />
            <BaseTextInput
              placeholder="Placeholder"
              name={PARAM_PROPS_KEYS.PLACEHOLDER}
              value={param[PARAM_PROPS_KEYS.PLACEHOLDER] || ''}
              onChange={handleChange}
            />
          </StyledFlex>
        )}

        <StyledFlex>
          <InputLabel label="Component Type" size={16} weight={600} />
          <CustomSelect
            options={COMPONENT_TYPES_OPTIONS}
            placeholder="Component Type Parameter"
            name={PARAM_PROPS_KEYS.COMPONENT_TYPE}
            value={COMPONENT_TYPES_OPTIONS.find((v) => v.value === param[PARAM_PROPS_KEYS.COMPONENT_TYPE])}
            onChange={(e) => handleChangeWithType(e, PARAM_PROPS_KEYS.COMPONENT_TYPE)}
            components={{ DropdownIndicator: CustomDropdownIndicator }}
            isDisabled={enableComponentType(param)}
            closeMenuOnSelect
            closeMenuOnScroll
            form
          />
        </StyledFlex>

        {showOptions(param) && (
          <StyledFlex>
            <StyledFlex justifyContent="space-between" flexDirection="row">
              <StyledText size={19} weight={500}>
                Dropdown Options
              </StyledText>

              <StyledFlex
                style={{ cursor: 'pointer' }}
                gap="2px"
                flexDirection="row"
                onClick={() => handleOptionAdd(param)}
              >
                <StyledFlex width="35px" height="35px">
                  <AddIcon />
                </StyledFlex>
                <StyledText>Add</StyledText>
              </StyledFlex>
            </StyledFlex>
          </StyledFlex>
        )}

        {showOptions(param) && (
          <DragDropContext onDragEnd={(result) => handleOnDragEnd(result, param)}>
            <Droppable
              droppableId="paramsReorder"
              renderClone={(provided, snapshot, rubric) => {
                const { index } = rubric.source;

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
                      <InputField name={index} value={param[PARAM_PROPS_KEYS.OPTIONS][index].value} />
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
                  {param[PARAM_PROPS_KEYS.OPTIONS].map(({ value }, index) => {
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
                            <StyledFlex width="35px" height="35px" onClick={() => deleteOption(index)}>
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

  const handleOptionAdd = useCallback((parameter) => {
    const options = [...parameter[PARAM_PROPS_KEYS.OPTIONS]];
    options.push({ value: '' });

    setParam((prev) => ({
      ...prev,
      [PARAM_PROPS_KEYS.OPTIONS]: options,
    }));
  }, []);

  const handleConfirmClick = () => {
    onConfirmClick((prev) => ({
      ...prev,
      inputParamSets: [
        {
          ...prev?.inputParamSets[0],
          name: 'Parameters',
          orderNumber: prev.inputParamSets.length,
          [paramSetKey]: [...prev.inputParamSets[0]?.[paramSetKey], param],
        },
      ],
    }));

    if (isScheduledExecution) return;

    onBackClick((prev) => ({ current: prev.previous, previous: prev.current }));
  };

  return (
    <>
      <SettingsHeading
        heading={`New ${isDynamic ? 'Input' : 'Default'} Parameter`}
        onBackClick={() => onBackClick((prev) => ({ current: prev.previous, previous: prev.current }))}
        promptText={headingPromptText}
      />
      <Scrollable>
        <Content variant="default">
          <StyledFlex gap={2} mb={2}>
            <StyledFlex>
              <InputLabel label="Parameter Name" size={16} weight={600} hint="This field does not allow spaces" />
              <BaseTextInput
                placeholder="Parameter Name"
                name={PARAM_PROPS_KEYS.PARAM_NAME}
                value={param[PARAM_PROPS_KEYS.PARAM_NAME] || ''}
                onChange={handleChangeWithoutSpaces}
                onBlur={syncDisplayNameWithParamName}
              />
            </StyledFlex>

            <StyledFlex>
              <InputLabel label="Expect Parameter Type" size={16} weight={600} />
              <CustomSelect
                options={GROUPED_VALIDATION_TYPES_OPTIONS}
                placeholder="Select Workflow Parameter"
                name={PARAM_PROPS_KEYS.VALIDATION_TYPE}
                value={VALIDATION_TYPES_OPTIONS.find((v) => v.value === param[PARAM_PROPS_KEYS.VALIDATION_TYPE])}
                onChange={(e) => handleChangeValidationType(e, PARAM_PROPS_KEYS.VALIDATION_TYPE)}
                components={{
                  DropdownIndicator: CustomDropdownIndicator,
                }}
                isOptionDisabled={(option) => option.disabled}
                filterOption={(o) => isDynamic || o.value !== VALIDATION_TYPES.SIGNATURE}
                closeMenuOnSelect
                closeMenuOnScroll
                menuPlacement="auto"
                menuPortalTarget={document.body}
                form
              />
            </StyledFlex>

            {isStatic && (
              <StyledFlex>
                <InputLabel label="Parameter Value" size={16} weight={600} />
                <DynamicParamInput
                  placeholder="Parameter Value"
                  type={param[PARAM_PROPS_KEYS.VALIDATION_TYPE]}
                  name={PARAM_PROPS_KEYS.VALUE}
                  value={param[PARAM_PROPS_KEYS.VALUE]}
                  isError={valueError}
                  onChange={handleStaticValueChange}
                  onError={(e) => setValueError(e)}
                />
                {valueError && <FormErrorMessage>{valueError}</FormErrorMessage>}
              </StyledFlex>
            )}

            {isProtectedToggleShown && (
              <StyledFlex>
                <InputLabel label="Protected" size={16} weight={600} hint="The field is Protected" />

                <StyledFlex display="flex" alignItems="center" gap="10px" alignSelf="stretch" flexDirection="row">
                  <Switch
                    name={PARAM_PROPS_KEYS.IS_PROTECTED}
                    id={PARAM_PROPS_KEYS.IS_PROTECTED}
                    activeLabel=""
                    inactiveLabel=""
                    checked={!!param[PARAM_PROPS_KEYS.IS_PROTECTED]}
                    onChange={(value) => {
                      setParam((prev) => ({
                        ...prev,
                        [PARAM_PROPS_KEYS.IS_PROTECTED]: value,
                      }));
                    }}
                  />
                  <StyledText textAlign="right" weight="500" lh="24px">
                    Field is Protected
                  </StyledText>
                </StyledFlex>
              </StyledFlex>
            )}

            {isDynamic && (
              <>
                <StyledFlex>
                  <InputLabel label="Required" size={16} weight={600} hint="The field is Required" />
                  <StyledFlex display="flex" alignItems="center" gap="10px" alignSelf="stretch" flexDirection="row">
                    <Switch
                      name={PARAM_PROPS_KEYS.IS_REQUIRED}
                      id={PARAM_PROPS_KEYS.IS_REQUIRED}
                      activeLabel=""
                      inactiveLabel=""
                      checked={!!param[PARAM_PROPS_KEYS.IS_REQUIRED]}
                      onChange={(value) => {
                        setParam((prev) => ({
                          ...prev,
                          [PARAM_PROPS_KEYS.IS_REQUIRED]: value,
                        }));
                      }}
                    />
                    <StyledText textAlign="right" weight="500" lh="24px">
                      Field is Required
                    </StyledText>
                  </StyledFlex>
                  {showSignatureContent(param) && param[PARAM_PROPS_KEYS.IS_REQUIRED] ? (
                    <StyledFlex mt="10px">
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

                <StyledDivider borderWidth={2} orientation="horizontal" />

                <StyledFlex
                  mb={2}
                  cursor="pointer"
                  direction="row"
                  gap={0.75}
                  onClick={() => setShowAdvancedConfig((prev) => !prev)}
                >
                  <ChevronDown
                    style={{
                      transform: showAdvancedConfig ? 'rotate(180deg)' : 'rotate(270deg)',
                      width: '19px',
                      height: '19px',
                      margin: 'auto 0 auto 0',
                    }}
                  />
                  <StyledText size={19} weight={500}>
                    Advanced Configuration
                  </StyledText>
                </StyledFlex>

                {showAdvancedConfig && advancedContent()}
              </>
            )}
          </StyledFlex>
          <Content variant="inner" centered>
            <Button
              type="button"
              variant={!isButtonDisabled() ? 'filled' : 'disabled'}
              radius="ten"
              text="Confirm"
              disabled={isButtonDisabled()}
              onClick={handleConfirmClick}
            />
          </Content>
        </Content>
      </Scrollable>
    </>
  );
};

export default NewWorkflowInputParam;
