import './transition.css';

import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';

import AgentManagerSettingsComponent from './PrimaryViewTabs/AgentManagerSettingsComponent';
import ProcessManagerSettings from './PrimaryViewTabs/ProcessManagerSettings';
import TestManagerSettingsComponent from './PrimaryViewTabs/TestManagerSettingsComponent';
import AgentManagerAdvancedSettings from './SecondaryViewTabs/AgentManagerTabs/AdvancedSettings/AgentManagerAdvancedSettings';
import ConfigureChannels from './SecondaryViewTabs/AgentManagerTabs/ConfigureChannels/ConfigureChannels';
import ManageBlackOutPeriods from './SecondaryViewTabs/ProcessManagerTabs/ManageBlackOutPeriods/ManageBlackOutPeriods';
import PublicSubmissionForm from './SecondaryViewTabs/ProcessManagerTabs/PublicSubmissionForm/PublicSubmissionForm';
import Resources from './SecondaryViewTabs/ProcessManagerTabs/Resources/Resources';
import ArchiveOrDeleteProcess from './SecondaryViewTabs/SharedComponents/ArchiveOrDeleteProcess/ArchiveOrDeleteProcess';
import UpdateElementSideMenu from './SecondaryViewTabs/SharedComponents/UpdateElementSideMenu/UpdateElementSideMenu';
import AddNewTestCase from './SecondaryViewTabs/TestManagerTabs/AddNewTestCase/AddNewTestCase';
import classes from './SettingsSideDrawer.module.css';
import { ReactFlowProvider } from 'reactflow';
import ProcessVisibilityPanel from './SecondaryViewTabs/ProcessManagerTabs/ProcessVisibility/ProcessVisibilityPanel';

export const DEACTIVATE_TRIGGER_API = 'deactivateTriggerApi';

export const SAVE_BUTTON_KEYS = {
  TRIGGER_API: 'triggerApi',
  IS_BUTTON_DISABLED: 'isButtonDisabled',
};

export const CSS_TRANSITION_ACTIVE_MENUS = {
  PRIMARY_MENU: 'primaryMenu',
  SECONDARY_MENU: 'secondaryMenu',
};

export const SAVE_BUTTON_CONFIGURATION_SCHEMA = {
  [SAVE_BUTTON_KEYS.TRIGGER_API]: false,
  [SAVE_BUTTON_KEYS.IS_BUTTON_DISABLED]: true,
};

export const CHANGE_AGENT_MANAGER_MENUS = {
  PRIMARY_MENU: {
    value: CSS_TRANSITION_ACTIVE_MENUS.PRIMARY_MENU,
  },

  EDIT_DETAILS: {
    value: CSS_TRANSITION_ACTIVE_MENUS.SECONDARY_MENU,
    component: UpdateElementSideMenu,
  },

  ADVANCED_SETTINGS: {
    value: CSS_TRANSITION_ACTIVE_MENUS.SECONDARY_MENU,
    component: AgentManagerAdvancedSettings,
  },

  CONFIGURE_CHANNELS: {
    value: CSS_TRANSITION_ACTIVE_MENUS.SECONDARY_MENU,
    component: ConfigureChannels,
  },
};

export const CHANGE_PROCESS_MANAGER_MENUS = {
  PRIMARY_MENU: {
    value: CSS_TRANSITION_ACTIVE_MENUS.PRIMARY_MENU,
  },
  EDIT_PROCESS_DETAILS: {
    value: CSS_TRANSITION_ACTIVE_MENUS.SECONDARY_MENU,
    component: UpdateElementSideMenu,
  },
  PROCESS_VISIBILITY: {
    value: CSS_TRANSITION_ACTIVE_MENUS.SECONDARY_MENU,
    component: ProcessVisibilityPanel,
  },
  MANAGE_BLACKOUT_PERIODS: {
    value: CSS_TRANSITION_ACTIVE_MENUS.SECONDARY_MENU,
    component: ManageBlackOutPeriods,
  },
  PUBLIC_SUBMISSION_FORM: {
    value: CSS_TRANSITION_ACTIVE_MENUS.SECONDARY_MENU,
    component: PublicSubmissionForm,
  },
  RESOURCES: {
    value: CSS_TRANSITION_ACTIVE_MENUS.SECONDARY_MENU,
    component: Resources,
  },
};

export const CHANGE_TEST_MANAGER_MENUS = {
  PRIMARY_MENU: {
    value: CSS_TRANSITION_ACTIVE_MENUS.PRIMARY_MENU,
  },

  EDIT_TEST_SUITE_DETAILS: {
    value: CSS_TRANSITION_ACTIVE_MENUS.SECONDARY_MENU,
    component: UpdateElementSideMenu,
  },

  ARCHIVE_OR_DELETE_TEST_SUITE: {
    value: CSS_TRANSITION_ACTIVE_MENUS.SECONDARY_MENU,
    component: ArchiveOrDeleteProcess,
  },

  VIEW_ALL_TEST_CASES: {
    value: CSS_TRANSITION_ACTIVE_MENUS.SECONDARY_MENU,
    component: AddNewTestCase,
  },
};

export const HorizontalLine = ({ addMargin }) => (
  <div
    className={`${classes.horizontal_line}
  ${addMargin && classes.addMargin}`}
  />
);

const PrimarySettingsMenu = ({
  isProcessManagerView,
  isTestManagerView,
  isAgentManagerView,
  setShowIsProcessStatusChanged,
  setActiveMenu,
  clickedProcess,
  onExecuteTestSuite,
  setShowMoveElementToArchive,
  setShowDeleteElementModal,
  setShowAgentManagerModal,
  exportProcess,
  isExportProcessLoading,
  setShowProcessManagerModal,
  exportAgent,
  isExportAgentLoading,
}) => {
  if (isProcessManagerView) {
    return (
      <ProcessManagerSettings
        setShowIsProcessStatusChanged={setShowIsProcessStatusChanged}
        setActiveMenu={setActiveMenu}
        processData={clickedProcess}
        setShowDeleteElementModal={setShowDeleteElementModal}
        setShowMoveElementToArchive={setShowMoveElementToArchive}
        exportProcess={exportProcess}
        isExportProcessLoading={isExportProcessLoading}
        setShowProcessManagerModal={setShowProcessManagerModal}
      />
    );
  }

  if (isTestManagerView) {
    return (
      <TestManagerSettingsComponent
        setActiveMenu={setActiveMenu}
        clickedProcess={clickedProcess}
        onExecuteTestSuite={onExecuteTestSuite}
      />
    );
  }

  if (isAgentManagerView) {
    return (
      <ReactFlowProvider>
        <AgentManagerSettingsComponent
          setActiveMenu={setActiveMenu}
          clickedProcess={clickedProcess}
          setShowMoveElementToArchive={setShowMoveElementToArchive}
          setShowDeleteElementModal={setShowDeleteElementModal}
          setShowAgentManagerModal={setShowAgentManagerModal}
          exportAgent={exportAgent}
          isExportAgentLoading={isExportAgentLoading}
        />
      </ReactFlowProvider>
    );
  }
  return <></>;
};

const FallBackComponent = () => <div>Unable to load component</div>;

const SettingsSideDrawer = ({
  isProcessManagerView = false,
  isTestManagerView = false,
  isAgentManagerView = false,
  setShowIsProcessStatusChanged = () => {},
  setShowMoveElementToArchive,
  setShowDeleteElementModal,
  filterQuery,
  setFilterQuery,
  viewBackupFilters,
  clickedProcess,
  setAddNewElementFormCollector,
  addNewElementFormCollector,
  isUpdateElementLoading,
  setActiveMenu,
  activeMenu,
  goBackToPrimaryMenu,
  setShowAddNewTestCaseModal,
  showSettingsSideDrawer,
  setShowSettingsSideDrawer,
  triggerOpenTestCasesSideModal = false,
  isAddNewCaseApiLoading,
  setAddNewTestCaseFormCollector,
  addNewTestCaseToSuite,
  setTriggerOpenTestCasesSideModal,
  saveButtonConfigurations,
  setSaveButtonConfigurations,
  onExecuteTestSuite,
  preventGoBackToPrimaryMenu = false,
  setIsAddWidgetModalOpen = () => {},
  setIsAddPhoneNumberModalOpen = () => {},
  setClickedProcess = () => {},
  setPreventGoBackToPrimaryMenu = () => {},
  tabValue,
  onTabChange,
  setShowAgentManagerModal,
  exportProcess,
  isExportProcessLoading,
  exportAgent,
  isExportAgentLoading,
  setShowProcessManagerModal,
  setShowUnsavedChangesModalOpen,
  showUnsavedChangesModalOpen,
}) => {
  useEffect(() => {
    if (!triggerOpenTestCasesSideModal && !preventGoBackToPrimaryMenu) {
      goBackToPrimaryMenu();
    }
  }, [clickedProcess]);

  useEffect(() => {
    let timer;

    if (triggerOpenTestCasesSideModal) {
      timer = setTimeout(() => {
        setActiveMenu(CHANGE_TEST_MANAGER_MENUS.VIEW_ALL_TEST_CASES);
        setTriggerOpenTestCasesSideModal(false);
      }, 300);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [triggerOpenTestCasesSideModal]);

  return (
    <div className={classes.root}>
      <CSSTransition
        in={activeMenu.value === CSS_TRANSITION_ACTIVE_MENUS.PRIMARY_MENU}
        timeout={850}
        classNames="menu-primary-Manager-Transition"
        unmountOnExit
      >
        <PrimarySettingsMenu
          setShowIsProcessStatusChanged={setShowIsProcessStatusChanged}
          setActiveMenu={setActiveMenu}
          isProcessManagerView={isProcessManagerView}
          isTestManagerView={isTestManagerView}
          isAgentManagerView={isAgentManagerView}
          clickedProcess={clickedProcess}
          onExecuteTestSuite={onExecuteTestSuite}
          setShowMoveElementToArchive={setShowMoveElementToArchive}
          setShowDeleteElementModal={setShowDeleteElementModal}
          setShowAgentManagerModal={setShowAgentManagerModal}
          exportProcess={exportProcess}
          isExportProcessLoading={isExportProcessLoading}
          setShowProcessManagerModal={setShowProcessManagerModal}
          exportAgent={exportAgent}
          isExportAgentLoading={isExportAgentLoading}
        />
      </CSSTransition>
      <CSSTransition
        in={activeMenu.value === CSS_TRANSITION_ACTIVE_MENUS.SECONDARY_MENU}
        timeout={850}
        classNames="menu-secondary-Manager-Transition"
        unmountOnExit
      >
        <div
          className={`${classes.secondary_view_root}
        ${activeMenu.component === Resources && classes.remove_padding}`}
        >
          {(() => {
            const GetComponent = activeMenu.component ?? FallBackComponent;
            return (
              <GetComponent
                goBackToPrimaryMenu={goBackToPrimaryMenu}
                setActiveMenu={setActiveMenu}
                setShowMoveElementToArchive={setShowMoveElementToArchive}
                setShowDeleteElementModal={setShowDeleteElementModal}
                filterQuery={filterQuery}
                setFilterQuery={setFilterQuery}
                viewBackupFilters={viewBackupFilters}
                isTestManagerView={isTestManagerView}
                isProcessManagerView={isProcessManagerView}
                isAgentManagerView={isAgentManagerView}
                clickedProcess={clickedProcess}
                setAddNewElementFormCollector={setAddNewElementFormCollector}
                addNewElementFormCollector={addNewElementFormCollector}
                isUpdateElementLoading={isUpdateElementLoading}
                setShowAddNewTestCaseModal={setShowAddNewTestCaseModal}
                showSettingsSideDrawer={showSettingsSideDrawer}
                setShowSettingsSideDrawer={setShowSettingsSideDrawer}
                isAddNewCaseApiLoading={isAddNewCaseApiLoading}
                addNewTestCaseToSuite={addNewTestCaseToSuite}
                setAddNewTestCaseFormCollector={setAddNewTestCaseFormCollector}
                saveButtonConfigurations={saveButtonConfigurations}
                setSaveButtonConfigurations={setSaveButtonConfigurations}
                setIsAddWidgetModalOpen={setIsAddWidgetModalOpen}
                setIsAddPhoneNumberModalOpen={setIsAddPhoneNumberModalOpen}
                setClickedProcess={setClickedProcess}
                setPreventGoBackToPrimaryMenu={setPreventGoBackToPrimaryMenu}
                tabValue={tabValue}
                onTabChange={onTabChange}
                setShowUnsavedChangesModalOpen={setShowUnsavedChangesModalOpen}
                showUnsavedChangesModalOpen={showUnsavedChangesModalOpen}
              />
            );
          })()}
        </div>
      </CSSTransition>
    </div>
  );
};

export default SettingsSideDrawer;

HorizontalLine.propTypes = {
  addMargin: PropTypes.bool,
};

PrimarySettingsMenu.propTypes = {
  isProcessManagerView: PropTypes.bool,
  isTestManagerView: PropTypes.bool,
  isAgentManagerView: PropTypes.bool,
  setShowIsProcessStatusChanged: PropTypes.func,
  clickedProcess: PropTypes.object,
  setActiveMenu: PropTypes.func,
  onExecuteTestSuite: PropTypes.func,
};

SettingsSideDrawer.propTypes = {
  isProcessManagerView: PropTypes.bool,
  isTestManagerView: PropTypes.bool,
  isAgentManagerView: PropTypes.bool,
  setShowIsProcessStatusChanged: PropTypes.func,
  setShowMoveElementToArchive: PropTypes.func,
  setShowDeleteElementModal: PropTypes.func,
  filterQuery: PropTypes.object,
  setFilterQuery: PropTypes.func,
  viewBackupFilters: PropTypes.object,
  clickedProcess: PropTypes.object,
  setAddNewElementFormCollector: PropTypes.func,
  addNewElementFormCollector: PropTypes.object,
  isUpdateElementLoading: PropTypes.bool,
  setActiveMenu: PropTypes.func,
  activeMenu: PropTypes.object,
  goBackToPrimaryMenu: PropTypes.func,
  setShowAddNewTestCaseModal: PropTypes.func,
  showSettingsSideDrawer: PropTypes.bool,
  triggerOpenTestCasesSideModal: PropTypes.bool,
  isAddNewCaseApiLoading: PropTypes.bool,
  setAddNewTestCaseFormCollector: PropTypes.func,
  addNewTestCaseToSuite: PropTypes.func,
  setTriggerOpenTestCasesSideModal: PropTypes.func,
  saveButtonConfigurations: PropTypes.object,
  setSaveButtonConfigurations: PropTypes.func,
  onExecuteTestSuite: PropTypes.func,
};
