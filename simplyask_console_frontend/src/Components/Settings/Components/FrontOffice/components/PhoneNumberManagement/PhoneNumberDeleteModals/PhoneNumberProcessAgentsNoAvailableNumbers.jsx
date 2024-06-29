import React from 'react'
import ConfirmationModal from '../../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal'
import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled'


const PhoneNumberProcessAgentsNoAvailableNumbersModal = ({ isOpen, onCloseModal, onSuccessClick, isLoading, phoneNumberTableRow, linkColor, onOpenGenerateNewPhoneNumberModal }) => {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onCloseModal={onCloseModal}
      alertType="WARNING"
      title={'Action is Required'}
      modalIconSize={70}
      successBtnText="Move & Delete"
      onSuccessClick={onSuccessClick}
      isLoading={isLoading}
      titleTextAlign="center"
    >
      <StyledFlex gap="20px 0" m="0px 5px">
        <StyledText display="inline" p="10px 15px" size={16} lh={16} weight={600} textAlign="center">
          <StyledText as="span" display="inline" size={14} lh={19}>
            You are about to delete <StyledText as="span" display="inline" size={14} weight={600}>{phoneNumberTableRow}</StyledText>.
            To complete this, you must move the currently associated Processes and Agent to a different number. As there can only be 1 Agent per number, the only numbers available will be
            ones currently without agents.
          </StyledText>
        </StyledText>
        <StyledText display="inline" size={14} lh={19} weight={400} textAlign="center" p="0px 10px">
          Currently, <StyledText as="span" size={14} lh={19} display="inline" weight={600}>there are no available phone numbers.</StyledText> Generate a new one first in order to proceed.
        </StyledText>
        <StyledText cursor="pointer" display="inline" color={linkColor} size={14} weight={500} textAlign="center" onClick={onOpenGenerateNewPhoneNumberModal} >
          Generate a New Number
        </StyledText>
      </StyledFlex>
    </ConfirmationModal>
  )
}

export default PhoneNumberProcessAgentsNoAvailableNumbersModal