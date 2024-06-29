import Scrollbars from 'react-custom-scrollbars-2';
import { useQuery } from '@tanstack/react-query';

import { getUserAvatar } from '../../axios/fileAxios';
import useScrollToBottom from '../../hooks/useScrollToBottom';
import { DEMO_CONVERSATION, msgSrcs } from '../../utils/constants/common';
import { fileToBase64 } from '../../utils/helperFunctions';
import { StyledFlex } from '../shared/styles/styled';

import Message from './Message';

const Conversation = ({ isEditMode, sendMsg, conversation = [], appearances }) => {
  const ref = useScrollToBottom(conversation, isEditMode);

  const getConversations = isEditMode ? DEMO_CONVERSATION : conversation;

  const { data: botAvatarBlob } = useQuery({
    queryFn: () => getUserAvatar(appearances.customChatBotIconDownloadUrl),
    queryKey: ['getMessageAvatarById', appearances.customChatBotIconDownloadUrl],
    enabled: !!appearances.customChatBotIconDownloadUrl,
  });

  const { data: botAvatar } = useQuery({
    queryFn: () => fileToBase64(botAvatarBlob?.data),
    queryKey: ['fileToBase64BotAvatar', botAvatarBlob?.data],
    enabled: !!botAvatarBlob?.data,
  });

  const lastIndexOfConversation = getConversations?.length - 1;

  const isLastMessageSentByUser =
    getConversations?.[lastIndexOfConversation] &&
    [getConversations?.[lastIndexOfConversation]]?.find((item) => item.messageSource === msgSrcs.USER);

  const isHumanAgentConnected = getConversations?.find((item) => item.messageSource === msgSrcs.AGENT);

  const getAnyOneConversationTypedByBot = getConversations?.filter(
    (item) => item.messageSource === msgSrcs.DIALOGFLOW
  )?.[0];

  return (
    <Scrollbars autoHide>
      <StyledFlex ref={ref} padding="17px 15px" gap="11px">
        {getConversations?.map(({ messageSource, message, transmissionTime }, i) => (
          <Message
            name={message.contents.fromName}
            message={message.contents.data}
            timestamp={transmissionTime}
            src={messageSource}
            pfp={message.contents.fromProfilePicture}
            chips={message.contents.quickReplies}
            onChipClick={sendMsg}
            isLastMessage={lastIndexOfConversation}
            avatar={botAvatar}
            key={i}
            isEditMode={isEditMode}
            appearances={appearances}
          />
        ))}

        {!isHumanAgentConnected &&
          isLastMessageSentByUser &&
          getAnyOneConversationTypedByBot &&
          [getAnyOneConversationTypedByBot]?.map(({ messageSource, message, transmissionTime }, i) => (
            <Message
              name={message.contents.fromName}
              message={message.contents.data}
              timestamp={transmissionTime}
              src={messageSource}
              pfp={message.contents.fromProfilePicture}
              chips={message.contents.quickReplies}
              avatar={botAvatar}
              key={i}
              appearances={appearances}
              showTypingAnimation
            />
          ))}
      </StyledFlex>
    </Scrollbars>
  );
};

export default Conversation;
