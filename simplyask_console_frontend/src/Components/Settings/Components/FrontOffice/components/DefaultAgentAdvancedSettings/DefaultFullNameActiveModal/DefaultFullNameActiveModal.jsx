import ConfirmationModal from "../../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal";
import { StyledFlex, StyledText } from "../../../../../../shared/styles/styled";


const DefaultFullNameActiveModal = ({ isOpen, onClose, onConfirm, fieldToOpen }) => {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      alertType="WARNING"
      title={`You Currently have "Full Name" Active`}
      successBtnText="Confirm"
      onCloseModal={onClose}
      onSuccessClick={onConfirm}
      width="530px"
    >
      <StyledFlex display="inline" as="p">
        <StyledText as="span" display="inline" size={14} lh={20}>
          You cannot have "Full Name" and {fieldToOpen} on at the same time. By turning on {fieldToOpen}, "Full Name" will be
        </StyledText>
        <StyledText as="span" display="inline" size={14} lh={20} weight={700}>
          {' turned off. '}
        </StyledText>
      </StyledFlex>
      <StyledFlex mt="10px">
        <StyledText as="span" size={14} lh={20}>
          Click "Confirm" below to activate the {fieldToOpen} field
        </StyledText>
      </StyledFlex>
    </ConfirmationModal>
  )
}

export default DefaultFullNameActiveModal;