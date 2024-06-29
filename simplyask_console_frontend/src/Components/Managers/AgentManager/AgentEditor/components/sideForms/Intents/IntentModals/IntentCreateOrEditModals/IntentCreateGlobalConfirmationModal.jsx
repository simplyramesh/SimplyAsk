import ConfirmationModal from '../../../../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';

const IntentCreateGlobalConfirmationModal = ({
  isOpen,
  closeModal,
  handleSubmit,
  values,
  isCreateNewIntentApiLoading,
}) => (
  <ConfirmationModal
    isOpen={isOpen}
    onCloseModal={closeModal}
    onSuccessClick={() => handleSubmit(values)}
    alertType="WARNING"
    modalIconSize={70}
    successBtnText="Create Intent"
    cancelBtnText="Cancel"
    title="Are You Sure?"
    text="You have chosen to make this a global intent. Once saved, this change cannot be undone"
    titleTextAlign="center"
    isLoading={isCreateNewIntentApiLoading}
  />
);

export default IntentCreateGlobalConfirmationModal;
