import React, { memo, useState } from 'react';
import { useSetRecoilState } from 'recoil';

import ArrowIcon from '../../../../../../../Assets/icons/agent/sidebar/arrow.svg?component';
import DefaultIcon from '../../../../../../../Assets/icons/agent/sidebar/default.svg?component';
import StartIcon from '../../../../../../../Assets/icons/agent/sidebar/start.svg?component';
import TransferIcon from '../../../../../../../Assets/icons/agent/steps/transfer.svg?component';
import PersonIconRed from '../../../../../../shared/REDISIGNED/icons/svgIcons/PersonIconRed';
import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import {
  StyledSidebarItem,
  StyledSidebarItemIcon,
  StyledSidebarItemTopIcon,
  StyledSidebarItemWrap,
} from '../../../../../shared/components/StyledFlowSidebar';
import { STEP_TYPES } from '../../../../../shared/constants/steps';
import { useStepHover } from '../../../../../shared/hooks/useStepHover';
import { STEP_ENTITY_TYPE, SWITCH_TYPES } from '../../../constants/steps';
import { agentEditorStepItem } from '../../../store';

import StepItems from './StepItems';

const getIcon = (step) => {
  const iconMap = {
    [STEP_TYPES.START]: <StartIcon />,
    [STEP_TYPES.DEFAULT]: <DefaultIcon />,
  };

  if (step.type === STEP_TYPES.SWITCH) {
    if (step.data.switchType === SWITCH_TYPES.HUMAN) {
      return <PersonIconRed />;
    }

    if (step.data.switchType === SWITCH_TYPES.AGENT) {
      return <TransferIcon />;
    }
  }

  return iconMap[step.type];
};

const NO_EXPANDABLE_TYPES = [STEP_TYPES.START, STEP_TYPES.SWITCH];

const StepsSidebarItem = ({ step, onClick, onContextMenu, forceOpen }) => {
  const [open, setOpen] = useState(false);
  const icon = getIcon(step);

  const opened = forceOpen || open;

  const { onMouseEnter, onMouseLeave } = useStepHover();
  const setStepItemOpened = useSetRecoilState(agentEditorStepItem);

  const handleArrowClick = (e) => {
    e.stopPropagation();
    setOpen(!open);
  };

  const handleStepClick = () => {
    if (step.type === STEP_TYPES.SWITCH) {
      setStepItemOpened({ stepId: step.id, stepType: STEP_TYPES.SWITCH, switchType: step.data?.switchType });
      return;
    }

    if (step.selected) {
      setOpen(true);
    }
    onClick();
  };

  return (
    <StyledSidebarItemWrap>
      <StyledSidebarItem
        onClick={handleStepClick}
        onContextMenu={(event) =>
          onContextMenu(event, {
            data: step,
            dataType: STEP_ENTITY_TYPE.STEP,
          })
        }
        onMouseEnter={() => onMouseEnter(step.id)}
        onMouseLeave={() => onMouseLeave(step.id)}
        selected={step.selected}
        hovered={step.data?.meta?.hovered}
        direction="row"
        alignItems="center"
        gap="10px"
        p="10px 15px"
      >
        <StyledFlex flex="0 0">
          <StyledSidebarItemIcon>{icon}</StyledSidebarItemIcon>
        </StyledFlex>
        <StyledText maxLines={1} size={16} weight={600}>
          {step.data.label}
        </StyledText>
        <StyledFlex m="0 0 0 auto">
          {!NO_EXPANDABLE_TYPES.includes(step.type) && (
            <StyledSidebarItemTopIcon open={opened} onClick={handleArrowClick}>
              <ArrowIcon />
            </StyledSidebarItemTopIcon>
          )}
        </StyledFlex>
      </StyledSidebarItem>
      {opened && step.data.stepItems?.length > 0 && (
        <StepItems stepId={step.id} stepItems={step.data.stepItems} onContextMenu={onContextMenu} />
      )}
    </StyledSidebarItemWrap>
  );
};

export default memo(StepsSidebarItem);
