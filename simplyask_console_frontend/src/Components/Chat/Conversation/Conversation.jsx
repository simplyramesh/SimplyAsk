import { DragAndDrop } from 'simplexiar_react_components';
import Message from './Message/Message';
import Scrollbars from 'react-custom-scrollbars-2';
import { useEffect, useRef } from 'react';
import { useTheme } from '@mui/material';
import logo from '../../../Assets/images/simplyaskLogo.png';
import { StyledFlex } from '../../shared/styles/styled';

const MSG_SOURCES = {
  USER: 'USER',
  DIALOGFLOW: 'DIALOGFLOW',
  AGENT: 'AGENT',
};

const Conversation = ({ data, user, fullWidth = false, isConversationHistory = false, handleDropFile }) => {
  const { colors } = useTheme();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [data]);

  const getChatColor = (src) => {
    switch (src) {
      case MSG_SOURCES.USER:
        return colors.secondary;
      case MSG_SOURCES.DIALOGFLOW:
        return colors.tertiary;
      default:
        return colors.primary;
    }
  };

  return (
    <Scrollbars autoHide>
      <DragAndDrop handleDrop={handleDropFile}>
        <StyledFlex ref={messagesEndRef} p="16px 24px" gap="24px">
          {isConversationHistory
            ? data.map(({ firstName, lastName, message, timestamp, right, color }, index) => (
                <Message
                  name={`${firstName} ${lastName}`}
                  message={message}
                  timestamp={timestamp}
                  key={index}
                  fullWidth={fullWidth}
                  color={color}
                  right={right}
                />
              ))
            : data.map(({ messageSource, message, transmissionTime }, index) => (
                <Message
                  name={message.contents.fromName}
                  message={message.contents.data}
                  timestamp={transmissionTime}
                  key={index}
                  fullWidth={fullWidth}
                  color={getChatColor(messageSource)}
                  isFromThisUser={message.contents.fromId === user.id}
                  avatar={
                    messageSource === MSG_SOURCES.DIALOGFLOW
                      ? logo
                      : message.contents.fromId === user.id
                        ? user.pfp
                        : null
                  }
                />
              ))}
        </StyledFlex>
      </DragAndDrop>
    </Scrollbars>
  );
};

export default Conversation;
