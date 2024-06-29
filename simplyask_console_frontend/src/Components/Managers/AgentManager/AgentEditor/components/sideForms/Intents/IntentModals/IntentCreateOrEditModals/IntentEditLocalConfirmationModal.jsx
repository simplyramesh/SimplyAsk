import ConfirmationModal from '../../../../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StyledText } from '../../../../../../../../shared/styles/styled';
import { StyledStrong } from '../../IntentsCreateOrEdit/IntentsCreateOrEdit';

const IntentEditLocalConfirmationModal = ({
  isOpen,
  closeModal,
  handleSubmit,
  values,
  isUpdateIntentApiLoading,
}) => (
  <ConfirmationModal
    isOpen={isOpen}
    onCloseModal={closeModal}
    onSuccessClick={() => handleSubmit(values)}
    alertType="WARNING"
    modalIconSize={70}
    successBtnText="Save Changes"
    cancelBtnText="Cancel"
    title="You Are About to Make This a Global Intent"
    titleTextAlign="center"
    isLoading={isUpdateIntentApiLoading}
  >
    <StyledText weight={400} size={15} lh={21} textAlign="center">
      You are about to change your local intent into a global intent. This is a
      {' '}
      <StyledStrong>permanent</StyledStrong>
      {' '}
      change that cannot be undone.
    </StyledText>
  </ConfirmationModal>
);

export default IntentEditLocalConfirmationModal;
