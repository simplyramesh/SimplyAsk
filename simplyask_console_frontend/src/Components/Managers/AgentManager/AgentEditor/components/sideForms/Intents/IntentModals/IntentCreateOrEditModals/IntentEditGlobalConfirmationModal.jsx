import ConfirmationModal from '../../../../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StyledText } from '../../../../../../../../shared/styles/styled';
import { StyledStrong } from '../../IntentsCreateOrEdit/IntentsCreateOrEdit';

const IntentEditGlobalConfirmationModal = ({
  isOpen,
  closeModal,
  handleSubmit,
  values,
  clickedIntent,
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
    title="Are You Sure?"
    titleTextAlign="center"
    isLoading={isUpdateIntentApiLoading}
  >
    <StyledText weight={400} size={15} lh={21} textAlign="center">
      You are about to change the settings of
      {' '}
      <StyledStrong>
        {clickedIntent?.name}
      </StyledStrong>
      {' '}
      . These changes will be applied to
      {' '}
      <StyledStrong>all</StyledStrong>
      {' '}
      agents using this intent
    </StyledText>
  </ConfirmationModal>
);

export default IntentEditGlobalConfirmationModal;
