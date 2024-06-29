import { useTheme } from '@emotion/react';
import { useState } from 'react';
import BulbIcon from '../../../../Assets/icons/bulbIcon.svg?component';
import SettingsOrganization from '../../../../Assets/icons/SettingsOrganization.svg?component';
import { StyledAccordion, StyledAccordionDetails, StyledDivider, StyledFlex } from '../../../shared/styles/styled';
import Summary from '../FrontOffice/components/Summary/Summary';
import OrganizationDetails from '../OrganizationDetails/OrganizationDetails';
import SimplyAssistantKnowledgeBases from './components/SimplyAssistantKnowledgeBases/SimplyAssistantKnowledgeBases';
import { GENERAL_SETTINGS_EXPANDED_TYPES } from './utils/constants';

const GeneralSettings = () => {
  const { colors } = useTheme();

  const [expanded, setExpanded] = useState(null);

  const toggleAccordion = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
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
        expanded={expanded === GENERAL_SETTINGS_EXPANDED_TYPES.ORGANIZATION_DETAILS}
        onChange={toggleAccordion(GENERAL_SETTINGS_EXPANDED_TYPES.ORGANIZATION_DETAILS)}
      >
        <Summary
          Icon={SettingsOrganization}
          heading="Organization Details"
          description="Configure organization account details"
          {...sharedSummaryProps}
        />
        <StyledAccordionDetails>
          <OrganizationDetails />
        </StyledAccordionDetails>
      </StyledAccordion>
      <StyledDivider color={colors.platinum} borderWidth={1.5} />
      <StyledAccordion
        expanded={expanded === GENERAL_SETTINGS_EXPANDED_TYPES.KNOWLEDGE_BASES}
        onChange={toggleAccordion(GENERAL_SETTINGS_EXPANDED_TYPES.KNOWLEDGE_BASES)}
      >
        <Summary
          Icon={BulbIcon}
          heading="SimplyAssistant Knowledge Bases"
          descriptionMaxWidth="1100px"
          description="Create and edit chat widgets, as well as customize their appearance, for agents.Configure knowledge bases trained on organization data (documents, text, websites, APIs, etc.) for use with SimplyAssistant in Agents and Processes"
          {...sharedSummaryProps}
        />
        <StyledAccordionDetails>
          <SimplyAssistantKnowledgeBases />
        </StyledAccordionDetails>
      </StyledAccordion>
    </StyledFlex>
  );
};

export default GeneralSettings;
