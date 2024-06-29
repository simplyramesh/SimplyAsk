import { useTheme } from '@emotion/react';
import CircleIcon from '@mui/icons-material/Circle';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import { Collapse } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { CopyBlock, dracula } from 'react-code-blocks';
import Scrollbars from 'react-custom-scrollbars-2';

import { MANAGER_API_KEYS } from '../../../../../../../../config/managerKeys';
import routes from '../../../../../../../../config/routes';
import { getProcessUrl } from '../../../../../../../../Services/axios/processManager';
import { StyledButton } from '../../../../../../REDISIGNED/controls/Button/StyledButton';
import Spinner from '../../../../../../Spinner/Spinner';
import { StyledDivider, StyledFlex, StyledIconButton, StyledText } from '../../../../../../styles/styled';
import useGetOrgAPIKey from '../../../hooks/useGetOrgAPIKey';
import useGetWorkflowSettingsDto from '../../../hooks/useGetWorkflowSettingsDtoById';
import { CHANGE_PROCESS_MANAGER_MENUS } from '../../../SettingsSideDrawer';
import { StyledSettingsMenuItem } from '../../../StyledSettingsSideDrawer';

import { matchValidation } from './helpers';

const CODE_BLOCK_ID = 'codeBlockParentId';
const DEFAULT_BUTTON_TEXT = 'Copy Snippet';
const COPIED_BUTTON_TEXT = 'Copied';

const sharedStylingAttrs = {
  padding: '0 25px 0 20px',
  px: '20px',
  pr: '25px',
  pb: '30px',
  outerGap: '16px 0',
  innerGap: '14px 0',
  listGap: '8px 0',
};

const textAttrs = {
  true: {
    as: 'h3',
    size: 16,
    weight: 600,
    lh: 21,
  },
  false: {
    as: 'p',
    size: 14,
    weight: 400,
    lh: 21,
  },
};

const Resources = ({ setActiveMenu, clickedProcess }) => {
  const { colors } = useTheme();

  const [expanded, setExpanded] = useState(false);

  const [copyButtonText, setCopyButtonText] = useState(DEFAULT_BUTTON_TEXT);
  const [cUrl, setCUrl] = useState({
    cURL: 'curl -XPOST',
    contentType: '-H "Content-Type: application/json"',
    payload: '-d { }',
  });

  const copyBlockRef = useRef(null);

  const changeCopyButtonText = () => setCopyButtonText(COPIED_BUTTON_TEXT);
  const toggleAccordion = (panel) => setExpanded((prev) => (prev !== panel ? panel : false));

  const {
    data: backendUrl,
    isFetching,
    isSuccess: isBackendUrlSuccess,
  } = useQuery({
    queryKey: ['getProcessUrl'],
    queryFn: () => getProcessUrl(),
    onSuccess: (data) => {
      setCUrl((prev) => ({
        ...prev,
        url: ` '${data}'`,
      }));
    },
  });

  const { defaultOrganizationKey, organizationKeyLoading, isOrganizationKeySuccess } = useGetOrgAPIKey({
    options: {
      select: (data) => data?.value || '',
      onSuccess: (data) => {
        setCUrl((prev) => ({
          ...prev,
          auth: `-H 'authorization: ${data}'`,
        }));
      },
    },
  });

  const { workflowDtoSettings: workflowSettings, isWorkflowDtoSettingsFetching: workflowSettingsLoading } =
    useGetWorkflowSettingsDto({
      workflowId: clickedProcess[MANAGER_API_KEYS.WORKFLOW_ID],
      options: {
        enabled: !!clickedProcess[MANAGER_API_KEYS.WORKFLOW_ID] && isBackendUrlSuccess && isOrganizationKeySuccess,
        select: (data) => {
          const paramSets = data?.inputParamSets[0]?.dynamicInputParams.reduce(
            (acc, item) => ({
              ...acc,
              [item.paramName]: matchValidation(item.validationType).value,
            }),
            {}
          );

          const paramsWithValidation = data?.inputParamSets[0]?.dynamicInputParams.reduce((acc, item) => {
            const capitalizedValidationType =
              item.validationType.toLowerCase().charAt(0).toUpperCase() + item.validationType.slice(1).toLowerCase();

            return [...acc, `${item.paramName} (${capitalizedValidationType})`];
          }, []);
          return {
            ...data,
            expectedInputParams: paramSets,
            paramsWithValidation,
          };
        },
        onSuccess: (data) => {
          let modifiedParam = Object.keys(data?.expectedInputParams ?? {})
            ?.map((item) => `                "${item}": "${data?.expectedInputParams?.[item]}"`)
            .join(',\n');

          if (!modifiedParam) {
            modifiedParam = ' '.repeat(16); // Empty space for indentation
          }

          const processId = clickedProcess?.[MANAGER_API_KEYS.WORKFLOW_ID];
          const params = modifiedParam ? `    ${modifiedParam}\n` : '';

          const text = `curl -XPOST -H 'authorization:\n ${defaultOrganizationKey}'
-H "Content-type:\n application/json" -d '{
         "processId" : "${processId}",
         "params" : {
${params}         }
}' '${backendUrl}'`;

          setCUrl((prev) => {
            const payload = `-d '${JSON.stringify({
              processId: clickedProcess[MANAGER_API_KEYS.WORKFLOW_ID],
              params: data?.expectedInputParams,
            })}'`;

            return {
              ...prev,
              payload,
              copyBlock: text,
              fullcURL: `${prev.cURL} ${prev?.auth ?? ''} ${prev.contentType} ${payload} ${prev?.url ?? ''}`,
            };
          });
        },
      },
    });

  useEffect(() => {
    let timeoutId;

    const resetCopyButtonText = () => {
      setCopyButtonText(DEFAULT_BUTTON_TEXT);
    };

    if (!copyButtonText) resetCopyButtonText();

    if (copyButtonText === COPIED_BUTTON_TEXT) {
      timeoutId = setTimeout(resetCopyButtonText, 3000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [copyButtonText]);

  const renderMenuItemIcon = () => (
    <StyledFlex as="span" flexShrink={0} ml={4} justifyContent="center">
      <ExpandMoreRoundedIcon />
    </StyledFlex>
  );

  const renderDetailsText = (text, isSubtitle = false) => {
    const { as, size, weight, lh } = textAttrs[isSubtitle.toString()];

    return (
      <StyledText as={as} size={size} lh={lh} weight={weight}>
        {text}
      </StyledText>
    );
  };

  const renderCollapseSummary = (text, toggleValue) => (
    <StyledSettingsMenuItem
      p={sharedStylingAttrs.padding}
      py={sharedStylingAttrs.pb}
      onClick={() => toggleAccordion(toggleValue)}
    >
      {renderDetailsText(text, true)}
      {renderMenuItemIcon()}
    </StyledSettingsMenuItem>
  );

  const renderListItem = (item, number = null) => (
    <StyledFlex direction="row" alignItems="flex-start" key={item} pl="8px">
      <StyledFlex direction="row" alignItems={number ? 'flex-start' : 'center'} gap="0 8px">
        <StyledFlex as="span" fontSize="4px">
          {number ? renderDetailsText(number) : <CircleIcon fontSize="inherit" />}
        </StyledFlex>
        {renderDetailsText(item)}
      </StyledFlex>
    </StyledFlex>
  );

  const renderBtn = (text, onClick, isStart = true) => (
    <StyledFlex alignItems={isStart ? 'flex-start' : 'flex-end'}>
      <StyledButton variant="contained" primary onClick={onClick}>
        {text}
      </StyledButton>
    </StyledFlex>
  );

  const renderDivider = (withMargin = false) => (
    <StyledDivider color={colors.cardGridItemBorder} borderWidth={2} m={withMargin ? '10px 0 0 0' : 0} />
  );

  return (
    <StyledFlex height="100%" pb="80px">
      <StyledFlex mb="20px">
        <StyledFlex direction="row" gap="15px" p="20px 24px 20px 15px" alignItems="center">
          <StyledIconButton
            size="32px"
            iconSize="27px"
            bgColor="transparent"
            hoverBgColor={colors.galleryGray}
            onClick={() =>
              setActiveMenu((prev) => ({
                ...prev,
                ...CHANGE_PROCESS_MANAGER_MENUS.PRIMARY_MENU,
              }))
            }
          >
            <KeyboardBackspaceRoundedIcon />
          </StyledIconButton>
          <StyledText as="h2" size={19} weight={600} lh={25}>
            How to Execute Process
          </StyledText>
        </StyledFlex>
        <StyledFlex px={sharedStylingAttrs.px}>
          {renderDetailsText(
            'You can execute a Symphona Flow Process and integrate them with existing systems and operations in many ways. The following options below outline different options and the steps required.'
          )}
        </StyledFlex>
      </StyledFlex>
      {renderDivider()}
      <StyledFlex height="100%">
        <Scrollbars autoHide>
          <StyledFlex pb={sharedStylingAttrs.pb}>
            {renderCollapseSummary('REST API Execution', 'restAPI')}
            <StyledFlex p={sharedStylingAttrs.padding}>
              <Collapse in={expanded === 'restAPI'}>
                {isFetching || organizationKeyLoading || workflowSettingsLoading ? (
                  <Spinner inline medium />
                ) : (
                  <StyledFlex gap={sharedStylingAttrs.outerGap} pb={sharedStylingAttrs.pb}>
                    {renderDetailsText(
                      "To execute your Process over REST API, you will need to make a request to the specified endpoint with one of your organization's API keys (configured in Settings > Access Management)."
                    )}
                    {renderDetailsText(
                      'Sending a request to the specified endpoint will start a single Process execution. To start multiple Process executions, send multiple requests to this endpoint.'
                    )}
                    {renderDetailsText('API Request Specification', true)}
                    <StyledFlex gap={sharedStylingAttrs.innerGap}>
                      <StyledFlex gap={sharedStylingAttrs.listGap}>
                        {renderListItem('Method: POST')}
                        {renderListItem(`URL: ${backendUrl ?? ''}`)}
                        {renderListItem(`Authorization: ${defaultOrganizationKey ?? ''}`)}
                        <StyledFlex>
                          {renderListItem('Body (raw JSON):')}
                          <StyledFlex pl="16px">
                            {renderListItem(`"processId": ${clickedProcess?.[MANAGER_API_KEYS.WORKFLOW_ID] ?? '---'}`)}
                            <StyledFlex>
                              {renderListItem('"params":')}
                              <StyledFlex pl="16px">
                                {workflowSettings?.paramsWithValidation?.map((item) => renderListItem(item))}
                              </StyledFlex>
                            </StyledFlex>
                          </StyledFlex>
                        </StyledFlex>
                      </StyledFlex>
                    </StyledFlex>
                    {renderDetailsText('cURL Example', true)}
                    <StyledFlex gap={sharedStylingAttrs.innerGap}>
                      {renderDetailsText(
                        "The following example will execute this Process using your organization's default API key (with mock parameter values)"
                      )}
                      <StyledFlex ref={copyBlockRef}>
                        <CopyBlock
                          id={CODE_BLOCK_ID}
                          language="javascript"
                          text={cUrl?.copyBlock}
                          showLineNumbers
                          theme={dracula}
                          wrapLongLines
                          onCopy={changeCopyButtonText}
                        />
                      </StyledFlex>
                      {renderBtn(
                        copyButtonText,
                        () => {
                          if (copyBlockRef.current) {
                            copyBlockRef.current.querySelector('button').click();
                            changeCopyButtonText();
                          }
                        },
                        false
                      )}
                    </StyledFlex>
                  </StyledFlex>
                )}
              </Collapse>
              {renderDivider()}
            </StyledFlex>

            {renderCollapseSummary('Public Submission Form', 'submissionForm')}
            <StyledFlex p={sharedStylingAttrs.padding}>
              <Collapse in={expanded === 'submissionForm'}>
                <StyledFlex gap={sharedStylingAttrs.outerGap} pb={sharedStylingAttrs.pb}>
                  {renderDetailsText(
                    'To execute your Process from a publicly accessible form (if enabled for the Process), go to the URL address provided in Process Manager > Process Settings > Public Submission Form'
                  )}
                  {renderBtn('Go to Submission Form Configuration', () =>
                    window.open(routes.SETTINGS_BACK_OFFICE_TAB, '_blank')
                  )}
                </StyledFlex>
              </Collapse>
              {renderDivider()}
            </StyledFlex>
            {renderCollapseSummary('Inbound Email', 'inboundEmail')}
            <StyledFlex p={sharedStylingAttrs.padding}>
              <Collapse in={expanded === 'inboundEmail'}>
                <StyledFlex gap={sharedStylingAttrs.outerGap} pb={sharedStylingAttrs.pb}>
                  {renderDetailsText(
                    'To execute your Process when inbound emails are received, you will need to forward your emails to a defined email address. Please contact Symphona Support to set up this feature for your organization.'
                  )}
                  {renderBtn('Go to Support Page', () => window.open(routes.SUPPORT, '_blank'))}
                </StyledFlex>
              </Collapse>
              {renderDivider()}
            </StyledFlex>
            {renderCollapseSummary('Platform - Converse Agent Conversation', 'converseAgent')}
            <StyledFlex p={sharedStylingAttrs.padding}>
              <Collapse in={expanded === 'converseAgent'}>
                <StyledFlex gap={sharedStylingAttrs.outerGap} pb={sharedStylingAttrs.pb}>
                  {renderDetailsText(
                    'To execute your Process during an automated Converse Agent conversation, you must define it in the Agent Editor. The steps are as follows:'
                  )}
                  <StyledFlex gap={sharedStylingAttrs.innerGap}>
                    <StyledFlex gap={sharedStylingAttrs.listGap}>
                      {renderListItem(
                        'Navigate to Converse > Agent Manager in the side navigation bar and click "Edit Agent" to open the Agent Editor',
                        '1.'
                      )}
                      {renderListItem(
                        'Create a new "Action" block in the conversation step you would like the Process to execute on',
                        '2.'
                      )}
                      {renderListItem('Click on the new "Action" block to edit it', '3.')}
                      {renderListItem(
                        'Select "Execute Process (Asynchronously)" or "Execute Process (Synchronously)" in the "Type" field',
                        '4.'
                      )}
                      {renderListItem(
                        `Select your target Process in the "Process" field, define the required input parameters in the "Process Input Fields" section, and optionally for 
                      "Synchronous" executions, define any output parameters you would like for later use in the Agent in the "Process Output Fields" section.`,
                        '5.'
                      )}
                      {renderListItem('Click "Publish" to save your changes', '6.')}
                    </StyledFlex>
                    {renderDetailsText(
                      'After following these steps, your Process will execute at the end of the specified Agent conversation step.'
                    )}
                  </StyledFlex>
                  {renderBtn('Go to Agent Manager', () => window.open(routes.AGENT_MANAGER, '_blank'))}
                </StyledFlex>
              </Collapse>
              {renderDivider()}
            </StyledFlex>
            {renderCollapseSummary('Platform - Process Trigger (Form Entry)', 'formEntry')}
            <StyledFlex p={sharedStylingAttrs.padding}>
              <Collapse in={expanded === 'formEntry'}>
                <StyledFlex gap={sharedStylingAttrs.outerGap} pb={sharedStylingAttrs.pb}>
                  {renderDetailsText(
                    'To execute your Process by individually entering in the required Process input parameters, you can use Process Trigger. The steps are as follows:'
                  )}
                  <StyledFlex gap={sharedStylingAttrs.innerGap}>
                    <StyledFlex gap={sharedStylingAttrs.listGap}>
                      {renderListItem('Navigate to Flow > Process Trigger in the side navigation bar', '1.')}
                      {renderListItem('In page section "Step 1", select your target process', '2.')}
                      {renderListItem(
                        'In page section "Step 2", select "Form Entry" and define one or more process executions by clicking "Define Execution"',
                        '3.'
                      )}
                      {renderListItem(
                        'In page section "Step 3", define your desired execution time and frequency',
                        '4.'
                      )}
                      {renderListItem('Click "Submit Execution"', '5.')}
                    </StyledFlex>
                    {renderDetailsText(
                      'After following these steps, your process executions will start (either immediately or at a later specified date, depending on your selected execution time).'
                    )}
                  </StyledFlex>
                  {renderBtn('Go to Process Trigger', () => window.open(routes.PROCESS_TRIGGER, '_blank'))}
                </StyledFlex>
              </Collapse>
              {renderDivider()}
            </StyledFlex>
            {renderCollapseSummary('Platform - Process Trigger (File Upload)', 'fileUpload')}
            <StyledFlex p={sharedStylingAttrs.padding}>
              <Collapse in={expanded === 'fileUpload'}>
                <StyledFlex gap={sharedStylingAttrs.outerGap} pb={sharedStylingAttrs.pb}>
                  {renderDetailsText(
                    'To execute your Process by uploading a file with a list of one or more process executions, you can use Process Trigger. The steps are as follows:'
                  )}
                  <StyledFlex gap={sharedStylingAttrs.innerGap}>
                    <StyledFlex gap={sharedStylingAttrs.listGap}>
                      {renderListItem('Navigate to Flow > Process Trigger in the side navigation bar', '1.')}
                      {renderListItem('In page section "Step 1", select your target process', '2.')}
                      {renderListItem('In page section "Step 2", select "File Upload" and select your file', '3.')}
                      {renderListItem(
                        'In page section "Step 3", define your desired execution time and frequency',
                        '4.'
                      )}
                      {renderListItem('Click "Submit Execution"', '5.')}
                    </StyledFlex>
                    {renderDetailsText(
                      'After following these steps, your process executions will start (either immediately or at a later specified date, depending on your selected execution time).'
                    )}
                  </StyledFlex>
                  {renderBtn('Go to Process Trigger', () => window.open(routes.PROCESS_TRIGGER, '_blank'))}
                </StyledFlex>
              </Collapse>
              {renderDivider()}
            </StyledFlex>
            {renderCollapseSummary('Platform - Process Orchestrator', 'orchestrator')}
            <StyledFlex p={sharedStylingAttrs.padding}>
              <Collapse in={expanded === 'orchestrator'}>
                <StyledFlex gap={sharedStylingAttrs.outerGap} pb={sharedStylingAttrs.pb}>
                  {renderDetailsText(
                    'To execute multiple Processes in a defined order, you can use Process Orchestrator. The steps are as follows:'
                  )}
                  <StyledFlex gap={sharedStylingAttrs.innerGap}>
                    <StyledFlex gap={sharedStylingAttrs.listGap}>
                      {renderListItem('If creating a new orchestration, click "Create Orchestration"', '1.')}
                      {renderListItem('In the Orchestration details page, select the "Orchestration" tab', '2.')}
                      {renderListItem('Click the "Edit" button', '3.')}
                      {renderListItem('Add a new "Process" to the orchestration flow', '4.')}
                      {renderListItem('Click "Publish" to save your changes', '5.')}
                      {renderListItem(
                        'Click on "Execute From Start" or the execute button on one of the Processes in the orchestration diagram',
                        '6.'
                      )}
                    </StyledFlex>
                    {renderDetailsText(
                      'After following these steps, your process orchestration will start executing and your process will execute once the orchestration execution has reached it.'
                    )}
                  </StyledFlex>
                  {renderBtn('Go to Process Orchestrator', () => window.open(routes.PROCESS_ORCHESTRATION, '_blank'))}
                </StyledFlex>
              </Collapse>
            </StyledFlex>
          </StyledFlex>
        </Scrollbars>
      </StyledFlex>
    </StyledFlex>
  );
};

export default Resources;

Resources.propTypes = {
  setActiveMenu: PropTypes.func,
  clickedProcess: PropTypes.object,
};
