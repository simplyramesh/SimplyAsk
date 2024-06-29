import { HelpOutline } from '@mui/icons-material';

import PlayOutlinedIcon from "../../../../shared/REDISIGNED/icons/svgIcons/PlayOutlinedIcon";
import SettingsOutlinedIcon from "../../../../shared/REDISIGNED/icons/svgIcons/SettingsOutlinedIcon";
import ZoomInIcon from "../../../../shared/REDISIGNED/icons/svgIcons/ZoomInIcon";
import ZoomOutIcon from "../../../../shared/REDISIGNED/icons/svgIcons/ZoomOutIcon";
import { StyledTooltip } from "../../../../shared/REDISIGNED/tooltip/StyledTooltip";
import { StyledAgentEditorHeadIconWrapper } from "../../../AgentManager/AgentEditor/components/AgentEditorHead/StyledAgentEditorHead";
import { memo } from 'react';

const iconMap = {
  SETTINGS: <SettingsOutlinedIcon />,
  ZOOM_IN: <ZoomInIcon />,
  ZOOM_OUT: <ZoomOutIcon />,
  PLAY: <PlayOutlinedIcon />,
  HELP: <HelpOutline />,
};

const FlowIconWithTooltip = ({
  icon,
  text,
  isDisabled = false,
  active,
  onClick,
  children,
}) => {
  const renderIconWrapper = () => children
    ? children
    : (
      <StyledAgentEditorHeadIconWrapper active={active} isDisabled={isDisabled} onClick={onClick}>
        {iconMap[icon]}
      </StyledAgentEditorHeadIconWrapper>
    );

  return (
    <StyledTooltip
      title={!isDisabled ? text : ''}
      arrow
      weight={500}
      placement="top"
      p="10px 15px"
      maxWidth="auto"
    >
      {renderIconWrapper()}
    </StyledTooltip>
  );
};

export default memo(FlowIconWithTooltip);
