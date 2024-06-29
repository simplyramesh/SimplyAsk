import { useTheme } from '@emotion/react';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import React, { useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSetRecoilState } from 'recoil';

import CopyIcon from '../../../../../../Assets/icons/copy.svg?component';
import routes from '../../../../../../config/routes';
import useUpdateOrchestrator from '../../../../../../hooks/orchestrator/useOrchestrationUpdate';
import useOrchestratorDelete from '../../../../../../hooks/orchestrator/useOrchestratorDelete';
import useOrchestratorDetails from '../../../../../../hooks/orchestrator/useOrchestratorDetails';
import useCopyToClipboard from '../../../../../../hooks/useCopyToClipboard';
import { useGetCurrentUser } from '../../../../../../hooks/useGetCurrentUser';
import { usePopoverToggle } from '../../../../../../hooks/usePopoverToggle';
import { modifiedCurrentPageDetails } from '../../../../../../store';
import { BASE_DATE_TIME_FORMAT, getInFormattedUserTimezone } from '../../../../../../utils/timeUtil';
import EditableRichDescription from '../../../../../Issues/components/shared/EditableRichDescription/EditableRichDescription';
import EditValueTrigger from '../../../../../Issues/components/shared/EditValueTrigger/EditValueTrigger';
import { StyledButton, StyledExpandButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import { RichTextEditor } from '../../../../../shared/REDISIGNED/controls/lexical/RichTextEditor';
import TagsInput from '../../../../../shared/REDISIGNED/controls/TagsInput/TagsInput';
import TrashBinIcon from '../../../../../shared/REDISIGNED/icons/svgIcons/TrashBinIcon';
import InfoListGroup from '../../../../../shared/REDISIGNED/layouts/InfoList/InfoListGroup';
import InfoListItem from '../../../../../shared/REDISIGNED/layouts/InfoList/InfoListItem';
import EmptyTable from '../../../../../shared/REDISIGNED/table-v2/EmptyTable/EmptyTable';
import { StyledTooltip } from '../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import Spinner from '../../../../../shared/Spinner/Spinner';
import {
  StyledDivider,
  StyledFlex,
  StyledResizeHandle,
  StyledStatus,
  StyledText,
} from '../../../../../shared/styles/styled';
import { ContextMenu, ContextMenuItem } from '../../../../shared/components/ContextMenus/StyledContextMenus';
import DeleteOrchestrationModal from '../../../ProcessOrchestratorList/DeleteOrchestrationModal/DeleteOrchestrationModal';

import OrchestratorFullViewTable from './OrchestratorFullViewTable/OrchestratorFullViewTable';

const OrchestratorFullView = () => {
  const navigate = useNavigate();
  const { colors, boxShadows } = useTheme();
  const { processId } = useParams();
  const { copyToClipboard } = useCopyToClipboard();
  const { currentUser } = useGetCurrentUser();

  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [copyMessage, setCopyMessage] = useState('Copy URL of Orchestartor');

  const [manageTagsText, setManageTagsText] = useState('Manage Tags');
  const [tags, setTags] = useState([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const setCurrentPageDetailsState = useSetRecoilState(modifiedCurrentPageDetails);

  const {
    id: deleteMenuId,
    anchorEl: deleteAnchorEl,
    open: isDeleteMenuOpen,
    handleClick: onOpenDeleteMenu,
    handleClose: onCloseDeleteMenu,
  } = usePopoverToggle('orchestrator-details-delete-context-menu');

  const toggleManageTagsText = () => setManageTagsText((prev) => (prev !== 'Done' ? 'Done' : 'Manage Tags'));

  const { orchestrator, isOrchestratorFetching } = useOrchestratorDetails({
    id: processId,
    onSuccess: (res) => {
      setCurrentPageDetailsState({
        pageUrlPath: routes.PROCESS_ORCHESTRATION_DETAILS,
        pageName: res.name,
      });
    },
    onError: () => {
      toast.error('Something went wrong...');
      navigate(`${routes.PROCESS_ORCHESTRATION}`);
    },
  });

  const { updateOrchestration } = useUpdateOrchestrator({
    onSuccess: () => {
      toast.success('Orchestrator has been updated successfully.');
    },
    onError: () => {
      toast.error('Failed to update Orchestrator.');
    },
  });

  const { removeOrchestrationGroups, isDeleteOrchestrationLoading } = useOrchestratorDelete({
    onSuccess: () => {
      toast.success('Orchestrator Job has been deleted successfully.');
      navigate(routes.PROCESS_ORCHESTRATION);
    },
    onError: () => {
      toast.error('Failed to delete Orchestrator Job.');
    },
  });

  const renderDateField = (key) =>
    getInFormattedUserTimezone(orchestrator?.[key], currentUser?.timezone, BASE_DATE_TIME_FORMAT);

  const renderCurrentTags = (tagsArr) =>
    tagsArr.length > 0 ? (
      tagsArr.map((tag) => (
        <StyledStatus key={tag} bgColor={colors.athensGray} height="36px" minWidth="0">
          <StyledText size={15} weight={400} lh={18}>
            {tag}
          </StyledText>
        </StyledStatus>
      ))
    ) : (
      <StyledFlex alignItems="center" alignSelf="stretch" p="20px" ml="-30px">
        <EmptyTable message="There Are No Tags" hideTitle />
      </StyledFlex>
    );

  if (isOrchestratorFetching || isDeleteOrchestrationLoading) return <Spinner parent />;

  return (
    <PanelGroup autoSaveId="service-ticket-view" direction="horizontal">
      <Panel defaultSize={75}>
        <StyledFlex backgroundColor={colors.white} height="100%" boxShadow={boxShadows.box}>
          <Scrollbars id="orchestrator-view-main">
            <StyledFlex p="30px" gap="16px">
              <StyledFlex direction="row" alignItems="center" gap={1.5}>
                <StyledText>#{orchestrator?.id}</StyledText>
              </StyledFlex>
              <StyledText weight="600" size="24" lh="29">
                {orchestrator?.name}
              </StyledText>
            </StyledFlex>
            <StyledDivider orientation="horizontal" height="2px" />
            <StyledFlex p="30px">
              <StyledFlex mb={7}>
                <StyledText mb={16} weight="600">
                  Description
                </StyledText>
                <StyledText>
                  <EditValueTrigger
                    minHeight={0}
                    bgTopBotOffset={14}
                    editableComponent={(setEditing, key) => (
                      <EditableRichDescription
                        placeholder="Add description..."
                        description={orchestrator?.description}
                        key={`${key}-${orchestrator?.updatedAt}`}
                        onCancel={() => setEditing(false)}
                        onSave={async (description) => {
                          setEditing(false);

                          updateOrchestration({ processId, body: { description } });
                        }}
                      />
                    )}
                  >
                    {orchestrator?.description ? (
                      <RichTextEditor
                        key={orchestrator?.updatedAt}
                        readOnly
                        minHeight={0}
                        editorState={orchestrator?.description}
                      />
                    ) : (
                      'No description'
                    )}
                  </EditValueTrigger>
                </StyledText>
              </StyledFlex>
              <OrchestratorFullViewTable groupId={processId} />
            </StyledFlex>
          </Scrollbars>
        </StyledFlex>
      </Panel>

      <StyledResizeHandle>
        <StyledExpandButton onClick={() => setIsPanelOpen((prev) => !prev)}>
          {isPanelOpen ? <KeyboardArrowRightRoundedIcon /> : <KeyboardArrowLeftRoundedIcon />}
        </StyledExpandButton>
      </StyledResizeHandle>

      {isPanelOpen && (
        <Panel defaultSize={25} minSize={25} maxSize={40}>
          <StyledFlex boxShadow={boxShadows.box} height="100%" position="relative" backgroundColor={colors.white}>
            <Scrollbars id="orchestrator-view-panel">
              <StyledFlex p="36px 26px">
                <StyledFlex
                  p="0 10px 30px"
                  direction="row"
                  gap="10px"
                  justifyContent="flex-end"
                  alignItems="flex-start"
                >
                  <StyledTooltip title={copyMessage} arrow placement="top" p="10px 15px" maxWidth="auto">
                    <StyledFlex
                      as="span"
                      width="38px"
                      height="38px"
                      padding="8px 8px 8px 10px"
                      cursor="pointer"
                      borderRadius="7px"
                      backgroundColor={colors.graySilver}
                      onClick={() => {
                        copyToClipboard(`${window.location.href}`);
                        setCopyMessage('Copied!');
                      }}
                      onMouseLeave={() => setCopyMessage('Copy URL of Order')}
                    >
                      <CopyIcon />
                    </StyledFlex>
                  </StyledTooltip>

                  <StyledFlex
                    as="span"
                    width="38px"
                    height="38px"
                    padding="6px 0px 7px 8px"
                    cursor="pointer"
                    borderRadius="7px"
                    backgroundColor={colors.graySilver}
                    onClick={onOpenDeleteMenu}
                  >
                    <MoreHorizIcon />
                  </StyledFlex>
                  <ContextMenu
                    key={deleteMenuId}
                    open={isDeleteMenuOpen}
                    onClose={onCloseDeleteMenu}
                    anchorEl={deleteAnchorEl}
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
                  >
                    <ContextMenuItem startIcon={<TrashBinIcon />} onClick={() => setIsDeleteModalOpen(true)}>
                      Delete
                    </ContextMenuItem>
                  </ContextMenu>
                </StyledFlex>

                <InfoListGroup title="Details" noPaddings>
                  <InfoListItem name="Created On">{renderDateField('updatedAt')}</InfoListItem>
                  <InfoListItem name="Last Edited">{renderDateField('updatedAt')}</InfoListItem>
                </InfoListGroup>
                <StyledDivider borderWidth={2} color={`${colors.regentGray}80`} m="30px -36px 36px -36px" />
                <InfoListGroup noPaddings>
                  <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="15px">
                    <StyledText weight={600} size={19} lh={24}>
                      Tags
                    </StyledText>
                    <StyledButton
                      variant="text"
                      onClick={() => {
                        if (manageTagsText === 'Done') {
                          const tagsToUpdate = tags.map((tag) => tag.value);

                          updateOrchestration({ processId, body: { tags: tagsToUpdate } });
                        } else {
                          setTags(orchestrator?.tags.map((tag) => ({ value: tag, label: tag })));
                        }

                        toggleManageTagsText();
                      }}
                    >
                      {manageTagsText}
                    </StyledButton>
                  </StyledFlex>
                  <StyledFlex
                    direction="row"
                    gap="12px"
                    alignContent="center"
                    alignItems="center"
                    alignSelf="stretch"
                    flexWrap="wrap"
                  >
                    {manageTagsText !== 'Done' ? (
                      renderCurrentTags(orchestrator?.tags)
                    ) : (
                      <TagsInput
                        value={tags}
                        onCreateOption={(tag) => setTags((prev) => [...prev, { value: tag, label: tag }])}
                        onChange={(values) => setTags(values)}
                        placeholder="Enter Tags..."
                      />
                    )}
                  </StyledFlex>
                </InfoListGroup>
              </StyledFlex>
            </Scrollbars>
          </StyledFlex>
        </Panel>
      )}
      <DeleteOrchestrationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={() => removeOrchestrationGroups({ groupIds: [processId] })}
        orchestrationJobToDelete={orchestrator}
      />
    </PanelGroup>
  );
};

export default OrchestratorFullView;
