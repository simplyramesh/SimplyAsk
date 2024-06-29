import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import { MANAGER_API_KEYS } from '../../../../../../../../config/managerKeys';
import {
  ADD_NEW_AGENT_KEYS,
  ADD_NEW_MODAL_TITLES as ADD_NEW_AGENT_MODAL_TITLES,
} from '../../../../../../../Managers/AgentManager/AgentManager';
import {
  ADD_NEW_MODAL_TITLES as ADD_NEW_PROCESS_MODAL_TITLES,
  ADD_NEW_PROCESS_KEYS,
} from '../../../../../../../Managers/ProcessManager/ProcessManager';
import { ADD_NEW_MODAL_TITLES, ADD_NEW_TEST_SUITE_KEYS } from '../../../../../../../../utils/constants';
import { StyledButton } from '../../../../../../REDISIGNED/controls/Button/StyledButton';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../../styles/styled';
import AddNewProcessModal from '../../../../../Modals/SharedModals/AddNewProcessModal/AddNewProcessModal';
import { SAVE_BUTTON_KEYS } from '../../../SettingsSideDrawer';

import classes from './UpdateElementSideMenu.module.css';

const UpdateElementSideMenu = ({
  goBackToPrimaryMenu,
  setAddNewElementFormCollector,
  addNewElementFormCollector,
  clickedProcess,
  isUpdateElementLoading,
  isTestManagerView,
  isAgentManagerView,
  isProcessManagerView,
  showSettingsSideDrawer,
  saveButtonConfigurations,
  setSaveButtonConfigurations,
}) => {
  useEffect(() => {
    if (clickedProcess && isTestManagerView && showSettingsSideDrawer) {
      setAddNewElementFormCollector((prev) => ({
        ...prev,
        [ADD_NEW_TEST_SUITE_KEYS.testName]: clickedProcess[MANAGER_API_KEYS.DISPLAY_NAME],
        [ADD_NEW_TEST_SUITE_KEYS.testDescription]: clickedProcess[MANAGER_API_KEYS.DESCRIPTION],
        [ADD_NEW_TEST_SUITE_KEYS.tags]: clickedProcess[MANAGER_API_KEYS.TAGS],
      }));
    }
    if (clickedProcess && isProcessManagerView && showSettingsSideDrawer) {
      setAddNewElementFormCollector((prev) => ({
        ...prev,
        [ADD_NEW_PROCESS_KEYS.processName]: clickedProcess[MANAGER_API_KEYS.DISPLAY_NAME],
        [ADD_NEW_PROCESS_KEYS.processDescription]: clickedProcess[MANAGER_API_KEYS.DESCRIPTION],
        [ADD_NEW_PROCESS_KEYS.processTypeId]: clickedProcess[MANAGER_API_KEYS.PROCESS_TYPE]?.id,
        [ADD_NEW_PROCESS_KEYS.tags]: clickedProcess[MANAGER_API_KEYS.TAGS],
      }));
    }
    if (clickedProcess && isAgentManagerView && showSettingsSideDrawer) {
      setAddNewElementFormCollector((prev) => ({
        ...prev,
        [ADD_NEW_AGENT_KEYS.agentName]: clickedProcess[ADD_NEW_AGENT_KEYS.agentName],
        [ADD_NEW_AGENT_KEYS.agentDescription]: clickedProcess[ADD_NEW_AGENT_KEYS.agentDescription],
        [ADD_NEW_AGENT_KEYS.tags]: clickedProcess[ADD_NEW_AGENT_KEYS.tags],
      }));
    }
  }, [clickedProcess, isTestManagerView, isProcessManagerView, isAgentManagerView, showSettingsSideDrawer]);

  const handleSaveButtonClick = () => {
    setSaveButtonConfigurations((prev) => ({
      ...prev,
      [SAVE_BUTTON_KEYS.TRIGGER_API]: true,
    }));
  };

  const getGoBackTitle = () => {
    if (isTestManagerView) {
      return 'Edit Test Suite Details';
    }
    if (isProcessManagerView) {
      return 'Process Details';
    }
    if (isAgentManagerView) {
      return 'Agent Details';
    }
  };

  const deactivateTriggerApi = () => {
    setSaveButtonConfigurations((prev) => ({
      ...prev,
      [SAVE_BUTTON_KEYS.TRIGGER_API]: false,
    }));
  };

  const getModalTitles = () => {
    if (isTestManagerView) return ADD_NEW_MODAL_TITLES;
    if (isProcessManagerView) return ADD_NEW_PROCESS_MODAL_TITLES;
    if (isAgentManagerView) return ADD_NEW_AGENT_MODAL_TITLES;
  };

  return (
    <StyledFlex position="relative" height="100%" ml="-15px" pt="15px">
      <StyledFlex position="absolute" top="-40px" right="20px">
        <StyledButton
          primary
          variant="contained"
          position="absolute"
          disabled={saveButtonConfigurations[SAVE_BUTTON_KEYS.IS_BUTTON_DISABLED]}
          onClick={handleSaveButtonClick}
        >
          Save
        </StyledButton>
      </StyledFlex>

      <StyledFlex direction="row" mb="20px" gap="15px" p="0 24px" alignItems="center">
        <KeyboardBackspaceIcon className={classes.backBtnIcon} onClick={goBackToPrimaryMenu} />
        <StyledText size={19} weight={600}>
          {getGoBackTitle()}
        </StyledText>
      </StyledFlex>

      <StyledDivider height="2px" />
      <AddNewProcessModal
        setAddNewElementFormCollector={setAddNewElementFormCollector}
        dataCollector={addNewElementFormCollector}
        activateEditElementSideModal
        isTestManagerView={isTestManagerView}
        isProcessManagerView={isProcessManagerView}
        isAgentManagerView={isAgentManagerView}
        ADD_NEW_MODAL_TITLES={getModalTitles}
        setSaveButtonConfigurations={setSaveButtonConfigurations}
        saveButtonConfigurations={saveButtonConfigurations}
        isApiLoading={isUpdateElementLoading}
        goBackToPrimaryMenu={goBackToPrimaryMenu}
        deactivateTriggerApi={deactivateTriggerApi}
      />
    </StyledFlex>
  );
};

export default UpdateElementSideMenu;

UpdateElementSideMenu.propTypes = {
  goBackToPrimaryMenu: PropTypes.func,
  setAddNewElementFormCollector: PropTypes.func,
  addNewElementFormCollector: PropTypes.object,
  clickedProcess: PropTypes.object,
  isUpdateElementLoading: PropTypes.bool,
  isTestManagerView: PropTypes.bool,
  isAgentManagerView: PropTypes.bool,
  isProcessManagerView: PropTypes.bool,
  showSettingsSideDrawer: PropTypes.bool,
  saveButtonConfigurations: PropTypes.object,
  setSaveButtonConfigurations: PropTypes.func,
};
