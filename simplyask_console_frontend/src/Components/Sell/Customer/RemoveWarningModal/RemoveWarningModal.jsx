import React from 'react';
import ConfirmationModal from "../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal";
import { StyledFlex, StyledText } from "../../../shared/styles/styled";
import PropTypes from "prop-types";


const RemoveWarningModal = ({
  open, onClose, onDelete, selectedCustomers, selectedCustomerName
}) => {

  const messageText = (name, selectedCustomerIds) => {
    if(selectedCustomerIds > 1) {
      return (
        <>
          You are about to delete the profiles for
          <strong> {selectedCustomerIds}</strong> customers. All data associated with the customer will be permanently lost, and cannot be recovered.
        </>)
    } else {
      return (
        <>
          You are about to delete the profile for
          <strong> {name}</strong>. All data associated with the customer will be permanently lost, and cannot be recovered.
        </>
      )
    }
  }

  return (
    <ConfirmationModal
      isOpen={open}
      onCloseModal={onClose}
      alertType="DANGER"
      title={"Are You Sure?"}
      modalIcon="BANG_CIRCLE"
      modalIconSize={76}
      successBtnDanger
      onSuccessClick={onDelete}
    >
      <StyledFlex gap="17px 0">
        <StyledText textAlign="center" size={14} weight={400}>
          {messageText(selectedCustomerName, selectedCustomers)}
        </StyledText>
      </StyledFlex>
    </ConfirmationModal>
  );
};

export default RemoveWarningModal;
RemoveWarningModal.propTypes = {
  isOpen: PropTypes.func,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
  selectedCustomerName: PropTypes.string,
  selectedCustomers: PropTypes.number,
};