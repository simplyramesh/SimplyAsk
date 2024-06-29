import { useTheme } from '@mui/material/styles';
import { useState, memo } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';

import { useGetAllAgents } from '../../../../../ConverseDashboard/hooks/useGetAllAgents';
import ConfirmationModal from '../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StyledDivider } from '../../../../../shared/styles/styled';
import FlowEditorHead from '../../../../shared/components/FlowEditorHead/FlowEditorHead';
import SettingsControl from '../../../../shared/components/SettingsControl/SettingsControl';
import ZoomControl from '../../../../shared/components/ZoomControl/ZoomControl';
import AgentManagerDuplicateModal from '../../../AgentManagerModals/AgentManagerDuplicateModal/AgentManagerDuplicateModal';
import useDuplicateAgent from '../../../hooks/useDuplicateAgent';
import { agentEditorState } from '../../store';
import HeadContextMenu from '../ContextMenus/SettingsContextMenu/SettingsContextMenu';

import AgentEditorHeadControls from './AgentEditorHeadControls';

const AgentEditorHead = () => {
  const { colors } = useTheme();
  const { serviceTypeId } = useParams();

  const { settings } = useRecoilValue(agentEditorState);

  const [isConnectAgentModalOpen, setIsConnectAgentModalOpen] = useState(false);
  const [agentDuplicationModal, setAgentDuplicationModal] = useState(null);

  const { duplicateAgent, isDuplicateAgentLoading } = useDuplicateAgent({
    onSuccess: () => {
      setAgentDuplicationModal(null);

      // TODO customize toast with link
      toast.success('Agent was successfully duplicated');
    },
    onError: () => toast.error('Something went wrong!'),
  });

  const { allAgents: allAgentsOptions } = useGetAllAgents(
    new URLSearchParams({
      pageSize: 999,
    }),
    {
      select: (res) => res?.content || [],
      enabled: !!agentDuplicationModal,
    }
  );

  const onDuplicateAgentClick = () => {
    setAgentDuplicationModal({ ...settings, agentId: serviceTypeId });
  };

  return (
    <>
      <FlowEditorHead
        title={settings?.name}
        leftControls={
          <>
            <SettingsControl>
              <HeadContextMenu onDuplicateAgentClick={onDuplicateAgentClick} />
            </SettingsControl>
            <StyledDivider orientation="vertical" borderWidth={2} height="39px" color={colors.frenchGray} />
            <ZoomControl />
          </>
        }
        rightControls={<AgentEditorHeadControls />}
      />

      <ConfirmationModal
        isOpen={isConnectAgentModalOpen}
        onClose={() => setIsConnectAgentModalOpen(false)}
        onCancelClick={() => setIsConnectAgentModalOpen(false)}
        onSuccessClick={() => {}}
        modalIcon="UNDRAW_SHARE_LINK"
        modalIconSize={176}
        successBtnText="Configure Channels"
        cancelBtnText="No Thanks"
        title="Connect Your Agent"
        text={
          'Looks like you haven\'t connected your Agent to any communication channels yet. Click on "Configure Channels" to connect your Agent.'
        }
      />

      {!!agentDuplicationModal && !!allAgentsOptions?.length && (
        <AgentManagerDuplicateModal
          data={agentDuplicationModal}
          onClose={() => setAgentDuplicationModal(null)}
          duplicateAgent={duplicateAgent}
          isLoading={isDuplicateAgentLoading}
          allAgentsOptions={allAgentsOptions}
        />
      )}
    </>
  );
};

export default memo(AgentEditorHead);
