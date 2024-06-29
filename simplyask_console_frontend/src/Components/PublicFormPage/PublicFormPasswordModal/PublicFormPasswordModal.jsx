import FormErrorMessage from '../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import { StyledButton } from '../../shared/REDISIGNED/controls/Button/StyledButton';
import PasswordInput from '../../shared/REDISIGNED/controls/PasswordInput/PasswordInput';
import { StyledFixedModalBody, StyledFixedModalFooter } from '../../shared/REDISIGNED/modals/CenterModalFixed/StyledCenterModal';
import { StyledFlex, StyledText } from '../../shared/styles/styled';
import { StyledPasswordModal, StyledPasswordModalHead } from '../StyledPublicFormPage';

const PublicFormPasswordModal = ({
  isOpen, onConfirm, onPasswordChange, password, error,
}) => (
  <StyledPasswordModal
    fullWidth
    maxWidth="455px"
    open={isOpen}
    aria-labelledby="scroll-dialog-title"
    aria-describedby="scroll-dialog-isOpen"
    keepMounted={false}
  >
    <StyledPasswordModalHead>
      Enter Password
    </StyledPasswordModalHead>
    <StyledFixedModalBody
      bodyPadding="26px 20px 0px 20px"
    >
      <StyledFlex gap="14px 0">
        <StyledText as="p" size={14} lh={19}>
          This form is password protected.
        </StyledText>
        <StyledText as="p" size={14} lh={19}>
          Please enter the password below to access the content.
        </StyledText>
      </StyledFlex>
      <StyledFlex mt="30px">
        <PasswordInput
          onChange={onPasswordChange}
          initialValue={password}
          invalid={error}
        />
        {error
          ? <FormErrorMessage>{error}</FormErrorMessage>
          : null}
      </StyledFlex>
    </StyledFixedModalBody>
    <StyledFixedModalFooter>
      <StyledButton
        primary
        variant="contained"
        onClick={onConfirm}
      >
        Confirm
      </StyledButton>
    </StyledFixedModalFooter>
  </StyledPasswordModal>
);

export default PublicFormPasswordModal;
