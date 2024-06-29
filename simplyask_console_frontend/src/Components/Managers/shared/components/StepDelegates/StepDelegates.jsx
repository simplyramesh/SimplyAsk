import React, { Fragment, memo } from 'react';
import { StyledStepDelegates, StyledStepDelegatesItemWrap } from './StyledStepDelegates';
import StepDelegatesItem from './StepDelegatesItem';
import { StyledDivider } from '../../../../shared/styles/styled';
import { STEP_ITEM_TYPES } from '../../../AgentManager/AgentEditor/constants/steps';

const StepDelegates = ({ stepDelegates }) => {
  return (
    <StyledStepDelegates>
      {stepDelegates.filter(delegate => !!delegate.visibleInSidebar).map((item, index) => (
        <Fragment key={index}>
          <StyledStepDelegatesItemWrap>
            <StepDelegatesItem item={item} />
            {item.children && (
              <StyledStepDelegates subMenu>
                {item.children.map((child, index) => (
                  <StepDelegatesItem
                    key={index}
                    item={child}
                  />
                ))}
              </StyledStepDelegates>
            )}
          </StyledStepDelegatesItemWrap>
          {item.type === STEP_ITEM_TYPES.TRANSITION && <StyledDivider color="#B7C6D7" borderWidth={2} />}
        </Fragment>
      ))}
    </StyledStepDelegates>
  );
};

export default memo(StepDelegates);
