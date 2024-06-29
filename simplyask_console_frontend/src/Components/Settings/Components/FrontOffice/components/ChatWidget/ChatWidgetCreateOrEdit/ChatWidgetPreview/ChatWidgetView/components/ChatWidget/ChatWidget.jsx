import { Backdrop } from '@mui/material';
import { useTheme } from '@mui/system';
import { useMutation } from '@tanstack/react-query';
import React, { useCallback, useRef, useState } from 'react';
import tinycolor from 'tinycolor2';
import { saveFile } from '../../axios/fileAxios';
import { fileToBase64 } from '../../utils/helperFunctions';
import Conversation from '../Conversation/Conversation';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import { StyledFlexContainerRoot, StyledHiddenInput, WidgetRoot } from '../shared/styles/styled';

const ChatWidget = ({
  sendMsg,
  sendFile,
  conversation,
  isWidgetPreviewOpen,
  closeWidgetPreview,
  isEditMode,
  appearances = {},
  getValidZIndex,
  isSoundOn,
  toggleSoundSettings,
  ivaAgentId,
}) => {
  const fileInputRef = useRef();
  const { boxShadows, colors } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [text, setText] = useState('');

  const { mutate: updateAttachmentFiles } = useMutation({
    mutationFn: async (files) => {
      const uploadBy = '';
      const b64Data = await fileToBase64(files[0]);
      const fileName = files[0].name;

      const payload = {
        uploadBy,
        ivaAgentId,
        b64Data: b64Data.split(',')[1],
        fileName,
      };

      const res = await saveFile(payload);
      return { res, payload };
    },
    onSuccess: (data) => {
      const fileData = {
        data: data.res.toString(),
        fileName: data.payload.fileName,
      };

      sendFile(fileData);
    },
    onError: (err) => {
      console.log('Error uploading file - ', err);
    },
  });

  const onSendMessage = (e) => {
    e.preventDefault();
    try {
      // try catch required on this socket call
      sendMsg(text);
      setText('');
    } catch (error) {
      console.log(error);
    }
  };

  const onAttachFile = () => {
    fileInputRef.current.value = null;

    fileInputRef.current.click();
  };

  const handleSelectedFile = async (e) => {
    const { files } = e.target;
    if (files.length === 0) return;

    updateAttachmentFiles(files);
  };

  const getDynamicHoverColorBasedOnBgColor = useCallback(
    () =>
      tinycolor(appearances.primaryColourHex)?.isLight() ? colors.extraLightBlackHover : colors.extraLightWhiteHover,
    [appearances.primaryColourHex]
  );

  return (
    <WidgetRoot
      position={isEditMode ? 'absolute' : 'fixed'}
      bottom={isEditMode ? 'auto' : '15px'}
      right={isEditMode ? 'auto' : '15px'}
      overflow="hidden"
      padding="10px"
      zIndex={getValidZIndex() || '5000'}
      transform={isWidgetPreviewOpen ? 'translateY(0)' : 'translateY(100px)'}
      visibility={isWidgetPreviewOpen ? 'visible' : 'hidden'}
      opacity={isWidgetPreviewOpen ? 1 : 0}
    >
      <StyledFlexContainerRoot borderRadius="15px" boxShadow={boxShadows.box} backgroundColor={colors.background}>
        <Backdrop
          open={showSettings}
          onClick={() => setShowSettings(false)}
          sx={{
            zIndex: 1,
            position: 'absolute',
            borderRadius: '15px',
            background: colors.extraLightCharcoal,
            margin: 'auto',
            width: 'calc(100% - 19px)',
            height: 'calc(100% - 19px)',
          }}
        />

        <Header
          closeWidgetPreview={closeWidgetPreview}
          title={appearances.titleText || 'Hey There 👋'}
          subTitle={
            appearances.subtitleText ||
            'Have a question about Symphona? Our Intelligent Virtual Agent is ready to help!'
          }
          appearances={appearances}
          getDynamicHoverColorBasedOnBgColor={getDynamicHoverColorBasedOnBgColor}
        />

        <Conversation isEditMode={isEditMode} conversation={conversation} sendMsg={sendMsg} appearances={appearances} />

        <Footer
          onAttachFile={onAttachFile}
          onSendMessage={onSendMessage}
          setText={setText}
          text={text}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          appearances={appearances}
          toggleSoundSettings={toggleSoundSettings}
          isSoundOn={isSoundOn}
        />

        {/* The input used to ask for files when clicking on browse button. */}
        <StyledHiddenInput type="file" onChange={handleSelectedFile} ref={fileInputRef} />
      </StyledFlexContainerRoot>
    </WidgetRoot>
  );
};

export default ChatWidget;
