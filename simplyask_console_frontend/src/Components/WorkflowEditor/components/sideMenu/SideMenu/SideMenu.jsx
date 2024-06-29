import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';

import { stepTypes } from '../../../constants/graph';
import { useHistoricalRecoilState } from '../../../hooks/useHistoricalRecoilState';
import ConditionalBranch from '../ConditionalBranch/ConditionalBranch';
import LogicalOps from '../ConditionalBranch/LogicalOps/LogicalOps';
import DefaultMenu from './DefaultMenu/DefaultMenu';
import DynamicMenu from './DynamicMenu/DynamicMenu';
import SecondMenu from './SecondMenu/SecondMenu';
import { StyledWorkflowSideMenuContainer } from './StyledSideMenuModule';

const initialState = {
  isDefaultMenuOpen: true,
  isSecondMenuOpen: false,
  both: false,
  componentName: 'div',
};

const SideMenu = ({ step }) => {
  const { set, state } = useHistoricalRecoilState();

  const [menuState, setMenuState] = useState(initialState);

  const handleToggleMenu = useCallback(() => {
    setMenuState((prev) => ({
      ...prev,
      isDefaultMenuOpen: !prev.isDefaultMenuOpen,
      isSecondMenuOpen: prev.both ? !prev.isDefaultMenuOpen : false,
    }));
  }, []);

  const handleSecondMenu = (e, componentName) => {
    setMenuState((prev) => ({
      ...prev,
      isSecondMenuOpen: true,
      both: true,
      componentName,
    }));
  };

  const handleSidebarClose = useCallback(() => {
    set({ ...state, editingStep: null });
  }, [state]);

  const handleOnCloseLogicalOps = () =>
    setMenuState((prev) => ({
      ...prev,
      isSecondMenuOpen: initialState.isSecondMenuOpen,
      both: initialState.both,
      componentName: initialState.componentName,
    }));

  return (
    <StyledWorkflowSideMenuContainer as="aside" dataExpanded={menuState.isDefaultMenuOpen}>
      <SecondMenu menuState={menuState} onClick={handleToggleMenu}>
        {menuState.componentName === 'logicalOps' && <LogicalOps onClose={handleOnCloseLogicalOps} />}
      </SecondMenu>
      <DefaultMenu>
        {step.stepType === stepTypes.GATEWAY ? (
          <ConditionalBranch stepId={step.stepId} onClick={handleSecondMenu} />
        ) : (
          <DynamicMenu stepId={step.stepId} onClose={handleSidebarClose} />
        )}
      </DefaultMenu>
    </StyledWorkflowSideMenuContainer>
  );
};

export default SideMenu;

SideMenu.propTypes = {
  step: PropTypes.object.isRequired,
};
