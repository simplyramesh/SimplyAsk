import styled from '@emotion/styled';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import SvgIcon from '@mui/material/SvgIcon';
import { useTheme } from '@mui/system';
import Scrollbars from 'react-custom-scrollbars-2';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useRecoilState, useRecoilValue } from 'recoil';

import { getFilteredChatWidgets } from '../../../../../../../../Services/axios/widgetAxios';
import useUpdateAgent from '../../../../../../../Managers/AgentManager/hooks/useUpdateAgent';
import { WIDGETS_QUERY_KEYS } from '../../../../../../../Settings/Components/FrontOffice/constants/common';
import { StyledFlex, StyledText } from '../../../../../../styles/styled';
import useGetAllPhoneNumberIds from '../../../../../../../../hooks/phoneNumberManagement/useGetAllPhoneNumberIds';
import ChatWidgetTab from './ConfigureChannelsTabs/ChatWidgetTab';
import PanelNavTabs from '../../../../../../PanelNavTabs/PanelNavTabs';
import PhoneNumberTab from './ConfigureChannelsTabs/PhoneNumberTab';
import {
  agentEditorAssociatedPhoneNumbers,
  agentEditorAssociatedWidgets,
} from '../../../../../../../Managers/AgentManager/AgentEditor/store';

const StyledScrollbars = styled(Scrollbars)`
  & > div {
    padding-bottom: 60px;
  }
`;

const RoundedCount = ({ count }) => {
  const { colors } = useTheme();

  return (
    <StyledFlex
      width="25px"
      height="25px"
      borderRadius="50%"
      backgroundColor={colors.lightLinkColor}
      alignItems="center"
      justifyContent="center"
      color={colors.linkColor}
      fontWeight={700}
    >
      {count}
    </StyledFlex>
  );
};

const ConfigureChannels = ({
  goBackToPrimaryMenu,
  setClickedProcess,
  clickedProcess,
  setIsAddWidgetModalOpen,
  setIsAddPhoneNumberModalOpen,
  setPreventGoBackToPrimaryMenu,
  tabValue,
  onTabChange,
  isAgentEditorSettingsView = false,
}) => {
  const { colors } = useTheme();
  const queryClient = useQueryClient();

  const [agentEditorWidgets, setAgentEditorWidgets] = useRecoilState(agentEditorAssociatedWidgets);

  const agentEditorPhoneNumbers = useRecoilValue(agentEditorAssociatedPhoneNumbers);

  const agentEditorWidgetsIdsArray = agentEditorWidgets.map(({ widgetId }) => widgetId);
  const agentEditorPhoneNumbersIdsArray = agentEditorPhoneNumbers.map(({ telephoneNumberId }) => telephoneNumberId);

  const chatWidgetIds =
    (isAgentEditorSettingsView ? agentEditorWidgetsIdsArray : clickedProcess?.associatedWidgets)
      ?.map((id) => id)
      .join(',') || null;

  const associatedPhoneNumberIds =
    (isAgentEditorSettingsView ? agentEditorPhoneNumbersIdsArray : clickedProcess?.associatedPhoneNumbers)
      ?.map((id) => id)
      .join(',') || null;

  const { data: filteredWidgets, isFetching: isWidgetsFetching } = useQuery({
    queryFn: () => getFilteredChatWidgets(`widgetIds=${chatWidgetIds}&pageSize=999`),
    queryKey: ['getAllFilteredWidgets', chatWidgetIds],
    enabled: !!chatWidgetIds,
    select: (res) => res?.content,
  });

  const { filteredPhoneNumberIds, isPhoneNumberIdsFetching } = useGetAllPhoneNumberIds(associatedPhoneNumberIds);

  const { updateAgentById, isUpdateAgentByIdLoading } = useUpdateAgent({
    onSuccess: (data) => {
      toast.success('The chat widget has been removed successfully');
      setClickedProcess(data);

      queryClient.invalidateQueries({
        queryKey: [WIDGETS_QUERY_KEYS.GET_CHAT_WIDGETS_FILTERED],
      });

      setTimeout(() => {
        setPreventGoBackToPrimaryMenu?.(false);
      }, 3000);
    },
    onError: () => {
      toast.error('Something went wrong...');
      setPreventGoBackToPrimaryMenu?.(false);
    },
  });

  const removeWidgetFromAgent = (removedWidgetId) => {
    if (isAgentEditorSettingsView) {
      const updatedWidgets = agentEditorWidgets.filter(({ widgetId }) => widgetId !== removedWidgetId);

      setAgentEditorWidgets(updatedWidgets);
    } else {
      setPreventGoBackToPrimaryMenu?.(true);

      const payload = {
        agentId: clickedProcess.agentId,
        ...{
          ...clickedProcess,
          associatedWidgets: clickedProcess?.associatedWidgets?.filter((widgetId) => widgetId !== removedWidgetId),
        },
      };

      updateAgentById(payload);
    }
  };

  const TABS_ARRAY = [
    { title: 'Chat Widgets', Icon: <RoundedCount count={filteredWidgets?.length || 0} /> },
    { title: 'Phone Numbers', Icon: <RoundedCount count={filteredPhoneNumberIds?.length || 0} /> },
  ];

  const sharedWidgetProps = {
    filteredWidgets,
    loading: isWidgetsFetching || isUpdateAgentByIdLoading,
    setIsAddWidgetModalOpen,
    removeWidgetFromAgent,
    clickedProcess,
  };

  const renderTabs = () => {
    switch (tabValue) {
      case 0:
        return <ChatWidgetTab {...sharedWidgetProps} />;
      case 1:
        return (
          <PhoneNumberTab
            setIsAddPhoneNumberModalOpen={setIsAddPhoneNumberModalOpen}
            filteredPhoneNumberIds={filteredPhoneNumberIds}
            loading={isPhoneNumberIdsFetching}
          />
        );
      default:
        return <ChatWidgetTab {...sharedWidgetProps} />;
    }
  };

  return (
    <StyledFlex height="100%" marginLeft="-15px">
      <StyledFlex
        direction="row"
        gap="15px"
        mt="5px"
        alignItems="center"
        padding="15px 30px 0 23px"
        marginBottom="20px"
      >
        {goBackToPrimaryMenu ? (
          <SvgIcon
            component={KeyboardBackspaceIcon}
            onClick={goBackToPrimaryMenu}
            sx={{
              width: '32px',
              height: '27px',
              cursor: 'pointer',
              color: colors.primaryColourHex,
              borderRadius: '50%',
              transition: 'all 160ms ease-in',

              '&:hover': {
                background: colors.galleryGray,
              },
            }}
          />
        ) : null}

        <StyledText weight={600} size={19}>
          Configure Channels
        </StyledText>
      </StyledFlex>

      <PanelNavTabs labels={TABS_ARRAY} value={tabValue} onChange={onTabChange} />

      <StyledScrollbars>{renderTabs()}</StyledScrollbars>
    </StyledFlex>
  );
};

export default ConfigureChannels;
