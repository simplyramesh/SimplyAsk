import { useTheme } from '@emotion/react';
import { debounce } from 'lodash';
import React, { Fragment, useEffect, useMemo, useState } from 'react';

import routes from '../../../../../../../config/routes';
import { useGetParametersSet } from '../../../../../../../hooks/environments/useGetParametersSet';
import { getParametersSets } from '../../../../../../../Services/axios/environment';
import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import OpenIcon from '../../../../../../shared/REDISIGNED/icons/svgIcons/OpenIcon';
import ConfirmationModal from '../../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import CustomIndicatorArrow from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomSelect from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import TrashIcon from '../../../../../Assets/Icons/trashIcon.svg?component';
import { Button } from '../../../base';
import { StyledParamListIconWrapper } from '../../../base/inputs/ApiParamList/StyledParamList';
import { LabeledField } from '../../../wrappers';
import SettingsHeading from '../../SettingsHeading/SettingsHeading';

import ParamGroup from './ParamGroup/ParamGroup';
import MigrateDeleteParamModal from '../../../../WarningModals/MigrateDeleteParamModal';
import { getNodesWithParam, updateNode, updateParamNamesInSet } from '../../../../../services/graph';
import { useHistoricalRecoilState } from '../../../../../hooks/useHistoricalRecoilState';
import { WORKFLOW_EDITOR_SETTINGS_SIDE_MENU_TYPE } from '../../../../../constants/layout';

import { MultiDirectedGraph } from 'graphology';

const TEST_EDITOR_PARAM_GROUPS = {
  STATIC: 'staticInputParams',
  DYNAMIC: 'dynamicInputParams',
  ENV: 'envParamSets',
};

const TestEditorInputParams = ({ onNav, onDeleteConfirm, inputParamSets, envParamSets, updateEnvParamSets }) => {
  const { colors } = useTheme();

  const { state: graphState, set: setGraphState } = useHistoricalRecoilState();
  const { workflow } = graphState;
  const graph = useMemo(() => new MultiDirectedGraph().import(workflow), [graphState]);

  const [inputParamGroups, setInputParamGroups] = useState(inputParamSets);
  const [selectEnvParamSets, setSelectEnvParamSets] = useState([...envParamSets]);
  const [openDeleteParamConfirmationModal, setDeleteParamConfirmationModal] = useState(false);
  const [openMigrateDeleteParamModal, setOpenMigrateDeleteParamModal] = useState(false);

  const [deleteModalData, setDeleteModalData] = useState(null);

  useEffect(() => {
    if (Array.isArray(inputParamSets)) {
      setInputParamGroups(inputParamSets);
    }
  }, [inputParamSets]);

  useEffect(() => {
    if (Array.isArray(envParamSets)) {
      const mappedEnvParamSets = envParamSets.map((paramSet) => ({
        label: paramSet,
        value: paramSet,
      }));
      setSelectEnvParamSets(mappedEnvParamSets);
    }
  }, [envParamSets]);

  const handleAddNewSet = () => {
    setSelectEnvParamSets((prevValues) => [...prevValues, null]);
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

  const isSingleTypeParam = (type) =>
    type === TEST_EDITOR_PARAM_GROUPS.STATIC || type === TEST_EDITOR_PARAM_GROUPS.DYNAMIC;

  const isParamUsedInFlow = (paramName) => {
    const nodes = getNodesWithParam(graph, paramName);

    return nodes.length > 0;
  };

  const onDeleteParam = (data) => {
    setDeleteModalData(data);

    if (isSingleTypeParam(data.type) && isParamUsedInFlow(data.paramName)) {
      setOpenMigrateDeleteParamModal(true);
    } else {
      setDeleteParamConfirmationModal(true);
    }
  };

  const onCancelDelete = () => {
    setDeleteParamConfirmationModal(false);
  };

  const onConfirmDelete = () => {
    const { paramGroupIndex, paramIndex, type: deleteType } = deleteModalData;

    onDeleteConfirm((prev) => {
      if (deleteType === TEST_EDITOR_PARAM_GROUPS.ENV) {
        return {
          ...prev,
          envParamSets: prev.envParamSets.filter((_, i) => i !== paramGroupIndex),
        };
      } else {
        return {
          ...prev,
          inputParamSets: prev.inputParamSets.map((paramSet, i) => {
            if (i === paramGroupIndex) {
              return {
                ...paramSet,
                [deleteType]: paramSet[deleteType].filter((_, j) => j !== paramIndex),
              };
            }

            return paramSet;
          }),
        };
      }
    });

    setDeleteModalData(null);
    setDeleteParamConfirmationModal(false);
    setOpenMigrateDeleteParamModal(false);
  };

  const migrateDeleteParam = (_, newParamValue) => {
    const nodes = getNodesWithParam(graph, deleteModalData.paramName);

    nodes.forEach((node) => {
      const nodeId = node.stepId;
      const nodeAttrs = graph.getNodeAttributes(nodeId);

      console.log(nodeAttrs.stepOutputParameters);

      updateNode(graph, nodeId, {
        stepInputParameters: updateParamNamesInSet(
          nodeAttrs.stepInputParameters,
          deleteModalData.paramName,
          newParamValue
        ),
        stepOutputParameters: updateParamNamesInSet(
          nodeAttrs.stepOutputParameters,
          deleteModalData.paramName,
          newParamValue
        ),
      });
    });

    setGraphState({ ...graphState, workflow: graph.export() });

    onConfirmDelete();
  };

  const mapAndFilterParamSets = (paramSets) =>
    paramSets
      ?.map((eachParam) => ({ label: eachParam.name, value: eachParam.name }))
      .filter(
        (eachParam) => !selectEnvParamSets?.some((selectedOption) => selectedOption?.value === eachParam.value)
      ) || [];

  const { data } = useGetParametersSet();

  const defaultParamSets = mapAndFilterParamSets(data?.content);

  const fetchOptions = debounce((inputVal, setOptions) => {
    getParametersSets(`searchText=${inputVal}`)
      .then((res) => mapAndFilterParamSets(res?.content))
      .then((optionsFromBackend) => {
        setOptions(optionsFromBackend);
      });
  }, 300);

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
        loadOptions={fetchOptions}
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
        onClick={() =>
          onDeleteParam({
            paramGroupName: selectedValue?.value,
            paramGroupIndex: index,
            type: TEST_EDITOR_PARAM_GROUPS.ENV,
          })
        }
      >
        <TrashIcon />
      </StyledParamListIconWrapper>
    </StyledFlex>
  );

  const renderDefaultParams = (paramSet, index) => (
    <Fragment key={paramSet.name}>
      {paramSet?.staticInputParams?.length !== 0 && (
        <ParamGroup
          groupHeading={paramSet?.name}
          inputParams={{
            dynamicInputParams: [],
            staticInputParams: paramSet?.staticInputParams,
          }}
          onDelete={(_, param, i) =>
            onDeleteParam({
              ...param,
              paramIndex: i,
              paramGroupIndex: index,
            })
          }
          onEdit={(_, paramType, paramIndex) =>
            onNav((prev) => ({
              current: WORKFLOW_EDITOR_SETTINGS_SIDE_MENU_TYPE.EDIT_PROCESS_INPUT_PARAM,
              previous: prev.current,
              payload: {
                isTestEditor: true,
                paramSetIndex: index,
                index: paramIndex,
                inputParams: paramSet,
                staticDynamic: paramType,
              },
            }))
          }
        />
      )}
    </Fragment>
  );

  return (
    <>
      <SettingsHeading
        heading="Input Parameters"
        onBackClick={() =>
          onNav((prev) => ({
            current: WORKFLOW_EDITOR_SETTINGS_SIDE_MENU_TYPE.SETTINGS,
            previous: prev.current,
          }))
        }
      />

      <StyledFlex m="0 21px 16px">
        <StyledText weight={600} mb={16}>
          Default Parameters
        </StyledText>
        {inputParamGroups?.map((paramSet, index) => renderDefaultParams(paramSet, index))}
        <Button
          text="Add a New Parameter"
          variant="outline"
          flexWidth
          onClick={() =>
            onNav((prev) => ({
              current: WORKFLOW_EDITOR_SETTINGS_SIDE_MENU_TYPE.NEW_TEST_INPUT_PARAM,
              previous: prev.current,
              payload: { isTestEditor: true, isStatic: true },
            }))
          }
        />
      </StyledFlex>

      <StyledDivider borderWidth={2} color={colors.geyser} flexItem />

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
        onCloseModal={onCancelDelete}
        onSuccessClick={onConfirmDelete}
        successBtnText="Delete"
        alertType="DANGER"
        title="Are You Sure?"
        text={`You are about to delete ${deleteModalData?.paramGroupName || deleteModalData?.paramName || 'a parameter'}.`}
      />

      <MigrateDeleteParamModal
        open={openMigrateDeleteParamModal}
        onSubmit={migrateDeleteParam}
        onCancel={() => setOpenMigrateDeleteParamModal(false)}
      />
    </>
  );
};

export default TestEditorInputParams;
