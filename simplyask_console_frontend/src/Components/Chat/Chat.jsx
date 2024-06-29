import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';

import { useConversation } from '../../contexts/ConversationContext';
import useTabs from '../../hooks/useTabs';
import Chatbar from './Chatbar';
import ChatBox from './ChatBox/ChatBox';
import SearchBar from '../shared/SearchBar/SearchBar';
import { StyledFlex } from '../shared/styles/styled';
import { useTheme } from '@mui/material';
import EmptyTable from '../shared/REDISIGNED/table-v2/EmptyTable/EmptyTable';
import Tabs from '../shared/NavTabs/Tabs/Tabs';


const TAB_VALUES = { PRIMARY: 0, REQUESTS: 1 };

const Chat = () => {
  const { colors, boxShadows } = useTheme();

  const getConversationByType = () => tabValue === TAB_VALUES.PRIMARY ? [...primaryConvs, ...reClsdConvs] : requestConvs;

  const { tabValue, onTabChange, setTabValue } = useTabs(TAB_VALUES.PRIMARY);
  const [filteredConversations, setFilteredConversations] = useState([]);

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

  const searchBarHandler = (event) => {
    const query = event.target.value.toLowerCase();

    setFilteredConversations(
      query.length
        ? getConversationByType().filter(({ name }) => name?.toLowerCase().includes(query))
        : getConversationByType()
    );
  };

  return (
    <StyledFlex p="30px" height="100%">
      <StyledFlex direction="row" gap="40px" height="100%">
        <StyledFlex width="25%" flexShrink={0} minWidth="370px" boxShadow={boxShadows.box} borderRadius="10px">
          <StyledFlex
            p="24px 24px 0"
            gap="8px"
            alignItems="center"
            justifyContent="center"
            backgroundColor={colors.cardGridItemBorder}
            borderRadius="10px 10px 0 0"
          >
            <StyledFlex width="100%">
              <SearchBar
                placeholder="Search Messages..."
                onChange={searchBarHandler}
                width="100%"
              />
            </StyledFlex>
            <Tabs
              tabs={[
                { title: 'Primary', unread: unreadPrimaryCount },
                { title: 'Requests', unread: unreadRequestsCount },
              ]}
              margin="16px"
              value={tabValue}
              onChange={onTabChange}
            />
          </StyledFlex>
          <Scrollbars autoHide>
            {filteredConversations.length === 0 && (
              <EmptyTable
                hideTitle
                message={`No ${tabValue === TAB_VALUES.PRIMARY ? 'Active' : 'Pending'} Chats`}
              />
            )}
            { filteredConversations.length > 0 &&
            <StyledFlex>
              {filteredConversations.map(
                ({
                  sessionId, name, lastModified, lastMessage, userMessageReadStatus, supportStatus,
                }, index) => (
                  <Chatbar
                    id={sessionId}
                    name={name || 'Unknown User'}
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
            }
          </Scrollbars>
        </StyledFlex>
        <StyledFlex flex={1} boxShadow={boxShadows.box} borderRadius="10px" alignItems="center">
          {selectedConversationId ? (
            <ChatBox setTabValue={setTabValue} />
          ) : (
            <StyledFlex width="100%" height="100%" alignItems="center" justifyContent="center">
              <StyledFlex >
                <EmptyTable
                  hideTitle
                  message="No Conversation Selected"
                />
              </StyledFlex>
            </StyledFlex>
          )}
        </StyledFlex>
      </StyledFlex>
    </StyledFlex>
  );
};

export default Chat;
