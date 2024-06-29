import classnames from 'classnames';
import { MultiDirectedGraph } from 'graphology';
import React, { memo, useCallback, useContext, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { WorkflowEditorConfig } from '../../../WorkflowEditorConfig';
import { promptText, stepTypes, stepTypesForRender } from '../../../constants/graph';
import { DIAGRAM_ID } from '../../../constants/layout';
import { useHistoricalRecoilState } from '../../../hooks/useHistoricalRecoilState';
import {
  insertConditionalNode,
  insertGroupNode,
  insertNode,
  replaceConditionalNode,
  replaceGroupNode,
  replaceNode,
} from '../../../services/graph';
import { graphToTree } from '../../../services/layout';
import { staticStepDelegates } from '../../../store/selectors';
import { initialRows } from '../../SpreadsheetBuilder/utils/data';
import { modifyAllSpreadsheetNodes } from '../../SpreadsheetBuilder/utils/spreadsheet';
import { StyledWorkflowEditorDrawerOverlay } from '../../WorkflowEditorDrawer/StyledFlowEditorDrawer';
import { STEP_INPUT_TYPE_KEYS } from '../../sideMenu/SideMenu/keyConstants';
import ConditionalBranch from '../ConditinalBranch/ConditionalBranch';
import EndProcessInfo from '../EndProcessInfo/EndProcessInfo';
import diagramStyles from '../diagram.module.css';
import BaseSquare from '../steps/BaseSquare';
import GroupEnd from '../steps/GroupEnd';
import Slot from '../steps/Slot';
import StepSquare from '../steps/StepSquare/StepSquare';

const TASK_SLOT = 'TASK_SLOT';

const Layout = () => {
  const config = useContext(WorkflowEditorConfig);
  const { set, state } = useHistoricalRecoilState();

  const baseStepDelegates = useRecoilValue(staticStepDelegates);

  const { workflow, editingStep } = state;

  const graph = useMemo(() => new MultiDirectedGraph().import(workflow), [state]);

  window.graph = graph;

  const handleEditStep = async (step) => {
    set({ ...state, editingStep: step });
  };

  const handleAddStep = useCallback(
    (graph, edge, step) => {
      const getInitializedParams = (params) =>
        params?.map((param) => {
          let value = '';
          let defaultValue = '';

          try {
            defaultValue = JSON.parse(param?.stepSettingOptions?.defaultValue);
          } catch {
            defaultValue = param?.stepSettingOptions?.defaultValue;
          }

          // for spreadsheet it should be filled by default with initial data
          if (param.promptText === promptText.SPREADSHEET_EDITOR) {
            value = initialRows;
          }

          const restInitialValues = {};

          if (param.stepSettingsInputType === STEP_INPUT_TYPE_KEYS.STATIC_DYNAMIC_FILE_UPLOAD) {
            restInitialValues.isStatic = true;
          }

          return {
            ...restInitialValues,
            stepSettingTemplate: param,
            currentValue: defaultValue ?? value,
          };
        });
      // add initial inputs/outputs params

      const settings = step.stepDelegateSettings ?? [];
      const filteredInputParams = settings.filter((setting) => !setting.isOutputParam);
      const stepInputParameters = getInitializedParams(filteredInputParams);

      const filteredOutputParams = settings.filter((setting) => !!setting.isOutputParam);
      const stepOutputParameters = getInitializedParams(filteredOutputParams);

      const attributes = {
        ...step,
        stepInputParameters,
        stepOutputParameters,
      };

      // if there is stepId - it means we are replacing node
      if (step.stepId) {
        if (step.stepDelegateType === stepTypes.GATEWAY) {
          replaceConditionalNode(graph, edge, step.stepId);
        } else if ([stepTypes.LOOP_START, stepTypes.RPA_START].includes(step.stepDelegateType)) {
          replaceGroupNode(graph, edge, step.stepId);
        } else {
          replaceNode(graph, edge, step.stepId);
        }
        // if it's conditional branch from sidebar
      } else if (step.stepDelegateType === stepTypes.GATEWAY) {
        insertConditionalNode(graph, edge, step, baseStepDelegates[stepTypes.MERGE]);
        // if it's any other step delegates from sidebar
      } else if ([stepTypes.LOOP_START, stepTypes.RPA_START].includes(step.stepDelegateType)) {
        insertGroupNode(graph, edge, attributes, {});
        // if it's any other step delegates from sidebar
      } else {
        insertNode(graph, edge, attributes);
      }

      if ([stepTypes.CREATE_EXCEL_SPREADSHEET, stepTypes.UPDATE_EXCEL_DATA].includes(step.stepDelegateType)) {
        const spreadsheetNodes = graph.filterNodes(
          (_, attrs) =>
            attrs.stepType === stepTypes.CREATE_EXCEL_SPREADSHEET || attrs.stepType === stepTypes.UPDATE_EXCEL_DATA
        );

        // modification is reasonable only if there is more than 1 spreadsheet nodes
        if (spreadsheetNodes.length > 1) {
          modifyAllSpreadsheetNodes(graph);
        }
      }

      set({ ...state, workflow: graph.export() });
    },
    [graph]
  );

  const renderWorkflowBranch = ({ stepType, children }) =>
    stepType === stepTypes.BRANCH && (
      <section className={diagramStyles.Branch}>{children && renderWorkflow(children)}</section>
    );

  const renderLoopGroup = ({ stepType, children }) => {
    const hasRPAError = children?.some((child) => child.stepType === stepTypes.RPA_START && child.hasExecutionError);

    return (
      [stepTypes.LOOP_GROUP, stepTypes.RPA_GROUP].includes(stepType) && (
        <main
          className={classnames({
            [diagramStyles.Branch]: true,
            [diagramStyles.Group]: true,
            [diagramStyles[stepType]]: true,
            [diagramStyles.RPAError]: hasRPAError,
          })}
        >
          {children && renderWorkflow(children)}
        </main>
      )
    );
  };

  const renderStep = (item) => {
    const { stepType, stepId } = item;
    const isStepForRender = Object.values(stepTypesForRender).includes(stepType);

    const isStepEditing = editingStep?.stepId === stepId;

    return (
      isStepForRender && (
        <StepSquare item={item} onEdit={() => handleEditStep(item)} id={stepId} isStepEditing={isStepEditing} />
      )
    );
  };

  const renderGateway = (item) => {
    const { stepType, children, stepId } = item;
    const isStepEditing = editingStep?.stepId === stepId;

    return (
      stepType === stepTypes.GATEWAY && (
        <>
          <StepSquare item={item} onEdit={() => handleEditStep(item)} isStepEditing={isStepEditing} />
          <ConditionalBranch>{children && renderWorkflow(children)}</ConditionalBranch>
        </>
      )
    );
  };

  const renderStartStartEnd = ({ stepId, stepType }) => {
    if (stepType === stepTypes.START) return <BaseSquare type={stepType} id={stepId} />;

    if (stepType === stepTypes.END) {
      return <BaseSquare type={stepType} infoBlocks={<EndProcessInfo />} id={stepId} />;
    }
  };

  const renderLoopEnd = ({ stepType }) => stepType === stepTypes.LOOP_END && <GroupEnd name="End of loop" />;
  const renderRpaEnd = ({ stepType }) => stepType === stepTypes.RPA_END && <GroupEnd name="End of Web UI" />;

  const renderSlot = (item) => {
    const { stepType, stepId } = item;

    return (
      stepType === stepTypes.TASK_SLOT && <Slot data={item} onDrop={(data) => handleAddStep(graph, stepId, data)} />
    );
  };

  const renderWorkflow = (items) =>
    items?.map((item) => {
      if (!item) return null;

      return (
        <React.Fragment key={JSON.stringify(item)}>
          {renderWorkflowBranch(item)}
          {renderLoopGroup(item)}
          {renderStep(item)}
          {renderStartStartEnd(item)}
          {renderLoopEnd(item)}
          {renderRpaEnd(item)}
          {renderSlot(item)}
          {renderGateway(item)}
        </React.Fragment>
      );
    });

  const tree = graphToTree(graph);

  return (
    <StyledWorkflowEditorDrawerOverlay isReadOnly={config.isReadOnly} id={DIAGRAM_ID}>
      {renderWorkflow(tree)}
    </StyledWorkflowEditorDrawerOverlay>
  );
};

export default memo(Layout);
