import { useTheme } from '@mui/material/styles';

import { useGetCurrentUser } from '../../../../../../../../hooks/useGetCurrentUser';
import { formatDateOrRelative } from '../../../../../../../../utils/timeUtil';
import { StyledAvatar, StyledFlex, StyledText } from '../../../../../../../shared/styles/styled';
import { ISSUE_ENTITY_TYPE } from '../../../../../../constants/core';
import { getFirstOrFullNameInitials } from '../../../../../TicketTasks/utills/helpers';

const ConversationHistoryItem = ({ data, avatarProps = {} }) => {
  const { colors } = useTheme();
  const { currentUser } = useGetCurrentUser();

  const messageSource = data?.messageSource || '';
  const msgDateTime = data?.transmissionDateTime || '';

  const msgContents = data?.message?.contents;
  const from = msgContents?.fromName || '';
  const message = msgContents?.data || '';
  const msgFromId = msgContents?.fromId || '';

  const isCurrentUser = currentUser?.id === msgFromId;

  const textAlignProp = isCurrentUser ? 'right' : 'left';
  const msgContainerProps = {
    direction: 'row',
    gap: '0 15px',
    alignItems: 'flex-start',
    ...(isCurrentUser ? { justifyContent: 'flex-end' } : {}),
  };

  const renderAvatar = (name, msgSource) => {
    const isAgent = msgSource !== ISSUE_ENTITY_TYPE.USER;

    return (
      <StyledAvatar
        width="40px"
        fontSize="14px"
        fontWeight="500"
        bgColor={isAgent ? colors.primary : colors.secondary}
        color={colors.white}
        {...avatarProps}
      >
        {getFirstOrFullNameInitials(name)}
      </StyledAvatar>
    );
  };

  return (
    <StyledFlex {...msgContainerProps}>
      {!isCurrentUser ? renderAvatar(from, messageSource) : null}
      <StyledFlex>
        <StyledText size={14} weight={600} lh={17} mb={7} textAlign={textAlignProp}>{from}</StyledText>
        <StyledText size={12} weight={400} lh={15} mb={4} textAlign={textAlignProp}>{message}</StyledText>
        <StyledText
          size={10}
          weight={300}
          lh={12}
          color={colors.disabledBtnText}
          textAlign={textAlignProp}
        >
          {formatDateOrRelative(msgDateTime, currentUser?.timezone)}
        </StyledText>
      </StyledFlex>
      {isCurrentUser ? renderAvatar(from, messageSource) : null}
    </StyledFlex>
  );
};

export default ConversationHistoryItem;
