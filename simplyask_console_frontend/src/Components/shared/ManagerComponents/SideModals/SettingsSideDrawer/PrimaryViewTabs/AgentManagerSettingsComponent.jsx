import 'react-slidedown/lib/slidedown.css';

import IosShareRoundedIcon from '@mui/icons-material/IosShareRounded';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PropTypes from 'prop-types';
import React from 'react';

import DuplicateIcon from '../../../../../../Assets/icons/agent/contextMenu/duplicate.svg?component';
import AiIcon from '../../../../../../Assets/icons/agent/generativeAgent/ai.svg?component';
import ArchiveIcon from '../../../../../../Assets/icons/processManagerArchiveIcon.svg?component';
import { MANAGER_API_KEYS } from '../../../../../../config/managerKeys';
import { AGENT_EDITION, SHOW_AGENT_MANAGER_MODAL_TYPES } from '../../../../../Managers/AgentManager/constants/core';
import { StyledButton } from '../../../../REDISIGNED/controls/Button/StyledButton';
import TrashBinIcon from '../../../../REDISIGNED/icons/svgIcons/TrashBinIcon';
import CustomScrollbar from '../../../../REDISIGNED/layouts/CustomScrollbar/CustomScrollbar';
import { StyledTooltip } from '../../../../REDISIGNED/tooltip/StyledTooltip';
import Spinner from '../../../../Spinner/Spinner';
import { StyledDivider, StyledFlex, StyledText } from '../../../../styles/styled';
import { CHANGE_AGENT_MANAGER_MENUS } from '../SettingsSideDrawer';
import { StyledSettingsMenuItem } from '../StyledSettingsSideDrawer';
import useAgentDetails from '../../../../../Managers/AgentManager/AgentEditor/hooks/useAgentDetails';
import StructuredIcon from '../../../../../../Assets/icons/agent/generativeAgent/structuredBranch.svg?component';
import InputLabel from '../../../../REDISIGNED/controls/InputLabel/InputLabel';
import DateAndUserName from '../../../Shared/DateAndUserName';
import { useGetCurrentUser } from '../../../../../../hooks/useGetCurrentUser';

function AgentManagerSettingsComponent({
  setActiveMenu,
  clickedProcess,
  setShowMoveElementToArchive,
  setShowDeleteElementModal,
  setShowAgentManagerModal,
  exportAgent,
  isExportAgentLoading,
}) {
  const { currentUser } = useGetCurrentUser();

  const isLoading = isExportAgentLoading;
  const { agent: agentDetails, isAgentLoading: isAgentDetailsLoading } = useAgentDetails(clickedProcess?.agentId);
  const shouldNotExportOrDuplicateAgent = !(agentDetails?.nodes.length > 1);

  return (
    <StyledFlex height="100%" width="100%">
      {(isLoading || isAgentDetailsLoading) && <Spinner fadeBgParentFixedPosition />}
      <CustomScrollbar autoHide>
        <StyledFlex p="25px" gap="30px">
          <StyledText size={19} weight={600}>
            Settings
          </StyledText>

          <StyledFlex direction="row" gap="20px">
            <StyledTooltip
              title={
                clickedProcess?.[MANAGER_API_KEYS.IS_ARCHIVED]
                  ? 'This will make the agent active, and it will appear back in the "All Agents" tab.'
                  : 'This will hide the agent by moving it to the “Archive” section. Archived agents will continue to function until it is deleted.'
              }
              arrow
              placement="top"
              p="10px 15px"
              maxWidth="auto"
            >
              <StyledButton
                startIcon={<ArchiveIcon width={23} />}
                tertiary
                variant="contained"
                onClick={() => setShowMoveElementToArchive(true)}
              >
                {clickedProcess?.[MANAGER_API_KEYS.IS_ARCHIVED] ? 'Unarchive' : 'Archive'}
              </StyledButton>
            </StyledTooltip>

            <StyledTooltip
              title="Export this agent, and all its information and settings."
              arrow
              placement="top"
              p="10px 15px"
              maxWidth="auto"
            >
              <StyledButton
                startIcon={<IosShareRoundedIcon />}
                tertiary
                variant="contained"
                onClick={() =>
                  exportAgent({
                    id: clickedProcess?.agentId,
                    agentName: clickedProcess?.name,
                  })
                }
                disabled={shouldNotExportOrDuplicateAgent}
              >
                Export
              </StyledButton>
            </StyledTooltip>

            <StyledTooltip
              title="This will clone the agent and all its information and settings."
              arrow
              placement="top"
              p="10px 15px"
              maxWidth="auto"
            >
              <StyledButton
                startIcon={<DuplicateIcon />}
                tertiary
                variant="contained"
                onClick={() =>
                  setShowAgentManagerModal({
                    type: SHOW_AGENT_MANAGER_MODAL_TYPES.DUPLICATE_AGENT,
                    data: clickedProcess,
                  })
                }
                disabled={shouldNotExportOrDuplicateAgent}
              >
                Duplicate
              </StyledButton>
            </StyledTooltip>

            <StyledTooltip
              title="This will permanently delete your agent. Once it is deleted, it cannot be recovered."
              arrow
              placement="top"
              p="10px 15px"
              maxWidth="auto"
            >
              <StyledButton
                startIcon={<TrashBinIcon />}
                tertiary
                variant="contained"
                onClick={() => setShowDeleteElementModal(true)}
              >
                Delete
              </StyledButton>
            </StyledTooltip>
          </StyledFlex>

          <StyledFlex gap={1}>
            <StyledText size={19} lh={21} weight={600}>
              {clickedProcess?.name ?? '---'}
            </StyledText>
            <StyledText size={16} lh={28}>
              {clickedProcess?.description ?? '---'}
            </StyledText>
          </StyledFlex>
        </StyledFlex>

        <StyledFlex p="0 25px 15px" gap="30px">
          <StyledFlex>
            <InputLabel label="Agent Type:" size={16} />
            <StyledFlex direction="row" alignItems="center" gap="10px">
              {clickedProcess?.edition === AGENT_EDITION.GENERATIVE ? (
                <>
                  <AiIcon />
                  Generative
                </>
              ) : (
                <>
                  <StructuredIcon />
                  Structured
                </>
              )}
            </StyledFlex>
          </StyledFlex>

          <StyledFlex>
            <InputLabel label="Created On: " size={16} />
            <DateAndUserName
              timeStamp={clickedProcess?.createdAt}
              userName={clickedProcess?.createdBy}
              currentUser={currentUser}
            />
          </StyledFlex>

          <StyledFlex>
            <InputLabel label="Updated On: " size={16} />
            <DateAndUserName
              timeStamp={clickedProcess?.updatedAt}
              userName={clickedProcess?.updatedBy}
              currentUser={currentUser}
            />
          </StyledFlex>
        </StyledFlex>

        <StyledDivider height="2px" />

        <StyledSettingsMenuItem
          p="25px"
          direction="row"
          justifyContent="space-between"
          onClick={() => setActiveMenu(CHANGE_AGENT_MANAGER_MENUS.EDIT_DETAILS)}
        >
          <StyledFlex gap={1}>
            <StyledText size={16} lh={21} weight={600}>
              Edit Agent Details
            </StyledText>
            <StyledText size={14} lh={24}>
              View and edit agent details, including name, tags, and description
            </StyledText>
          </StyledFlex>
          <StyledFlex flexShrink={0} ml={4} justifyContent="center">
            <KeyboardArrowRightIcon />
          </StyledFlex>
        </StyledSettingsMenuItem>

        <StyledDivider height="2px" />

        <StyledSettingsMenuItem
          p="25px"
          direction="row"
          justifyContent="space-between"
          onClick={() => setActiveMenu(CHANGE_AGENT_MANAGER_MENUS.ADVANCED_SETTINGS)}
        >
          <StyledFlex gap={1}>
            <StyledText size={16} lh={21} weight={600}>
              Advanced Settings
            </StyledText>
            <StyledText size={14} lh={24}>
              Override and modify the default agent configuration.
            </StyledText>
          </StyledFlex>
          <StyledFlex flexShrink={0} ml={4} justifyContent="center">
            <KeyboardArrowRightIcon />
          </StyledFlex>
        </StyledSettingsMenuItem>

        <StyledDivider height="2px" />

        <StyledSettingsMenuItem
          p="25px"
          direction="row"
          justifyContent="space-between"
          onClick={() => setActiveMenu(CHANGE_AGENT_MANAGER_MENUS.CONFIGURE_CHANNELS)}
        >
          <StyledFlex gap={1}>
            <StyledText size={16} lh={21} weight={600}>
              Configure Channels
            </StyledText>
            <StyledText size={14} lh={24}>
              Assign chat widgets and phone numbers to this agent.
            </StyledText>
          </StyledFlex>
          <StyledFlex flexShrink={0} ml={4} justifyContent="center">
            <KeyboardArrowRightIcon />
          </StyledFlex>
        </StyledSettingsMenuItem>

        <StyledDivider height="2px" />
      </CustomScrollbar>
    </StyledFlex>
  );
}

export default AgentManagerSettingsComponent;

AgentManagerSettingsComponent.propTypes = {
  setActiveMenu: PropTypes.func,
  clickedProcess: PropTypes.object,
};
