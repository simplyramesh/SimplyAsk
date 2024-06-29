import '../../styles/drawer.css';

import React, { memo, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { TransformComponent } from 'react-zoom-pan-pinch';
import { useRecoilState, useRecoilValue } from 'recoil';
import { WorkflowEditorConfig } from '../../WorkflowEditorConfig';
import { editingStep, workflowEditorSidebars } from '../../store/selectors';
import tabsSingleScreenDataSchema from '../WorkflowEditorCore/sideModalSchemas/singleScreenSideModalSchema';
import SingleScreenDynamicSideModal from '../WorkflowEditorSidebar/SingleScreenDynamicSideModal/SingleScreenDynamicSideModal';
import Layout from '../diagram/Layout/Layout';
import { SideMenu } from '../sideMenu';

import CustomSidebar from '../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import { StyledText } from '../../../shared/styles/styled';
import { workflowSettingsState } from '../../store';
import { SIDEBAR_TYPES } from '../../utils/sidebar';
import ProcessDetailsSidebar from '../WorkflowEditorSidebar/ProcessDetails/ProcessDetailsSidebar';
import { StyledWorkflowEditorDrawer, StyledWorkflowEditorDrawerComponent } from './StyledFlowEditorDrawer';

const DynamicSideDrawers = () => {
  const config = useContext(WorkflowEditorConfig);
  const [showSingleScreenTransitionSideModal, setShowSingleScreenTransitionSideModal] = useState(true);

  return (
    <SingleScreenDynamicSideModal
      showModal={showSingleScreenTransitionSideModal}
      setShowModal={setShowSingleScreenTransitionSideModal}
      onFilter={config.api.getWorkflowStepDelegatesFilter}
      tabsSingleScreenDataSchema={tabsSingleScreenDataSchema}
    />
  );
};

const WorkflowEditorDrawer = () => {
  const editingStepData = useRecoilValue(editingStep);
  const config = useContext(WorkflowEditorConfig);

  const [sidebars, setSetSidebars] = useRecoilState(workflowEditorSidebars);
  const [settingsTab, setSettingsTab] = useRecoilState(workflowSettingsState);

  const renderSidebars = () => {
    if (config.isReadOnly) return null;

    const sidebarsNames = Object.keys(sidebars);
    const openedSidebar = sidebarsNames.find((name) => sidebars[name]);

    const validateProcessDetails = () => !settingsTab.displayName;

    const handleCustomSidebarClose = () => {
      const isError = validateProcessDetails();

      if (!isError) {
        setSetSidebars({ type: openedSidebar, open: false });
      } else {
        toast.error('Valid Process details are required');
      }
    };

    if (openedSidebar) {
      return (
        <CustomSidebar
          open={!!openedSidebar}
          onClose={handleCustomSidebarClose}
          headStyleType="filter"
          headerTemplate={
            <StyledText size={19} weight={600}>
              Process Details
            </StyledText>
          }
        >
          {() => {
            return (
              openedSidebar === SIDEBAR_TYPES.PROCESS_DETAILS && (
                <ProcessDetailsSidebar settingsTab={settingsTab} setSettingsTab={setSettingsTab} />
              )
            );
          }}
        </CustomSidebar>
      );
    }

    return editingStepData ? <SideMenu step={editingStepData} /> : <DynamicSideDrawers />;
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    <StyledWorkflowEditorDrawer pattern tabIndex={0}>
      {renderSidebars()}
      <TransformComponent contentClass={StyledWorkflowEditorDrawerComponent}>
        <Layout />
      </TransformComponent>
    </StyledWorkflowEditorDrawer>
  );
};

export default memo(WorkflowEditorDrawer);
