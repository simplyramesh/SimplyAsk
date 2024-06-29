import { useEffect } from 'react';

import RadioGroupSet from '../../../../../../../../shared/REDISIGNED/controls/Radio/RadioGroupSet';
import ConfirmationModal from '../../../../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StyledText, StyledFlex, StyledRadio } from '../../../../../../../../shared/styles/styled';
import { INTENT_DUPLICATE_UNSAVED_CHANGES, StyledStrong } from '../../IntentsCreateOrEdit/IntentsCreateOrEdit';

const IntentDuplicateConfirmationModal = ({
  isOpen,
  closeModal,
  handleDuplicateIntent,
  duplicateIntentModalRadio,
  setDuplicateIntentModalRadio,
}) => {
  useEffect(() => {
    setDuplicateIntentModalRadio(INTENT_DUPLICATE_UNSAVED_CHANGES.SAVE_UNSAVED_CHANGES);
  }, [isOpen]);

  const onRadioChange = (e) => {
    setDuplicateIntentModalRadio(e.target.value);
  };

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onCloseModal={closeModal}
      alertType="WARNING"
      title="You Are Duplicating an Intent with Unsaved Changes"
      modalIconSize={70}
      cancelBtnText="Cancel"
      successBtnText="Confirm"
      onSuccessClick={handleDuplicateIntent}
      // TODO
      // isLoading={isDeleteChatWidgetLoading}
      width="545px"
      titleTextAlign="center"

    >
      <StyledFlex gap="0" marginTop="6px">
        <StyledText display="inline" size={14} lh={16} textAlign="center" mb={0}>
          To avoid conflicts you can either:
        </StyledText>

        <RadioGroupSet
          row
          name={INTENT_DUPLICATE_UNSAVED_CHANGES.SAVE_UNSAVED_CHANGES}
          value={duplicateIntentModalRadio}
          onChange={onRadioChange}
          sx={{ padding: '1px', textAlign: 'left', '.MuiFormControlLabel-label': { marginTop: '20px' } }}
        >
          <StyledRadio
            value={INTENT_DUPLICATE_UNSAVED_CHANGES.SAVE_UNSAVED_CHANGES}
            label={(
              <StyledText size={14}>
                Save your unsaved changes
                {' '}
                <StyledStrong>and</StyledStrong>
                {' '}
                duplicate the intent with the changes (default option)
              </StyledText>
            )}
          />
        </RadioGroupSet>

        <RadioGroupSet
          row
          name={INTENT_DUPLICATE_UNSAVED_CHANGES.DISCARD_UNSAVED_CHANGES}
          value={duplicateIntentModalRadio}
          onChange={onRadioChange}
          sx={{ padding: '1px', textAlign: 'left', '.MuiFormControlLabel-label': { marginTop: '20px' } }}
        >
          <StyledRadio
            value={INTENT_DUPLICATE_UNSAVED_CHANGES.DISCARD_UNSAVED_CHANGES}
            label={(
              <StyledText size={14}>
                Discard your unsaved changes
                {' '}
                <StyledStrong>and</StyledStrong>
                {' '}
                duplicate the intent without the changes
              </StyledText>
            )}
          />
        </RadioGroupSet>
      </StyledFlex>
    </ConfirmationModal>
  );
};

export default IntentDuplicateConfirmationModal;
