import UserAvatar from "../../../UserAvatar";
import moment from 'moment';
import { useTheme } from "@mui/material";
import { StyledFlex, StyledText } from "../../../shared/styles/styled";

const Message = ({
  name,
  message,
  timestamp,
  color,
  fullWidth = false,
  isFromThisUser = false,
  avatar,
}) => {
  const { colors } = useTheme();
  return (
    <StyledFlex
      maxWidth={fullWidth ? '100%' : '65%'}
      ml={isFromThisUser ? 'auto' : 0}
      direction={isFromThisUser ? 'row-reverse' : 'row'} gap={2}
    >
      <UserAvatar
        customUser={{ firstName: name?.split(" ")[0] || 'Unknown', lastName: name?.split(" ")[1] }}
        color={color}
        textColor={color === colors.tertiary ? colors.primary : colors.white}
        size="45"
        src={avatar ? avatar : null}
      />
      <StyledFlex>
        <StyledText
          textAlign={isFromThisUser ? 'right' : 'left'}
          size={16}
          lh={24}
          weight={600}
        >
          {`${name || 'Unknown User'} ${isFromThisUser ? "(You)" : ""}`}
        </StyledText>

        {typeof message === "string" ? (
          <StyledText
            textAlign={isFromThisUser ? 'right' : 'left'}
            size={14}
            lh={20}
            mb={4}
          >
            {message}
          </StyledText>
        ) : (
          <a href={message.dataFilePath} target="_blank" rel="noreferrer">
            {message.fileName}
          </a>
        )}

        <StyledText
          size={12}
          lh={14}
          weight={300}
          color={colors.dustyGray}
          textAlign={isFromThisUser ? 'right' : 'left'}
        >
          {moment(timestamp).format("h:mm a MMMM DD, YYYY")}
        </StyledText>
      </StyledFlex>
    </StyledFlex>
  );
};

export default Message;
