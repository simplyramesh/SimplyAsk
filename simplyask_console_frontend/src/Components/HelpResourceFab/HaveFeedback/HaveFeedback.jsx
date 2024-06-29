import { Popover } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

import CustomTableIcons from '../../shared/REDISIGNED/icons/CustomTableIcons';
import CenterModalFixed from '../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import { StyledFlex, StyledText } from '../../shared/styles/styled';
import { StyledFeedbackModalBody, StyledFeedbackModalHead } from '../StyledHelpResourcesFab';

const HaveFeedback = ({
  onClose, open, children, feedbackRef = null,
}) => {
  const { boxShadows } = useTheme();

  const renderFeedbackContent = () => (
    <>
      <StyledFeedbackModalHead>
        <StyledText size={19} weight={600} lh={23}>
          Have Feedback?
        </StyledText>
        <CustomTableIcons
          icon="CLOSE"
          width={20}
          onClick={onClose}
        />
      </StyledFeedbackModalHead>
      <StyledFeedbackModalBody>
        <StyledFlex p="22px">
          {children}
        </StyledFlex>
      </StyledFeedbackModalBody>
    </>
  );

  const popoverProps = {
    open,
    onClose,
    anchorEl: feedbackRef,
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'right',
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'right',
    },
    sx: {
      marginTop: '10px',
      '& .MuiPopover-paper': {
        borderRadius: '25px',
        boxShadow: boxShadows.box,
        width: '435px',
      },
    },
  };

  return (
    <>
      {!feedbackRef && (
        <CenterModalFixed
          open={open}
          onClose={onClose}
          maxWidth="435px"
          title="Have Feedback?"
        >
          <StyledFlex p="24px 22px">
            {children}
          </StyledFlex>
        </CenterModalFixed>
      )}
      {!!feedbackRef && <Popover {...popoverProps}>{renderFeedbackContent()}</Popover>}
    </>
  );
};

export default HaveFeedback;

HaveFeedback.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  children: PropTypes.node,
  feedbackRef: PropTypes.object,
};
