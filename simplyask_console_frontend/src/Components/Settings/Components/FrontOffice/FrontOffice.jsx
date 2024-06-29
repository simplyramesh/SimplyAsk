import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import PhoneIcon from '../../../../Assets/icons/chatWidgets/Phone.svg?component';
import WidgetsIcon from '../../../../Assets/icons/chatWidgets/WidgetsIcon.svg?component';
import AgentIcon from '../../../shared/REDISIGNED/icons/svgIcons/AgentIcon';
import TicketIcon from '../../../shared/REDISIGNED/icons/svgIcons/TicketIcon';
import { StyledAccordion, StyledAccordionDetails, StyledDivider, StyledFlex } from '../../../shared/styles/styled';

import ChatWidgetTable from './components/ChatWidget/ChatWidgetTable/ChatWidgetTable';
import DefaultAgentAdvancedSettings from './components/DefaultAgentAdvancedSettings/DefaultAgentAdvancedSettings';
import PhoneNumberManagementTable from './components/PhoneNumberManagement/PhoneNumberManagementTable/PhoneNumberManagementTable';
import ServiceTicketTypes from './components/ServiceTicketTypes/ServiceTicketTypes';
import Summary from './components/Summary/Summary';
import { EXPANDED_TYPES } from './constants/tabConstants';

const FrontOffice = () => {
  const [searchParams] = useSearchParams();
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const autoExpandTab = searchParams.get('autoExpandTab');

  if (autoExpandTab) {
    setExpanded(autoExpandTab);
    searchParams.delete('autoExpandTab');
  }

  // NOTE: this method of controlling accordion open/close only allows for one to be open at a time
  // change method if required
  const toggleAccordion = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const iconContainerStyles = {
    width: '110px',
    minWidth: '110px',
    marginLeft: '-25px',
  };

  const sharedSummaryProps = {
    iconContainerStyles,
    iconAndTextGap: '0',
  };

  return (
    <StyledFlex p="0 22px 0 25px">
      <StyledAccordion
        expanded={expanded === EXPANDED_TYPES.SERVICE_TICKET_TYPE}
        onChange={toggleAccordion(EXPANDED_TYPES.SERVICE_TICKET_TYPE)}
      >
        <Summary
          Icon={TicketIcon}
          heading="Service Tickets Types"
          description="Manage service ticket settings and detail views"
          {...sharedSummaryProps}
        />
        <StyledAccordionDetails>
          <ServiceTicketTypes />
        </StyledAccordionDetails>
      </StyledAccordion>
      <StyledDivider color={colors.platinum} borderWidth={1.5} />
      <StyledAccordion
        expanded={expanded === EXPANDED_TYPES.CHAT_WIDGETS}
        onChange={toggleAccordion(EXPANDED_TYPES.CHAT_WIDGETS)}
      >
        <Summary
          Icon={WidgetsIcon}
          heading="Chat Widgets"
          description="Create and edit chat widgets, as well as customize their appearance, for agents."
          {...sharedSummaryProps}
        />
        <StyledAccordionDetails>
          <ChatWidgetTable />
        </StyledAccordionDetails>
      </StyledAccordion>
      <StyledDivider color={colors.platinum} borderWidth={1.5} />
      <StyledAccordion
        expanded={expanded === EXPANDED_TYPES.PHONE_NUMBER}
        onChange={toggleAccordion(EXPANDED_TYPES.PHONE_NUMBER)}
      >
        <Summary
          Icon={PhoneIcon}
          heading="Phone Number Management"
          description="Manage phone numbers for use with Agents and Processes."
          {...sharedSummaryProps}
        />
        <StyledAccordionDetails>
          <PhoneNumberManagementTable />
        </StyledAccordionDetails>
      </StyledAccordion>
      <StyledDivider color={colors.platinum} borderWidth={1.5} />
      <StyledAccordion
        expanded={expanded === EXPANDED_TYPES.DEFAULT_AGENT}
        onChange={toggleAccordion(EXPANDED_TYPES.DEFAULT_AGENT)}
      >
        <Summary
          Icon={AgentIcon}
          heading="Default Agent - Advanced Settings"
          description="Configure default settings for Agents, including user identification and transfer to human options."
          {...sharedSummaryProps}
        />
        <StyledAccordionDetails>
          <DefaultAgentAdvancedSettings />
        </StyledAccordionDetails>
      </StyledAccordion>
    </StyledFlex>
  );
};

export default FrontOffice;
