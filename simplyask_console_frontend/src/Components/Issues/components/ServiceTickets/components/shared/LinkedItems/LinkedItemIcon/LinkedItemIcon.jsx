import { useTheme } from '@mui/material/styles';
import ServiceTicketIcon from '../../../../../../../../Assets/icons/issues/types/ServiceTicketIcon.svg?component';
import AgentIcon from '../../../../../../../../Assets/icons/linked-items/agent.svg?component';
import ConversationIcon from '../../../../../../../../Assets/icons/linked-items/conversation.svg?component';
import ProcessExecutionIcon from '../../../../../../../../Assets/icons/linked-items/execution.svg?component';
import WorkflowIcon from '../../../../../../../../Assets/icons/linked-items/process.svg?component';
import useUserPfp from '../../../../../../../../hooks/useUserPfp';
import TestIcon from '../../../../../../../Managers/TestManager/components/TestIcon/TestIcon';
import { TEST_ENTITY_TYPE } from '../../../../../../../Managers/TestManager/constants/constants';
import { StyledTooltip } from '../../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledFlex } from '../../../../../../../shared/styles/styled';
import UserAvatar from '../../../../../../../UserAvatar';
import { ISSUE_ENTITY_TYPE, ISSUE_ENTITY_TYPE_LABEL } from '../../../../../../constants/core';

const LinkedItemIcon = ({ type, relatedEntity, showTooltip = true, customIcon = null, tooltipText = null }) => {
  const [profileImg] = useUserPfp(relatedEntity?.pfp);
  const { colors } = useTheme();

  const getIcon = () => {
    switch (type) {
      case ISSUE_ENTITY_TYPE.PROCESS:
        return <ProcessExecutionIcon />;
      case ISSUE_ENTITY_TYPE.WORKFLOW:
        return <WorkflowIcon />;
      case ISSUE_ENTITY_TYPE.CONVERSATION:
        return <ConversationIcon />;
      case ISSUE_ENTITY_TYPE.ISSUE:
        return <ServiceTicketIcon />;
      case ISSUE_ENTITY_TYPE.AGENT:
        return <AgentIcon />;
      case ISSUE_ENTITY_TYPE.TEST_CASE:
        return <TestIcon entityType={TEST_ENTITY_TYPE.CASE} />;
      case ISSUE_ENTITY_TYPE.TEST_SUITE:
        return <TestIcon entityType={TEST_ENTITY_TYPE.SUITE} />;
      case ISSUE_ENTITY_TYPE.TEST_GROUP:
        return <TestIcon entityType={TEST_ENTITY_TYPE.GROUP} />;
      case ISSUE_ENTITY_TYPE.USER: {
        const customUserFullName = relatedEntity?.name || relatedEntity?.displayName;
        const [firstName, lastName] = customUserFullName?.split(' ') || [];

        return (
          <UserAvatar
            customUser={{
              firstName: relatedEntity?.firstName || firstName,
              lastName: relatedEntity?.lastName || lastName,
            }}
            imgSrc={profileImg}
            size={30}
            color={colors.secondary}
          />
        );
      }
      default:
        return null;
    }
  };

  const getTooltipText = () => {
    if (!showTooltip) {
      return null;
    }

    if (type === ISSUE_ENTITY_TYPE.ISSUE) {
      return relatedEntity?.category?.name;
    }
    return ISSUE_ENTITY_TYPE_LABEL[type];
  };

  return (
    <StyledTooltip title={tooltipText || getTooltipText()} arrow placement="top" p="10px 15px" maxWidth="auto">
      <StyledFlex as="span">{customIcon || getIcon()}</StyledFlex>
    </StyledTooltip>
  );
};

export default LinkedItemIcon;
