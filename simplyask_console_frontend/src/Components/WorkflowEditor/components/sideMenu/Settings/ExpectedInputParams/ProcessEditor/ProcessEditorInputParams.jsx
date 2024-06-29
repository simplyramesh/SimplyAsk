import { useTheme } from '@emotion/react';
import { MultiDirectedGraph } from 'graphology';
import { debounce } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { DATA_TYPES } from '../../../../../../Settings/Components/FrontOffice/components/ChatWidget/ChatWidgetCreateOrEdit/ChatWidgetPreview/ChatWidgetView/utils/constants/common';
import ConfirmationModal from '../../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import TrashIcon from '../../../../../Assets/Icons/trashIcon.svg?component';
import { useHistoricalRecoilState } from '../../../../../hooks/useHistoricalRecoilState';
import { getNodesWithParam, updateNode, updateParamNamesInSet } from '../../../../../services/graph';
import Accordion from '../../../../Accordian/Accordion';
import MigrateDeleteParamModal from '../../../../WarningModals/MigrateDeleteParamModal';
import { Button } from '../../../base';
import ParamList from '../../../base/inputs/ApiParamList/ParamList';
import ParameterCardText from '../../../base/Typography/ParameterCardText';
import { Content, LabeledField } from '../../../wrappers';
import ScheduledProcessWarning from '../../ScheduledProcessWarning/ScheduledProcessWarning';
import SettingsHeading from '../../SettingsHeading/SettingsHeading';

import routes from '../../../../../../../config/routes';
import { useGetParametersSet } from '../../../../../../../hooks/environments/useGetParametersSet';
import { getParametersSets } from '../../../../../../../Services/axios/environment';
import { swapArrayElements } from '../../../../../../../utils/helperFunctions';
import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import OpenIcon from '../../../../../../shared/REDISIGNED/icons/svgIcons/OpenIcon';
import CustomIndicatorArrow from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomSelect from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { WORKFLOW_EDITOR_SETTINGS_SIDE_MENU_TYPE } from '../../../../../constants/layout';
import { StyledParamListIconWrapper } from '../../../base/inputs/ApiParamList/StyledParamList';

const ProcessEditorInputParams = ({
  onBackClick,
  inputParams,
  onDeleteClick,
  isScheduledExecution,
  envParamSets,
  updateEnvParamSets,
}) => {
  const { colors } = useTheme();
  const { state: graphState, set: setGraphState } = useHistoricalRecoilState();
  const { workflow } = graphState;
  const graph = useMemo(() => new MultiDirectedGraph().import(workflow), [graphState]);

  const [openDeleteParamConfirmationModal, setDeleteParamConfirmationModal] = useState(false);
  const [openMigrateDeleteParamModal, setOpenMigrateDeleteParamModal] = useState(false);

  const [deleteParamData, setDeleteParamData] = useState(null);

  const [inputParamItems, setInputParamItems] = useState(inputParams[0] || []);
  const [selectEnvParamSets, setSelectEnvParamSets] = useState([...envParamSets]);

  const { data: parametersSet } = useGetParametersSet();

  useEffect(() => {
    if (Array.isArray(envParamSets)) {
      const mappedEnvParamSets = envParamSets.map((paramSet) => ({
        label: paramSet,
        value: paramSet,
      }));
      setSelectEnvParamSets(mappedEnvParamSets);
    }
  }, [envParamSets]);

  useEffect(() => {
    if (Array.isArray(inputParams)) {
      setInputParamItems(inputParams[0]);
    }
  }, [inputParams]);

  const handleAddNewSet = () => {
    setSelectEnvParamSets((prevValues) => [...prevValues, null]);
  };

  const handleEditClick = (paramType, index) => {
    onBackClick((prev) => ({
      current: 'editProcessInputParam',
      previous: prev.current,
      payload: { inputParams: inputParamItems, index, staticDynamic: paramType },
    }));
  };

  const isParamUsedInFlow = (paramName) => {
    const nodes = getNodesWithParam(graph, paramName);

    return nodes.length > 0;
  };

  const cancelDelete = () => {
    setOpenMigrateDeleteParamModal(false);
    setDeleteParamConfirmationModal(false);
    setDeleteParamData(null);
  };

  const handleDeleteParamClick = (deleteInfo) => {
    setDeleteParamData(deleteInfo);

    isParamUsedInFlow(deleteInfo.paramName)
      ? setOpenMigrateDeleteParamModal(true)
      : setDeleteParamConfirmationModal(true);
  };

  const handleDeleteParamsSet = (deleteInfo, index) => {
    setDeleteParamData({
      ...deleteInfo,
      index,
    });
    setDeleteParamConfirmationModal(true);
  };

  const deleteParam = () => {
    const { type } = deleteParamData;

    onDeleteClick((prev) => {
      if (type === 'envParamSets') {
        return {
          ...prev,
          envParamSets: prev.envParamSets.filter((_, i) => i !== deleteParamData.index),
        };
      } else {
        return {
          ...prev,
          inputParamSets: prev.inputParamSets.map((set, index) => {
            if (index === 0) {
              return {
                ...set,
                [type]: set[type].filter((_, i) => i !== deleteParamData.index),
              };
            } else {
              return set;
            }
          }),
        };
      }
    });

    cancelDelete();
  };

  const migrateDeleteParam = (_, newParamValue) => {
    const { paramName } = deleteParamData;
    const nodes = getNodesWithParam(graph, paramName);

    nodes.forEach((node) => {
      const nodeId = node.stepId;
      const nodeAttrs = graph.getNodeAttributes(nodeId);

      updateNode(graph, nodeId, {
        stepInputParameters: updateParamNamesInSet(nodeAttrs.stepInputParameters, paramName, newParamValue),
        stepOutputParameters: updateParamNamesInSet(nodeAttrs.stepOutputParameters, paramName, newParamValue),
      });
    });

    setGraphState({ ...graphState, workflow: graph.export() });

    deleteParam();
  };

  const handleOnDragEnd = (result, type) => {
    const numbersCopy = [...(inputParams[0]?.dynamicInputParams ?? [])];
    swapArrayElements(numbersCopy, result.source.index, result.destination.index);

    onDeleteClick((prev) => ({
      ...prev,
      inputParamSets: [
        {
          ...prev?.inputParamSets[0],
          name: 'Parameters',
          orderNumber: prev.inputParamSets.length,
          [type]: numbersCopy,
        },
      ],
    }));
  };

  const handleParamSelection = (index, newValue) => {
    setSelectEnvParamSets((prevValues) => {
      const updatedValues = [...prevValues];
      updatedValues[index] = newValue;
      const envSets = updatedValues?.map((item) => (typeof item === 'object' ? item?.value : item));
      updateEnvParamSets((prev) => ({ ...prev, envParamSets: envSets }));
      return updatedValues;
    });
  };

  const mapAndFilterParamSets = (paramSets) =>
    paramSets
      ?.map((eachParam) => ({ label: eachParam.name, value: eachParam.name }))
      .filter(
        (eachParam) => !selectEnvParamSets?.some((selectedOption) => selectedOption?.value === eachParam.value)
      ) || [];

  const defaultParamSets = mapAndFilterParamSets(parametersSet?.content);

  const fetchParamsSetsOptions = debounce((inputVal, setOptions) => {
    const queryParamsObj = {
      searchText: inputVal,
      pageSize: 10,
      isAscending: true,
    };
    const queryParams = new URLSearchParams(queryParamsObj).toString();

    getParametersSets(queryParams)
      .then((res) => mapAndFilterParamSets(res?.content))
      .then((optionsFromBackend) => {
        setOptions(optionsFromBackend);
      });
  }, 300);

  const renderAccordionTitle = (
    <StyledFlex mb="-30px">
      <LabeledField label="Parameters" promptText="Add New Parameters" inAccordion marginBottom={12} />
    </StyledFlex>
  );

  const getDoubleParsedValue = (value) => {
    try {
      return JSON.parse(JSON.parse(value));
    } catch {
      return '';
    }
  };

  const renderParameterList = ({ param, index, paramType, provided, style }) => (
    <StyledFlex
      mb="20px"
      key={index}
      {...(!!provided && { ref: provided.innerRef, ...provided.draggableProps, ...provided.dragHandleProps })}
      {...(!!style && { style })}
    >
      <ParamList
        index={index + 1}
        key={`${param.paramName}-${index}`}
        draggable={paramType === 'dynamic'}
        onEditClick={() => handleEditClick(`${paramType}InputParams`, index)}
        onDeleteClick={() =>
          handleDeleteParamClick({
            paramName: param.paramName,
            type: `${paramType}InputParams`,
            index,
          })
        }
      >
        <ParameterCardText title={param.paramName}>
          {({ renderParamCardOption }) => {
            const parsedObj = getDoubleParsedValue(param?.value);

            let fieldValue = param?.value;

            const isDataTypeFile = parsedObj?.type === DATA_TYPES.FILE;

            if (isDataTypeFile) {
              fieldValue = parsedObj.name;
            }

            return (
              <>
                {renderParamCardOption({
                  paramValueName: 'Value',
                  paramType: paramType.toUpperCase(),
                  paramValue: !param.value && param.isRequired ? 'Mandatory' : fieldValue || 'Optional',
                  maxLines: 1,
                })}
                {renderParamCardOption({
                  paramValueName: 'Data Type',
                  paramValue: param.validationType,
                  maxLines: 1,
                })}
              </>
            );
          }}
        </ParameterCardText>
      </ParamList>
    </StyledFlex>
  );

  const renderParameterSets = ({ index, selectedValue }) => (
    <StyledFlex direction="row" key={index} gap="5px" width="100%">
      <CustomSelect
        defaultOptions={defaultParamSets}
        key={index}
        name="Parameter Set"
        value={selectedValue}
        onChange={(newValue) => handleParamSelection(index, newValue)}
        placeholder="Search Parameter Sets..."
        isAsync
        loadOptions={fetchParamsSetsOptions}
        components={{
          DropdownIndicator: CustomIndicatorArrow,
        }}
        form
        minHeight={40}
        menuPadding={0}
        withSeparator
        isClearable
        isSearchable
        closeMenuOnSelect
      />
      <StyledParamListIconWrapper
        justifyContent="center"
        onClick={() => handleDeleteParamsSet({ paramName: selectedValue?.value, type: 'envParamSets' }, index)}
      >
        <TrashIcon />
      </StyledParamListIconWrapper>
    </StyledFlex>
  );

  return (
    <DragDropContext onDragEnd={(e) => handleOnDragEnd(e, 'dynamicInputParams')}>
      <SettingsHeading
        heading="Initial Parameters"
        onBackClick={() =>
          onBackClick((prev) => ({ current: 'settings', previous: prev.current, payload: { isDynamic: false } }))
        }
      />
      <Content variant="wide">
        {isScheduledExecution ? <ScheduledProcessWarning isScheduledExecution={isScheduledExecution} /> : null}
        <StyledFlex m="10px 21px -10px 21px">
          <LabeledField label="Input Parameters" marginBottom={14} gap={14}>
            {inputParams[0]?.dynamicInputParams?.length > 0 ? (
              <Accordion title={renderAccordionTitle} isCollapsible={false}>
                <Droppable
                  droppableId="paramsReorder"
                  renderClone={(provided, snapshot, rubric) => {
                    const block = inputParams[0]?.dynamicInputParams[rubric.source.index];
                    const { index } = rubric.source;

                    return renderParameterList({
                      param: block,
                      index,
                      paramType: 'dynamic',
                      provided,
                      style: {
                        ...provided.draggableProps.style,
                        boxShadow: '0 0 5px rgba(0,0,0,.1)',
                        background: 'white',
                        borderRadius: '10px',
                      },
                    });
                  }}
                >
                  {(provided) => (
                    <div className="paramsReorder" ref={provided.innerRef} {...provided.droppableProps}>
                      {inputParams[0]?.dynamicInputParams?.map((param, index) => (
                        <Draggable
                          draggableId={`${param.paramName}-${index}`}
                          index={index}
                          draggable={false}
                          key={`${param.paramName}-${index}`}
                        >
                          {(provided) => renderParameterList({ param, index, paramType: 'dynamic', provided })}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Accordion>
            ) : null}

            <Button
              text="Add a New Parameter"
              variant="outline"
              flexWidth
              onClick={() =>
                onBackClick((prev) => ({
                  current: WORKFLOW_EDITOR_SETTINGS_SIDE_MENU_TYPE.NEW_PROCESS_INPUT_PARAM,
                  previous: prev.current,
                  payload: { isDynamic: true },
                }))
              }
            />
          </LabeledField>
        </StyledFlex>
      </Content>

      <StyledDivider borderWidth={2} color={colors.cardGridItemBorder} flexItem />

      <StyledFlex m="10px 21px -10px 21px">
        <LabeledField label="Default Parameters" marginBottom={14} gap={14}>
          {inputParams[0]?.staticInputParams?.length > 0 ? (
            <Accordion title={renderAccordionTitle} isCollapsible={false}>
              {inputParams[0]?.staticInputParams?.map((param, index) =>
                renderParameterList({ param, index, paramType: 'static' })
              )}
            </Accordion>
          ) : null}
          <Button
            text="Add a New Parameter"
            variant="outline"
            flexWidth
            onClick={() => onBackClick((prev) => ({ current: 'newProcessInputParam', previous: prev.current }))}
          />
        </LabeledField>
      </StyledFlex>

      <StyledDivider borderWidth={2} color={colors.cardGridItemBorder} flexItem />

      <StyledFlex m="10px 21px -10px 21px">
        <LabeledField label="Parameter Sets" marginBottom={14} gap={14}>
          {selectEnvParamSets?.map((_, index) =>
            renderParameterSets({ index, selectedValue: selectEnvParamSets[index] })
          )}
          <StyledButton
            variant="text"
            startIcon={<OpenIcon />}
            onClick={() => window.open(`${routes.SETTINGS_BACK_OFFICE_TAB}`, '_blank')}
          >
            <StyledText weight={600} lh={20} color="inherit" wrap="nowrap">
              Manage Parameter Sets in Settings
            </StyledText>
          </StyledButton>

          <Button text="Add a New Set" variant="outline" flexWidth onClick={handleAddNewSet} />
        </LabeledField>
      </StyledFlex>

      <ConfirmationModal
        isOpen={openDeleteParamConfirmationModal}
        onCloseModal={cancelDelete}
        onSuccessClick={deleteParam}
        successBtnText="Delete"
        alertType="DANGER"
        title="Are You Sure?"
        text={`You are about to delete ${deleteParamData?.paramName ?? ''}.`}
      />

      <MigrateDeleteParamModal
        open={openMigrateDeleteParamModal}
        paramName={deleteParamData?.paramName}
        onSubmit={migrateDeleteParam}
        onCancel={() => setOpenMigrateDeleteParamModal(false)}
      />
    </DragDropContext>
  );
};

export default ProcessEditorInputParams;
