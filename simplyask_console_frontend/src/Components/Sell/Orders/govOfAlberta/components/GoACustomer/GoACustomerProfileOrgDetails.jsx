import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useState } from 'react';

import InfoList from '../../../../../shared/REDISIGNED/layouts/InfoList/InfoList';
import InfoListGroup from '../../../../../shared/REDISIGNED/layouts/InfoList/InfoListGroup';
import InfoListItem from '../../../../../shared/REDISIGNED/layouts/InfoList/InfoListItem';
import {
  StyledDivider, StyledFlex, StyledIconButton,
} from '../../../../../shared/styles/styled';
import { PRODUCT_FILTERS } from '../../../../constants/productInitialValues';

const GoACustomerProfileOrgDetails = ({ customers }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const password = passwordVisible ? customers?.[PRODUCT_FILTERS.PASSWORD] : '**********';
  const visibilityIcon = passwordVisible ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />;
  const infoListNameStyles = { wrap: 'nowrap' };

  return (
    <StyledFlex pt="30px" pb="60px" gap="30px 0">
      <StyledDivider />
      <InfoList>
        <InfoListGroup title="Organization Details">
          <InfoListItem name="Organization" nameStyles={infoListNameStyles}>{customers?.[PRODUCT_FILTERS.ORGANIZATION] || ''}</InfoListItem>
          <InfoListItem name="Department" nameStyles={infoListNameStyles}>{customers?.[PRODUCT_FILTERS.DEPARTMENT] || ''}</InfoListItem>
          <InfoListItem name="Cost Center Code" nameStyles={infoListNameStyles}>{customers?.[PRODUCT_FILTERS.COST_CENTER_ID] || ''}</InfoListItem>
          <InfoListItem name="Title" nameStyles={infoListNameStyles}>{customers?.[PRODUCT_FILTERS.TITLE] || '---'}</InfoListItem>
          <InfoListItem name="Role" nameStyles={infoListNameStyles}>{customers?.[PRODUCT_FILTERS.ROLE] || '---'}</InfoListItem>
          <InfoListItem name="Badge Number" nameStyles={infoListNameStyles}>{customers?.[PRODUCT_FILTERS.BADGE_NUMBER] || '---'}</InfoListItem>
          <InfoListItem name="Escalation Contact 1" nameStyles={infoListNameStyles}>{customers?.[PRODUCT_FILTERS.ESCALATION_CONTACT_1] || '---'}</InfoListItem>
          <InfoListItem name="Escalation Contact 2" nameStyles={infoListNameStyles}>{customers?.[PRODUCT_FILTERS.ESCALATION_CONTACT_2] || '---'}</InfoListItem>
          <InfoListItem name="Escalation Contact 3" nameStyles={infoListNameStyles}>{customers?.[PRODUCT_FILTERS.ESCALATION_CONTACT_3] || '---'}</InfoListItem>
          <InfoListItem name="Escalation Contact 4" nameStyles={infoListNameStyles}>{customers?.[PRODUCT_FILTERS.ESCALATION_CONTACT_4] || '---'}</InfoListItem>
          <InfoListItem name="Escalation Contact 5" nameStyles={infoListNameStyles}>{customers?.[PRODUCT_FILTERS.ESCALATION_CONTACT_5] || '---'}</InfoListItem>
          <InfoListItem name="User Name" nameStyles={infoListNameStyles}>{customers?.[PRODUCT_FILTERS.USERNAME] || ''}</InfoListItem>
          <InfoListItem name="Password" nameStyles={infoListNameStyles}>
            <StyledFlex direction="row" alignItems="center" justifyContent="center" gap="0 12px">
              {password}
              <StyledIconButton
                iconSize="24px"
                bgColor="transparent"
                hoverBgColor="transparent"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {visibilityIcon}
              </StyledIconButton>
            </StyledFlex>
          </InfoListItem>
        </InfoListGroup>
      </InfoList>

    </StyledFlex>
  );
};

export default GoACustomerProfileOrgDetails;
