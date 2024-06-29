import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React, { memo, useState } from 'react';

import Spinner from '../../../Spinner/Spinner';
import { StyledFlex, StyledText } from '../../../styles/styled';
import BaseTextInput from '../../controls/BaseTextInput/BaseTextInput';
import { StyledButton, StyledLoadingButton } from '../../controls/Button/StyledButton';
import CustomTableIcons from '../../icons/CustomTableIcons';
import CustomScrollbar from '../../layouts/CustomScrollbar/CustomScrollbar';
import { StyledTooltip } from '../../tooltip/StyledTooltip';
import CenterModalFixed from '../CenterModalFixed/CenterModalFixed';

const ConfirmationModal = ({
  isOpen,
  onCloseModal,
  isLoading,
  width,
  alertType,
  modalIcon,
  modalIconColor,
  modalIconSize = 70,
  title,
  titleCustom,
  text,
  autoHeightMax,
  customFooter,
  cancelBtnText,
  hideCancelBtn = false,
  successBtnText,
  isDarkTheme = false,
  successBtnDanger = false,
  successBtnHint,
  successBtnHintIfDisabled,
  onCancelClick,
  onSuccessClick,
  isSuccessBtnDisabled,
  textDirection,
  modalRef,
  children,
  actionConfirmationText,
  titleTextAlign,
  zIndexRoot,
}) => {
  const [actionConfirmationInputValue, setActionConfirmationInputValue] = useState('');
  const { colors } = useTheme();

  const modalAlertType = {
    INFO: colors.statusResolved,
    WARNING: colors.statusAssigned,
    DANGER: colors.statusOverdue,
  };

  const handleCancelClick = () => {
    if (typeof onCancelClick === 'function') {
      onCancelClick();
    } else {
      onCloseModal();
    }
    setActionConfirmationInputValue('');
  };

  const handleSuccessClick = () => {
    if (typeof onSuccessClick === 'function') {
      onSuccessClick();
    }
    setActionConfirmationInputValue('');
  };

  const isActionUnconfirmed = () => actionConfirmationText && actionConfirmationText !== actionConfirmationInputValue;

  return (
    <CenterModalFixed
      open={isOpen}
      onClose={onCloseModal}
      maxWidth={width || '528px'}
      modalRef={modalRef}
      isDarkTheme={isDarkTheme}
      footerShadow={false}
      actions={
        customFooter || (
          <StyledFlex gap="24px" direction="row" alignItems="center" justifyContent="center" width="100%">
            {!hideCancelBtn && (
              <StyledButton primary variant="outlined" onClick={handleCancelClick}>
                {cancelBtnText || 'Cancel'}
              </StyledButton>
            )}
            <StyledLoadingButton
              primary={!successBtnDanger}
              danger={successBtnDanger}
              variant="contained"
              disabled={isSuccessBtnDisabled || isActionUnconfirmed()}
              onClick={handleSuccessClick}
            >
              {successBtnText || 'Confirm'}
              {successBtnHint && (isSuccessBtnDisabled || !successBtnHintIfDisabled) && (
                <StyledTooltip
                  title={successBtnHint}
                  arrow
                  placement="top"
                  p="8px 13px"
                  size="14px"
                  lh="1.5"
                  radius="15px"
                  maxWidth="380px"
                  color={colors.charcoal}
                  bgTooltip={colors.shortcutItemHoverBg}
                >
                  <CustomTableIcons
                    icon="HELP"
                    width={17}
                    display="inline"
                    margin="0 0 0 4px"
                    color={isSuccessBtnDisabled ? colors.disabledBtnText : 'inherit'}
                    throughEvent
                  />
                </StyledTooltip>
              )}
            </StyledLoadingButton>
          </StyledFlex>
        )
      }
      zIndexRoot={zIndexRoot}
    >
      {isLoading && <Spinner fadeBgParentFixedPosition small />}

      <StyledFlex p="20px 36px 28px 36px">
        <StyledFlex mb="12px" alignItems="center" justifyContent="center">
          <CustomTableIcons
            icon={modalIcon || 'BANG_CIRCLE'}
            color={modalIconColor || modalAlertType[alertType]}
            width={modalIconSize}
            margin="0 0 20px"
          />
          {titleCustom}
          {title && (
            <StyledText
              color={isDarkTheme ? colors.white : colors.primary}
              as="h3"
              size={18}
              lh={28}
              weight={600}
              textAlign={titleTextAlign}
            >
              {title}
            </StyledText>
          )}
        </StyledFlex>

        <CustomScrollbar
          autoHeight
          autoHeightMax={autoHeightMax || '70vh'}
          thumbWidth="4px"
          thumbColor={colors.timberwolfGray}
          radius="10px"
        >
          <StyledFlex gap="15px" alignItems="center" justifyContent="center" textAlign={textDirection || 'center'}>
            {text && (
              <StyledText
                color={isDarkTheme ? colors.white : colors.primary}
                as="p"
                size="15"
                lh="21"
                weight={400}
                textAlign={textDirection || 'center'}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            )}
            {children}
          </StyledFlex>
        </CustomScrollbar>

        {actionConfirmationText && (
          <StyledFlex mt="20px" mb="30px" gap={1.5} alignItems="center">
            <StyledText color={isDarkTheme ? colors.white : colors.primary} textAlign="center" size={14} lh={20}>
              Type "{actionConfirmationText}" in the box below to confirm
            </StyledText>
            <StyledFlex width="240px">
              <BaseTextInput
                height="38px"
                value={actionConfirmationInputValue}
                onChange={(e) => setActionConfirmationInputValue(e.target.value)}
              />
            </StyledFlex>
          </StyledFlex>
        )}
      </StyledFlex>
    </CenterModalFixed>
  );
};

export default memo(ConfirmationModal);

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool,
  isDarkTheme: PropTypes.bool,
  isLoading: PropTypes.bool,
  onCloseModal: PropTypes.func,
  width: PropTypes.string,
  alertType: PropTypes.oneOf(['INFO', 'WARNING', 'DANGER']),
  modalIcon: PropTypes.string,
  modalIconColor: PropTypes.string,
  modalIconSize: PropTypes.number,
  title: PropTypes.string,
  text: PropTypes.string,
  titleCustom: PropTypes.node,
  autoHeightMax: PropTypes.string,
  customFooter: PropTypes.node,
  cancelBtnText: PropTypes.string,
  successBtnText: PropTypes.string,
  successBtnHint: PropTypes.string,
  successBtnHintIfDisabled: PropTypes.bool,
  onCancelClick: PropTypes.func,
  onSuccessClick: PropTypes.func,
  isSuccessBtnDisabled: PropTypes.bool,
  textDirection: PropTypes.string,
  modalRef: PropTypes.object,
  children: PropTypes.node,
};
