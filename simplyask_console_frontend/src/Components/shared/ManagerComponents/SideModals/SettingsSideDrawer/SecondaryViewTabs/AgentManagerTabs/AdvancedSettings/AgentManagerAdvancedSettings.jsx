import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';

import useTabs from '../../../../../../../../hooks/useTabs';
import { getAgentDetails } from '../../../../../../../../Services/axios/agentManager';
import { agentEditorState } from '../../../../../../../Managers/AgentManager/AgentEditor/store';
import { AGENT_QUERY_KEYS } from '../../../../../../../Managers/AgentManager/constants/core';
import useUpdateAgent from '../../../../../../../Managers/AgentManager/hooks/useUpdateAgent';
import TransferSettings from '../../../../../../../Settings/Components/FrontOffice/components/DefaultAgentAdvancedSettings/TransferSettings/TransferSettings';
import UserIdentification from '../../../../../../../Settings/Components/FrontOffice/components/DefaultAgentAdvancedSettings/UserIdentification/UserIdentification';
import useGetDefaultAgentConfig from '../../../../../../../Settings/Components/FrontOffice/hooks/DefaultAgentAdvancedSettingHooks/useGetDefaultAgentConfig';
import { getAgentConfigInitialData } from '../../../../../../../Settings/Components/FrontOffice/utils/helpers';
import PanelNavTabs from '../../../../../../PanelNavTabs/PanelNavTabs';
import { StyledButton } from '../../../../../../REDISIGNED/controls/Button/StyledButton';
import Spinner from '../../../../../../Spinner/Spinner';
import { StyledFlex, StyledText } from '../../../../../../styles/styled';
import classes from '../../SharedComponents/ArchiveOrDeleteProcess/ArchiveOrDeleteProcess.module.css';

const AgentManagerAdvancedSettings = ({ goBackToPrimaryMenu, clickedProcess }) => {
  const TABS = [{ title: 'Transfer Settings' }, { title: 'User Identification' }];

  const { tabValue, onTabChange } = useTabs(0);

  const [agentConfig, setAgentConfig] = useState(getAgentConfigInitialData());
  const [agent, setAgent] = useRecoilState(agentEditorState);
  const [defaultConfig, setDefaultConfig] = useState();

  const { isFetching: isAgentConfigFetching } = useQuery({
    queryKey: [AGENT_QUERY_KEYS.GET_AGENT_DETAILS, clickedProcess.agentId],
    queryFn: () => getAgentDetails(clickedProcess.agentId),
    onSuccess: (d) => setAgent(d),
  });

  const { updateAgentById } = useUpdateAgent({
    onSuccess: () => toast.success('The agent advance settings has been updated'),
    onError: () => toast.error('Something went wrong...'),
  });

  const { isFetching: isDefaultConfigFetching } = useGetDefaultAgentConfig({
    onSuccess: (agentConfig) => {
      setDefaultConfig({ ...getAgentConfigInitialData(agentConfig), ...agentConfig });
    },
  });

  useEffect(() => {
    if (defaultConfig && agent) {
      const isDefaultConfigSet = agent.agentConfiguration.useDefaultConfiguration;

      setAgentConfig(isDefaultConfigSet ? defaultConfig : agent.agentConfiguration.manualConfig);
    }
  }, [defaultConfig, agent]);

  const onSaveHandler = () => updateAgentById({
      ...clickedProcess,
      ...agent,
      agentConfiguration: {
        useDefaultConfiguration: false,
        manualConfig: agentConfig,
      },
    });

  if (isAgentConfigFetching || isDefaultConfigFetching) return <Spinner parent />;
  return (
    <StyledFlex position="relative" height="100%" p="16px 0" ml="-18px">
      <StyledFlex position="absolute" top="-40px" right="20px">
        <StyledButton primary variant="contained" position="absolute" onClick={onSaveHandler}>
          Save
        </StyledButton>
      </StyledFlex>

      <StyledFlex p="0 25px" direction="row" gap="15px" mt="5px" mb="20px">
        <KeyboardBackspaceIcon className={classes.backBtnIcon} onClick={goBackToPrimaryMenu} />
        <StyledText size="19" weight={600}>
          Advanced Settings
        </StyledText>
      </StyledFlex>

      <PanelNavTabs labels={TABS} value={tabValue} onChange={onTabChange} />

      <Scrollbars>
        <StyledFlex p="20px 30px 75px" flexGrow="1">
          {tabValue === 0 && (
            <TransferSettings
              onChange={(e) => setAgentConfig((prev) => ({ ...prev, ...e }))}
              agentConfig={agentConfig}
              isPanelView
            />
          )}

          {tabValue === 1 && (
            <UserIdentification
              agentConfig={agentConfig}
              isPanelView
              onChange={(e) => setAgentConfig((prev) => ({ ...prev, ...e }))}
            />
          )}
        </StyledFlex>
      </Scrollbars>
    </StyledFlex>
  );
};

export default AgentManagerAdvancedSettings;
