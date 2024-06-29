import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useTheme } from '@mui/system';

import { StyledButton } from '../../../../../../../REDISIGNED/controls/Button/StyledButton';
import { StyledTooltip } from '../../../../../../../REDISIGNED/tooltip/StyledTooltip';
import Spinner from '../../../../../../../Spinner/Spinner';
import { StyledFlex, StyledText, StyledDivider, StyledEmptyValue } from '../../../../../../../styles/styled';
import ConfigureChannelsWidgetAccordion from '../ConfigureChannelsAccordion/ConfigureChannelsWidgetAccordion';
import EmptyTable from '../../../../../../../REDISIGNED/table-v2/EmptyTable/EmptyTable';

const WebsiteRow = ({ title = '', description = '', widgetId, agentId, removeWidgetFromAgent }) => {
  const { colors } = useTheme();

  return (
    <StyledFlex padding="8px 20px 5px 27px">
      <StyledFlex direction="row" alignItems="center">
        <StyledFlex flex={1}>
          <StyledText weight={600}>{title}</StyledText>
          <StyledText weight={400} mt={2} p="0 35px 0 0" maxLines={2}>
            {description || <StyledEmptyValue />}
          </StyledText>
        </StyledFlex>

        <StyledFlex>
          <StyledTooltip title="Remove" placement="top" arrow p="8px 14px" radius="10px">
            <CloseRoundedIcon
              sx={{
                backgroundColor: colors.greyIconBg,
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                padding: '4px',
                cursor: 'pointer',
                marginTop: '34px',
              }}
              onClick={() => removeWidgetFromAgent(widgetId)}
            />
          </StyledTooltip>
        </StyledFlex>
      </StyledFlex>

      <StyledFlex direction="row" alignItems="center" cursor="pointer" marginTop="-2px">
        <ConfigureChannelsWidgetAccordion widgetId={widgetId} agentId={agentId} />
      </StyledFlex>
    </StyledFlex>
  );
};

const ChatWidgetTab = ({
  filteredWidgets,
  loading,
  setIsAddWidgetModalOpen,
  removeWidgetFromAgent,
  clickedProcess,
}) => {
  const { colors } = useTheme();

  return (
    <>
      <StyledFlex padding="30px 20px 30px 27px" direction="row" justifyContent="space-between">
        <StyledText weight={600} size={19}>
          Assigned Chat Widgets
        </StyledText>
        <StyledButton primary variant="contained" tertiary fontSize={16} onClick={() => setIsAddWidgetModalOpen(true)}>
          Add Widgets
        </StyledButton>
      </StyledFlex>

      <StyledDivider borderWidth={1} color={colors.primary} />

      {loading ? (
        <Spinner medium inline />
      ) : (
        filteredWidgets?.map((widget, index) => (
          <StyledFlex key={widget.widgetId}>
            <WebsiteRow
              title={widget.name}
              description={widget.description}
              widgetId={widget.widgetId}
              agentId={clickedProcess.agentId}
              removeWidgetFromAgent={removeWidgetFromAgent}
            />
            {index !== filteredWidgets.length - 1 && (
              <StyledDivider borderWidth={1} color={colors.cardGridItemBorder} />
            )}
          </StyledFlex>
        )) ?? (
          <StyledFlex alignItems="center" justifyContent="center" textAlign="center">
            <EmptyTable customTitle="There Are No Chat Widgets Assigned" />
          </StyledFlex>
        )
      )}
    </>
  );
};

export default ChatWidgetTab;
