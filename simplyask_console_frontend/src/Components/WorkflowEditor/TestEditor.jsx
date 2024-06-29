import { useEffect } from 'react';
import { useParams, generatePath } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import routes from '../../config/routes';
import {
  getTestWorkflow,
  getTestWorkflowGraph,
  getTestWorkflowStepDelegates,
  getTestWorkflowStepDelegatesFilter,
  getTestWorkflowStepDelegatesStructure,
  updateTestWorkflow,
  getWorkflow,
  getWorkflowGraph,
  getWorkflowStepDelegates,
  getWorkflowStepDelegatesFilter,
  getWorkflowStepDelegatesStructure,
  updateWorkflow,
} from '../../Services/axios/workflowEditor';
import { modifiedCurrentPageDetails } from '../../store';
import { useGetTestCase } from '../Managers/TestManager/hooks/useGetTestCase';
import { EXECUTION_FRAMEWORKS } from '../shared/constants/core';

import WorkflowEditor from './components/WorkflowEditor/WorkflowEditor';

const TestEditor = () => {
  const setCurrentPageDetailsState = useSetRecoilState(modifiedCurrentPageDetails);

  const { testCaseId } = useParams();
  const { testCase } = useGetTestCase({
    payload: { id: testCaseId },
  });

  const isRPA = testCase?.processType === EXECUTION_FRAMEWORKS.RPA;
  const processId = isRPA ? testCase?.workflowId : testCase?.testCaseId;

  useEffect(() => {
    if (testCaseId) {
      setCurrentPageDetailsState({
        disableBreadCrumbLoading: true,
        pageUrlPath: routes.TEST_EDITOR_INFO,
        clickableIdRoutes: [
          {
            breadCrumbLabel: testCaseId,
            path: routes.TEST_CASE_DETAILS,
            clickablePath: generatePath(routes.TEST_CASE_DETAILS, { caseId: testCaseId }),
          },
        ],
      });
    }
  }, [testCaseId]);

  return isRPA ? (
    <WorkflowEditor
      config={{
        processId,
        isReadOnly: false,
        isTestEditor: true,
        redirectUrl: routes.TEST_MANAGER,
        entityIdName: 'workflowId',
        api: {
          getWorkflow,
          getWorkflowGraph,
          getWorkflowStepDelegates,
          getWorkflowStepDelegatesFilter,
          getWorkflowStepDelegatesStructure,
          updateWorkflow,
        },
      }}
    />
  ) : (
    <WorkflowEditor
      config={{
        processId,
        isTestEditor: true,
        redirectUrl: routes.TEST_MANAGER,
        entityIdName: 'testCaseId',
        api: {
          getWorkflow: getTestWorkflow,
          getWorkflowGraph: getTestWorkflowGraph,
          getWorkflowStepDelegates: getTestWorkflowStepDelegates,
          getWorkflowStepDelegatesFilter: getTestWorkflowStepDelegatesFilter,
          getWorkflowStepDelegatesStructure: getTestWorkflowStepDelegatesStructure,
          updateWorkflow: updateTestWorkflow,
        },
      }}
    />
  );
};

export default TestEditor;
