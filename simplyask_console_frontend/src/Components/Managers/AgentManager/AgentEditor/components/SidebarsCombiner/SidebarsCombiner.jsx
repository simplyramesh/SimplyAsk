import React, { memo } from 'react';
import CustomSidebar from '../../../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import { SIDEBAR_TYPES } from '../../utils/sidebar';
import AgentDetailsSideBar from '../sideForms/AgentDetails/AgentDetailsSideBar';
import AdvancedSettingsSidebar from '../sideForms/AdvancedSettings/AdvancedSettingsSidebar';
import IntentsView from '../sideForms/Intents/IntentsView/IntentsView';
import StepItemSidebar from '../sideForms/Sidebar/StepItemSidebar';
import StepsSidebar from '../sideForms/StepsSidebar/StepsSidebar';
import { useRecoilState, useRecoilValue } from 'recoil';
import { agentEditorSidebars, agentEditorStepItem } from '../../store';
import ConfigureChannelsSidebar from '../sideForms/ConfigureChannels/ConfigureChannelsSidebar';

const SidebarsCombiner = () => {
  const [sidebarOpened, setSidebarOpened] = useRecoilState(agentEditorSidebars);
  const stepItemOpened = useRecoilValue(agentEditorStepItem);

  const { type, width } = sidebarOpened || {};

  return (
    <>
      {stepItemOpened ? <StepItemSidebar /> : <StepsSidebar />}

      <CustomSidebar
        open={!!type}
        onClose={() => setSidebarOpened(null)}
        headStyleType="filter"
        width={width}
      >
        {(customActionsRef) => (
          <>
            {type === SIDEBAR_TYPES.AGENT_DETAILS && <AgentDetailsSideBar customActionsRef={customActionsRef} />}
            {type === SIDEBAR_TYPES.ADVANCED_SETTINGS && <AdvancedSettingsSidebar customActionsRef={customActionsRef} />}
            {type === SIDEBAR_TYPES.INTENT && <IntentsView customActionsRef={customActionsRef} />}
            {type === SIDEBAR_TYPES.CONFIGURE_CHANNELS && <ConfigureChannelsSidebar customActionsRef={customActionsRef} />}
          </>
        )}
      </CustomSidebar>
    </>
  )
};

export default memo(SidebarsCombiner);
