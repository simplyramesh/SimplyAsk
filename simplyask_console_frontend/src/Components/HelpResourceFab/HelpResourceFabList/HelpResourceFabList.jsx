import { ClickAwayListener } from '@mui/material';
import PropTypes from 'prop-types';

import { StyledHelpResourceList } from '../StyledHelpResourcesFab';

const HelpResourceFabList = ({ children, onClose }) => {
  return (
    <ClickAwayListener onClickAway={onClose}>
      <StyledHelpResourceList>{children}</StyledHelpResourceList>
    </ClickAwayListener>
  );
};

export default HelpResourceFabList;

HelpResourceFabList.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func,
};
