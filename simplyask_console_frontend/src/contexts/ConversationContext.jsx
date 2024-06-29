import PropTypes from 'prop-types';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import notifTypes from '../config/notificationTypes';
import useAxiosGet from '../hooks/useAxiosGet';
import { CHAT_API } from '../Services/axios/AxiosInstance';
import { getFileDonwloadLink } from '../Services/axios/filesAxios';
import { useNotification } from './NotificationContext';
import { useGetCurrentUser } from '../hooks/useGetCurrentUser';

const MSG_TYPES = {
  TEXT: 'CHAT_TEXT',
  FILE: 'CHAT_FILE',
  AGENT_SUPPORT_SESSION_UPDATE: 'AGENT_SUPPORT_SESSION_UPDATE',
  AGENT_INIT: 'SET_AGENT_ID',
};

const MODIFIED_FIELDS = {
  LAST_MESSAGE: 'LAST_MESSAGE',
  SUPPORT_STATUS: 'SUPPORT_STATUS',
  USER_MESSAGE_READ_STATUS: 'USER_MESSAGE_READ_STATUS',
};

const CONV_TYPES = {
  primary: 'ACTIVE_SUPPORT_IN_PROGRESS',
  request: 'ACTIVE_PENDING_SUPPORT',
};

const CLOSED_TYPES = {
  user: 'CLOSED_BY_USER',
  agent: 'CLOSED_BY_AGENT',
};

const ConversationContext = createContext();

export const useConversation = () => {
  return useContext(ConversationContext);
};

export const ConversationProvider = ({ children }) => {
  const [socket, setSocket] = useState();
  const {
    response: conversations,
    setResponse: setConversations,
    fetchData: fetchConversations,
  } = useAxiosGet('/agent/support/active', true, CHAT_API, []);
  const { response: reClsdConvs, fetchData: fetchReClsdConvs } = useAxiosGet(
    '/agent/support/recentlyClosed',
    true,
    CHAT_API,
    []
  );

  const [primaryConvs, setPrimaryConvs] = useState([]);
  const [requestConvs, setRequestConvs] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState([]);
  const [selectedConversationDetails, setSelectedConversationDetails] = useState();
  const [selectedConversationId, setSelectedConversationId] = useState('');
  const [hasUnreadChat, setHasUnreadChat] = useState();
  const [unreadPrimaryCount, setUnreadPrimaryCount] = useState(0);
  const [unreadRequestsCount, setUnreadRequestsCount] = useState(0);
  const { addNotification } = useNotification();
  const { currentUser: user } = useGetCurrentUser();

  useEffect(() => {
    if (!user) return;

    const s = new WebSocket(import.meta.env.VITE_CHAT_AGENT_URL);

    const msgData = {
      id: user.id,
      profilePicture: 'https://www.w3schools.com/howto/img_avatar.png',
      organizationId: user.organization?.id,
    };

    s.onopen = () => {
      s.send(
        JSON.stringify({
          type: MSG_TYPES.AGENT_INIT,
          contents: {
            data: msgData,
            toId: undefined,
            fromName: undefined,
            fromEmail: undefined,
          },
        })
      );
    };

    setSocket(s);

    return () => s.close();
  }, [user]);

  const refreshSessions = useCallback(() => {
    fetchConversations();
    fetchReClsdConvs();
  }, [fetchConversations, fetchReClsdConvs]);

  const getSelectedConversation = useCallback(() => {
    CHAT_API.get(`/history/${selectedConversationId}`).then((res) => setSelectedConversation(res.data));
    setSelectedConversationDetails(
      [...conversations, ...reClsdConvs].find(({ sessionId }) => sessionId === selectedConversationId)
    );
  }, [selectedConversationId, conversations, reClsdConvs]);

  const addMessageToConversation = useCallback(
    (message, needsFomatting = false) => {
      setSelectedConversation((prevValue) => [
        ...prevValue,
        needsFomatting
          ? {
              message: { ...message, contents: { ...message.contents, fromId: user.id } },
              messageSource: 'AGENT',
              transmissionTime: new Date(),
            }
          : message,
      ]);
    },
    [user]
  );

  const subscribeToChat = useCallback(
    (conversationId) => {
      CHAT_API.post(`/subscribe/${conversationId}`, null, { headers: { agentSessionId: user.id } });
    },
    [user]
  );

  const unsubscribeFromChat = useCallback(
    (conversationId) => {
      CHAT_API.post(`/unsubscribe/${conversationId}`, null, { headers: { agentSessionId: user.id } });
    },
    [user]
  );

  const selectConversation = useCallback(
    (conversationId) => {
      if (conversationId === selectedConversationId) return;

      if (selectedConversationId !== '') unsubscribeFromChat(selectedConversationId);
      if (conversationId !== '') subscribeToChat(conversationId);
      setSelectedConversationId(conversationId);
    },
    [selectedConversationId, subscribeToChat, unsubscribeFromChat]
  );

  const updateConversations = useCallback(
    (newConv) => {
      setConversations((prevArr) => prevArr.map((conv) => (conv.sessionId === newConv.sessionId ? newConv : conv)));
    },
    [setConversations]
  );

  const handleMessage = useCallback(
    (msg) => {
      if (msg.type === undefined) {
        if (msg.message.type === MSG_TYPES.TEXT || msg.message.type === MSG_TYPES.FILE) {
          if (msg.userSessionId === selectedConversationId) addMessageToConversation(msg);
        }
      } else if (msg.type === MSG_TYPES.AGENT_SUPPORT_SESSION_UPDATE) {
        if (msg.contents.modifiedFields.includes(MODIFIED_FIELDS.SUPPORT_STATUS)) {
          const suppStat = msg.contents.agentSupportSession.supportStatus;

          // Checking if the currently selcted chat was closed by the user or an agent
          if (
            (suppStat === CLOSED_TYPES.user || suppStat === CLOSED_TYPES.agent) &&
            msg.contents.agentSupportSession.sessionId === selectedConversationId
          ) {
            selectConversation('');
            toast.success(
              `Conversation was successfully closed by the ${suppStat === CLOSED_TYPES.user ? 'user' : 'agent'}.`
            );
          }

          // Adding a notification for the newly started conversation
          if (suppStat === CONV_TYPES.request) {
            addNotification(msg.contents.agentSupportSession, notifTypes.MESSAGE_REQUEST);
          }

          refreshSessions();
        }
        if (
          msg.contents.modifiedFields.includes(MODIFIED_FIELDS.LAST_MESSAGE) ||
          msg.contents.modifiedFields.includes(MODIFIED_FIELDS.USER_MESSAGE_READ_STATUS)
        ) {
          updateConversations(msg.contents.agentSupportSession);
        }
      }
    },
    [
      addNotification,
      selectedConversationId,
      addMessageToConversation,
      refreshSessions,
      selectConversation,
      updateConversations,
    ]
  );

  const reducer = (val, { userMessageReadStatus }) => (userMessageReadStatus === 'UNREAD' ? val + 1 : val);

  useEffect(() => {
    if (conversations) {
      const primarys = conversations.filter(({ supportStatus }) => supportStatus === CONV_TYPES.primary);
      const requests = conversations.filter(({ supportStatus }) => supportStatus === CONV_TYPES.request);

      setUnreadPrimaryCount(primarys.reduce(reducer, 0));
      setUnreadRequestsCount(requests.reduce(reducer, 0));

      setPrimaryConvs(primarys);
      setRequestConvs(requests);
      setHasUnreadChat(conversations.some(({ userMessageReadStatus }) => userMessageReadStatus === 'UNREAD'));
    }
  }, [conversations]);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      handleMessage(msg);
    };
  }, [socket, handleMessage]);

  useEffect(() => {
    if (!selectedConversationId) return;

    getSelectedConversation();
  }, [getSelectedConversation, selectedConversationId]);

  const sendMessage = (text) => {
    if (text === '') return;

    const message = {
      type: MSG_TYPES.TEXT,
      contents: {
        data: text,
        toId: selectedConversationId,
        fromName: `${user.firstName} ${user.lastName}`,
        fromEmail: user.email,
      },
    };
    addMessageToConversation(message, true);
    socket.send(JSON.stringify(message));
  };

  const sendFile = (filesArr) => {
    filesArr.forEach(({ name, id }) => {
      const file = {
        dataFilePath: getFileDonwloadLink(id),
        fileName: name,
      };

      const message = {
        type: MSG_TYPES.FILE,
        contents: {
          data: file,
          toId: selectedConversationId,
          fromName: `${user.firstName} ${user.lastName}`,
          fromEmail: user.email,
        },
      };

      addMessageToConversation(message, true);
      socket.send(JSON.stringify(message));
    });
  };

  const acceptSupportSession = () => {
    CHAT_API.post(`/agent/support/${selectedConversationId}/accept`);
  };

  const closeSupportSession = () => {
    CHAT_API.post(`/agent/support/${selectedConversationId}/close`);
  };

  const value = {
    conversations,
    primaryConvs,
    requestConvs,
    reClsdConvs,
    selectedConversation,
    selectedConversationId,
    selectedConversationDetails,
    hasUnreadChat,
    unreadPrimaryCount,
    unreadRequestsCount,
    CONV_TYPES,
    selectConversation,
    sendMessage,
    sendFile,
    acceptSupportSession,
    closeSupportSession,
  };

  return <ConversationContext.Provider value={value}>{children}</ConversationContext.Provider>;
};

ConversationProvider.propTypes = {
  children: PropTypes.node,
};
