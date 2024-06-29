import { StyledFlex } from '../../../../../../../shared/styles/styled';
import { CustomBlackStyledButton, CustomOrangeStyledButton } from '../../../StyledProcessTriggerExecuteProcess';

const ToggleButtons = ({ buttonClickedOn, setButtonClickedOn }) => (
  <StyledFlex display="flex" flexDirection="row" mb={4}>
    {buttonClickedOn.formEntryState ? (
      <CustomOrangeStyledButton borderradiusleft="10px 0px 0px 10px" borderwidthleft="2px 1px 2px 2px">
        Form Entry
      </CustomOrangeStyledButton>
    ) : (
      <CustomBlackStyledButton
        onClick={() => {
          setButtonClickedOn({ fileUploadState: false, formEntryState: true });
        }}
        borderradiusleft="10px 0px 0px 10px"
        borderwidthleft="2px 1px 2px 2px"
      >
        Form Entry
      </CustomBlackStyledButton>
    )}

    {buttonClickedOn.fileUploadState ? (
      <CustomOrangeStyledButton ml="-2px" borderradiusleft="0 10px 10px 0px" borderwidthleft="2px 2px 2px 1px">
        File Upload
      </CustomOrangeStyledButton>
    ) : (
      <CustomBlackStyledButton
        onClick={() => {
          setButtonClickedOn({ formEntryState: false, fileUploadState: true });
        }}
        borderradiusleft="0 10px 10px 0px"
        borderwidthleft="2px 2px 2px 1px"
        ml="-2px"
      >
        File Upload
      </CustomBlackStyledButton>
    )}
  </StyledFlex>
);

export default ToggleButtons;
