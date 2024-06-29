import { useTheme, Avatar as AvatarMui } from '@mui/material';
import moment from 'moment';
import React from 'react';

import ChatBot from '../../../assets/ChatBot.svg?component';
import { msgNames, msgSrcs } from '../../../utils/constants/common';
import { StyledFlex, StyledText, StyledWidgetImage, TypingBalls } from '../../shared/styles/styled';

import Chips from './Chips';
import FileMessage from './FileMessage';
import NotificationMessage from './NotificationMessage';

const Avatar = ({ img, size = '65', className, ...otherProps }) => (
  <AvatarMui
    style={{
      height: `${size}px`,
      width: `${size}px`,
    }}
    src={img}
    {...otherProps}
  />
);

const MessageIcon = ({ avatar, colors, appearances }) => (
  <StyledFlex
    borderRadius="50%"
    width="30px"
    height="30px"
    backgroundColor={appearances.primaryColourHex || colors.primary}
    justifyContent="center"
    alignItems="center"
  >
    {avatar ? <StyledWidgetImage src={avatar} alt="Msg Avatar" height="15px" /> : <ChatBot />}
  </StyledFlex>
);

const Message = ({
  name,
  message,
  timestamp,
  src,
  pfp,
  chips,
  onChipClick,
  isLastMessage,
  avatar,
  isEditMode,
  appearances,
  showTypingAnimation = false,
}) => {
  const { colors } = useTheme();
  const isRightSidedMsg = src === msgSrcs.USER;

  const getName = () => {
    switch (src) {
      case msgSrcs.DIALOGFLOW:
        return appearances.chatBotName || msgNames.DIALOGFLOW;
      case msgSrcs.USER:
        return msgNames.USER;
      case msgSrcs.AGENT:
        return name;
      default:
        return '';
    }
  };

  const renderMessageBody = () => {
    if (isEditMode) return '';

    if (showTypingAnimation && !isEditMode) {
      return (
        <TypingBalls>
          <StyledFlex as="span" />
          <StyledFlex as="span" />
          <StyledFlex as="span" />
        </TypingBalls>
      );
    }
    return message;
  };

  if (src === msgSrcs.NOTIFICATION) return <NotificationMessage text={message} />;
  return (
    <StyledFlex>
      <StyledFlex
        direction="row"
        gap="8px"
        mb={!chips && '10px'}
        justifyContent={isRightSidedMsg ? 'flex-end' : 'flex-start'}
      >
        {src === msgSrcs.DIALOGFLOW && <MessageIcon avatar={avatar} colors={colors} appearances={appearances} />}
        {src === msgSrcs.AGENT &&
          (pfp ? (
            <Avatar img={pfp} size="30" />
          ) : (
            <MessageIcon avatar={avatar} colors={colors} appearances={appearances} />
          ))}

        <StyledFlex maxWidth="70%">
          <StyledFlex direction="row" alignSelf={isRightSidedMsg ? 'flex-end' : 'flex-start'} gap="2px" mb="2px">
            <StyledText lh="12" weight={500} size={10} smSize={9} color={colors.extraLightBlack}>
              {getName()} •
            </StyledText>

            <StyledText lh="12" weight={400} size={10} smSize={9} color={colors.extraLightBlack}>
              {!showTypingAnimation && moment(timestamp).format('h:mm a')}
            </StyledText>
          </StyledFlex>

          {typeof message === 'object' ? (
            <FileMessage data={message} appearances={appearances} />
          ) : (
            <StyledFlex
              backgroundColor={colors.mercury}
              borderRadius="2px 10px 10px 10px"
              width="fit-content"
              padding="8px"
              {...(isRightSidedMsg && {
                backgroundColor: appearances.secondaryColourHex || colors.tertiaryDark,
                borderRadius: '10px 2px 10px 10px',
                marginLeft: 'auto',
              })}
              {...(isEditMode && {
                width: ' 220px',
                height: '60px',
              })}
            >
              <StyledText size={12} smSize={11} color={colors.primary} wordBreak="break-word">
                {renderMessageBody()}
              </StyledText>
            </StyledFlex>
          )}
        </StyledFlex>
      </StyledFlex>

      <Chips data={chips} onClick={onChipClick} hidden={!isLastMessage} appearances={appearances} />
    </StyledFlex>
  );
};

export default Message;
