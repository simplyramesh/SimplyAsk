import React from 'react';
import useFilteredPhoneNumbers from '../../../../../../../hooks/phoneNumberManagement/useFilteredPhoneNumbers';
import ConfirmationModal from '../../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import CustomSelect from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';

const PhoneNumberWithOnlyProcessesModal = ({
  isOpen,
  onCloseModal,
  onSuccessClick,
  isLoading,
  availableNumbers,
  phoneNumberTableRow,
  availableNumbersOnChange,
  phoneNumberValue,
  linkColor,
  onOpenGenerateNewPhoneNumberModal,
}) => {
  const [filteredAvailableNumbers, selectedPhoneNumber] = useFilteredPhoneNumbers(availableNumbers, phoneNumberValue);

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onCloseModal={onCloseModal}
      alertType="WARNING"
      title={'Action is Required'}
      modalIconSize={70}
      width={'604px'}
      successBtnText="Move & Delete"
      onSuccessClick={onSuccessClick}
      isLoading={isLoading}
      titleTextAlign="center"
    >
      <StyledFlex gap="20px 0" m="0px 5px">
        <StyledText display="inline" p="10px 20px" size={16} lh={16} weight={600} textAlign="center">
          <StyledText as="span" display="inline" size={14} lh={19}>
            You are about to delete <StyledText as="span" display="inline" size={14} weight={600}>{phoneNumberTableRow}</StyledText>.
            To complete this, you must move the currently associated Processes to a different number.
          </StyledText>
        </StyledText>
        <StyledText display="inline" size={14} mb={-12} weight={400} textAlign="center">
          Select a phone number:
        </StyledText>
        <CustomSelect
          options={filteredAvailableNumbers}
          placeholder="Select a Phone Number"
          onChange={availableNumbersOnChange}
          value={selectedPhoneNumber}
          form
          closeMenuOnSelect
          withSeparator
          menuPortalTarget={document.body}
        />
        <StyledText display="inline" size={16} weight={600} mt={-5} textAlign="center">
          Or
        </StyledText>
        <StyledText
          cursor="pointer"
          display="inline"
          color={linkColor}
          size={14}
          weight={500}
          textAlign="center"
          onClick={onOpenGenerateNewPhoneNumberModal}
        >
          Generate a New Number
        </StyledText>
      </StyledFlex>
    </ConfirmationModal>
  );
};

export default PhoneNumberWithOnlyProcessesModal;
