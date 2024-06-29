import React, { useEffect, useState } from 'react';
import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';

import PanelNavTabs from '../../../../../../shared/PanelNavTabs/PanelNavTabs';
import Scrollbars from 'react-custom-scrollbars-2';
import TransferSettings from '../../../../../../Settings/Components/FrontOffice/components/DefaultAgentAdvancedSettings/TransferSettings/TransferSettings';
import UserIdentification from '../../../../../../Settings/Components/FrontOffice/components/DefaultAgentAdvancedSettings/UserIdentification/UserIdentification';
import useTabs from '../../../../../../../hooks/useTabs';
import useGetDefaultAgentConfig from '../../../../../../Settings/Components/FrontOffice/hooks/DefaultAgentAdvancedSettingHooks/useGetDefaultAgentConfig';
import { getAgentConfigInitialData } from '../../../../../../Settings/Components/FrontOffice/utils/helpers';
import { useRecoilState } from 'recoil';
import { agentEditorAgentConfiguration } from '../../../store';
import Spinner from '../../../../../../shared/Spinner/Spinner';

const AdvancedSettingsSidebar = () => {
  const [agentConfig, setAgentConfig] = useRecoilState(agentEditorAgentConfiguration);
  const [defaultConfig, setDefaultConfig] = useState();
  const [configState, setConfigState] = useState();

  const TABS = [{ title: 'Transfer Settings' }, { title: 'User Identification' }];

  const { tabValue, onTabChange } = useTabs(0);

  const { isFetching: isDefaultConfigFetching } = useGetDefaultAgentConfig({
    onSuccess: (agentConfig) => {
      setDefaultConfig({ ...getAgentConfigInitialData(agentConfig), ...agentConfig });
    },
  });

  useEffect(() => {
    if (agentConfig && defaultConfig && !configState) {
      setConfigState(agentConfig.useDefaultConfiguration ? defaultConfig : agentConfig.manualConfig);
    }
  }, [agentConfig, defaultConfig]);

  const onConfigChange = (event) => {
    setConfigState((prev) => ({ ...prev, ...event }));
    setAgentConfig((prev) => ({
      useDefaultConfiguration: false,
      manualConfig: {
        ...(prev.manualConfig || defaultConfig),
        ...event,
      },
    }));
  };

  if (!configState || isDefaultConfigFetching) return <Spinner inline />;

  return (
    <StyledFlex display="flex" gap="16px" height="100%">
      <StyledFlex p="0 28px">
        <StyledText weight={600} size={19}>
          Advanced Settings
        </StyledText>
      </StyledFlex>

      <StyledFlex m="0" flex={1}>
        <PanelNavTabs labels={TABS} value={tabValue} onChange={onTabChange} />

        <Scrollbars>
          <StyledFlex p="20px 30px 75px" flexGrow="1">
            {tabValue === 0 && <TransferSettings agentConfig={configState} onChange={onConfigChange} isPanelView />}

            {tabValue === 1 && <UserIdentification agentConfig={configState} onChange={onConfigChange} isPanelView />}
          </StyledFlex>
        </Scrollbars>
      </StyledFlex>
    </StyledFlex>
  );
};

export default AdvancedSettingsSidebar;
