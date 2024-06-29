import React, { useState } from 'react';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import { useTheme } from '@mui/material/styles';
import CircularTooltipIcon from '../../../../../../../Assets/icons/circularToolTipIcon.svg?component';
import { StyledTooltip } from '../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import Switch from '../../../../../../SwitchWithText/Switch';
import DefaultFullNameActiveModal from '../DefaultFullNameActiveModal/DefaultFullNameActiveModal';
import DefaultFirstAndLastNameActiveModal from '../DefaultFirstAndLastNameActiveModal/DefaultFirstAndLastNameActiveModal';
import { USER_IDENTIFICATION_BLOCK } from '../../../constants/defaultAgentAdvanceSettingsConstants';

const CollectUserInfoTable = ({ agentConfig, onChange }) => {
  const { colors } = useTheme();

  const infoNameArr = ['Full Name', 'First Name', 'Last Name', 'Email', 'Phone Number'];
  const agentDefaultConfigPropArr = [
    'collectFullName',
    'collectFirstName',
    'collectLastName',
    'collectEmail',
    'collectPhoneNumber',
  ];

  const [isFullNameConflictFirstNameModalOpen, setIsFullNameConflictFirstNameModalOpen] = useState(false);
  const [isFullNameConflictLastNameModalOpen, setIsFullNameConflictLastNameModalOpen] = useState(false);
  const [isFirstAndLastNameConflictModalOpen, setIsFirstAndLastNameConflictModalOpen] = useState(false);

  const onSwitchChangeHandler = (index) => {
    if (
      (agentDefaultConfigPropArr[index] === USER_IDENTIFICATION_BLOCK.COLLECT_FIRST_NAME_STRING ||
        agentDefaultConfigPropArr[index] === USER_IDENTIFICATION_BLOCK.COLLECT_LAST_NAME_STRING) &&
      agentConfig[USER_IDENTIFICATION_BLOCK.COLLECT_FULL_NAME_STRING] === true
    ) {
      if (agentDefaultConfigPropArr[index] === USER_IDENTIFICATION_BLOCK.COLLECT_FIRST_NAME_STRING) {
        setIsFullNameConflictFirstNameModalOpen(true);
      } else {
        setIsFullNameConflictLastNameModalOpen(true);
      }

      return;
    }

    if (
      agentDefaultConfigPropArr[index] === USER_IDENTIFICATION_BLOCK.COLLECT_FULL_NAME_STRING &&
      (agentConfig[USER_IDENTIFICATION_BLOCK.COLLECT_FIRST_NAME_STRING] === true ||
        agentConfig[USER_IDENTIFICATION_BLOCK.COLLECT_LAST_NAME_STRING] === true)
    ) {
      setIsFirstAndLastNameConflictModalOpen(true);

      return;
    }

    onChange({
      [agentDefaultConfigPropArr[index]]: !agentConfig[agentDefaultConfigPropArr[index]],
    });
  };

  const onDefaultFullNameConflictLastNameModalConfirm = () => {
    onChange({
      collectFullName: false,
      collectLastName: true,
    });

    setIsFullNameConflictLastNameModalOpen(false);
  };

  const onDefaultFullNameConflictFirstNameModalConfirm = () => {
    onChange({
      collectFullName: false,
      collectFirstName: true,
    });

    setIsFullNameConflictFirstNameModalOpen(false);
  };

  const onDefaultFirstAndLastNameConflictModalConfirm = () => {
    onChange({
      collectFullName: true,
      collectFirstName: false,
      collectLastName: false,
    });

    setIsFirstAndLastNameConflictModalOpen(false);
  };

  return (
    <StyledFlex>
      <StyledFlex>
        <StyledFlex display="flex" flexDirection="row" alignItems="center" height="65px">
          <StyledFlex
            display="flex"
            width="160px"
            flexShrink={0}
            gap="8px"
            direction="row"
            alignItems="center"
            justifyContent="center"
          >
            <StyledText weight="600" size="15">
              Collect Data
            </StyledText>
            <StyledTooltip
              title={
                <StyledFlex alignItems="center">
                  <StyledText size="14" weight="500" width="259px" textAlign="center" color={colors.white}>
                    All rows that have "Collect Data" turned on will be the information collected if the user requests
                    to be transferred.
                  </StyledText>
                </StyledFlex>
              }
              arrow
              placement="top"
              p="10px 15px"
              maxWidth="auto"
            >
              <CircularTooltipIcon style={{ width: '14px', height: '14px' }} />
            </StyledTooltip>
          </StyledFlex>
          <StyledFlex display="flex" alignItems="center" padding="0px 20px">
            <StyledText weight="600" size="15">
              Name
            </StyledText>
          </StyledFlex>
        </StyledFlex>
      </StyledFlex>
      <StyledDivider color={colors.primary} orientation="horizontal" />
      {infoNameArr.map((name, index) => (
        <StyledFlex key={name}>
          <StyledFlex>
            <StyledFlex display="flex" flexDirection="row" height={85}>
              <StyledFlex display="flex" width="160px" flexShrink={0} justifyContent="center" alignItems="center">
                <Switch
                  checked={agentConfig[agentDefaultConfigPropArr[index]]}
                  activeLabel=""
                  inactiveLabel=""
                  onChange={() => onSwitchChangeHandler(index)}
                />
              </StyledFlex>
              <StyledFlex display="flex" justifyContent="center" padding="0px 20px">
                <StyledText size="15">{name}</StyledText>
              </StyledFlex>
            </StyledFlex>
          </StyledFlex>
          {index < infoNameArr.length - 1 && (
            <StyledDivider color={colors.cardGridItemBorder} orientation="horizontal" />
          )}
        </StyledFlex>
      ))}
      <DefaultFullNameActiveModal
        isOpen={isFullNameConflictFirstNameModalOpen}
        onClose={() => {
          setIsFullNameConflictFirstNameModalOpen(false);
        }}
        onConfirm={onDefaultFullNameConflictFirstNameModalConfirm}
        fieldToOpen="First Name"
      />

      <DefaultFullNameActiveModal
        isOpen={isFullNameConflictLastNameModalOpen}
        onClose={() => {
          setIsFullNameConflictLastNameModalOpen(false);
        }}
        onConfirm={onDefaultFullNameConflictLastNameModalConfirm}
        fieldToOpen="Last Name"
      />

      <DefaultFirstAndLastNameActiveModal
        isOpen={isFirstAndLastNameConflictModalOpen}
        onClose={() => {
          setIsFirstAndLastNameConflictModalOpen(false);
        }}
        onConfirm={onDefaultFirstAndLastNameConflictModalConfirm}
      />
    </StyledFlex>
  );
};

export default CollectUserInfoTable;
