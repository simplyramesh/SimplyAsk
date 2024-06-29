import Switch from '../../../../../../SwitchWithText/Switch';

import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledFlex,
  StyledText,
} from '../../../../../../shared/styles/styled';
import { StyledTooltip } from '../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import TransferToHumanSettings from '../TransferToHumanSettings/TransferToHumanSettings';
import { useTheme } from '@mui/material/styles';
import { InfoOutlined } from '@mui/icons-material';

const TransferSettings = ({ agentConfig, isPanelView, onChange }) => {
  const { colors } = useTheme();

  return (
    <StyledAccordion expanded={agentConfig?.transferToHuman}>
      <StyledFlex display="flex" flexDirection="column" alignItems="flex-start" gap="30px" alignSelf="stretch">
        <StyledFlex
          display="flex"
          width="514px"
          height="48px"
          flexDirection="column"
          justifyContent="center"
          lineHeight="28.5px"
        >
          <StyledText size="19" weight="600">
            Transfer Settings
          </StyledText>
          <StyledText>Configure how users are transferred on the platform</StyledText>
        </StyledFlex>
        <StyledFlex display="flex" alignItems="center" gap="10px" alignSelf="stretch" flexDirection="row">
          <Switch
            checked={agentConfig?.transferToHuman}
            activeLabel=""
            inactiveLabel=""
            onChange={() =>
              onChange({
                transferToHuman: !agentConfig?.transferToHuman,
              })
            }
          />
          <StyledText textAlign="right" weight="500" lh="24px">
            Transfer to Human
          </StyledText>
          <StyledTooltip
            title={
              <StyledFlex alignItems="center">
                <StyledText size="14" weight="500" width="259px" textAlign="center" color={colors.white}>
                  When toggled on, users conversing with Agents can request to be transferred to live support workers
                </StyledText>
              </StyledFlex>
            }
            arrow
            placement="top"
            p="10px 15px"
            maxWidth="auto"
          >
           <InfoOutlined fontSize="small" />
          </StyledTooltip>
        </StyledFlex>
      </StyledFlex>
      <StyledAccordionDetails>
        <TransferToHumanSettings agentConfig={agentConfig} onChange={onChange} isPanelView={isPanelView} />
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default TransferSettings;
