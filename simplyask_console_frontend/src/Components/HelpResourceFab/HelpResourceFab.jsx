import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import routes from '../../config/routes';
import { StyledLoadingButton } from '../shared/REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../shared/REDISIGNED/controls/InputLabel/InputLabel';
import RadioGroupSet from '../shared/REDISIGNED/controls/Radio/RadioGroupSet';
import AddFeatureIcon from '../shared/REDISIGNED/icons/svgIcons/AddFeatureIcon';
import DocumentationIcon from '../shared/REDISIGNED/icons/svgIcons/DocumentationIcon';
import SupportIcon from '../shared/REDISIGNED/icons/svgIcons/SupportIcon';
import { StyledDivider, StyledFlex, StyledRadio, StyledTextField } from '../shared/styles/styled';

import HaveFeedback from './HaveFeedback/HaveFeedback';
import HelpResourceFabList from './HelpResourceFabList/HelpResourceFabList';
import HelpResourceFabListItem from './HelpResourceFabList/HelpResourceFabListItem/HelpResourceFabListItem';
import { StyledFab, StyledFabIcon } from './StyledHelpResourcesFab';
import { ContextMenu } from '../Managers/shared/components/ContextMenus/StyledContextMenus';
import { usePopoverToggle } from '../../hooks/usePopoverToggle';
import { StyledTooltip } from '../shared/REDISIGNED/tooltip/StyledTooltip';

const listItems = [
  {
    label: 'Product Documentation',
    Icon: DocumentationIcon,
    action: 'documentation',
  },
  {
    label: 'Submit Feedback',
    Icon: AddFeatureIcon,
    action: 'feedback',
  },
  {
    label: 'Contact Support',
    Icon: SupportIcon,
    action: 'support',
  },
];

const HelpResourceFab = ({ onFeedback, feedback, onSubmitFeedback, feedbackRef, isSubmitFeedbackLoading }) => {
  const navigate = useNavigate();

  const { colors } = useTheme();

  const [tooltipOpen, setTooltipOpen] = useState(false);

  const [reportType, setReportType] = useState('BUG');
  const [description, setDescription] = useState('');

  const toggleTooltip = (value) => setTooltipOpen(value);

  const {
    anchorEl: helpMenuAnchorEl,
    open: isHelpMenuOpen,
    handleClick: onOpenHelpMenu,
    handleClose: onCloseHelpMenu,
  } = usePopoverToggle('help-context-menu');

  const onMenuSelect = (action) => {
    const siteUrl = 'https://docs.symphona.ai';

    switch (action) {
      case 'documentation':
        window.open(siteUrl, '_blank');
        break;
      case 'feedback':
        onFeedback();
        break;
      case 'support':
        navigate(routes.SUPPORT);
        break;
      default:
        break;
    }

    onCloseHelpMenu();
  };

  const onChange = (e) => {
    const { name, value } = e.target;

    const stateFunctions = {
      description: setDescription,
      reportType: setReportType,
    };

    const setStateFunction = stateFunctions[name];

    if (setStateFunction) {
      setStateFunction(value);
    }

    onFeedback((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <StyledTooltip
        title="Help and Resources"
        open={tooltipOpen && !isHelpMenuOpen}
        onOpen={() => toggleTooltip(true)}
        onClose={() => toggleTooltip(false)}
        arrow
        placement="bottom"
      >
        <StyledFab color="primary" aria-label="help and resources" onClick={onOpenHelpMenu}>
          <StyledFabIcon>
            <QuestionMarkIcon sx={{ fontSize: 16 }} />
          </StyledFabIcon>
        </StyledFab>
      </StyledTooltip>

      <ContextMenu
        open={isHelpMenuOpen}
        onClose={onCloseHelpMenu}
        anchorEl={helpMenuAnchorEl}
        maxWidth="275px"
        MenuListProps={{
          onMouseLeave: onCloseHelpMenu,
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          left: 50,
        }}
      >
        <HelpResourceFabList onClose={onCloseHelpMenu}>
          {listItems.map(({ label, Icon, action }, index) => (
            <HelpResourceFabListItem key={label} Icon={Icon} label={label} onOpen={() => onMenuSelect(action)}>
              {index !== listItems.length - 1 && (
                <StyledFlex m="0 15px">
                  <StyledDivider borderWidth={1.5} color={colors.disabledBtnBg} />
                </StyledFlex>
              )}
            </HelpResourceFabListItem>
          ))}
        </HelpResourceFabList>
      </ContextMenu>

      <HaveFeedback
        open={!!feedback}
        onClose={() => {
          setDescription('');
          setReportType('BUG');
          onFeedback(null);
        }}
        feedbackRef={feedbackRef}
      >
        <RadioGroupSet
          row
          name="reportType"
          value={reportType}
          onChange={onChange}
          sx={{
            gap: '0 43px',
            mb: '23px',
          }}
        >
          <StyledRadio value="FEEDBACK" label="Feature Suggestion" />
          <StyledRadio value="BUG" label="Bug Report" />
        </RadioGroupSet>
        <StyledFlex direction="column" flex="auto" width="100%" height="auto" mb="24px">
          <InputLabel label="Description" size={16} />
          <StyledTextField
            multiline
            variant="standard"
            minHeight="69px"
            fontSize="13px"
            lineHeight="16px"
            id="description"
            name="description"
            placeholder="Add text to explain...."
            value={description}
            onChange={onChange}
          />
        </StyledFlex>
        <StyledFlex flex="1 1 auto">
          <StyledLoadingButton
            primary
            variant="contained"
            onClick={onSubmitFeedback}
            disabled={description.length < 1}
            loading={isSubmitFeedbackLoading}
          >
            Submit
          </StyledLoadingButton>
        </StyledFlex>
      </HaveFeedback>
    </>
  );
};

export default HelpResourceFab;

HelpResourceFab.propTypes = {
  onFeedback: PropTypes.func,
  feedback: PropTypes.object,
  onSubmitFeedback: PropTypes.func,
  // currentProduct: PropTypes.arrayOf(PropTypes.object),
  feedbackRef: PropTypes.object,
};
