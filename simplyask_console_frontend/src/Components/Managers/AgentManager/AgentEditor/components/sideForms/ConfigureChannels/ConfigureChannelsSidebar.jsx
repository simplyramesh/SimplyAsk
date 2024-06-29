import React, { useState } from 'react'
import { useParams } from 'react-router-dom';

import ConfigureChannels from '../../../../../../shared/ManagerComponents/SideModals/SettingsSideDrawer/SecondaryViewTabs/AgentManagerTabs/ConfigureChannels/ConfigureChannels'
import useTabs from '../../../../../../../hooks/useTabs';
import AgentManagerModalsAddWidget from '../../../../AgentManagerModals/AgentManagerModalsAddWidget';
import AgentManagerModalsAddPhoneNumber from '../../../../AgentManagerModals/AgentManagerModalPhoneNumber/AgentManagerModalsAddPhoneNumber';


const ConfigureChannelsSidebar = () => {
    const { serviceTypeId } = useParams();

    const { tabValue, onTabChange } = useTabs(0);

    const [isAddPhoneNumberModalOpen, setIsAddPhoneNumberModalOpen] = useState(false);
    const [isAddWidgetModalOpen, setIsAddWidgetModalOpen] = useState(false);

    const handleCloseSettingsAndCreateWidgetModals = () => {
        setIsAddWidgetModalOpen(false);
        setIsAddPhoneNumberModalOpen(false);
    };

    return (
        <>
            <ConfigureChannels
              clickedProcess={{ agentId: serviceTypeId }}
              setIsAddWidgetModalOpen={setIsAddWidgetModalOpen}
              setIsAddPhoneNumberModalOpen={setIsAddPhoneNumberModalOpen}
              tabValue={tabValue}
              onTabChange={onTabChange}
              isAgentEditorSettingsView
            />

            <AgentManagerModalsAddWidget
              open={isAddWidgetModalOpen}
              onClose={() => setIsAddWidgetModalOpen(false)}
              onCloseSettingsAndCreateWidgetModals={handleCloseSettingsAndCreateWidgetModals}
              isAgentEditorSettingsView
            />

            <AgentManagerModalsAddPhoneNumber
              open={isAddPhoneNumberModalOpen}
              onClose={() => setIsAddPhoneNumberModalOpen(false)}
              onCloseSettingsAndCreateWidgetModals={handleCloseSettingsAndCreateWidgetModals}
              isAgentEditorSettingsView
            />
        </>
    )
}

export default ConfigureChannelsSidebar