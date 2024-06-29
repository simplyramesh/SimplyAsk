import ConfirmationModal from '../../../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StyledFlex, StyledText } from '../../../../../../../shared/styles/styled';

const ChatWidgetDeleteNoAgentsModal = ({
  isOpen = false,
  setClose = () => {},
  clickedTableRow,
  handleWidgetDeletion,
  isDeleteChatWidgetLoading,
}) => (
  <ConfirmationModal
    isOpen={isOpen}
    onCloseModal={setClose}
    alertType="WARNING"
    title={`Delete "${clickedTableRow?.name}"?`}
    modalIconSize={70}
    successBtnDanger
    successBtnText="Delete"
    onSuccessClick={handleWidgetDeletion}
    isLoading={isDeleteChatWidgetLoading}
    titleTextAlign="center"
  >
    <StyledFlex gap="17px 0">
      <StyledText display="inline" size={16} lh={16} weight={600} textAlign="center">
        <StyledText as="span" display="inline" size={14} lh={19}>
          Are you sure you want to delete this chat widget? This action cannot be reversed.
        </StyledText>
      </StyledText>
    </StyledFlex>
  </ConfirmationModal>
);

export default ChatWidgetDeleteNoAgentsModal;
