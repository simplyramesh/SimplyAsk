import ConfirmationModal from '../../../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StyledFlex, StyledText } from '../../../../../../../shared/styles/styled';

const ChatWidgetDeleteNoWidgetsAvailableModal = ({
  isOpen = false,
  setClose = () => {},
  isDeleteChatWidgetLoading,
  handleWidgetDeletion,
  clickedTableRow,
}) => (
  <ConfirmationModal
    isOpen={isOpen}
    onCloseModal={setClose}
    alertType="WARNING"
    title="Are You Sure?"
    modalIconSize={70}
    successBtnDanger
    successBtnText="Delete"
    onSuccessClick={() => handleWidgetDeletion(true)}
    isLoading={isDeleteChatWidgetLoading}
    titleTextAlign="center"
  >
    <StyledFlex gap="17px 0">
      <StyledText display="inline" size={16} lh={16} weight={600} textAlign="center">
        <StyledText as="span" display="inline" size={14} lh={19}>
          You are about to delete
        </StyledText>
        <StyledText as="span" display="inline" size={14} lh={19} weight={700}>{` ${clickedTableRow?.name}. `}</StyledText>
        <StyledText as="span" display="inline" size={14} lh={19}>
          As there are no other chat widgets to migrate the assigned agents to, upon deletion,
          all agents associated with this widget will be unassigned.
        </StyledText>
      </StyledText>

    </StyledFlex>
  </ConfirmationModal>
);

export default ChatWidgetDeleteNoWidgetsAvailableModal;
