import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import UserAvatar from '../UserAvatar';
import { StyledFlex, StyledText } from '../shared/styles/styled';
import { useTheme } from '@mui/material/styles';
import styled from '@emotion/styled';

moment.updateLocale('en', {
  relativeTime: {
    // TODO: future should have the "in" prefix
    future: '%s',
    past: '%s',
    s: '%ds',
    ss: '%ds',
    m: '%dm',
    mm: '%dm',
    h: '%dh',
    hh: '%dh',
    d: '%dd',
    dd: '%dd',
    w: '%dw',
    ww: '%dw',
    M: '%dm',
    MM: '%dm',
    y: '%dy',
    yy: '%dy',
  },
});

const StyledChatBox = styled(StyledFlex, {
  shouldForwardProp: (prop) => prop !== 'isClosed',
})`
  position: relative;
  border-radius: 10px;
  flex-direction: row;
  gap: 12px;
  align-items: center;
  overflow: hidden;
  padding: 20px;
  opacity: ${({ isClosed }) => (isClosed ? '0.5' : '1')};
  background-color: ${({ theme, unread }) => (unread ? theme.colors.lightGrayBlue : theme.colors.white)};
  border-left: ${({ theme, unread }) => `7px solid ${unread ? theme.colors.secondary : 'transparent'}`};
  cursor: pointer;
  transition: 0.3s all;

  &:hover {
    background-color: ${({ theme }) => theme.colors.lightGray2};
  }
`;

const Chatbar = ({ id, name, timestamp, message, unread, onClick, isClosed }) => {
  const { colors } = useTheme();

  return (
    <StyledChatBox isClosed={isClosed} unread={unread} onClick={() => onClick(id)}>
      <UserAvatar
        customUser={{ firstName: name?.split(' ')[0] || 'Unknown', lastName: name?.split(' ')[1] }}
        color={colors.secondary}
        size="50"
        textColor={colors.white}
      />
      <StyledFlex flex={1}>
        <StyledText weight={600} size={20} maxLines={1}>
          {name || 'Unknown User'}
        </StyledText>
        <StyledText size={15} maxLines={1}>
          {message}
        </StyledText>
      </StyledFlex>
      <StyledFlex flexShrink={0} alignSelf="flex-start">
        <StyledText size={12}>{moment(timestamp).fromNow()}</StyledText>
      </StyledFlex>
    </StyledChatBox>
  );
};

export default Chatbar;

Chatbar.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  timestamp: PropTypes.string,
  message: PropTypes.string,
  unread: PropTypes.bool,
  onClick: PropTypes.func,
  isClosed: PropTypes.bool,
};
