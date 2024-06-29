import React from 'react';

import ConfirmationModal from '../../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';

const PhoneNumberNoProcessNoAgentsDeleteModal = ({
  isOpen, onCloseModal, title, onSuccessClick, isPhoneNumberDeleting,
}) => (
  <ConfirmationModal
    isOpen={isOpen}
    onCloseModal={onCloseModal}
    alertType="WARNING"
    title={title}
    modalIconSize={70}
    successBtnText="Delete"
    onSuccessClick={onSuccessClick}
    isLoading={isPhoneNumberDeleting}
    titleTextAlign="center"
    thumbWidth="0px"
  >
    <StyledFlex gap="17px 0">
      <StyledText display="inline" size={16} lh={16} weight={600} textAlign="center">
        <StyledText as="span" display="inline" size={14} lh={19}>
          Are you sure you want to delete this phone number? This action cannot be reversed.
        </StyledText>
      </StyledText>
    </StyledFlex>
  </ConfirmationModal>
);

export default PhoneNumberNoProcessNoAgentsDeleteModal;
