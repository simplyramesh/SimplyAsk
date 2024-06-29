import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SvgIcon from '@mui/material/SvgIcon';
import { useTheme } from '@mui/system';
import { Transition } from 'react-transition-group';

import { EXTERNAL_LINKS } from '../../utils/constants/common';
import { getMidOpacityOfColor } from '../../utils/helperFunctions';
import BaseTextInput from '../shared/controls/BaseTextInput/BaseTextInput';
import {
  SendButton,
  StyledAttachmentButton,
  StyledFlex,
  StyledHyperLink,
  StyledPoweredImage,
  StyledSettingsDiv,
  StyledSubmissionForm,
  StyledText,
  StyledTextHyperLink,
  TransitionContainer,
} from '../shared/styles/styled';
import SettingsGeneralIcon from '../shared/svgIcons/SettingsGeneralIcon';
import SoundIcon from '../shared/svgIcons/SoundIcon';
import SoundIconClosed from '../shared/svgIcons/SoundIconClosed';

const Footer = ({
  onAttachFile,
  onSendMessage,
  text,
  setText,
  showSettings,
  setShowSettings,
  appearances,
  toggleSoundSettings,
  isSoundOn,
}) => {
  const { colors } = useTheme();

  return (
    <StyledFlex backgroundColor={colors.chatBotSilverFooter} borderRadius="0px 0px 15px 15px">
      <StyledFlex direction="row" alignItems="center" padding="11px 5px 11px 15px" gap="7px">
        <StyledAttachmentButton
          onClick={onAttachFile}
          bg={appearances.secondaryColourHex || colors.tertiaryDark}
          color={appearances.secondaryAccentColourHex || colors.primary}
          hoverBg={getMidOpacityOfColor(appearances.secondaryColourHex || colors.extraLightBlackHover)}
        >
          <SvgIcon component={AttachFileIcon} sx={{ width: '17px', rotate: '30deg' }} />
        </StyledAttachmentButton>

        <StyledSubmissionForm onSubmit={onSendMessage} flex="1">
          <BaseTextInput
            name="message"
            placeholder="Type your message here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            inputHeight="30px"
            fontSize="12px"
            borderRadius="5px"
            padding="5px 55px 5px 7px"
            autoComplete="off"
          />
        </StyledSubmissionForm>

        <SendButton
          onClick={onSendMessage}
          bg={appearances.primaryColourHex || colors.primary}
          color={appearances.primaryAccentColourHex || colors.white}
          hoverBg={getMidOpacityOfColor(appearances.primaryColourHex || colors.primary)}
        >
          Send
          <SvgIcon
            component={SendIcon}
            sx={{
              width: '13px',
              rotate: '-45deg',
              position: 'relative',
              top: '-2px',
              marginRight: '-2px',
            }}
          />
        </SendButton>
      </StyledFlex>

      <StyledFlex direction="row" alignItems="center" justifyContent="center">
        <StyledFlex
          position="absolute"
          left="24px"
          bottom="15px"
          onClick={() => setShowSettings(true)}
          cursor="pointer"
          hoverBg={colors.extraLightSilver}
          borderRadius="5px"
          width="27px"
          height="27px"
          alignItems="center"
          justifyContent="center"
        >
          <SettingsGeneralIcon height="20px" color={colors.primary} />
        </StyledFlex>
        <StyledHyperLink href={EXTERNAL_LINKS.SIMPLY_ASK_MAIN_SITE} target="_blank">
          <StyledText size={8} lh={8} weight={700} color={colors.extraLightCharcoal} opacity={0.45}>
            POWERED BY
          </StyledText>
          <StyledPoweredImage />
        </StyledHyperLink>
      </StyledFlex>

      <Transition in={showSettings} timeout={700} classNames="settings-transition" unmountOnExit>
        {(state) => (
          <TransitionContainer state={state}>
            <StyledSettingsDiv position="absolute" backgroundColor={colors.white} padding="15px 18px">
              <StyledFlex direction="row">
                <StyledText weight={700} color={colors.primary}>
                  Settings
                </StyledText>
              </StyledFlex>

              <StyledFlex direction="row" gap="4px" position="absolute" right="18px">
                <StyledFlex
                  color={colors.primary}
                  cursor="pointer"
                  onClick={() => setShowSettings(false)}
                  width="27px"
                  height="27px"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="5px"
                  hoverBg={colors.extraLightSilver}
                >
                  <SvgIcon component={CloseIcon} />
                </StyledFlex>
              </StyledFlex>

              <StyledFlex
                direction="row"
                gap="10px"
                marginTop="14px"
                alignItems="center"
                borderRadius="5px"
                hoverBg={colors.extraLightSilver}
                cursor="pointer"
                padding="8px"
                onClick={toggleSoundSettings}
              >
                {isSoundOn ? (
                  <>
                    <SoundIconClosed color={colors.iconColorOrange} />
                    <StyledText weight={500} color={colors.primary} size={12} smSize={10}>
                      Turn off sound
                    </StyledText>
                  </>
                ) : (
                  <>
                    <SoundIcon color={colors.iconColorOrange} />
                    <StyledText weight={500} color={colors.primary} size={12} smSize={10}>
                      Turn on sound
                    </StyledText>
                  </>
                )}
              </StyledFlex>

              <StyledFlex
                direction="row"
                gap="10px"
                marginTop="17px"
                alignItems="center"
                justifyContent="space-between"
              >
                <StyledText weight={400} color={colors.primary} size={10} lh={12} width="190px" smSize={9}>
                  The chat content is neither created nor endorsed by SimplyAsk
                </StyledText>

                <StyledTextHyperLink
                  color={colors.linkColor}
                  wrap="no-wrap"
                  cursor="pointer"
                  href={EXTERNAL_LINKS.SIMPLY_ASK_REPORT}
                  target="_blank"
                >
                  Report Abuse
                </StyledTextHyperLink>
              </StyledFlex>

              <StyledFlex
                direction="row"
                gap="10px"
                marginTop="18px"
                alignItems="center"
                justifyContent="space-between"
              >
                <StyledTextHyperLink
                  color={colors.linkColor}
                  wrap="no-wrap"
                  cursor="pointer"
                  target="_blank"
                  href={EXTERNAL_LINKS.SIMPLY_ASK_MAIN_SITE}
                >
                  © 2022 SimplyAsk
                </StyledTextHyperLink>

                <StyledFlex direction="row" alignItems="center" gap="5px">
                  <StyledTextHyperLink
                    color={colors.linkColor}
                    wrap="no-wrap"
                    cursor="pointer"
                    target="_blank"
                    href={EXTERNAL_LINKS.SIMPLY_ASK_PRIVACY_POLICY}
                  >
                    Privacy Policy
                  </StyledTextHyperLink>
                  ·
                  <StyledTextHyperLink
                    color={colors.linkColor}
                    wrap="no-wrap"
                    cursor="pointer"
                    target="_blank"
                    href={EXTERNAL_LINKS.SIMPLY_ASK_TERMS_OF_SERVICE}
                  >
                    Terms of Service
                  </StyledTextHyperLink>
                </StyledFlex>
              </StyledFlex>
            </StyledSettingsDiv>
          </TransitionContainer>
        )}
      </Transition>
    </StyledFlex>
  );
};

export default Footer;
