import { Close, MoreVertOutlined } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dropdown } from 'simplexiar_react_components';

import { useUser } from '../../../contexts/UserContext';
import { getConversationHistory } from '../../../Services/axios/conversationHistoryAxios';
import { getConvDropdownItems } from '../../Chat/DropdownItems';
import Spinner from '../../shared/Spinner/Spinner';
import UserAvatar from '../../UserAvatar';
import classes from './ConvHisModalView.module.css';
import Conversation from '../../Chat/Conversation/Conversation';
import { StyledFlex, StyledText } from '../../shared/styles/styled';
import { useTheme } from '@mui/material';

const ConvHisModalView = ({ convId, closeModal, historyConvs, convsIsLoading }) => {
  const { colors } = useTheme();
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const { data: convMsgs, isLoading } = useQuery({
    queryKey: ['getConversationHistory', convId],
    queryFn: () => getConversationHistory(convId),
    enabled: !!convId,
  });

  const [convDetails, setConvDetails] = useState();
  const { user } = useUser();

  useEffect(() => {
    setConvDetails(historyConvs.find(({ sessionId }) => sessionId === convId));
  }, [historyConvs, convId]);

  if (isLoading || convsIsLoading || !convDetails) return <Spinner parent />;
  return (
    <StyledFlex height="100%" width="100%">
      <StyledFlex
        direction="row"
        flex="1"
        justifyContent="space-between"
        alignItems="center"
        p="16px 24px"
        backgroundColor={colors.cardGridItemBorder}
      >
        <Close onClick={closeModal} />
        <StyledFlex direction="row" alignItems="center" gap="8px">
          <UserAvatar
            customUser={{
              firstName: convDetails?.name?.split(' ')[0] || 'Unknown',
              lastName: convDetails?.name?.split(' ')[1],
            }}
            size="50"
            color={colors.secondary}
          />
          <StyledText weight={600}>{convDetails?.name || 'Unknown User'}</StyledText>
        </StyledFlex>
        <StyledFlex className={classes.detailsMenuRight}>
          <Dropdown
            items={getConvDropdownItems(convDetails)}
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
      <Conversation user={user} data={convMsgs} fullWidth />
    </StyledFlex>
  );
};

export default ConvHisModalView;

ConvHisModalView.propTypes = {
  convId: PropTypes.string,
  closeModal: PropTypes.func,
  historyConvs: PropTypes.arrayOf(
    PropTypes.shape({
      email: PropTypes.string,
      firstClosed: PropTypes.string,
      lastMessage: PropTypes.shape({
        message: PropTypes.shape({
          contents: PropTypes.shape({
            data: PropTypes.string,
            fromEmail: PropTypes.string,
            fromId: PropTypes.string,
            fromName: PropTypes.string,
            type: PropTypes.string,
          }),
        }),
        messageSource: PropTypes.string,
        transmissionTime: PropTypes.string,
        userSessionId: PropTypes.string,
      }),
      lastModified: PropTypes.string,
      name: PropTypes.string,
      sessionId: PropTypes.string,
      supportStatus: PropTypes.string,
      userMessageReadStatus: PropTypes.string,
    })
  ),
  convsIsLoading: PropTypes.bool,
};
