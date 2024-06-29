import React from 'react';

import SettingReporting from '../../../../Assets/icons/SettingReporting.svg?component';
import SettingsPublicForm from '../../../../Assets/icons/SettingsPublicForm.svg?component';
import SettingsTestEnv from '../../../../Assets/icons/SettingsTestEnv.svg?component';
import PublicSubmissionForm from '../../Components/PublicSubmissionForm/components/PublicSubmissionForm';
import ReportingTab from '../../Components/ReportingTab/ReportingTab';
import { StyledAccordion, StyledAccordionDetails, StyledDivider, StyledFlex } from '../../../shared/styles/styled';
import Summary from '../../Components/FrontOffice/components/Summary/Summary';
import { useTheme } from '@mui/material';
import EnvironmentsAndParameters from '../../Components/EnvironmentsAndParameters/EnvironmentsAndParameters';

const BackOfficeSettings = () => {
  const { colors } = useTheme();

  return (
    <StyledFlex p="0 22px 0 25px">
      <StyledAccordion>
        <Summary
          Icon={SettingsTestEnv}
          heading="Environments & Shared Parameter Sets"
          description="Define environments and associated parameter sets to share with one or more processes."
        />
        <StyledAccordionDetails>
          <EnvironmentsAndParameters />
        </StyledAccordionDetails>
      </StyledAccordion>
      <StyledDivider color={colors.platinum} borderWidth={2} />
      <StyledAccordion>
        <Summary
          Icon={SettingReporting}
          heading="Process Reporting"
          description="Configure automated reporting emails for recent process executions."
        />
        <StyledAccordionDetails p="20px 0">
          <ReportingTab />
        </StyledAccordionDetails>
      </StyledAccordion>
      <StyledDivider color={colors.platinum} borderWidth={2} />
      <StyledAccordion>
        <Summary
          Icon={SettingsPublicForm}
          heading="Public Submission Form Branding"
          description="Configure the appearance of your public submission form, including colouring and logo."
        />
        <StyledAccordionDetails p="20px 0">
          <PublicSubmissionForm />
        </StyledAccordionDetails>
      </StyledAccordion>
    </StyledFlex>
  );
};

export default BackOfficeSettings;
