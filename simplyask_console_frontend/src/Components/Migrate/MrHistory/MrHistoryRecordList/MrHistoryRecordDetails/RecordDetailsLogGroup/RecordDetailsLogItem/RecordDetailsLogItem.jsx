import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

import StatusTimelineItem from '../../../../../../shared/REDISIGNED/layouts/StatusTimeline/StatusTimelineItem/StatusTimelineItem';
import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';

const RecordDetailsLogItem = (props) => {
  const {
    color,
    date,
    level,
    message,
    messageLink,
    children,
  } = props;

  const { colors } = useTheme();

  const linkText = messageLink?.link || '';
  const messageLinkText = messageLink?.text || '';

  return (
    <StatusTimelineItem color={color}>
      <StyledFlex gap="4px 0">
        <StyledText size={12} lh={15}>{date}</StyledText>
        <StyledText size={14} lh={17} weight={600}>{level}</StyledText>
        <StyledFlex>
          <StyledText size={14} lh={17}>{message}</StyledText>
          {messageLink && (
            <StyledFlex as="p" direction="row" gap="0 0.5ch">
              <StyledText as="span" display="inline" size={14} lh={17}>{`${messageLinkText}:`}</StyledText>
              <StyledText
                as="span"
                display="inline"
                size={14}
                lh={17}
                color={colors.linkColor}
                cursor="pointer"
                onClick={messageLink.onId}
              >
                {`#${linkText}`}
              </StyledText>
            </StyledFlex>
          )}
          {children}
        </StyledFlex>
      </StyledFlex>
    </StatusTimelineItem>
  );
};

export default RecordDetailsLogItem;

RecordDetailsLogItem.propTypes = {
  color: PropTypes.string,
  date: PropTypes.string,
  level: PropTypes.string,
  message: PropTypes.string,
  messageLink: PropTypes.shape({
    link: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    text: PropTypes.string,
    onId: PropTypes.func,
  }),
  children: PropTypes.node,
};
