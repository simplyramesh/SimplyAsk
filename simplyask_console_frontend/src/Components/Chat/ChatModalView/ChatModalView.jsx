import { Close, Fullscreen } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useNavigate } from 'react-router-dom';

import routes from '../../../config/routes';
import { useConversation } from '../../../contexts/ConversationContext';
import useTabs from '../../../hooks/useTabs';
import Chatbar from '../Chatbar';
import ChatBoxModalView from './ChatBoxModalView/ChatBoxModalView';
import SearchBar from '../../shared/SearchBar/SearchBar';
import { StyledFlex, StyledText } from '../../shared/styles/styled';
import { useTheme } from '@mui/material';
import EmptyTable from '../../shared/REDISIGNED/table-v2/EmptyTable/EmptyTable';
import Tabs from '../../shared/NavTabs/Tabs/Tabs';

const TAB_VALUES = { PRIMARY: 0, REQUESTS: 1 };

const ChatModalView = ({ closeModal, openAttachModal }) => {
  const navigate = useNavigate();

  const getConversationByType = () => tabValue === TAB_VALUES.PRIMARY ? [...primaryConvs, ...reClsdConvs] : requestConvs;

  const { colors } = useTheme();
  const [filteredConversations, setFilteredConversations] = useState([]);
  const { tabValue, setTabValue, onTabChange } = useTabs(TAB_VALUES.PRIMARY);
  const {
    primaryConvs,
    requestConvs,
    reClsdConvs,
    selectConversation,
    selectedConversationId,
    unreadPrimaryCount,
    unreadRequestsCount,
  } = useConversation();

  useEffect(() => {
    setFilteredConversations(getConversationByType());
  }, [tabValue, primaryConvs, requestConvs, reClsdConvs]);

  const fullScreenHandler = () => {
    navigate(`${routes.CHAT}`);
    closeModal()
  };

  const searchBarHandler = (event) => {
    const query = event.target.value.toLowerCase();

    setFilteredConversations(
      query.length
        ? getConversationByType().filter(({ name }) => name?.toLowerCase().includes(query))
        : getConversationByType()
    );
  };


  return (
    <StyledFlex width="100%" height="100%" backgroundColor={colors.white}>
      {selectedConversationId ? (
        <ChatBoxModalView setTabValue={setTabValue} openAttachModal={openAttachModal} />
      ) : (
        <>
          <StyledFlex p="24px 24px 0" backgroundColor={colors.cardGridItemBorder} alignItems="center">
            <StyledFlex flexDirection="row" justifyContent="space-between" alignItems="center" width="100%" mb={2}>
              <Close onClick={closeModal}  />
              <StyledText size={24} weight={600}>Chat</StyledText>
              <Fullscreen onClick={fullScreenHandler} />
            </StyledFlex>

            <StyledFlex mb={2} width="100%">
              <SearchBar
                placeholder="Search Messages..."
                width="100%"
                onChange={searchBarHandler}
              />
            </StyledFlex>

            <Tabs
              tabs={[
                { title: 'Active', unread: unreadPrimaryCount },
                { title: 'Pending', unread: unreadRequestsCount },
              ]}
              margin="32px"
              value={tabValue}
              onChange={onTabChange}
            />
          </StyledFlex>
          <Scrollbars autoHide>
            <StyledFlex p="8px 24px" gap="8px">
              {filteredConversations.length === 0 && (
                <EmptyTable
                  hideTitle
                  message={`No ${tabValue === TAB_VALUES.PRIMARY ? 'Active' : 'Pending'} Chats`}
                />
              )}
              {filteredConversations.map(
                ({
                  sessionId, name, lastModified, lastMessage, userMessageReadStatus, supportStatus,
                }, index) => (
                  <Chatbar
                    id={sessionId}
                    name={name}
                    timestamp={lastModified}
                    message={`${lastMessage.message.contents.fromName || 'Unknown User'}${
                      typeof lastMessage.message.contents.data === 'string'
                        ? `: ${lastMessage.message.contents.data}`
                        : ' sent a file'
                    }`}
                    unread={userMessageReadStatus === 'UNREAD' && !supportStatus.startsWith('CLOSED')}
                    isClosed={supportStatus.startsWith('CLOSED')}
                    onClick={selectConversation}
                    key={index}
                  />
                ),
              )}
            </StyledFlex>
          </Scrollbars>
        </>
      )}
    </StyledFlex>
  );
};

export default ChatModalView;

ChatModalView.propTypes = {
  closeModal: PropTypes.func.isRequired,
  openAttachModal: PropTypes.func.isRequired,
};
