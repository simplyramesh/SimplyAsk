import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';

import { StyledButton, StyledLoadingButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import ConfirmationModal from '../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import Spinner from '../../../../shared/Spinner/Spinner';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { WORKFLOW_EDITOR_SETTINGS_SIDE_MENU_TYPE } from '../../../constants/layout';
import useCancelProcessExecutions from '../../../hooks/useCancelProcessExecutions';
import useGetProcessExecutions from '../../../hooks/useGetProcessExecutions';
import { workflowEditorConfig, workflowSettingsState } from '../../../store';
import { Divider } from '../base';

import EditInputParam from './ExpectedInputParams/EditInputParam/EditInputParam';
import NewTestInputParam from './ExpectedInputParams/NewInputParam/NewTestInputParam';
import NewWorkflowInputParam from './ExpectedInputParams/NewInputParam/NewWorkflowInputParam';
import ProcessEditorInputParams from './ExpectedInputParams/ProcessEditor/ProcessEditorInputParams';
import AddEditParamSetName from './ExpectedInputParams/TestEditor/AddEditParamSetName/AddEditParamSetName';
import TestEditorInputParams from './ExpectedInputParams/TestEditor/TestEditorInputParams';
import GeneralSettings from './GeneralSettings/GeneralSettings';
import SettingsItem from './SettingsItem/SettingsItem';

const OPTIONS = {
  GENERAL: {
    HEADING: 'General Settings',
    INFO: 'Edit the name of your Workflow, and choose your Fallout Destination.',
  },
  EXPECTED_PARAMS: {
    HEADING: 'Expected Input Parameters',
    INFO: 'Add and edit, expected parameter names and parameter types.',
  },
};

const Settings = () => {
  const { processId } = useParams();

  const [editorInput, setEditorInput] = useRecoilState(workflowSettingsState);
  const [component, setComponent] = useState({ current: 'settings', previous: 'settings' });
  const config = useRecoilValue(workflowEditorConfig);

  const [scheduledExecutionWarning, setScheduledExecutionWarning] = useState(null);
  const [scheduledExecutionFileIds, setScheduledExecutionFileIds] = useState(null);

  const { executions, isFetching } = useGetProcessExecutions({
    filterParams: { searchText: editorInput?.displayName },
    options: {
      enabled: !!processId && !!editorInput?.displayName,
      select: (data) => {
        const scheduledExecutions = data?.content?.filter((execution) => execution.scheduled === true);

        return {
          scheduledExecutions,
          isScheduledExecution: scheduledExecutions?.length > 0,
          scheduledExecutionFileIds: scheduledExecutions?.map((execution) => execution.id),
        };
      },
    },
  });

  const { isCancelledProcessesFetching } = useCancelProcessExecutions({
    executionFileIds: scheduledExecutionFileIds,
    options: { enabled: !!scheduledExecutionFileIds },
    onSuccess: () => {
      setScheduledExecutionFileIds(null);
      setScheduledExecutionWarning(null);
    },
  });

  const isLoading =
    isFetching &&
    [
      WORKFLOW_EDITOR_SETTINGS_SIDE_MENU_TYPE.EDIT_PROCESS_INPUT_PARAM,
      WORKFLOW_EDITOR_SETTINGS_SIDE_MENU_TYPE.NEW_PROCESS_INPUT_PARAM,
      WORKFLOW_EDITOR_SETTINGS_SIDE_MENU_TYPE.PROCESS_EDITOR,
    ].includes(component.current);

  return (
    <>
      <StyledFlex gap="16px" m="16px 8px 18px 8px">
        {isLoading && <Spinner fadeBgParentFixedPosition medium />}
        {component.current === WORKFLOW_EDITOR_SETTINGS_SIDE_MENU_TYPE.SETTINGS && (
          <>
            <SettingsItem
              heading={OPTIONS.GENERAL.HEADING}
              info={OPTIONS.GENERAL.INFO}
              onClick={() =>
                setComponent((prev) => ({ ...prev, current: WORKFLOW_EDITOR_SETTINGS_SIDE_MENU_TYPE.GENERAL_SETTINGS }))
              }
              withIcon
            />
            <Divider variant="center" color="gray" />
            {config?.isTestEditor ? (
              <SettingsItem
                heading="Test Editor"
                info={OPTIONS.EXPECTED_PARAMS.INFO}
                onClick={() =>
                  setComponent((prev) => ({ ...prev, current: WORKFLOW_EDITOR_SETTINGS_SIDE_MENU_TYPE.TEST_EDITOR }))
                }
                withIcon
              />
            ) : (
              <SettingsItem
                heading={OPTIONS.EXPECTED_PARAMS.HEADING}
                info={OPTIONS.EXPECTED_PARAMS.INFO}
                onClick={() =>
                  setComponent((prev) => ({ ...prev, current: WORKFLOW_EDITOR_SETTINGS_SIDE_MENU_TYPE.PROCESS_EDITOR }))
                }
                withIcon
              />
            )}
          </>
        )}
        {/* components */}
        {component.current === WORKFLOW_EDITOR_SETTINGS_SIDE_MENU_TYPE.GENERAL_SETTINGS && (
          <GeneralSettings onBackClick={setComponent} onChange={setEditorInput} value={editorInput} />
        )}
        {component.current === WORKFLOW_EDITOR_SETTINGS_SIDE_MENU_TYPE.PROCESS_EDITOR && (
          <ProcessEditorInputParams
            onBackClick={setComponent}
            inputParams={editorInput.inputParamSets}
            onDeleteClick={setEditorInput}
            isScheduledExecution={executions?.isScheduledExecution}
            isFetching={isFetching}
            envParamSets={editorInput.envParamSets}
            updateEnvParamSets={setEditorInput}
          />
        )}
        {component.current === WORKFLOW_EDITOR_SETTINGS_SIDE_MENU_TYPE.NEW_PROCESS_INPUT_PARAM && (
          <NewWorkflowInputParam
            onBackClick={setComponent}
            onConfirmClick={(v) =>
              executions?.isScheduledExecution ? setScheduledExecutionWarning('create') : setEditorInput(v)
            }
            headingPromptText={`Add a New ${component?.payload?.isDynamic ? 'Input' : 'Default'} Parameter to the Workflow`}
            isScheduledExecution={executions?.isScheduledExecution}
            isDynamic={component?.payload?.isDynamic}
          />
        )}
        {component.current === WORKFLOW_EDITOR_SETTINGS_SIDE_MENU_TYPE.NEW_TEST_INPUT_PARAM && (
          <NewTestInputParam
            onBackClick={setComponent}
            onConfirmClick={(v) =>
              executions?.isScheduledExecution ? setScheduledExecutionWarning('create') : setEditorInput(v)
            }
            headingPromptText={`Add a New Default Parameter to the Test Workflow`}
          />
        )}
        {component.current === WORKFLOW_EDITOR_SETTINGS_SIDE_MENU_TYPE.EDIT_PROCESS_INPUT_PARAM && (
          <EditInputParam
            onBackClick={setComponent}
            onConfirmClick={(v) =>
              executions?.isScheduledExecution ? setScheduledExecutionWarning('edit') : setEditorInput(v)
            }
            initParam={component.payload}
            isTestEditor={component?.payload?.isTestEditor}
            paramSets={editorInput.inputParamSets}
            isScheduledExecution={executions?.isScheduledExecution}
          />
        )}
        {component.current === WORKFLOW_EDITOR_SETTINGS_SIDE_MENU_TYPE.TEST_EDITOR && (
          <TestEditorInputParams
            onNav={setComponent}
            onDeleteConfirm={setEditorInput}
            inputParamSets={editorInput.inputParamSets}
            envParamSets={editorInput.envParamSets}
            updateEnvParamSets={setEditorInput}
          />
        )}
        {component.current === WORKFLOW_EDITOR_SETTINGS_SIDE_MENU_TYPE.PARAM_SET_NAME && (
          <AddEditParamSetName onNav={setComponent} onConfirm={setEditorInput} paramGroup={component?.payload} />
        )}
      </StyledFlex>
      <ConfirmationModal
        isOpen={!!scheduledExecutionWarning || !!scheduledExecutionFileIds}
        onCloseModal={() => setScheduledExecutionWarning(null)}
        title="You Have a Scheduled Execution"
        alertType="WARNING"
        customFooter={
          <StyledFlex gap="24px" direction="row" alignItems="center" justifyContent="center" width="100%">
            <StyledButton primary variant="outlined" onClick={() => setScheduledExecutionWarning(null)}>
              Cancel
            </StyledButton>
            <StyledLoadingButton
              primary
              variant="contained"
              loading={isCancelledProcessesFetching}
              onClick={() => setScheduledExecutionFileIds(executions?.scheduledExecutionFileIds)}
            >
              Delete Executions
            </StyledLoadingButton>
          </StyledFlex>
        }
      >
        <StyledText as="p" weight={400} lh={19} size={14}>
          {`This Process has actively scheduled executions in the Process Trigger. ${
            scheduledExecutionWarning === 'edit' ? 'Editing' : 'Creating'
          } input parameters will cause conflicts with the existing executions. In order to save ${
            scheduledExecutionWarning === 'edit' ? 'these changes' : 'this parameter'
          },`}
          <StyledText display="inline" weight={600} lh={19} size={14}>
            {' you must delete the scheduled executions first'}
          </StyledText>
        </StyledText>
      </ConfirmationModal>
    </>
  );
};

export default Settings;
