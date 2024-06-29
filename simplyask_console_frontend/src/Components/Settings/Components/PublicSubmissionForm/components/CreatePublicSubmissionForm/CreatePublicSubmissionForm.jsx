import { useTheme } from '@emotion/react';
import { InfoOutlined } from '@mui/icons-material';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { debounce } from 'lodash';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { saveImgFile } from '../../../../../../Services/axios/filesAxios';
import { base64ToFile } from '../../../../../../utils/functions/fileImageFuncs';
import BlockNavigate from '../../../../../shared/REDISIGNED/BlockNavigate/BlockNavigate';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import UploadImageFile from '../../../../../shared/REDISIGNED/controls/UploadImageFile/UploadImageFile';
import CenterModalFixed from '../../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import ConfirmationModal from '../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import CustomSelect from '../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { FontOption } from '../../../../../shared/REDISIGNED/selectMenus/customComponents/options/FontOption';
import { StyledTooltip } from '../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import Spinner from '../../../../../shared/Spinner/Spinner';
import { StyledDivider, StyledFlex, StyledImgLogoUpload, StyledText } from '../../../../../shared/styles/styled';
import AvatarCropper from '../../../../AccessManagement/components/Avatar/AvatarCropper/AvatarCropper';
import FormErrorMessage from '../../../../AccessManagement/components/FormErrorMessage/FormErrorMessage';
import ColorPickerInputWithHexValue from '../../../FrontOffice/components/ChatWidget/ChatWidgetCreateOrEdit/ChatWidgetAppearanceSetting/ColorPickerInputWithHexValue';
import { IMAGE_CROPPER_SHAPE } from '../../../FrontOffice/constants/common';
import useSubmitPublicFormConfig from '../../hooks/useSubmitPublicFormConfig';
import { PUBLIC_FORM_IMAGE_TYPES, PUBLIC_FORM_THEME_VALUES } from '../../utils/constants';
import { editPublicFormValidationSchema } from '../../utils/validationSchemas';
import { StyledLinkBtn, StyledThemeDarkBtn, StyledThemeLightBtn } from '../StyledPublicSubmissionForm';

const CreatePublicSubmissionForm = ({ open, onClose, publicFormConfigValues }) => {
  const { colors } = useTheme();

  const fontsOptions = [
    { label: 'Montserrat', value: 'Montserrat' },
    { label: 'Roboto', value: 'Roboto' },
    { label: 'Open Sans', value: 'Open Sans' },
    { label: 'Noto Sans JP', value: 'Noto Sans JP' },
    { label: 'Poppins', value: 'Poppins' },
    { label: 'Lato', value: 'Lato' },
    { label: 'Roboto Condensed', value: 'Roboto Condensed' },
    { label: 'Inter', value: 'Inter' },
    { label: 'Barlow', value: 'Barlow' },
    { label: 'Quicksand', value: 'Quicksand' },
    { label: 'PlayfairDisplay', value: 'PlayfairDisplay' },
    { label: 'Quicksand', value: 'Quicksand' },
    { label: 'Oswald', value: 'Oswald' },
    { label: 'Barlow', value: 'Barlow' },
    { label: 'Tangerine', value: 'Tangerine' },
  ];

  const INITIAL_VALUES = {
    theme: publicFormConfigValues?.theme,
    buttonColourHex: publicFormConfigValues?.buttonColourHex,
    buttonTextColourHex: publicFormConfigValues?.buttonTextColourHex,
    accentColourHex: publicFormConfigValues?.accentColourHex,
    logo: publicFormConfigValues?.logo || '',
    font: publicFormConfigValues?.font || 'Montserrat',
    pageColourHex: publicFormConfigValues?.pageColourHex,
    headerColourHex: publicFormConfigValues?.headerColourHex,
    backgroundImage: publicFormConfigValues?.backgroundImage || '',
  };

  const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] = useState(false);

  const logoInputFileRef = useRef(null);
  const bgImgInputFileRef = useRef(null);

  const { submitPublicFormConfigValues, isSubmitPublicFormConfigValuesLoading } = useSubmitPublicFormConfig({
    onSuccess: () => {
      toast.success('Your changes have been successfully saved');
      onClose();
    },
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const { values: imagesData, setValues: setImagesData } = useFormik({
    initialValues: {
      imageType: null,
      imageData: null,
      croppedLogo: null,
      croppedBgImg: null,
    },
  });

  const { values, setFieldValue, submitForm, dirty, errors, touched } = useFormik({
    initialValues: INITIAL_VALUES,
    enableReinitialize: true,
    validateOnMount: false,
    validationSchema: editPublicFormValidationSchema,
    onSubmit: (val) => {
      submitPublicFormConfigValues(val);
    },
  });

  const debouncedSetFieldValue = debounce(setFieldValue, 350);

  const { mutate: updateLogoImages, isPending: isUpdateImageLoading } = useMutation({
    mutationFn: async ({ imageFile, imageType }) => {
      const response = await saveImgFile([imageFile], null, null, false);
      return { response, imageType };
    },
    onSuccess: (data) => {
      const type = data.imageType;
      const mediaLink = data.response?.[0]?.mediaLink;
      const field = type === PUBLIC_FORM_IMAGE_TYPES.BG_IMAGE ? 'backgroundImage' : 'logo';

      setFieldValue(field, mediaLink);
    },
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const handleFileChange = (newImageData, fileType) => {
    setImagesData({
      ...imagesData,
      imageType: fileType,
      imageData: newImageData,
    });
  };

  const handleApplyCrop = async (croppedImg) => {
    const imageFile = await base64ToFile(croppedImg, imagesData.imageData?.name);

    const imgObjKey = imagesData.imageType === PUBLIC_FORM_IMAGE_TYPES.FORM_LOGO ? 'croppedLogo' : 'croppedBgImg';

    setImagesData({
      ...imagesData,
      [imgObjKey]: { img: croppedImg, imageFile },
      imageType: null,
      imageData: null,
    });
    updateLogoImages({ imageFile, imageType: imagesData.imageType });
  };

  const onRemoveImageClick = (imgObjKey, valueKey) => {
    setImagesData({ ...imagesData, [imgObjKey]: null });
    setFieldValue([valueKey], '');
  };

  const handleStayOnPage = () => {
    setIsUnsavedChangesModalOpen(false);
    onClose();
  };

  const handleLeavePage = () => {
    setIsUnsavedChangesModalOpen(false);
  };

  const handleOnCloseCenterModal = () => {
    if (dirty) {
      setIsUnsavedChangesModalOpen(true);
      return;
    }

    onClose();
  };

  const renderColorPicker = (label, valueKey) => (
    <StyledFlex width="100%">
      <InputLabel label={label} size={16} mb={10} />
      <ColorPickerInputWithHexValue
        id={valueKey}
        name={valueKey}
        squareColor={values[valueKey]}
        onPickerChange={(e) => debouncedSetFieldValue(valueKey, e.target.value)}
        onTextChange={(e) => setFieldValue(valueKey, e.target.value)}
        invalid={errors[valueKey] && touched[valueKey]}
      />
      {errors[valueKey] && touched[valueKey] && <FormErrorMessage>{errors[valueKey]}</FormErrorMessage>}
    </StyledFlex>
  );

  const renderFont = (label, valueKey) => (
    <StyledFlex width="100%">
      <InputLabel label={label} size={16} mb={10} />

      <CustomSelect
        name={valueKey}
        options={fontsOptions}
        value={fontsOptions.find((opt) => opt.value === values[valueKey])}
        closeMenuOnSelect
        form
        components={{
          Option: FontOption,
        }}
        onChange={(v) => setFieldValue(valueKey, v.value)}
        isSearchable
        invalid={errors[valueKey] && touched[valueKey]}
      />

      {errors[valueKey] && touched[valueKey] && <FormErrorMessage>{errors[valueKey]}</FormErrorMessage>}
    </StyledFlex>
  );

  const renderFileUploadBtn = (inputRef, imgValueKey, imgType, altSrc) => (
    <StyledFlex maxWidth="226px">
      <UploadImageFile
        onChange={(newImageData) => handleFileChange(newImageData, imgType)}
        inputRef={inputRef}
        previewImage={
          imagesData?.[imgValueKey]?.img || altSrc ? (
            <StyledImgLogoUpload src={imagesData?.[imgValueKey]?.img || altSrc} alt="" />
          ) : (
            ''
          )
        }
      />
    </StyledFlex>
  );

  const renderRemoveImgBtn = (imgValueKey, valueKey) =>
    values?.[valueKey] ? (
      <StyledLinkBtn onClick={() => onRemoveImageClick(imgValueKey, valueKey)}>Remove Image</StyledLinkBtn>
    ) : null;

  return (
    <>
      <CenterModalFixed
        open={open}
        onClose={handleOnCloseCenterModal}
        maxWidth="900px"
        title={
          <StyledText size={20} weight={600}>
            Form Configurations
          </StyledText>
        }
        actions={
          <StyledFlex direction="row" gap="15px">
            <StyledButton
              primary
              variant="outlined"
              onClick={handleOnCloseCenterModal}
              disabled={isSubmitPublicFormConfigValuesLoading}
            >
              Cancel
            </StyledButton>
            <StyledButton
              primary
              variant="contained"
              onClick={submitForm}
              disabled={isSubmitPublicFormConfigValuesLoading || isUpdateImageLoading}
            >
              Save
            </StyledButton>
          </StyledFlex>
        }
      >
        <StyledFlex padding="30px">
          {isSubmitPublicFormConfigValuesLoading && <Spinner fadeBgParent />}

          <StyledText size={19} weight={600}>
            Theme
          </StyledText>

          <StyledFlex direction="row" marginTop="20px" gap="30px">
            <StyledFlex gap="8px">
              <StyledText weight={600}>Light</StyledText>
              <StyledThemeLightBtn
                bordercolor={
                  values.theme === PUBLIC_FORM_THEME_VALUES.LIGHT ? colors.skyBlue : colors.publicFormThemeLightOutline
                }
                borderwidth={values.theme === PUBLIC_FORM_THEME_VALUES.LIGHT ? '5px' : '2px'}
                opacity={values.theme === PUBLIC_FORM_THEME_VALUES.LIGHT ? '1' : '0.7'}
                onClick={() => setFieldValue('theme', PUBLIC_FORM_THEME_VALUES.LIGHT)}
              >
                <LightModeIcon
                  sx={{
                    color: colors.publicFormThemeLightBg,
                    width: '50px',
                    height: '50px',
                  }}
                />
              </StyledThemeLightBtn>
            </StyledFlex>

            <StyledFlex gap="8px">
              <StyledText weight={600}>Dark</StyledText>
              <StyledThemeDarkBtn
                bordercolor={
                  values.theme === PUBLIC_FORM_THEME_VALUES.DARK ? colors.skyBlue : colors.publicFormThemeLightBg
                }
                borderwidth={values.theme === PUBLIC_FORM_THEME_VALUES.DARK ? '5px' : '2px'}
                onClick={() => setFieldValue('theme', PUBLIC_FORM_THEME_VALUES.DARK)}
                hovercolor={
                  values.theme === PUBLIC_FORM_THEME_VALUES.DARK
                    ? colors.publicFormThemeLightBg
                    : colors.publicFormThemeDarkHover
                }
              >
                <DarkModeOutlinedIcon
                  sx={{
                    color: colors.white,
                    width: '50px',
                    height: '50px',
                  }}
                />
              </StyledThemeDarkBtn>
            </StyledFlex>
          </StyledFlex>

          <StyledDivider m="30px 0" />

          <StyledText size={19} weight={600}>
            Form Appearance
          </StyledText>

          <StyledFlex marginTop="25px" gap="25px">
            <StyledFlex direction="row" gap="30px">
              {renderColorPicker('Button Colour', 'buttonColourHex')}
              {renderColorPicker('Button Text Colour', 'buttonTextColourHex')}
            </StyledFlex>

            <StyledFlex direction="row" gap="30px">
              {renderColorPicker('Accent Colour', 'accentColourHex')}
              {renderFont('Font', 'font')}
            </StyledFlex>

            <StyledFlex width="100%">
              <InputLabel label="Logo" size={16} mb={10} />
              <StyledFlex maxWidth="226px">
                {renderFileUploadBtn(
                  logoInputFileRef,
                  'croppedLogo',
                  PUBLIC_FORM_IMAGE_TYPES.FORM_LOGO,
                  imagesData?.croppedLogo?.img || values.logo
                )}
              </StyledFlex>
              {renderRemoveImgBtn('croppedLogo', 'logo')}
            </StyledFlex>
          </StyledFlex>
          <StyledDivider m="30px 0" />
          {values.theme === PUBLIC_FORM_THEME_VALUES.LIGHT && (
            <>
              <StyledText size={19} weight={600}>
                Page Appearance
              </StyledText>

              <StyledFlex marginTop="25px" gap="25px">
                <StyledFlex>
                  <StyledFlex direction="row" gap="30px">
                    {renderColorPicker('Page Colour', 'pageColourHex')}
                    {renderColorPicker('Banner Colour', 'headerColourHex')}
                  </StyledFlex>
                </StyledFlex>
              </StyledFlex>
            </>
          )}

          <StyledFlex width="100%" marginTop={values.theme === PUBLIC_FORM_THEME_VALUES.LIGHT ? '25px' : '0'}>
            <StyledFlex direction="row" gap="10px" alignItems="center" marginBottom="10px">
              <InputLabel label="Background Image" isOptional size={16} mb={0} />
              <StyledTooltip
                arrow
                placement="top"
                title="Using a Background Image will override the Banner Colour"
                maxWidth="auto"
                p="10px 15px"
              >
                <InfoOutlined fontSize="inherit" />
              </StyledTooltip>
            </StyledFlex>
            {renderFileUploadBtn(
              bgImgInputFileRef,
              'croppedBgImg',
              PUBLIC_FORM_IMAGE_TYPES.BG_IMAGE,
              imagesData?.croppedBgImg?.img || values.backgroundImage
            )}
            {renderRemoveImgBtn('croppedBgImg', 'backgroundImage')}
          </StyledFlex>
        </StyledFlex>
      </CenterModalFixed>

      <AvatarCropper
        image={imagesData.imageData}
        onClose={() => setImagesData({ ...imagesData, imageType: null, imageData: null })}
        open={!!imagesData.imageData}
        onApply={handleApplyCrop}
        cropShape={IMAGE_CROPPER_SHAPE.rectangle}
      />

      <ConfirmationModal
        isOpen={isUnsavedChangesModalOpen}
        onCloseModal={() => setIsUnsavedChangesModalOpen(false)}
        onCancelClick={handleStayOnPage}
        successBtnText="Stay On Page"
        onSuccessClick={handleLeavePage}
        cancelBtnText="Leave Page"
        alertType="WARNING"
        title="Are You Sure?"
        text="You have unsaved changes and are about to exit out of the page. If you leave, all your progress will be lost."
      />

      {/* // BlockNavigate is used only handle beforeunload event (like tab closing), not any redirection.
      // Since this public form itself is a modal, there's no way to click any redirection link
       */}
      <BlockNavigate isBlocked={dirty} />
    </>
  );
};

export default CreatePublicSubmissionForm;
