import { useState } from 'react';
import Spinner from '../../../../../shared/Spinner/Spinner';
import { StyledCard, StyledFlex } from '../../../../../shared/styles/styled';
import useGetDefaultAgentConfig from '../../hooks/DefaultAgentAdvancedSettingHooks/useGetDefaultAgentConfig';
import useSaveDefaultAgentConfig from '../../hooks/DefaultAgentAdvancedSettingHooks/useSaveDefualtAgentConfig';
import { getAgentConfigInitialData } from '../../utils/helpers';
import TransferSettings from './TransferSettings/TransferSettings';
import UserIdentification from './UserIdentification/UserIdentification';

const DefaultAgentAdvancedSettings = () => {
  const [agentConfig, setAgentConfig] = useState(getAgentConfigInitialData());
  const [userChanges, setUserChanges] = useState({});

  const updateAgentConfigFromResponse = (apiResponse, changes = {}) => {
    let mergedConfig = { ...getAgentConfigInitialData(apiResponse), ...apiResponse, ...changes };

    if (!changes.collectFullName && (mergedConfig.collectFirstName || mergedConfig.collectLastName)) {
      mergedConfig.collectFullName = '';
    }

    return mergedConfig;
  };

  const { saveAgentDefaultSetting } = useSaveDefaultAgentConfig({
    onSuccess: (data) => {
      const updatedConfig = updateAgentConfigFromResponse(data, userChanges);
      setAgentConfig(updatedConfig);
      setUserChanges({});
    },
  });

  const { isFetching } = useGetDefaultAgentConfig({
    onSuccess: (agentConfig) => {
      const updatedConfig = updateAgentConfigFromResponse(agentConfig);
      setAgentConfig(updatedConfig);
    },
  });

  const handleUserChange = (changes) => {
    setUserChanges((prev) => ({ ...prev, ...changes }));
    saveAgentDefaultSetting({
      ...agentConfig,
      ...changes,
    });
  };

  if (isFetching) return <Spinner parent />;

  return (
    <StyledFlex gap="36px" p="24px 0" width="1150px">
      <StyledCard p="30px">
        <TransferSettings
          agentConfig={agentConfig}
          onChange={(event) => {
            saveAgentDefaultSetting({
              ...agentConfig,
              ...event,
            });
          }}
        />
      </StyledCard>

      <StyledCard p="30px">
        <UserIdentification agentConfig={agentConfig} onChange={handleUserChange} />
      </StyledCard>
    </StyledFlex>
  );
};

export default DefaultAgentAdvancedSettings;
