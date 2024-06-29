import RadioGroupSet from '../../../../../../../shared/REDISIGNED/controls/Radio/RadioGroupSet';
import ConfirmationModal from '../../../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import CustomIndicatorArrow from '../../../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomSelect from '../../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledFlex, StyledText, StyledRadio } from '../../../../../../../shared/styles/styled';
import { DELETE_MODAL_RADIO } from '../../../../constants/common';

const ChatWidgetDeleteMigrateAgentsModal = ({
  isOpen = false,
  setClose = () => {},
  isDeleteChatWidgetLoading,
  handleWidgetDeletion,
  clickedTableRow,
  filterClickedWidget,
  selectedChatWidget,
  setSelectedChatWidget,
  isAgentAssignEnabled,
  setIsAgentAssignEnabled,
}) => {
  const onRadioChange = (e) => {
    const { value } = e.target;
    setIsAgentAssignEnabled(value);
  };

  const handleLocalDeletion = () => {
    isAgentAssignEnabled === DELETE_MODAL_RADIO.MIGRATE_AGENTS
      ? handleWidgetDeletion(false, selectedChatWidget?.widgetId)
      : handleWidgetDeletion(true);
  };

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onCloseModal={setClose}
      alertType="WARNING"
      title="Action is Required"
      modalIconSize={70}
      successBtnDanger
      successBtnText="Delete"
      onSuccessClick={handleLocalDeletion}
      isLoading={isDeleteChatWidgetLoading}
      width="555px"
      isSuccessBtnDisabled={isAgentAssignEnabled === DELETE_MODAL_RADIO.MIGRATE_AGENTS && !selectedChatWidget}
      titleTextAlign="center"
    >
      <StyledFlex gap="17px 0">
        <StyledText display="inline" size={16} lh={16} weight={600} textAlign="center" mb={-10}>
          <StyledText as="span" display="inline" size={14} lh={19}>
            You are about to delete
          </StyledText>
          <StyledText as="span" display="inline" size={14} lh={19} weight={700}>{` ${clickedTableRow?.name}. `}</StyledText>
          <StyledText as="span" display="inline" size={14} lh={19}>
            To complete this,
          </StyledText>
          <StyledText display="block" size={14} lh={16} textAlign="center">
            you must either:
          </StyledText>
        </StyledText>

        <RadioGroupSet
          row
          name="isAgentAssignEnabled"
          value={isAgentAssignEnabled}
          onChange={onRadioChange}
          sx={{ padding: '1px', textAlign: 'left', '.MuiFormControlLabel-label': { marginTop: '20px' } }}
        >
          <StyledRadio
            value={DELETE_MODAL_RADIO.MIGRATE_AGENTS}
            label="Migrate all assigned Agents to another chat widget (default option)"
            size={14}
          />
        </RadioGroupSet>

        <CustomSelect
          name="chatWidgets"
          placeholder="Select Chat Widget"
          form
          options={filterClickedWidget ?? []}
          value={selectedChatWidget}
          onChange={setSelectedChatWidget}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.widgetId}
          components={{
            DropdownIndicator: CustomIndicatorArrow,
          }}
          isSearchable
          minMenuHeight={150}
          hideSelectedOptions={false}
          isClearable={false}
          openMenuOnClick
          closeMenuOnSelect
          maxHeight={30}
          menuPadding={0}
          menuPortalTarget={document.body}
          maxMenuHeight={200}
        />

        <RadioGroupSet
          row
          name="isAgentAssignDisabled"
          value={isAgentAssignEnabled}
          onChange={onRadioChange}
          sx={{ padding: '1px', textAlign: 'left' }}
        >
          <StyledRadio
            value={DELETE_MODAL_RADIO.NO_MIGRATE_AGENTS}
            label="Unassign all Agents"
            size={14}
          />
        </RadioGroupSet>
      </StyledFlex>
    </ConfirmationModal>
  );
};

export default ChatWidgetDeleteMigrateAgentsModal;
