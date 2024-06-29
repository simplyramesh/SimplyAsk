import { ArrowBackIos, CheckBox, MoreVertOutlined, Send } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Dropdown } from 'simplexiar_react_components';

import { useConversation } from '../../../../contexts/ConversationContext';
import { useUser } from '../../../../contexts/UserContext';
import { saveFile } from '../../../../Services/axios/filesAxios';
import { CHAT_FOLDER_ID } from '../../../Files/FolderIds';
import Spinner from '../../../shared/Spinner/Spinner';
import UserAvatar from '../../../UserAvatar';
import { getCloseSessionDropdownItems, getConvDropdownItems } from '../../DropdownItems';
import classes from './ChatBoxModalView.module.css';
import { StyledFlex, StyledIconButton, StyledText } from '../../../shared/styles/styled';
import { useTheme } from '@mui/material/styles';
import BaseTextInput from '../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import Conversation from '../../Conversation/Conversation';
import { StyledButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';

const ChatBoxModalView = ({ setTabValue }) => {
  const { colors } = useTheme();
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showCloseSessionDropdown, setShowCloseSessionDropdown] = useState(false);
  const [inputText, setInputText] = useState('');
  const {
    selectConversation,
    selectedConversation,
    selectedConversationDetails,
    sendMessage,
    sendFile,
    acceptSupportSession,
    closeSupportSession,
    CONV_TYPES,
  } = useConversation();
  const { user } = useUser();

  const onSendMessage = (event) => {
    event.preventDefault();

    sendMessage(inputText);
    setInputText('');
  };

  const onAcceptRequest = () => {
    setTabValue(0);
    acceptSupportSession();
  };

  const handleFiles = async (fileArr) => {
    if (fileArr.length === 0) return;

    // Files have already been uploaded and have got an id
    if (fileArr[0].id) return sendFile(fileArr);

    const result = await saveFile(fileArr, CHAT_FOLDER_ID, user.id);
    sendFile(result);
  };

  if (!selectedConversationDetails) return <Spinner parent />;
  return (
    <StyledFlex height="100%" width="100%">
      <StyledFlex
        direction="row"
        justifyContent="space-between"
        p="16px"
        mb={2}
        alignItems="center"
        backgroundColor={colors.cardGridItemBorder}
      >
        <ArrowBackIos onClick={() => selectConversation('')} />
        <StyledFlex alignItems="center" direction="row" gap="16px">
          <UserAvatar
            customUser={{
              firstName: selectedConversationDetails.name?.split(' ')[0] || 'Unknown',
              lastName: selectedConversationDetails.name?.split(' ')[1],
            }}
            size="50"
            color={colors.secondary}
          />
          <StyledText size={22} weight={600}>
            {selectedConversationDetails.name}
          </StyledText>
        </StyledFlex>
        <StyledFlex direction="row" alignItems="center">
          {selectedConversationDetails.supportStatus === CONV_TYPES.primary && (
            <Dropdown
              items={getCloseSessionDropdownItems(closeSupportSession, () => setShowCloseSessionDropdown(false))}
              className={classes.closeSessionDropdown}
              show={showCloseSessionDropdown}
              setShow={setShowCloseSessionDropdown}
            >
              <CheckBox
                className={classes.closeSessionButton}
                onClick={() => setShowCloseSessionDropdown((prevValue) => !prevValue)}
              />
            </Dropdown>
          )}
          <Dropdown
            items={getConvDropdownItems(selectedConversationDetails)}
            className={classes.dropdownMenu}
            show={showMenuDropdown}
            setShow={setShowMenuDropdown}
          >
            <MoreVertOutlined
              className={classes.topMenuButton}
              onClick={() => setShowMenuDropdown((prevValue) => !prevValue)}
            />
          </Dropdown>
        </StyledFlex>
      </StyledFlex>
      <Conversation
        data={selectedConversation}
        user={user}
        handleDropFile={selectedConversationDetails.supportStatus === CONV_TYPES.primary ? handleFiles : undefined}
        fullWidth
      />
      {(() => {
        if (selectedConversationDetails?.supportStatus === CONV_TYPES?.primary) {
          return (
            <form className={classes.inputForm} onSubmit={onSendMessage}>
              <StyledFlex
                width="100%"
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                p="24px 52px 24px 24px"
                gap="16px"
              >
                {/* <StyledIconButton
                  onClick={openAttachModal}
                  iconSize="24px"
                  size="40px"
                  iconColor={colors.primary}
                  bgColor={colors.tertiary}
                >
                  <AttachFile />
                </StyledIconButton> */}

                <StyledFlex flex="1">
                  <BaseTextInput
                    placeholder="Type your message here..."
                    value={inputText}
                    onChange={(event) => setInputText(event.target.value)}
                  />
                </StyledFlex>

                <StyledIconButton
                  onClick={onSendMessage}
                  iconSize="28px"
                  size="40px"
                  iconColor={colors.white}
                  bgColor={colors.secondary}
                >
                  <Send />
                </StyledIconButton>
              </StyledFlex>
            </form>
          );
        }
        if (selectedConversationDetails?.supportStatus === CONV_TYPES?.request) {
          return (
            <StyledFlex
              gap="8px"
              alignItems="center"
              m="16px"
              p="16px"
              backgroundColor={colors.tertiary}
              borderRadius="10px"
            >
              <StyledText size={19} weight={500}>
                Agent would like to transfer ticket to Employee.
              </StyledText>
              <StyledText>Accept request to respond to customer and move chat to Primary Inbox.</StyledText>
              <StyledButton variant="contained" primary onClick={onAcceptRequest}>
                Accept Request
              </StyledButton>
            </StyledFlex>
          );
        }
      })()}
    </StyledFlex>
  );
};

export default ChatBoxModalView;

ChatBoxModalView.propTypes = {
  setTabValue: PropTypes.func.isRequired,
  openAttachModal: PropTypes.func.isRequired,
};
