import { useState } from 'react';

import EditIcon from '../../../../../Assets/icons/EditIcon.svg?component';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InfoListItem from '../../../../shared/REDISIGNED/layouts/InfoList/InfoListItem';
import Spinner from '../../../../shared/Spinner/Spinner';
import { StyledFlex, StyledCard, StyledText, StyledColorSquare } from '../../../../shared/styles/styled';
import useGetPublicFormConfig from '../hooks/useGetPublicFormConfig';
import { PUBLIC_FORM_THEME_VALUES } from '../utils/constants';

import CreatePublicSubmissionForm from './CreatePublicSubmissionForm/CreatePublicSubmissionForm';
import { StyledFormLogo, StyledFormBgLogo } from './StyledPublicSubmissionForm';

const PublicSubmissionForm = () => {
  const { publicFormConfigValues, isPublicFormConfigValuesLoading } = useGetPublicFormConfig();

  const [openCreateFormModal, setOpenCreateFormModal] = useState(false);

  const renderColor = (color) => (
    <StyledFlex direction="row" gap="7px">
      <StyledColorSquare backgroundColor={color} cursor="default" />
      <StyledText uppercase>{color}</StyledText>
    </StyledFlex>
  );

  const renderText = (text) => text || '';

  const isLoading = isPublicFormConfigValuesLoading;

  return (
    <StyledFlex width="753px" position="relative">
      <StyledCard p="22px 18px 12px 18px">
        {isLoading && <Spinner fadeBgParent />}

        <StyledFlex direction="row" justifyContent="space-between" padding="0 14px 12px 14px">
          <StyledText size={19} weight={600}>
            Form Configurations
          </StyledText>
          <StyledButton
            variant="contained"
            tertiary
            startIcon={<EditIcon />}
            onClick={() => setOpenCreateFormModal(true)}
          >
            Edit Form
          </StyledButton>
        </StyledFlex>

        <InfoListItem name="Theme" alignItems="center">
          {renderText(publicFormConfigValues?.theme)}
        </InfoListItem>
        <InfoListItem name="Button Colour" alignItems="center">
          {renderColor(publicFormConfigValues?.buttonColourHex)}
        </InfoListItem>
        <InfoListItem name="Button Text Colour" alignItems="center">
          {renderColor(publicFormConfigValues?.buttonTextColourHex)}
        </InfoListItem>
        <InfoListItem name="Accent Colour" alignItems="center">
          {renderColor(publicFormConfigValues?.accentColourHex)}
        </InfoListItem>
        <InfoListItem name="Font" alignItems="center">
          <StyledText textAlign="right" ff={publicFormConfigValues?.font}>
            {renderText(publicFormConfigValues?.font)}
          </StyledText>
        </InfoListItem>
        <InfoListItem name="Logo" alignItems="center">
          <StyledFormLogo src={publicFormConfigValues?.logo} alt="Logo" />
        </InfoListItem>

        {publicFormConfigValues?.theme === PUBLIC_FORM_THEME_VALUES.LIGHT && (
          <>
            <InfoListItem name="Page Colour" alignItems="center">
              {renderColor(publicFormConfigValues?.pageColourHex)}
            </InfoListItem>
            <InfoListItem name="Banner Colour" alignItems="center">
              {renderColor(publicFormConfigValues?.headerColourHex)}
            </InfoListItem>
          </>
        )}

        <InfoListItem name="Background Image" alignItems="center">
          {publicFormConfigValues?.backgroundImage ? (
            <StyledFormBgLogo src={publicFormConfigValues?.backgroundImage} maxHeight="60px" maxWidth="60px" />
          ) : (
            renderText('None')
          )}
        </InfoListItem>
      </StyledCard>

      {openCreateFormModal && (
        <CreatePublicSubmissionForm
          open={openCreateFormModal}
          onClose={() => setOpenCreateFormModal(false)}
          publicFormConfigValues={publicFormConfigValues}
        />
      )}
    </StyledFlex>
  );
};

export default PublicSubmissionForm;
