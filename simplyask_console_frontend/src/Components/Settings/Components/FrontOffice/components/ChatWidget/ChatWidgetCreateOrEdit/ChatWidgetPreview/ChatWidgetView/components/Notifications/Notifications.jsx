import { StyledWidgetNotification, StyledText } from '../shared/styles/styled';

const Notifications = ({ isEditMode, unreadMessagesCount, appearances }) => {
  let count;
  if (isEditMode) {
    count = 1;
  }

  if (unreadMessagesCount > 0) {
    count = unreadMessagesCount < 10 ? unreadMessagesCount : '9+';
  }

  return isEditMode || count ? (
    <StyledWidgetNotification bgColor={appearances.notificationBackgroundColourHex}>
      <StyledText size={14} smSize={12} weight={700} color={appearances.notificationTextColourHex}>
        {count}
      </StyledText>
    </StyledWidgetNotification>
  ) : null;
};

export default Notifications;
