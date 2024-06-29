import { useTheme } from '@mui/system';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSetRecoilState } from 'recoil';
import BrushIcon from '../../../../../../../Assets/icons/chatWidgets/BrushIcon.svg?component';
import SettingsGeneralIcon from '../../../../../../../Assets/icons/settingsGeneralSideBar.svg?component';
import { getAllAgents } from '../../../../../../../Services/axios/conversationHistoryAxios';
import { saveImgFile } from '../../../../../../../Services/axios/filesAxios';
import { getChatWidgetById } from '../../../../../../../Services/axios/widgetAxios';
import routes from '../../../../../../../config/routes';
import useUserPfp from '../../../../../../../hooks/useUserPfp';
import { modifiedCurrentPageDetails } from '../../../../../../../store';
import { base64ToFile } from '../../../../../../../utils/functions/fileImageFuncs';
import { useNavigationBlock } from '../../../../../../shared/REDISIGNED/BlockNavigate/BlockNavigate';
import LeavePageBlockerModal from '../../../../../../shared/REDISIGNED/BlockNavigate/LeavePageBlockerModal/LeavePageBlockerModal';
import { delayedBlockerSyncNavigation } from '../../../../../../shared/REDISIGNED/BlockNavigate/utils/helpers';
import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import { getFileImageInfo } from '../../../../../../shared/REDISIGNED/controls/UploadImageFile/helpers';
import AgentIcon from '../../../../../../shared/REDISIGNED/icons/svgIcons/AgentIcon';
import ContentLayout from '../../../../../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../../../../../../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import Spinner from '../../../../../../shared/Spinner/Spinner';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledCard,
  StyledDivider,
  StyledFlex,
  StyledText,
} from '../../../../../../shared/styles/styled';
import { chatWidgetImageFileNames } from '../../../constants/chatWidgets';
import { WIDGETS_QUERY_KEYS } from '../../../constants/common';
import { CREATE_EDIT_TABS_INITIAL_VALUES } from '../../../constants/initialValues';
import { CREATE_EDIT_TABS, EXPANDED_TYPES } from '../../../constants/tabConstants';
import useCreateChatWidget from '../../../hooks/chatWidgetHooks/useCreateChatWidget';
import useUpdateChatWidget from '../../../hooks/chatWidgetHooks/useUpdateChatWidget';
import { chatWidgetCreateEditValidationSchema } from '../../../utils/validationSchemas';
import Summary from '../../Summary/Summary';
import ChatWidgetAgentsSetting from './ChatWidgetAgentsSetting/ChatWidgetAgentsSetting';
import ChatWidgetAppearanceSetting from './ChatWidgetAppearanceSetting/ChatWidgetAppearanceSetting';
import ChatWidgetGeneralSetting from './ChatWidgetGeneralSetting/ChatWidgetGeneralSetting';
import ChatWidgetView from './ChatWidgetPreview/ChatWidgetView/ChatWidgetView';

const ChatWidgetCreateOrEdit = () => {
  const setCurrentPageDetailsState = useSetRecoilState(modifiedCurrentPageDetails);

  const { id } = useParams();
  const isEditEnabled = !!id;

  const navigate = useNavigate();
  const { colors, boxShadows } = useTheme();
  const [expanded, setExpanded] = useState(CREATE_EDIT_TABS_INITIAL_VALUES);

  // For Image upload:
  const [isAvatarCropperOpen, setIsAvatarCropperOpen] = useState(false);
  const [isAvatarCropperOpenBot, setIsAvatarCropperOpenBot] = useState(false);
  const [newHeaderImg, setNewImg] = useState(null);
  const [newBotImg, setNewBotImg] = useState(null);
  const [croppedHeaderImg, setCroppedHeaderImg] = useState(null);
  const [croppedBotLogoImg, setCroppedBotLogoImg] = useState(null);

  const inputFileRef = useRef(null);
  const botLogoFileRef = useRef(null);

  const toggleAccordion = (panel) => () => {
    setExpanded((prev) => ({ ...prev, [panel]: !prev[panel] }));
  };

  const {
    data: widgetData,
    isSuccess,
    refetch: refetchWidgetData,
    isFetching,
  } = useQuery({
    queryFn: () => getChatWidgetById(id),
    queryKey: [WIDGETS_QUERY_KEYS.GET_CHAT_WIDGET_BY_ID, id],
    enabled: !!isEditEnabled,
  });

  useEffect(() => {
    if (isSuccess && widgetData) {
      setCurrentPageDetailsState({
        pageUrlPath: routes.SETTINGS_EDIT_CHAT_WIDGET,
        breadCrumbLabel: widgetData?.name,
      });
    }
  }, [widgetData, isSuccess]);

  const assignedAgentIds = widgetData?.assignedAgentIds?.join(',') || null;
  const {
    data: assignedAgents,
    refetch: refetchAssignedAgents,
    isFetching: isAgentsFetching,
  } = useQuery({
    queryFn: () => getAllAgents(`agentIds=${assignedAgentIds}&pageSize=999`),
    queryKey: [WIDGETS_QUERY_KEYS.GET_WIDGET_AGENTS_BY_ID, assignedAgentIds],
    enabled: !!assignedAgentIds && !!isEditEnabled,
    select: (res) => res?.content,
  });

  const INITIAL_VALUES = {
    name: widgetData?.name || '',
    description: widgetData?.description || '',
    agents: assignedAgents || [],
    titleText: widgetData?.titleText || '',
    subtitleText: widgetData?.subtitleText || '',
    primaryColourHex: widgetData?.primaryColourHex || colors.symphonaBlue,
    primaryAccentColourHex: widgetData?.primaryAccentColourHex || colors.white,
    secondaryColourHex: widgetData?.secondaryColourHex || colors.symphonaLighBlue,
    secondaryAccentColourHex: widgetData?.secondaryAccentColourHex || colors.charcoal,
    backgroundColourHex: widgetData?.backgroundColourHex || colors.symphonaBlue,
    iconColourHex: widgetData?.iconColourHex || colors.white,
    notificationTextColourHex: widgetData?.notificationTextColourHex || colors.white,
    notificationBackgroundColourHex: widgetData?.notificationBackgroundColourHex || colors.iconColorOrange,
    chatBotName: widgetData?.chatBotName || '',
    index: widgetData?.index || 5000,
    logoDownloadUrl: widgetData?.logoDownloadUrl || '',
    customChatBotIconDownloadUrl: widgetData?.customChatBotIconDownloadUrl || '',
    enableFileUpload: widgetData?.enableFileUpload ?? false,
  };

  const { values, errors, touched, setFieldValue, submitForm, resetForm, dirty } = useFormik({
    initialValues: INITIAL_VALUES,
    validateOnMount: false,
    enableReinitialize: true,
    validationSchema: chatWidgetCreateEditValidationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const [logoDownloadUrlImg] = useUserPfp(values?.logoDownloadUrl);
  const [customBotIconDownloadUrlImg] = useUserPfp(values?.customChatBotIconDownloadUrl);

  const isNavigationBlocked = dirty;

  const { navBlocker } = useNavigationBlock(isNavigationBlocked);

  const redirectToEditChatWidgetWithId = (id) => {
    navigate({
      pathname: `${routes.SETTINGS_EDIT_CHAT_WIDGET_WITHOUT_ID}/${id}`,
    });
  };

  const { createChatWidgetMutation, isCreateChatWidgetLoading } = useCreateChatWidget({
    onSuccess: (data) => {
      toast.success('Your changes have been successfully saved');
      resetForm();

      delayedBlockerSyncNavigation(() => redirectToEditChatWidgetWithId(data?.widgetId));
    },
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const { updateChatWidgetMutation, isUpdateChatWidgetLoading } = useUpdateChatWidget({
    onSuccess: () => {
      toast.success('Your changes have been successfully saved');
      setCroppedHeaderImg(null);
      setCroppedBotLogoImg(null);
      resetForm();
      refetchWidgetData();
      refetchAssignedAgents();
    },
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const { mutate: updateLogoImages } = useMutation({
    mutationFn: async ({ imageFile, imageType }) => {
      const response = await saveImgFile([imageFile], null, null, false);
      return { response, imageType };
    },
    onSuccess: (data) => {
      if (data.imageType === chatWidgetImageFileNames.HEADER_LOGO) {
        setFieldValue('logoDownloadUrl', data.response[0].id);
      } else if (data.imageType === chatWidgetImageFileNames.BOT_LOGO) {
        setFieldValue('customChatBotIconDownloadUrl', data.response[0].id);
      }
    },
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const validateForm = () => {
    if (Object.values(errors)?.join('')?.length > 0) {
      toast.error('Your changes cannot be saved, as there are missing mandatory fields');
    }

    submitForm();
  };

  const handleCloseEditor = () => {
    navigate({
      pathname: routes.SETTINGS_FRONT_OFFICE_TAB,
      search: `?autoExpandTab=${EXPANDED_TYPES.CHAT_WIDGETS}`,
    });
  };

  const handleSubmit = async (val) => {
    const agentIdsPayload = val.agents?.map((agent) => agent.agentId);
    const body = {
      name: val.name,
      description: val.description,
      assignedAgentIds: agentIdsPayload,
      titleText: val.titleText,
      subtitleText: val.subtitleText,
      primaryColourHex: val.primaryColourHex,
      primaryAccentColourHex: val.primaryAccentColourHex,
      secondaryColourHex: val.secondaryColourHex,
      secondaryAccentColourHex: val.secondaryAccentColourHex,
      backgroundColourHex: val.backgroundColourHex,
      iconColourHex: val.iconColourHex,
      notificationTextColourHex: val.notificationTextColourHex,
      notificationBackgroundColourHex: val.notificationBackgroundColourHex,
      chatBotName: val.chatBotName,
      index: val.index,
      logoDownloadUrl: val.logoDownloadUrl,
      customChatBotIconDownloadUrl: val.customChatBotIconDownloadUrl,
      enableFileUpload: val.enableFileUpload,
    };

    isEditEnabled ? updateChatWidgetMutation({ id, body }) : createChatWidgetMutation(body);
  };

  const sharedAccordionProps = {
    bgColor: colors.white,
    boxShadow: boxShadows.box,
    rootBorderRadius: '25px',
  };

  const isLoading = isFetching || isCreateChatWidgetLoading || isUpdateChatWidgetLoading || isAgentsFetching;

  const handleFileChange = async (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;
    const MAX_FILE_SIZE = 2048;
    const fileSizeKiloBytes = file.size / 1024;

    if (fileSizeKiloBytes <= MAX_FILE_SIZE) {
      const imageData = await getFileImageInfo(file, () => {});

      const setIsAvatarOpenFunc =
        fileType === chatWidgetImageFileNames.HEADER_LOGO ? setIsAvatarCropperOpen : setIsAvatarCropperOpenBot;
      const setNewImgFunc = fileType === chatWidgetImageFileNames.HEADER_LOGO ? setNewImg : setNewBotImg;

      setNewImgFunc(imageData);
      setIsAvatarOpenFunc(true);

      if (fileType === chatWidgetImageFileNames.HEADER_LOGO) {
        inputFileRef.current.value = null;
      } else if (fileType === chatWidgetImageFileNames.BOT_LOGO) {
        botLogoFileRef.current.value = null;
      }
    } else {
      toast.error('Unable to upload the profile image as the file size exceeds 2MB');
    }
  };

  const handleApplyCrop = async (croppedImg, imageType) => {
    const imageFile = await base64ToFile(
      croppedImg,
      imageType === chatWidgetImageFileNames.HEADER_LOGO ? newHeaderImg?.name : newBotImg?.name
    );

    if (imageType === chatWidgetImageFileNames.HEADER_LOGO) {
      setCroppedHeaderImg({ img: croppedImg, imageFile });
      setNewImg(null);
    } else if (imageType === chatWidgetImageFileNames.BOT_LOGO) {
      setCroppedBotLogoImg({ img: croppedImg, imageFile });
      setNewBotImg(null);
    }

    updateLogoImages({ imageFile, imageType });
  };

  return (
    <StyledFlex>
      {isLoading && <Spinner fadeBgParentFixedPosition />}
      <PageLayout
        top={
          <StyledFlex
            justifyContent="flex-end"
            direction="row"
            gap="12px"
            backgroundColor={colors.white}
            boxShadow={boxShadows.table}
            p="8px 36px"
          >
            <StyledButton variant="outlined" primary onClick={handleCloseEditor}>
              Close Editor
            </StyledButton>
            <StyledButton variant="contained" primary onClick={validateForm}>
              Save Changes
            </StyledButton>
          </StyledFlex>
        }
      >
        <ContentLayout
          side={
            <Scrollbars>
              <StyledFlex border={`1.5px solid ${colors.cardGridItemBorder}`} backgroundColor={colors.bgColorOptionTwo}>
                <StyledCard borderRadius="0" p="15px 30px">
                  <StyledText display="inline" size={19} weight={600}>
                    Chat Widget Preview
                  </StyledText>
                </StyledCard>

                <ChatWidgetView appearances={values} isEditMode isWidgetPreviewOpen />
              </StyledFlex>
            </Scrollbars>
          }
          sideWidth={492}
          containerDirection="row-reverse"
        >
          <StyledFlex gap="36px" maxWidth="800px" margin="auto" width="100%">
            <StyledAccordion
              expanded={expanded[CREATE_EDIT_TABS.GENERAL_SETTINGS]}
              onChange={toggleAccordion(CREATE_EDIT_TABS.GENERAL_SETTINGS)}
              {...sharedAccordionProps}
            >
              <Summary
                Icon={SettingsGeneralIcon}
                iconSize="47px"
                heading="General Settings"
                description="Create a name and description for your chat widget"
                headingSize={16}
                rootPadding="25px 30px"
                iconAndTextGap="0 30px"
                hoverBg={colors.bgColorOptionTwo}
                borderRadius="25px 25px 0 0"
              />
              <StyledAccordionDetails>
                <StyledDivider color={colors.platinum} borderWidth={1.5} />
                <ChatWidgetGeneralSetting
                  values={values}
                  errors={errors}
                  touched={touched}
                  setFieldValue={setFieldValue}
                />
              </StyledAccordionDetails>
            </StyledAccordion>
            <StyledAccordion
              expanded={expanded[CREATE_EDIT_TABS.AGENTS]}
              onChange={toggleAccordion(CREATE_EDIT_TABS.AGENTS)}
              {...sharedAccordionProps}
            >
              <Summary
                Icon={AgentIcon}
                iconParentFontSize="40px"
                heading="Agents"
                description="Assign existing agents to this chat widget."
                headingSize={16}
                rootPadding="25px 30px"
                iconAndTextGap="0 30px"
                hoverBg={colors.bgColorOptionTwo}
                borderRadius="25px 25px 0 0"
              />
              <StyledAccordionDetails>
                <StyledDivider color={colors.platinum} borderWidth={1.5} />
                <ChatWidgetAgentsSetting values={values} setFieldValue={setFieldValue} />
              </StyledAccordionDetails>
            </StyledAccordion>
            <StyledAccordion
              expanded={expanded[CREATE_EDIT_TABS.APPEARANCE]}
              onChange={toggleAccordion(CREATE_EDIT_TABS.APPEARANCE)}
              {...sharedAccordionProps}
            >
              <Summary
                Icon={BrushIcon}
                iconSize="35px"
                heading="Appearance"
                description="Customize the colours, fonts and icons of your chat widget"
                headingSize={16}
                rootPadding="25px 30px"
                iconAndTextGap="0 30px"
                hoverBg={colors.bgColorOptionTwo}
                borderRadius="25px 25px 0 0"
              />
              <StyledAccordionDetails>
                <StyledDivider color={colors.platinum} borderWidth={1.5} />
                <ChatWidgetAppearanceSetting
                  values={values}
                  setFieldValue={setFieldValue}
                  headerImage={newHeaderImg}
                  botImage={newBotImg}
                  onCloseAvatarHeaderCropper={() => setIsAvatarCropperOpen(false)}
                  onCloseAvatarBotCropper={() => setIsAvatarCropperOpenBot(false)}
                  open={isAvatarCropperOpen}
                  openBot={isAvatarCropperOpenBot}
                  onApply={handleApplyCrop}
                  onApplyBot={handleApplyCrop}
                  fileRef={inputFileRef}
                  fileBotRef={botLogoFileRef}
                  handleFileChange={handleFileChange}
                  croppedHeaderImg={croppedHeaderImg}
                  croppedBotLogoImg={croppedBotLogoImg}
                  logoDownloadUrlImg={logoDownloadUrlImg}
                  customBotIconDownloadUrlImg={customBotIconDownloadUrlImg}
                  errors={errors}
                  touched={touched}
                />
              </StyledAccordionDetails>
            </StyledAccordion>
          </StyledFlex>
        </ContentLayout>
      </PageLayout>

      <LeavePageBlockerModal navBlocker={navBlocker} isBlocked={isNavigationBlocked} />
    </StyledFlex>
  );
};
export default ChatWidgetCreateOrEdit;
