import ConfirmationModal from '../../../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';

const IntentDeleteConfirmationModal = ({
  isOpen,
  closeModal,
  handleDeleteIntent,
  values,
  isDeleteIntentApiLoading,
}) => (
  <ConfirmationModal
    isOpen={isOpen}
    onCloseModal={closeModal}
    onSuccessClick={handleDeleteIntent}
    alertType="WARNING"
    modalIconSize={70}
    successBtnText="Delete"
    cancelBtnText="Cancel"
    title="Are You Sure?"
    text={`You are about to delete a ${values?.name}.`}
    titleTextAlign="center"
    isLoading={isDeleteIntentApiLoading}
  />
);

export default IntentDeleteConfirmationModal;
