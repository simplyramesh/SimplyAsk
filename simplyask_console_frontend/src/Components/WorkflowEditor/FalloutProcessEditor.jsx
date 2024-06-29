import Close from '@mui/icons-material/Close';
import React, { useState } from 'react';

import routes from '../../config/routes';
import {
  getWorkflow,
  getTestWorkflow,
  getWorkflowGraph,
  getTestWorkflowGraph,
  getWorkflowStepDelegates,
  getTestWorkflowStepDelegates,
  getWorkflowStepDelegatesFilter,
  getTestWorkflowStepDelegatesFilter,
  getWorkflowStepDelegatesStructure,
  getTestWorkflowStepDelegatesStructure,
  updateWorkflow,
  updateTestWorkflow,
} from '../../Services/axios/workflowEditor';
import classes from '../shared/CustomModal/customModal.module.css';
import { StyledFlex, StyledText } from '../shared/styles/styled';

import FullScreenModal from './components/FullScreenModal/FullScreenModal';
import WorkflowEditor from './components/WorkflowEditor/WorkflowEditor';

const FalloutProcessEditor = ({
  processId, processInstanceId, paneConfigurations = {}, isEmbeddedSideModalData = false, testCaseExecutionId,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const api = processInstanceId
    ? {
      getWorkflow,
      getWorkflowGraph: () => getWorkflowGraph(processId, processInstanceId),
      getWorkflowStepDelegates,
      getWorkflowStepDelegatesFilter,
      getWorkflowStepDelegatesStructure,
      updateWorkflow,
    } : {
      getWorkflow: getTestWorkflow,
      getWorkflowGraph: () => getTestWorkflowGraph(processId, testCaseExecutionId),
      getWorkflowStepDelegates: getTestWorkflowStepDelegates,
      getWorkflowStepDelegatesFilter: getTestWorkflowStepDelegatesFilter,
      getWorkflowStepDelegatesStructure: getTestWorkflowStepDelegatesStructure,
      updateWorkflow: updateTestWorkflow,
    };

  const renderWorkflow = () => (
    <WorkflowEditor
      config={{
        onFullScreenTriggered: setIsFullScreen,
        fullScreen: isFullScreen,
        paneConfig: {
          centerZoomedOut: true,
          initialScale: 1,
          ...paneConfigurations,
        },
        processId,
        isReadOnly: true,
        isTestEditor: false,
        isEmbeddedSideModalData,
        redirectUrl: routes.PROCESS_MANAGER,
        entityIdName: 'workflowId',
        api,
      }}
    />
  );

  return (
    <>
      {renderWorkflow()}
      <FullScreenModal open={isFullScreen}>
        <StyledFlex height="100%" position="relative">
          <StyledFlex direction="row" alignItems="center" justifyContent="space-between" p="7px 20px">
            <StyledText as="span" size={19} weight={600}>
              Execution Status Diagram
            </StyledText>
            <Close className={`${classes.closeIcon} ${classes.fullScreen}`} onClick={() => setIsFullScreen(false)} />
          </StyledFlex>
          <StyledFlex height="100%" position="relative">
            {renderWorkflow()}
          </StyledFlex>
        </StyledFlex>
      </FullScreenModal>
    </>
  );
};

export default FalloutProcessEditor;
