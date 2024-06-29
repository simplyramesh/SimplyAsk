import { useTheme } from '@emotion/react';
// import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import IosShareRoundedIcon from '@mui/icons-material/IosShareRounded';
// import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import { Popover } from '@mui/material';
import CustomScrollbar from 'react-custom-scrollbars-2';

// import { toast } from 'react-toastify';
import DuplicateIcon from '../../../../../../Assets/icons/agent/contextMenu/duplicate.svg?component';
import ArchiveIcon from '../../../../../../Assets/icons/processManagerArchiveIcon.svg?component';
import { MANAGER_API_KEYS } from '../../../../../../config/managerKeys';
import { useGetCurrentUser } from '../../../../../../hooks/useGetCurrentUser';
// import { usePopoverToggle } from '../../../../../../hooks/usePopoverToggle';
import { SHOW_PROCESS_MANAGER_MODAL_TYPES } from '../../../../../Managers/ProcessManager/constants/common';
// import {
// PROCESS_HISTORY_STATUS_COLOR_MAP,
// PROCESS_HISTORY_STATUS_DESCRIPTION_MAP,
// PROCESS_HISTORY_STATUS_LABEL_MAP,
// PROCESS_HISTORY_STATUS_MENU_OPTIONS,
// } from '../../../../../Managers/ProcessManager/constants/statusConstants';
import { StyledButton } from '../../../../REDISIGNED/controls/Button/StyledButton';
import TrashBinIcon from '../../../../REDISIGNED/icons/svgIcons/TrashBinIcon';
import { StyledTooltip } from '../../../../REDISIGNED/tooltip/StyledTooltip';
import Spinner from '../../../../Spinner/Spinner';
import { StyledDivider, StyledFlex, StyledText } from '../../../../styles/styled';
import { CHANGE_PROCESS_MANAGER_MENUS } from '../SettingsSideDrawer';
import { StyledSettingsMenuItem } from '../StyledSettingsSideDrawer';
import DateAndUserName from '../../../Shared/DateAndUserName';
/*
--------------------------------------------------------------------------
Uncomment out code when they become functional
--------------------------------------------------------------------------
*/

const ProcessManagerSettings = ({
  // setShowIsProcessStatusChanged,
  setActiveMenu,
  processData,
  setShowMoveElementToArchive,
  setShowDeleteElementModal,
  exportProcess,
  isExportProcessLoading,
  setShowProcessManagerModal,
}) => {
  const { currentUser } = useGetCurrentUser();
  const { colors } = useTheme();
  // const { colors, boxShadows, statusColors } = useTheme();

  // const {
  // id: statusMenuId,
  // open: isStatusMenuOpen,
  // anchorEl: statusAnchorEl,
  // handleClick: onStatusOpen,
  // handleClose: onStatusClose,
  // } = usePopoverToggle('process-manager-settings-status-menu');

  const processName = processData?.[MANAGER_API_KEYS.DISPLAY_NAME];
  const processDescription = processData?.[MANAGER_API_KEYS.DESCRIPTION];
  // const processStatus = processData?.[MANAGER_API_KEYS.STATUS];
  const processTypeName = processData?.[MANAGER_API_KEYS.PROCESS_TYPE]?.[MANAGER_API_KEYS.NAME];
  const processTypeDescription = processData?.[MANAGER_API_KEYS.PROCESS_TYPE]?.[MANAGER_API_KEYS.DESCRIPTION];

  const renderTitleAndDescription = (
    title,
    description,
    isDescriptionLg = false,
    boldDescription = '',
    isProcessNameHeading = false,
    rootGap = '4px'
  ) => {
    const addHyphen = boldDescription ? ' - ' : '';

    return (
      <StyledFlex px="20px" gap={rootGap}>
        <StyledText as="h4" size={isProcessNameHeading ? 19 : 16} weight={600} lh={24}>
          {title}
        </StyledText>
        <StyledText as="p" size={isDescriptionLg ? 16 : 14} weight={400} lh={21}>
          {boldDescription ? (
            <StyledText display="inline" size={16} weight={700} lh={24}>
              {boldDescription}
            </StyledText>
          ) : null}
          {addHyphen}
          {description}
        </StyledText>
      </StyledFlex>
    );
  };

  // const renderStatusMenu = () => (
  //   <Popover
  //     id={statusMenuId}
  //     open={isStatusMenuOpen}
  //     onClose={onStatusClose}
  //     anchorEl={statusAnchorEl}
  //     hideBackdrop
  //     sx={{
  //       top: 10,
  //       zIndex: 5001,
  //       '& .MuiPaper-root': {
  //         width: statusAnchorEl?.offsetWidth,
  //         borderRadius: '10px',
  //         boxShadow: boxShadows.box,
  //       },
  //     }}
  //     anchorOrigin={{
  //       vertical: 'bottom',
  //       horizontal: 'center',
  //     }}
  //     transformOrigin={{
  //       vertical: 'top',
  //       horizontal: 'center',
  //     }}
  //   >
  //     <ClickAwayListener onClickAway={onStatusClose}>
  //       <StyledFlex p="16px" pb="18px" width="100%" gap="14px">
  //         {PROCESS_HISTORY_STATUS_MENU_OPTIONS.map((status) => (
  //           <StyledFlex
  //             key={status.value}
  //             onClick={(e) => {
  //               if (status.value === processStatus) {
  //                 toast.warning(`${status.label} status has already been selected`);
  //                 return;
  //               }

  //               setShowIsProcessStatusChanged({ showModal: true, value: status });
  //               onStatusClose(e);
  //             }}
  //             sx={{
  //               flexDirection: 'row',
  //               padding: '14px',
  //               '&:hover': {
  //                 cursor: 'pointer',
  //                 borderRadius: '10px',
  //                 backgroundColor: statusColors[PROCESS_HISTORY_STATUS_COLOR_MAP[status.value]].bg,
  //               },
  //             }}
  //           >
  //             <StyledFlex
  //               as="span"
  //               fontSize="16px"
  //               alignItems="center"
  //               justifyContent="center"
  //               color={statusColors[PROCESS_HISTORY_STATUS_COLOR_MAP[status.value]].color}
  //             >
  //               <CircleIcon fontSize="inherit" />
  //             </StyledFlex>
  //             {renderTitleAndDescription(status.label, status.description)}
  //           </StyledFlex>
  //         ))}
  //       </StyledFlex>
  //     </ClickAwayListener>
  //   </Popover>
  // );

  const renderMenuItemIcon = () => (
    <StyledFlex as="span" flexShrink={0} ml={4} justifyContent="center">
      <KeyboardArrowRightIcon />
    </StyledFlex>
  );

  const renderQuickActionButtons = () => (
    <StyledFlex direction="row" gap="20px" padding="0 20px">
      <StyledTooltip
        title={
          processData?.[MANAGER_API_KEYS.IS_ARCHIVED]
            ? 'This will make the process active, and it will appear back in the "All Processes" tab.'
            : 'This will hide the process by moving it to the “Archive” section. Archived processes will no longer function, but they can be viewed and edited.'
        }
        arrow
        placement="top"
        p="10px 15px"
        maxWidth="auto"
      >
        <StyledButton
          startIcon={<ArchiveIcon width={23} />}
          tertiary
          variant="contained"
          onClick={() => setShowMoveElementToArchive(true)}
        >
          {processData?.[MANAGER_API_KEYS.IS_ARCHIVED] ? 'Unarchive' : 'Archive'}
        </StyledButton>
      </StyledTooltip>

      <StyledTooltip
        title="Export this process, and all its information and settings."
        arrow
        placement="top"
        p="10px 15px"
        maxWidth="auto"
      >
        <StyledButton
          startIcon={<IosShareRoundedIcon />}
          tertiary
          variant="contained"
          onClick={() =>
            exportProcess({
              id: processData?.[MANAGER_API_KEYS.WORKFLOW_ID],
              processType: processData?.[MANAGER_API_KEYS.PROCESS_TYPE],
              processName,
            })
          }
        >
          Export
        </StyledButton>
      </StyledTooltip>

      <StyledTooltip
        title="This will clone the process, and all its information and settings."
        arrow
        placement="top"
        p="10px 15px"
        maxWidth="auto"
      >
        <StyledButton
          startIcon={<DuplicateIcon />}
          tertiary
          variant="contained"
          onClick={() =>
            setShowProcessManagerModal({
              type: SHOW_PROCESS_MANAGER_MODAL_TYPES.DUPLICATE_PROCESS,
              data: processData,
            })
          }
        >
          Duplicate
        </StyledButton>
      </StyledTooltip>

      <StyledTooltip
        title="This will permanently delete your process. Once it is deleted, it cannot be recovered."
        arrow
        placement="top"
        p="10px 15px"
        maxWidth="auto"
      >
        <StyledButton
          startIcon={<TrashBinIcon />}
          tertiary
          variant="contained"
          onClick={() => setShowDeleteElementModal(true)}
        >
          Delete
        </StyledButton>
      </StyledTooltip>
    </StyledFlex>
  );

  const isLoading = isExportProcessLoading;

  return (
    <StyledFlex pb="80px" width="100%" height="100%">
      {isLoading && <Spinner fadeBgParentFixedPosition />}
      <CustomScrollbar autoHide>
        <StyledFlex gap="30px 0">
          <StyledFlex px="20px" mt="10px">
            <StyledText as="h3" size={19} weight={600} lh={29}>
              Settings
            </StyledText>
          </StyledFlex>
          {renderQuickActionButtons()}
          {renderTitleAndDescription(processName, processDescription, true, null, true)}
        </StyledFlex>
        <StyledFlex>
          {/* <StyledFlex py="30px" gap="3px 0">
            {renderTitleAndDescription('Process Status')}
            <StyledFlex px="20px">
              <StyledCurrentProcessStatus
                // onClick={onStatusOpen}
                status={processStatus}
                variant="contained"
                primary
                startIcon={<CircleIcon />}
                endIcon={<KeyboardArrowDownRoundedIcon />}
                disableRipple
              >
                {renderTitleAndDescription(
                  PROCESS_HISTORY_STATUS_LABEL_MAP[processStatus],
                  PROCESS_HISTORY_STATUS_DESCRIPTION_MAP[processStatus],
                  null,
                  null,
                  null,
                  0,
                )}
              </StyledCurrentProcessStatus>
            </StyledFlex>
            {renderStatusMenu()}
          </StyledFlex> */}

          <StyledFlex pb="30px" gap="30px" mt="30px">
            <StyledFlex>
              {renderTitleAndDescription(
                'Process Type:',
                <StyledText display="inline" weight={500}>
                  {processTypeName}
                  {' - '}
                  <StyledText display="span" weight={400} color={colors.information}>
                    {processTypeDescription}
                  </StyledText>
                </StyledText>,
                true
              )}
            </StyledFlex>

            <StyledFlex gap="4px" px="20px">
              <StyledText weight={600}>Created On:</StyledText>
              <DateAndUserName
                timeStamp={processData?.createdAt}
                userName={processData?.createdBy}
                currentUser={currentUser}
              />
            </StyledFlex>

            <StyledFlex gap="4px" px="20px">
              <StyledText weight={600}>Updated On:</StyledText>
              <DateAndUserName
                timeStamp={processData?.updatedAt}
                userName={processData?.updatedBy}
                currentUser={currentUser}
              />
            </StyledFlex>
          </StyledFlex>

          <StyledDivider color={colors.cardGridItemBorder} borderWidth={2} />
          <StyledSettingsMenuItem
            py="30px"
            onClick={() => setActiveMenu(CHANGE_PROCESS_MANAGER_MENUS.EDIT_PROCESS_DETAILS)}
          >
            {renderTitleAndDescription(
              'Edit Process Details',
              'View and edit process details, including name, tags, and description.'
            )}
            {renderMenuItemIcon()}
          </StyledSettingsMenuItem>

          <StyledDivider color={colors.cardGridItemBorder} borderWidth={2} />
          <StyledSettingsMenuItem
            py="30px"
            onClick={() => setActiveMenu(CHANGE_PROCESS_MANAGER_MENUS.PROCESS_VISIBILITY)}
          >
            <StyledFlex>
              {renderTitleAndDescription('Process Visibility', 'Configure who can see, view and edit this process. ')}

              <StyledFlex
                direction="row"
                m="12px 0 0 20px"
                p="5px 8px"
                borderRadius="5px"
                bgcolor={colors.bgColorOptionTwo}
                alignSelf="flex-start"
              >
                <StyledText size={14} lh={21} weight={600}>
                  Current Visibility:&nbsp;
                </StyledText>
                <StyledText size={14} lh={21}>
                  {processData?.users?.length || processData?.userGroups?.length
                    ? 'Only Specific Users and User Groups'
                    : 'Entire Organization'}
                </StyledText>
              </StyledFlex>
            </StyledFlex>
            {renderMenuItemIcon()}
          </StyledSettingsMenuItem>
          <StyledDivider color={colors.cardGridItemBorder} borderWidth={2} />
          {/* <StyledSettingsMenuItem
            py="30px"
            onClick={() => setActiveMenu(CHANGE_PROCESS_MANAGER_MENUS.MANAGE_BLACKOUT_PERIODS)}
          >
            {renderTitleAndDescription(
              'Blackout Periods',
              'Set blackout dates and times to specify periods this process should not execute.',
            )}
          </StyledSettingsMenuItem>
          <StyledDivider color={colors.cardGridItemBorder} borderWidth={2} /> */}
          <StyledSettingsMenuItem
            py="30px"
            onClick={() => setActiveMenu(CHANGE_PROCESS_MANAGER_MENUS.PUBLIC_SUBMISSION_FORM)}
          >
            {renderTitleAndDescription(
              'Public Submission Form',
              'Enable a public branded form to capture requests for fulfillment by this Process with optional password protection.'
            )}
            {renderMenuItemIcon()}
          </StyledSettingsMenuItem>
          <StyledDivider color={colors.cardGridItemBorder} borderWidth={2} />
          <StyledSettingsMenuItem py="30px" onClick={() => setActiveMenu(CHANGE_PROCESS_MANAGER_MENUS.RESOURCES)}>
            {renderTitleAndDescription('How to Execute Process')}
            {renderMenuItemIcon()}
          </StyledSettingsMenuItem>
        </StyledFlex>
      </CustomScrollbar>
    </StyledFlex>
  );
};

export default ProcessManagerSettings;
