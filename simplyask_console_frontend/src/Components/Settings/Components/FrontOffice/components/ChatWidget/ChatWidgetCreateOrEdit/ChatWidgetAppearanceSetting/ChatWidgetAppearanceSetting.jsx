import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useTheme } from '@mui/system';
import { debounce } from 'lodash';

import ExportIcon from '../../../../../../../../Assets/icons/export.svg?component';
import BaseTextArea from '../../../../../../../shared/REDISIGNED/controls/BaseTextArea/BaseTextArea';
import BaseTextInput from '../../../../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import InputLabel from '../../../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import { StyledTooltip } from '../../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import {
  CustomGreyStyledButton,
  StyledDivider,
  StyledFlex,
  StyledImgLogoUpload,
  StyledImgLogoUploadContainer,
  StyledNumberWrapper,
  StyledNumberedInput,
  StyledSwitch,
  StyledText,
} from '../../../../../../../shared/styles/styled';
import AvatarCropper from '../../../../../../AccessManagement/components/Avatar/AvatarCropper/AvatarCropper';
import FormErrorMessage from '../../../../../../AccessManagement/components/FormErrorMessage/FormErrorMessage';
import { IMAGE_CROPPER_SHAPE } from '../../../../constants/common';

import ColorPickerInputWithHexValue from './ColorPickerInputWithHexValue';

const TextCount = ({ length = 0, maxLength }) => {
  const { colors } = useTheme();
  return (
    <StyledFlex marginTop="4px" marginBottom="-5px">
      <StyledText weight={400} size={13} color={colors.information} textAlign="right">
        {length}/{maxLength} Charcters
      </StyledText>
    </StyledFlex>
  );
};

const ChatWidgetAppearanceSetting = ({
  values,
  setFieldValue,
  headerImage,
  onCloseAvatarHeaderCropper,
  open,
  onApply,
  fileRef,
  handleFileChange,
  croppedHeaderImg,
  onApplyBot,
  fileBotRef,
  croppedBotLogoImg,
  botImage,
  onCloseAvatarBotCropper,
  openBot,
  logoDownloadUrlImg,
  customBotIconDownloadUrlImg,
  errors,
  touched,
}) => {
  const { colors } = useTheme();
  const debouncedSetFieldValue = debounce(setFieldValue, 350);

  const renderColorPicker = (key) => (
    <>
      <ColorPickerInputWithHexValue
        id={key}
        name={key}
        squareColor={values[key]}
        onPickerChange={(e) => debouncedSetFieldValue(key, e.target.value)}
        onTextChange={(e) => setFieldValue(key, e.target.value)}
        invalid={errors[key] && touched[key]}
      />
      {errors[key] && touched[key] && <FormErrorMessage>{errors[key]}</FormErrorMessage>}
    </>
  );

  return (
    <>
      <AvatarCropper
        image={headerImage}
        onClose={onCloseAvatarHeaderCropper}
        open={open}
        onApply={(headerImage) => onApply(headerImage, 'headerLogo')}
        cropShape={IMAGE_CROPPER_SHAPE.square}
      />

      <AvatarCropper
        image={botImage}
        onClose={onCloseAvatarBotCropper}
        open={openBot}
        onApply={(botImage) => onApplyBot(botImage, 'botLogo')}
      />

      <StyledFlex flex="auto" p="25px">
        <StyledText size={19} lh={25} weight={600} mb={12}>
          Colours
        </StyledText>
        <StyledFlex direction="row" spacing={5} mb={4}>
          <StyledFlex width="47%">
            <InputLabel label="Primary" size={14} mb={10} mt={5} />
            {renderColorPicker('primaryColourHex')}

            <InputLabel label="Primary Accent" size={16} mb={10} mt={24} />
            {renderColorPicker('primaryAccentColourHex')}
          </StyledFlex>

          <StyledFlex width="47%">
            <InputLabel label="Secondary" size={16} mb={10} mt={5} />
            {renderColorPicker('secondaryColourHex')}

            <InputLabel label="Secondary Accent" size={16} mb={10} mt={24} />
            {renderColorPicker('secondaryAccentColourHex')}
          </StyledFlex>
        </StyledFlex>

        <StyledDivider color={colors.platinum} borderWidth={1} variant="middle" />

        <StyledFlex mb={4}>
          <StyledText size={19} lh={25} weight={600} mb={12} mt={32}>
            Header
          </StyledText>
          <InputLabel label="Title Text" size={16} mb={10} mt={5} />
          <BaseTextInput
            name="titleText"
            value={values.titleText}
            onChange={(e) => setFieldValue('titleText', e.target.value)}
            placeholder="Hey There"
            maxLength={25}
          />
          <TextCount length={values.titleText?.length} maxLength={25} />

          <InputLabel label="Subtitle Text" size={16} mb={10} mt={24} />
          <BaseTextArea
            name="subtitleText"
            value={values.subtitleText}
            onChange={(e) => setFieldValue('subtitleText', e.target.value)}
            placeholder="Have a questions about Symphona? Our Intelligent Virtual Agent is ready to help!"
            height="100px"
            maxLength={90}
          />
          <TextCount length={values.subtitleText?.length} maxLength={90} />

          <InputLabel label="Logo" isOptional size={16} mb={10} mt={24} />
          <StyledFlex width="280px">
            <CustomGreyStyledButton
              variant="outlined"
              grey
              type="submit"
              height="70px"
              onClick={() => fileRef.current.click()}
              startIcon={
                <StyledImgLogoUploadContainer>
                  <StyledImgLogoUpload src={croppedHeaderImg?.img || logoDownloadUrlImg} alt="" />
                </StyledImgLogoUploadContainer>
              }
            >
              <input
                type="file"
                accept="image/*"
                hidden
                ref={fileRef}
                onChange={(e) => handleFileChange(e, 'headerLogo')}
              />{' '}
              &nbsp;
              <ExportIcon width={12} style={{ marginBottom: '4px' }} /> &nbsp; Upload Image
            </CustomGreyStyledButton>
          </StyledFlex>
        </StyledFlex>

        <StyledDivider color={colors.platinum} borderWidth={1} variant="middle" />

        <StyledText size={19} lh={25} weight={600} mb={10} mt={32}>
          Icon
        </StyledText>
        <StyledFlex direction="row" spacing={5} mb={4}>
          <StyledFlex width="47%">
            <InputLabel label="Background" size={16} mb={10} mt={5} />
            {renderColorPicker('backgroundColourHex')}

            <InputLabel label="Icon" size={16} mb={10} mt={24} />
            {renderColorPicker('iconColourHex')}
          </StyledFlex>
          <StyledFlex width="47%">
            <InputLabel label="Notification Background" size={16} mb={10} mt={5} />
            {renderColorPicker('notificationBackgroundColourHex')}

            <InputLabel label="Notification Text" size={16} mb={10} mt={24} />
            {renderColorPicker('notificationTextColourHex')}
          </StyledFlex>
        </StyledFlex>

        <StyledDivider color={colors.platinum} borderWidth={1} variant="middle" />

        <StyledFlex mb={4}>
          <StyledText size={19} lh={25} weight={600} mb={12} mt={32}>
            Chatbot Appearance
          </StyledText>
          <InputLabel label="Bot Name" size={16} mb={10} mt={6} />
          <BaseTextInput
            name="chatBotName"
            value={values.chatBotName}
            onChange={(e) => setFieldValue('chatBotName', e.target.value)}
            placeholder="SimplyBot"
            maxLength={30}
          />

          <TextCount length={values.chatBotName?.length} maxLength={30} />

          <InputLabel label="Icon" isOptional size={16} mt={24} />
          <StyledText size={14} lh={17} weight={400} mb={10}>
            An icon with transparent background is recommended
          </StyledText>
          <StyledFlex width="280px">
            <CustomGreyStyledButton
              variant="outlined"
              grey
              type="submit"
              height="70px"
              onClick={() => fileBotRef.current.click()}
              startIcon={
                <StyledImgLogoUploadContainer>
                  <StyledImgLogoUpload src={croppedBotLogoImg?.img || customBotIconDownloadUrlImg} alt="" />
                </StyledImgLogoUploadContainer>
              }
            >
              <input
                type="file"
                accept="image/*"
                hidden
                ref={fileBotRef}
                onChange={(e) => handleFileChange(e, 'bot')}
              />{' '}
              &nbsp;
              <ExportIcon width={12} mb={12} style={{ marginBottom: '4px' }} /> &nbsp; Upload Image
            </CustomGreyStyledButton>
          </StyledFlex>
        </StyledFlex>

        <StyledDivider color={colors.platinum} borderWidth={1} variant="middle" />

        <StyledFlex mb={4}>
          <StyledText size={19} lh={25} weight={600} mb={8} mt={22}>
            General
          </StyledText>
          <InputLabel label="Z-Index" size={16} mb={12} mt={6} />
          <StyledTooltip
            title="Determines the stacking order of elements on a page.
            Elements with a higher Z-Index will appear in front of elements with a lower Z-Index.
            It is recommended to use a Z-Index of 5000 or more to ensure the chat widget will always
             appear on every page on a website."
            arrow
            placement="top"
            p="10px 15px"
            maxWidth="auto"
          >
            <InfoOutlinedIcon
              sx={{
                color: colors.charcoal,
                position: 'absolute',
                left: '96px',
                marginTop: '61px',
                fontSize: '19px',
              }}
            />
          </StyledTooltip>

          <StyledFlex mb={6}>
            <StyledNumberWrapper>
              <StyledNumberedInput
                type="number"
                name="index"
                value={values.index}
                onChange={(e) => setFieldValue('index', e.target.value)}
              />
            </StyledNumberWrapper>
          </StyledFlex>

          <InputLabel label="Enable File Upload" size={16} mb={10} mt={24} />
          <StyledSwitch
            name="enableFileUpload"
            checked={values.enableFileUpload}
            onChange={(e) => {
              setFieldValue('enableFileUpload', e.target.checked);
            }}
          />
        </StyledFlex>
      </StyledFlex>
    </>
  );
};

export default ChatWidgetAppearanceSetting;
