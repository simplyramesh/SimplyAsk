import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import PropTypes from 'prop-types';
import React from 'react';

import CustomTableIcons from '../../../../../../REDISIGNED/icons/CustomTableIcons';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../../styles/styled';
import { StyledMenuButton } from '../../../StyledSettingsSideDrawer';

import classes from './ArchiveOrDeleteProcess.module.css';

const ArchiveOrDeleteProcess = ({
  goBackToPrimaryMenu,
  setShowMoveElementToArchive,
  setShowDeleteElementModal,
  isTestManagerView = false,
}) => {
  const moveProcessToArchive = () => {
    setShowMoveElementToArchive(true);
  };

  const triggerProcessDeletionPrompt = () => {
    setShowDeleteElementModal(true);
  };

  const getHeading = () => {
    if (isTestManagerView) return 'Archive or Delete Test Suite';
  };

  const getArchiveHeading = () => {
    if (isTestManagerView) return 'Move Test Suite to Archives';
  };

  const getArchiveBody = () => {
    if (isTestManagerView) return 'This will hide the test suite by moving it to the “Archive” section. Note that this test suite will continue to function until it is deleted.';
  };

  const getDeleteHeading = () => {
    if (isTestManagerView) return 'Delete Test Suite';
  };

  const getDeleteBody = () => {
    if (isTestManagerView) return 'This will permanently delete your test suite. Once it is deleted, it cannot be recovered.';
  };

  return (
    <StyledFlex height="100%" p="16px 0" ml="-18px">
      <StyledFlex p="0 25px" direction="row" gap="15px" mt="5px" mb="20px">
        <KeyboardBackspaceIcon
          className={classes.backBtnIcon}
          onClick={goBackToPrimaryMenu}
        />
        <StyledText size="19" weight={600}>
          {getHeading()}
        </StyledText>
      </StyledFlex>

      <StyledDivider height="2px" />

      <StyledMenuButton onClick={moveProcessToArchive}>
        <CustomTableIcons icon="ARCHIVE" width={24} />

        <StyledFlex gap="4px">
          <StyledText weight={600} lh={24}>
            {getArchiveHeading()}
          </StyledText>
          <StyledText size={14} lh={24}>
            {getArchiveBody()}
          </StyledText>
        </StyledFlex>
      </StyledMenuButton>

      <StyledDivider height="2px" />

      <StyledMenuButton
        direction="row"
        alignItems="center"
        p="20px 30px"
        gap="16px"
        onClick={triggerProcessDeletionPrompt}
      >
        <CustomTableIcons icon="BIN" width={24} />

        <StyledFlex gap="4px">
          <StyledText weight={600} lh={24}>
            {getDeleteHeading()}
          </StyledText>
          <StyledText size={14} lh={24}>
            {getDeleteBody()}
          </StyledText>
        </StyledFlex>
      </StyledMenuButton>
    </StyledFlex>
  );
};

export default ArchiveOrDeleteProcess;

ArchiveOrDeleteProcess.propTypes = {
  goBackToPrimaryMenu: PropTypes.func,
  setShowMoveElementToArchive: PropTypes.func,
  setShowDeleteElementModal: PropTypes.func,
  isTestManagerView: PropTypes.bool,
};
