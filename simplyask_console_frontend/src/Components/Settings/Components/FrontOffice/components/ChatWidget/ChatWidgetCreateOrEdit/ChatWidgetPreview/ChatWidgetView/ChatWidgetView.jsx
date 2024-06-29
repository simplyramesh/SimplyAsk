import ChatIcon from '@mui/icons-material/Chat';
import React from 'react';

import ChatWidget from './components/ChatWidget/ChatWidget';
import Notifications from './components/Notifications/Notifications';
import {
  StyledFlex,
  StyledWidgetPreviewCircularButton,
  RootSvgIcon,
} from './components/shared/styles/styled';
import { getMidOpacityOfColor } from './utils/helperFunctions';

const ChatWidgetView = ({
  isEditMode,
  isWidgetPreviewOpen,
  closeWidgetPreview,
  widgetData,
  isFetching,
  sendMsg,
  sendFile,
  conversation,
  id,
  appearances,
  isSoundOn,
  toggleSoundSettings,
  ivaAgentId,
  handleClickWidgetPreview,
  unreadMessagesCount,
}) => {
  const getValidZIndex = () => (appearances?.index > 0 ? appearances?.index : '4999');

  return (
    <StyledFlex
      alignItems="center"
      mt="33px"
    >
      <ChatWidget
        isWidgetPreviewOpen={isWidgetPreviewOpen}
        closeWidgetPreview={closeWidgetPreview}
        widgetData={widgetData}
        isFetching={isFetching}
        sendMsg={sendMsg}
        sendFile={sendFile}
        conversation={conversation}
        id={id}
        isEditMode={isEditMode}
        appearances={appearances}
        getValidZIndex={getValidZIndex}
        isSoundOn={isSoundOn}
        toggleSoundSettings={toggleSoundSettings}
        ivaAgentId={ivaAgentId}
      />

      <StyledWidgetPreviewCircularButton
        onClick={handleClickWidgetPreview}
        bgColor={appearances.backgroundColourHex}
        color={appearances.iconColourHex}
        hoverBg={getMidOpacityOfColor(appearances.backgroundColourHex)}
        {...(isEditMode ? {
          margin: '725px auto 30px auto',
        } : {
          sx: {
            position: 'fixed',
            bottom: '25px',
            right: '25px',
            zIndex: getValidZIndex() - 1 || '4999',
          },
          transform: isWidgetPreviewOpen ? 'translateY(10%)' : 'translateY(0)',
          visibility: isWidgetPreviewOpen ? 'hidden' : 'visible',
          opacity: isWidgetPreviewOpen ? 0 : 1,
        })}
      >
        <Notifications
          isEditMode={isEditMode}
          unreadMessagesCount={unreadMessagesCount}
          appearances={appearances}
        />
        <RootSvgIcon
          component={ChatIcon}
        />
      </StyledWidgetPreviewCircularButton>
    </StyledFlex>
  );
};

export default ChatWidgetView;
