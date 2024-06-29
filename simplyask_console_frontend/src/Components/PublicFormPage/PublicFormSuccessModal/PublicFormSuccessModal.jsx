import ConfirmationModal from '../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StyledFlex } from '../../shared/styles/styled';
import { StyledFormButton } from '../StyledPublicFormPage';

const PublicFormSuccessModal = ({ isOpen, onClose, iconColor, buttonColourHex, buttonTextColourHex, isDarkTheme }) => (
  <ConfirmationModal
    isOpen={isOpen}
    onCloseModal={onClose}
    modalIcon="FORM_RECEIVED"
    modalIconColor={iconColor}
    modalIconSize={168}
    isDarkTheme={isDarkTheme}
    title="Your Form Has Been Received!"
    text="Thank you for your submission. You can exit out of the page, or close this pop to submit another form, if needed."
    customFooter={
      <StyledFlex alignItems="center" justifyContent="center" width="100%">
        <StyledFlex width="168px">
          <StyledFormButton
            variant="contained"
            secondary
            buttonColourHex={buttonColourHex}
            buttonTextColourHex={buttonTextColourHex}
            onClick={onClose}
          >
            Close
          </StyledFormButton>
        </StyledFlex>
      </StyledFlex>
    }
  />
);

export default PublicFormSuccessModal;
