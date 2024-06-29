import React, { useState } from 'react';
import EditIcon from '../../../../Assets/icons/EditIcon.svg?component';
import { StyledButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';
import InfoListItem from '../../../shared/REDISIGNED/layouts/InfoList/InfoListItem';
import Spinner from '../../../shared/Spinner/Spinner';
import { StyledCard, StyledEmptyValue, StyledFlex, StyledText } from '../../../shared/styles/styled';
import EditOrganization from './EditOrganization/EditOrganization';
import useGetOrgDetails from './hooks/useGetOrgDetails';
import { ORGANIZATION_SETTINGS_API_KEYS, ORGANIZATION_SETTINGS_LABELS } from './utils/constants';

const OrganizationDetails = () => {
  const { organizationDetails, isOrganizationDetailsFetching } = useGetOrgDetails();

  const [showEditOrganizationDetails, setShowEditOrganizationDetails] = useState(false);

  const sharedInfoListProps = {
    alignItems: 'center',
    nameStyles: {
      weight: '600',
    },
  };

  const sharedStyledFlexProps = {
    alignItems: 'flex-end',
  };

  const renderText = (value) => <StyledText>{organizationDetails?.[value] || <StyledEmptyValue />}</StyledText>;

  return (
    <StyledFlex position="relative" width="755px">
      <StyledCard>
        {isOrganizationDetailsFetching && <Spinner fadeBgParent />}

        <StyledFlex marginTop="5px">
          <StyledFlex direction="row" justifyContent="space-between" height="38px">
            <StyledText weight="600" size={19} ml={12}>
              Organization Profile
            </StyledText>

            {!showEditOrganizationDetails && (
              <StyledButton
                variant="contained"
                tertiary
                startIcon={<EditIcon />}
                onClick={() => setShowEditOrganizationDetails(true)}
              >
                Edit Profile
              </StyledButton>
            )}
          </StyledFlex>
        </StyledFlex>

        {!showEditOrganizationDetails ? (
          <StyledFlex marginTop="5px">
            <InfoListItem name={ORGANIZATION_SETTINGS_LABELS.COMPANY_NAME} {...sharedInfoListProps}>
              <StyledFlex {...sharedStyledFlexProps}>{renderText(ORGANIZATION_SETTINGS_API_KEYS.ORG_NAME)}</StyledFlex>
            </InfoListItem>

            <InfoListItem name={ORGANIZATION_SETTINGS_LABELS.COUNTRY} {...sharedInfoListProps}>
              <StyledFlex {...sharedStyledFlexProps}>{renderText(ORGANIZATION_SETTINGS_API_KEYS.COUNTRY)}</StyledFlex>
            </InfoListItem>

            <InfoListItem name={ORGANIZATION_SETTINGS_LABELS.STREET_ADDRESS_1} {...sharedInfoListProps}>
              <StyledFlex {...sharedStyledFlexProps}>
                {renderText(ORGANIZATION_SETTINGS_API_KEYS.STREET_ADDRESS_1)}
              </StyledFlex>
            </InfoListItem>

            <InfoListItem name={ORGANIZATION_SETTINGS_LABELS.STREET_ADDRESS_2} {...sharedInfoListProps}>
              <StyledFlex {...sharedStyledFlexProps}>
                {renderText(ORGANIZATION_SETTINGS_API_KEYS.STREET_ADDRESS_2)}
              </StyledFlex>
            </InfoListItem>

            <InfoListItem name={ORGANIZATION_SETTINGS_LABELS.CITY} {...sharedInfoListProps}>
              <StyledFlex {...sharedStyledFlexProps}>{renderText(ORGANIZATION_SETTINGS_API_KEYS.CITY)}</StyledFlex>
            </InfoListItem>

            <InfoListItem name={ORGANIZATION_SETTINGS_LABELS.PROVINCE} {...sharedInfoListProps}>
              <StyledFlex {...sharedStyledFlexProps}>{renderText(ORGANIZATION_SETTINGS_API_KEYS.PROVINCE)}</StyledFlex>
            </InfoListItem>

            <InfoListItem name={ORGANIZATION_SETTINGS_LABELS.POSTAL_CODE} {...sharedInfoListProps}>
              <StyledFlex {...sharedStyledFlexProps}>
                {renderText(ORGANIZATION_SETTINGS_API_KEYS.POSTAL_CODE)}
              </StyledFlex>
            </InfoListItem>

            <InfoListItem name={ORGANIZATION_SETTINGS_LABELS.PHONE_NUMBER} {...sharedInfoListProps}>
              <StyledFlex {...sharedStyledFlexProps}>
                {renderText(ORGANIZATION_SETTINGS_API_KEYS.PHONE_NUMBER)}
              </StyledFlex>
            </InfoListItem>

            <InfoListItem name={ORGANIZATION_SETTINGS_LABELS.NUMBER_OF_EMPLOYEES} {...sharedInfoListProps}>
              <StyledFlex {...sharedStyledFlexProps}>
                {renderText(ORGANIZATION_SETTINGS_API_KEYS.NUMBER_OF_EMPLOYEES)}
              </StyledFlex>
            </InfoListItem>
          </StyledFlex>
        ) : (
          <EditOrganization data={organizationDetails} onClose={() => setShowEditOrganizationDetails(false)} />
        )}
      </StyledCard>
    </StyledFlex>
  );
};

export default OrganizationDetails;
