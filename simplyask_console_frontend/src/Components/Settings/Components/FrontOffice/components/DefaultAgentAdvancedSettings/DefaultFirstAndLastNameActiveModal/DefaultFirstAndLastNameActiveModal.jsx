import ConfirmationModal from "../../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal"
import { StyledFlex, StyledText } from "../../../../../../shared/styles/styled"

const DefaultFirstAndLastNameActiveModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      alertType="WARNING"
      titleCustom={
        <StyledText as="h3" size={18} lh={28} weight={600} textAlign="center">
          You Currently have "First Name" or "Last Name" Active
        </StyledText>
      }
      successBtnText="Confirm"
      onCloseModal={() => onClose(false)}
      onSuccessClick={onConfirm}
      width="530px"
    >
      <StyledFlex display="inline" as="p">
        <StyledText as="span" display="inline" size={14} lh={20}>
          You cannot have "First Name" or "Last Name" on at the same time as "Full Name". By turning on "Full Name", "First Name" and "Last Name" will be
        </StyledText>
        <StyledText as="span" display="inline" size={14} lh={20} weight={700}>
          {' turned off. '}
        </StyledText>
      </StyledFlex>
      <StyledFlex mt="10px">
        <StyledText as="span" size={14} lh={20}>
          Click "Confirm" below to activate the "Full Name" field
        </StyledText>
      </StyledFlex>
    </ConfirmationModal>
  )
}

export default DefaultFirstAndLastNameActiveModal