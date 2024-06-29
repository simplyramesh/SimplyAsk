import React, { Fragment } from 'react';

import KnowledgeBaseSelect from '../../../../../../Managers/AgentManager/AgentEditor/components/sideForms/ActionsSidebar/KnowledgeBaseSelect/KnowledgeBaseSelect';
import OutputFieldsControl from '../../../../../../Managers/shared/components/OutputFieldsControl/OutputFieldsControl';
import FormValidationMessage from '../../../../../../shared/forms/FormValidationMessage/FormValidationMessage';
import {
  ControlWithAvatar,
  OptionWithAvatar,
} from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/controls/UserAutocompleteControls';
import { UserAutocompleteForm } from '../../../../../../shared/REDISIGNED/selectMenus/UserAutocomplete/UserAutocomplete';
import Switch from '../../../../../../SwitchWithText/Switch';
import { useHistoricalRecoilState } from '../../../../../hooks/useHistoricalRecoilState';
import { updateNode } from '../../../../../services/graph';
import { getActionKey } from '../../../../../utils/helperFunctions';
import { ERROR_TYPES } from '../../../../../utils/validation';
import { Button, InputField } from '../../../base';
import ApiParamList from '../../../base/inputs/ApiParamList/ApiParamList';
import ExtractSpreadsheetParamList from '../../../base/inputs/ApiParamList/ExtractSpreadsheetParamList';
import RpaForumParamList from '../../../base/inputs/ApiParamList/RpaForumParamList';
import DiscreteSlider from '../../../base/inputs/DiscreteSlider/DiscreteSlider';
import DropdownSelector from '../../../base/inputs/DropdownSelector/DropdownSelector';
import DropdownSelectorMultiple from '../../../base/inputs/DropdownSelectorMultiple/DropdownSelectorMultiple';
import InputFieldMultiple from '../../../base/inputs/InputFieldMultiple/InputFieldMultiple';
import RadioGroup from '../../../base/inputs/RadioGroup/RadioGroup';
import ServiceTicketInputFields from '../../../base/inputs/SeviceTicketInputFields/ServiceTicketInputFields';
import StaticDynamicFileUpload from '../../../base/inputs/StaticDynamicFileUpload/StaticDynamicFileUpload';
import StaticDynamicParamField from '../../../base/inputs/StaticDynamicParamField/StaticDynamicParamField';
import WorkflowInputFields from '../../../base/inputs/WorkflowInputFields/WorkflowInputFields';
import WorkflowParamDropdown from '../../../base/inputs/WorkflowParamDropdown/WorkflowParamDropdown';
import { MessageBox } from '../../../sub';
import ParamGroup from '../../../sub/ParamGroup/ParamGroup';
import { LabeledField } from '../../../wrappers';
import { STEP_INPUT_TYPE_KEYS, STEP_PARAMS, THEN_OTHERWISE_ACTION_TYPES } from '../../keyConstants';
import DynamicRESTBodyParams from './DynamicRESTBodyParams/DynamicRESTBodyParams';

const DynamicMenuFields = ({ values, errors, paramsName, step, meta }) => {
  const { set, state } = useHistoricalRecoilState();

  const paramsErrors = errors?.[paramsName] || [];
  const isOutputParam = paramsName === STEP_PARAMS.OUTPUT;

  const handleUpdateGraph = ({ paramsName, mappedParams }) => {
    updateNode(graph, step.stepId, { [paramsName]: mappedParams });

    set({ ...state, workflow: graph.export() });
  };

  const handleChangeValue = (index, value, paramsName) => {
    const mappedParams = step[paramsName]?.map((param, i) => (index === i ? { ...param, currentValue: value } : param));

    handleUpdateGraph({ paramsName, mappedParams });
  };

  const handleChangeStaticDynamicValue = (index, value, paramsName, isStatic = false) => {
    const mappedParams = step[paramsName]?.map((param, i) =>
      index === i ? { ...param, isStatic, currentValue: value } : param
    );

    handleUpdateGraph({ paramsName, mappedParams });
  };

  const handleServiceRequestFieldDelete = ({ index, paramsName, indexToDelete }) => {
    const mappedParams = step[paramsName]?.map((param, i) => {
      if (index === i) {
        const currentValue = param.currentValue?.filter((_, currentIndex) => currentIndex !== indexToDelete);

        return { ...param, currentValue };
      }

      return param;
    });

    updateNode(graph, step.stepId, { [paramsName]: mappedParams });

    set({ ...state, workflow: graph.export() });
  };

  const getParamDependentTemplateValue = (param) => {
    const templateId = param.stepSettingOptions?.dependentSettingTemplateId;

    if (!templateId || !values) return;

    const params = [...values[STEP_PARAMS.INPUT], ...values[STEP_PARAMS.OUTPUT]];
    const dependentParam = params.find((param) => param.stepSettingTemplate.stepSettingTemplateId === templateId);

    if (!dependentParam) return;

    return dependentParam.currentValue;
  };

  const renderMessageBox = ({ param, index, value }) =>
    param.stepSettingsInputType === STEP_INPUT_TYPE_KEYS.MESSAGE_BOX && (
      <MessageBox
        subheading={param.stepSettingOptions.fieldSubheading}
        enableExpand={param.stepSettingOptions.enableExpandedEditor}
        placeholder={param.displayName}
        value={value}
        onChange={(e) => handleChangeValue(index, e.target.value, paramsName)}
        error={paramsErrors[index]}
      />
    );

  const renderInputField = ({ param, index, value }) =>
    param.stepSettingsInputType === STEP_INPUT_TYPE_KEYS.INPUT_FIELD && (
      <>
        {!param.stepSettingOptions.isList ? (
          <InputField
            subheading={param.stepSettingOptions.fieldSubheading}
            placeholder={param.promptText}
            value={value}
            onChange={(e) => handleChangeValue(index, e.target.value, paramsName)}
            error={paramsErrors[index]}
            onIconClick={() => {}}
            type={param.stepSettingOptions.isHidden ? 'password' : 'text'}
          />
        ) : (
          <InputFieldMultiple value={value} onChange={(value) => handleChangeValue(index, value, paramsName)}>
            {({ handleAdd, setState, state }) => (
              <InputField
                subheading={param.stepSettingOptions.fieldSubheading}
                placeholder={param.displayName}
                value={state}
                onChange={(e) => setState(e.target.value)}
                error={paramsErrors[index]}
                onIconClick={handleAdd}
                onEnterKeyPress={handleAdd}
                plusIcon
              />
            )}
          </InputFieldMultiple>
        )}
      </>
    );

  const renderUserAutocomplete = ({ param, index, value }) =>
    param.stepSettingsInputType === STEP_INPUT_TYPE_KEYS.DYNAMIC_TEXT_SELECTOR && (
      <UserAutocompleteForm
        value={value}
        onChange={(option) => handleChangeValue(index, option, paramsName)}
        invalid={paramsErrors[index]}
        placeholder={param.displayName}
        withSeparator={false}
        components={{
          Option: OptionWithAvatar,
          DropdownIndicator: () => null,
          Control: ControlWithAvatar,
        }}
      />
    );

  const renderParameterAutocomplete = ({ param, index, value }) =>
    param.stepSettingsInputType === STEP_INPUT_TYPE_KEYS.PARAMETER_AUTOCOMPLETE &&
    (!param.stepSettingOptions.isList ? (
      <InputField
        key={`${index}-${step.stepId}-inputField`}
        subheading={param.stepSettingOptions.fieldSubheading}
        placeholder={param.promptText}
        value={value}
        onChange={(value) => {
          handleChangeValue(index, value, paramsName);
        }}
        error={paramsErrors[index]}
        onIconClick={() => {}}
        paramAutocomplete
        expandable={param.stepSettingOptions.expandable}
        textfield={param.stepSettingOptions.textarea}
        enableVerticalResize={param.stepSettingOptions.enableVerticalResize}
        id={param.stepSettingTemplateId}
        stepId={step.stepId}
      />
    ) : (
      <InputFieldMultiple value={value} onChange={(value) => handleChangeValue(index, value, paramsName)}>
        {({ handleAdd, setState, state }) => (
          <InputField
            subheading={param.stepSettingOptions.fieldSubheading}
            placeholder={param.displayName}
            value={state}
            onChange={(value) => setState(value)}
            error={paramsErrors[index]}
            onIconClick={handleAdd}
            onEnterKeyPress={handleAdd}
            plusIcon
            paramAutocomplete
            isExpression={param.stepSettingOptions.isExpression}
            expandable={param.stepSettingOptions.expandable}
            textfield={param.stepSettingOptions.textarea}
            enableVerticalResize={param.stepSettingOptions.enableVerticalResize}
          />
        )}
      </InputFieldMultiple>
    ));

  const renderDropdownSelectorVariants = ({ param, index, value }) =>
    [STEP_INPUT_TYPE_KEYS.DROPDOWN_SELECTOR, STEP_INPUT_TYPE_KEYS.DYNAMIC_DROPDOWN_SELECTOR].includes(
      param.stepSettingsInputType
    ) && (
      <>
        {!param.stepSettingOptions.isList ? (
          <>
            {!param.stepSettingOptions.shouldDisplayDynamicParameterValues && (
              <>
                <DropdownSelector
                  placeholder={param.displayName}
                  value={value}
                  onChange={(value) => handleChangeValue(index, value, paramsName)}
                  error={paramsErrors[index]}
                  possibleValues={param.stepSettingOptions.possibleValues}
                  displayDynamicParamValues={param.stepSettingOptions.shouldDisplayDynamicParameterValues}
                  plusIcon={param.stepSettingOptions.isList}
                  requestType={param.stepSettingOptions.dynamicDropdownRequestType}
                />
              </>
            )}
            {param.stepSettingOptions.shouldDisplayDynamicParameterValues && (
              <WorkflowParamDropdown
                placeholder={param.displayName}
                value={value}
                isMulti={false}
                onChange={(value) => handleChangeValue(index, value, paramsName)}
                error={paramsErrors[index]}
                plusIcon={param.stepSettingOptions.isList}
              />
            )}
          </>
        ) : (
          <DropdownSelectorMultiple
            value={value}
            onChange={(value) => handleChangeValue(index, value, paramsName)}
            displayDynamicParamValues={param.stepSettingOptions.shouldDisplayDynamicParameterValues}
          >
            {({ handleAdd, setState, state }) => (
              <>
                {!param.stepSettingOptions.shouldDisplayDynamicParameterValues && (
                  <DropdownSelector
                    placeholder={param.displayName}
                    value={state}
                    onChange={(e) => setState(e)}
                    error={paramsErrors[index]}
                    possibleValues={param.stepSettingOptions.possibleValues}
                    displayDynamicParamValues={param.stepSettingOptions.shouldDisplayDynamicParameterValues}
                    plusIcon={param.stepSettingOptions.isList}
                    onIconClick={handleAdd}
                    requestType={param.stepSettingOptions.dynamicDropdownRequestType}
                  />
                )}
                {param.stepSettingOptions.shouldDisplayDynamicParameterValues && (
                  <WorkflowParamDropdown
                    placeholder={param.displayName}
                    value={state}
                    isMulti={false}
                    onChange={(e) => setState(e)}
                    error={paramsErrors[index]}
                    plusIcon={param.stepSettingOptions.isList}
                    onIconClick={handleAdd}
                  />
                )}
              </>
            )}
          </DropdownSelectorMultiple>
        )}
      </>
    );

  const renderStaticDynamicParamFields = ({ param, index, value }) =>
    param.stepSettingsInputType === STEP_INPUT_TYPE_KEYS.STATIC_DYNAMIC_PARAMETER_FIELD && (
      <StaticDynamicParamField
        key={`${index}-${step.stepId}-staticDynamicField`}
        placeholder={param.displayName}
        value={value}
        onChange={(value) => handleChangeValue(index, value, paramsName)}
        error={paramsErrors[index]}
        isOutputParam={isOutputParam}
        isList={param.stepSettingOptions.isList}
        isHiddenStaticValue={param.stepSettingOptions.isHiddenStaticValue}
      />
    );

  const renderStaticDynamicFileUpload = ({ param, index, value, paramItem }) =>
    param.stepSettingsInputType === STEP_INPUT_TYPE_KEYS.STATIC_DYNAMIC_FILE_UPLOAD && (
      <StaticDynamicFileUpload
        key={`${index}-${step.stepId}-staticDynamicFileUpload`}
        displayName={param.displayName}
        value={value}
        paramItem={paramItem}
        onChange={({ value, isStatic }) => handleChangeStaticDynamicValue(index, value, paramsName, isStatic)}
        error={paramsErrors[index]}
        isOutputParam={isOutputParam}
      />
    );

  const renderApiParamsList = ({ item, param, index, value }) =>
    param.stepSettingsInputType === STEP_INPUT_TYPE_KEYS.API_PARAMETER_LIST && (
      <ParamGroup
        heading={param.displayName}
        params={value}
        onAddParamClick={() => meta.setParamOpened({ ...item, index, paramsName })}
        error={paramsErrors[index]}
      >
        {({ param, paramIndex }) => (
          <ApiParamList
            key={paramIndex}
            param={param}
            onEditClick={() =>
              meta.setParamOpened({
                ...item,
                index,
                paramsName,
                indexToEdit: paramIndex,
              })
            }
            onDeleteClick={() => handleServiceRequestFieldDelete({ index, paramsName, indexToDelete: paramIndex })}
          />
        )}
      </ParamGroup>
    );

  const renderRestBodyParamList = ({ item, param, index, value }) => {
    const valueType = getParamDependentTemplateValue(param)?.value;

    return (
      param.stepSettingsInputType === STEP_INPUT_TYPE_KEYS.REST_BODY_PARAMETER_LIST && (
        <DynamicRESTBodyParams
          valueType={valueType}
          value={value}
          heading={param.displayName}
          onChange={(value) => handleChangeValue(index, value, paramsName)}
          onAddParam={() => meta.setParamOpened({ ...item, index, paramsName })}
          onEditParam={(paramIndex) =>
            meta.setParamOpened({
              ...item,
              index,
              paramsName,
              indexToEdit: paramIndex,
            })
          }
          onDeleteParam={(paramIndex) =>
            handleServiceRequestFieldDelete({ index, paramsName, indexToDelete: paramIndex })
          }
          error={paramsErrors[index]}
        />
      )
    );
  };

  const renderRpaForumParams = ({ item, param, index, value }) =>
    param.stepSettingsInputType === STEP_INPUT_TYPE_KEYS.RPA_FORUM_LIST && (
      <>
        <ParamGroup
          heading={param.displayName}
          params={value}
          onDeleteClick={(indexToDelete) => handleServiceRequestFieldDelete({ index, paramsName, indexToDelete })}
          onAddParamClick={() => meta.setParamOpened({ ...item, index, paramsName })}
          error={paramsErrors[index]}
          addNewButtonText="Add a New Field"
        >
          {({ param, paramIndex }) => (
            <RpaForumParamList
              key={paramIndex}
              param={param}
              onEditClick={() =>
                meta.setParamOpened({
                  ...item,
                  index,
                  paramsName,
                  indexToEdit: paramIndex,
                })
              }
              onDeleteClick={() => handleServiceRequestFieldDelete({ index, paramsName, indexToDelete: paramIndex })}
            />
          )}
        </ParamGroup>
      </>
    );

  const renderSpreadsheetTrigger = ({ index, param, item }) =>
    param.stepSettingsInputType === STEP_INPUT_TYPE_KEYS.SPREADSHEET && (
      <Button
        error={paramsErrors[index]}
        text="Add a New Parameter"
        variant="outline"
        flexWidth
        onClick={() => meta.setParamOpened({ ...item, index, paramsName })}
      />
    );

  const renderSpreadsheetParams = ({ item, param, index, value }) =>
    param.stepSettingsInputType === STEP_INPUT_TYPE_KEYS.SPREADSHEET_EXTRACT_LIST && (
      <ParamGroup
        heading={param.displayName}
        params={value}
        onDeleteClick={(indexToDelete) => handleServiceRequestFieldDelete({ index, paramsName, indexToDelete })}
        onAddParamClick={() => meta.setParamOpened({ ...item, index, paramsName })}
        error={paramsErrors[index]}
      >
        {({ param, paramIndex }) => (
          <ExtractSpreadsheetParamList
            key={paramIndex}
            param={param}
            onEditClick={() =>
              meta.setParamOpened({
                ...item,
                index,
                paramsName,
                indexToEdit: paramIndex,
              })
            }
            onDeleteClick={() => handleServiceRequestFieldDelete({ index, paramsName, indexToDelete: paramIndex })}
          />
        )}
      </ParamGroup>
    );

  const renderRadioGroup = ({ param, index, value }) =>
    param.stepSettingsInputType === STEP_INPUT_TYPE_KEYS.RADIO_GROUP && (
      <RadioGroup
        value={value}
        onChange={(value) => handleChangeValue(index, value, paramsName)}
        options={param.stepSettingOptions.possibleValues}
      />
    );

  const renderSwitchToggle = ({ param, index, value }) =>
    param.stepSettingsInputType === STEP_INPUT_TYPE_KEYS.SWITCH_TOGGLE && (
      <Switch
        activeLabel=""
        inactiveLabel=""
        id={param.stepSettingTemplateId}
        checked={!!value}
        onChange={() => handleChangeValue(index, !value, paramsName)}
      />
    );

  const renderDiscreteSlider = ({ param, index, value }) =>
    param.stepSettingsInputType === STEP_INPUT_TYPE_KEYS.DISCRETE_SLIDER && (
      <DiscreteSlider param={param} value={value} onChange={(value) => handleChangeValue(index, value, paramsName)} />
    );

  const renderKnowledgeBaseAutocomplete = ({ param, index, value }) =>
    param.stepSettingsInputType === STEP_INPUT_TYPE_KEYS.KNOWLEDGE_BASE_AUTOCOMPLETE && (
      <KnowledgeBaseSelect
        value={value}
        onChange={(value) => handleChangeValue(index, value, paramsName)}
        invalid={false}
      />
    );

  const renderParams = ({ param, index, value, stepSettings }) => {
    if (param.stepSettingsInputType === STEP_INPUT_TYPE_KEYS.DYNAMIC_PARAMETER_LIST) {
      return param.isOutputParam ? (
        <OutputFieldsControl
          label={null}
          value={value}
          onChange={(val) => {
            handleChangeValue(index, val, paramsName);
          }}
          disabled={false}
        />
      ) : (
        <WorkflowInputFields
          param={param}
          value={value}
          stepSettings={stepSettings}
          onChange={(val) => {
            handleChangeValue(index, val, paramsName);
          }}
        />
      );
    }

    if (param.stepSettingsInputType === STEP_INPUT_TYPE_KEYS.DYNAMIC_POPUP_FIELDS) {
      return (
        <ServiceTicketInputFields
          value={value}
          param={param}
          index={index}
          stepSettings={stepSettings}
          error={paramsErrors[index]}
          onChange={(val) => handleChangeValue(index, val, paramsName)}
        />
      );
    }
  };

  const renderErrors = ({ index }) =>
    paramsErrors[index] &&
    paramsErrors[index].type === ERROR_TYPES.ERROR && <FormValidationMessage text={paramsErrors[index].message} />;

  const stepSettings = values[paramsName];

  return (
    <>
      {stepSettings.map((item, index) => {
        const paramItem = item;
        const param = item?.stepSettingTemplate;
        const value = item?.currentValue;
        const { isHideField, when, includes, then, otherwise } = param?.stepSettingOptions || {};
        const key = getActionKey(stepSettings, {
          when,
          includes,
          then,
          otherwise,
        });

        if (!param || isHideField || key === THEN_OTHERWISE_ACTION_TYPES.HIDDEN) return null;

        return (
          <Fragment key={index}>
            <LabeledField
              error={paramsErrors[index]}
              row={!param.stepSettingOptions.isList}
              label={param.stepSettingsInputType !== STEP_INPUT_TYPE_KEYS.DYNAMIC_POPUP_FIELDS ? param.displayName : ''}
              key={index}
              promptText={param.helpTooltip}
              isOptional={param.isOptional}
              isRecommended={param.isRecommended}
            >
              {/* MESSAGE BOX */}
              {renderMessageBox({ value, index, param })}

              {/* INPUT BOX */}
              {renderInputField({ value, index, param })}

              {/* DROPDOWN SELECTORS - MULTIPLE, SINGLE, WITH PARAMS */}
              {renderDropdownSelectorVariants({ value, index, param })}

              {/* STATIC DYNAMIC PARAM FIELDS */}
              {renderStaticDynamicParamFields({ value, index, param })}

              {/* STATIC DYNAMIC FILE UPLOAD */}
              {renderStaticDynamicFileUpload({ value, index, param, paramItem })}

              {/* ADD API PARAM LIST BUTTON */}
              {renderApiParamsList({
                value,
                index,
                param,
                item,
              })}

              {/* ADD API PARAM LIST BUTTON */}
              {renderRestBodyParamList({
                value,
                index,
                param,
                item,
              })}

              {/* SPREADSHEET EXTRACT PARAMS */}
              {renderSpreadsheetParams({
                index,
                param,
                item,
                value,
              })}

              {/* RPA FORUM EXTRACT PARAMS */}
              {renderRpaForumParams({
                index,
                param,
                item,
                value,
              })}

              {/* SPREADSHEET TRIGGER BUTTON */}
              {renderSpreadsheetTrigger({
                index,
                param,
                item,
                value,
              })}

              {/* PARAMETER AUTOCOMPLETE */}
              {renderParameterAutocomplete({ value, index, param })}

              {/* USER AUTOCOMPLETE */}
              {renderUserAutocomplete({ value, index, param })}

              {/* RADIO GROUP */}
              {renderRadioGroup({ value, index, param })}

              {/* SWITCH TOGGLE */}
              {renderSwitchToggle({ value, index, param })}

              {/* DISCRETE SLIDER */}
              {renderDiscreteSlider({ value, index, param })}

              {/* KNOWLEDGE BASE AUTOCOMPLETE */}
              {renderKnowledgeBaseAutocomplete({ value, index, param })}

              {/* INPUT PARAMS */}
              {renderParams({
                value,
                index,
                param,
                stepSettings,
              })}

              {renderErrors({ index })}
            </LabeledField>
          </Fragment>
        );
      })}
    </>
  );
};

export default DynamicMenuFields;
