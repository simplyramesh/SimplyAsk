import PropTypes from 'prop-types';

import { StyledText } from '../../../shared/styles/styled';
import { StyledHelpResourceListItemButton, StyledHelpResourceListItemIcon } from '../../StyledHelpResourcesFab';

const HelpResourceFabListItem = ({ children, onOpen, Icon, label }) => {
  const IconComponent = Icon || 'div';

  return (
    <>
      <StyledHelpResourceListItemButton onClick={onOpen}>
        <StyledHelpResourceListItemIcon>
          <IconComponent fontSize="20px" />
        </StyledHelpResourceListItemIcon>
        <StyledText size={13} weight={600} lh={16} wrap="nowrap">
          {label}
        </StyledText>
      </StyledHelpResourceListItemButton>
      {children}
    </>
  );
};

export default HelpResourceFabListItem;

HelpResourceFabListItem.propTypes = {
  children: PropTypes.node,
  onOpen: PropTypes.func,
  Icon: PropTypes.func,
  label: PropTypes.string,
};
