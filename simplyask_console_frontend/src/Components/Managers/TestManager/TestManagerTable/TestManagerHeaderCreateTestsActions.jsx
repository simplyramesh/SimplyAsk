import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { usePopoverToggle } from '../../../../hooks/usePopoverToggle';
import {
  StyledImportButton,
  StyledPopoverActionsBtn,
} from '../../../shared/ManagerComponents/SubNavBar/StyledSubNavBar';
import { StyledButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';
import { StyledTooltip } from '../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledFlex, StyledText } from '../../../shared/styles/styled';
import { ContextMenu } from '../../shared/components/ContextMenus/StyledContextMenus';
import { CreateTestDataMenuItem } from '../StyledTestManager';
import TestIcon from '../components/TestIcon/TestIcon';
import { TEST_ENTITY_TYPE } from '../constants/constants';

const TestManagerHeaderCreateTestsActions = ({
  setIsCreateTestCaseModalOpen,
  setIsCreateTestSuiteModalOpen,
  setIsCreateTestGroupModalOpen,
  isImportButtonLoading,
  onImportNewTestClick,
  onImportAndReplaceTestClick,
}) => {
  const {
    id: createTestId,
    open: isCreateTestBtnOpen,
    anchorEl: createTestAnchorEl,
    handleClick: onCreateTestOpen,
    handleClose: onCreateTestClose,
  } = usePopoverToggle('create-test-popover', false);

  const {
    id: idImportTestActionsPopover,
    open: openImportTestActionsPopover,
    anchorEl: anchorElImportTestActionsPopover,
    handleClick: handleClickImportTestActionsPopover,
    handleClose: handleCloseImportTestActionsPopover,
  } = usePopoverToggle('import-test-popover');

  const handleImportButtonClick = (e) => {
    if (isImportButtonLoading) return;

    handleClickImportTestActionsPopover(e);
  };

  const handlePopOverActionClick = (e, callbackFn) => {
    handleCloseImportTestActionsPopover(e);
    callbackFn();
  };

  return (
    <>
      <StyledFlex direction="row" gap="15px">
        <StyledButton
          secondary
          variant="contained"
          onClick={onCreateTestOpen}
          endIcon={<KeyboardArrowDownOutlinedIcon color="white" width={20} />}
        >
          Create
        </StyledButton>

        <StyledTooltip
          title={!isImportButtonLoading && 'Import a Test Case'}
          arrow
          placement="top"
          p="10px"
          maxWidth="auto"
        >
          <StyledFlex>
            <StyledImportButton
              variant="contained"
              tertiary
              startIcon={!isImportButtonLoading && <FileDownloadOutlinedIcon />}
              endIcon={!isImportButtonLoading && <KeyboardArrowDownRoundedIcon />}
              onClick={handleImportButtonClick}
              loading={isImportButtonLoading}
            />
          </StyledFlex>
        </StyledTooltip>
      </StyledFlex>

      <ContextMenu
        key={createTestId}
        open={isCreateTestBtnOpen}
        onClose={onCreateTestClose}
        anchorEl={createTestAnchorEl}
        maxWidth="-webkit-fill-available"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        marginTop="4px"
        width="500px"
      >
        <StyledFlex flexDirection="column">
          <CreateTestDataMenuItem
            display="flex"
            flexDirection="row"
            p="10px 20px"
            cursor="pointer"
            onClick={() => {
              setIsCreateTestCaseModalOpen(true);
              onCreateTestClose();
            }}
          >
            <TestIcon entityType={TEST_ENTITY_TYPE.CASE} />
            <StyledText as="span" weight={600} lh={30} ml={6} mr={4}>
              {'Test Case '}
            </StyledText>
            <StyledText as="span" lh={30}>
              {' - A Single Test Case'}
            </StyledText>
          </CreateTestDataMenuItem>
          <CreateTestDataMenuItem
            display="flex"
            flexDirection="row"
            p="10px 20px"
            cursor="pointer"
            onClick={() => {
              setIsCreateTestSuiteModalOpen(true);
              onCreateTestClose();
            }}
          >
            <TestIcon entityType={TEST_ENTITY_TYPE.SUITE} />
            <StyledText as="span" weight={600} lh={30} ml={6} mr={4}>
              {'Test Suite '}
            </StyledText>
            <StyledText as="span" lh={30}>
              {' - A Collection of Test Cases'}
            </StyledText>
          </CreateTestDataMenuItem>
          <CreateTestDataMenuItem
            display="flex"
            flexDirection="row"
            p="10px 20px"
            cursor="pointer"
            onClick={() => {
              setIsCreateTestGroupModalOpen(true);
              onCreateTestClose();
            }}
          >
            <TestIcon entityType={TEST_ENTITY_TYPE.GROUP} />
            <StyledText as="span" weight={600} lh={30} ml={6} mr={4}>
              {'Test Group '}
            </StyledText>
            <StyledText as="span" lh={30}>
              {' - A Group of Test Cases and/or Test Suites'}
            </StyledText>
          </CreateTestDataMenuItem>
        </StyledFlex>
      </ContextMenu>

      <ContextMenu
        key={idImportTestActionsPopover}
        open={openImportTestActionsPopover}
        onClose={handleCloseImportTestActionsPopover}
        anchorEl={anchorElImportTestActionsPopover}
        maxWidth="-webkit-fill-available"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        marginTop="4px"
        rootpadding="0"
      >
        <StyledFlex overflow="hidden" padding="5px 0">
          <StyledPopoverActionsBtn onClick={(e) => handlePopOverActionClick(e, onImportNewTestClick)}>
            <StyledFlex cursor="pointer" p="7px 16px 10px 16px" alignItems="center" marginRight="auto">
              <StyledText wrap="nowrap">Import and create a new Test Case</StyledText>
            </StyledFlex>
          </StyledPopoverActionsBtn>

          <StyledPopoverActionsBtn onClick={(e) => handlePopOverActionClick(e, onImportAndReplaceTestClick)}>
            <StyledFlex cursor="pointer" p="10px 16px 7px 16px" alignItems="center" marginRight="auto">
              <StyledText wrap="nowrap">Import and replace an existing Test Case</StyledText>
            </StyledFlex>
          </StyledPopoverActionsBtn>
        </StyledFlex>
      </ContextMenu>
    </>
  );
};

export default TestManagerHeaderCreateTestsActions;
