import { DragIndicator } from '@mui/icons-material';
import { BASE_DATE_FORMAT, getInFormattedUserTimezone } from '../../../utils/timeUtil';
import { StyledTooltip } from '../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledRowHoverActionCellIconWrapper, StyledText } from '../../shared/styles/styled';

export const renderIssueTooltip = (children, title) => (
  <StyledTooltip title={title} arrow placement="top" p="10px 15px" maxWidth="auto">
    <span>{children}</span>
  </StyledTooltip>
);

export const renderCellText = ({ as = 'p', text, weight = null, color = null }) => {
  const textProps = {
    as,
    size: 15,
    lh: 23,
    ...(weight && { weight }),
    ...(color && { color }),
  };
  return <StyledText {...textProps}>{text}</StyledText>;
};

export const renderDate = ({ as = 'p', cell, table }) => {
  const time = cell.getValue();
  const timezone = table.options.meta.user?.timezone;

  return (
    <>
      {renderCellText({
        as,
        text: getInFormattedUserTimezone(time, timezone, BASE_DATE_FORMAT),
        weight: 400,
      })}
    </>
  );
};

export const renderRowHoverAction = ({ icon, onClick = () => {}, toolTipTitle }) => (
  <StyledRowHoverActionCellIconWrapper className="showOnRowHover" onClick={onClick}>
    <TableRowIconWithTooltip icon={icon} toolTipTitle={toolTipTitle} />
  </StyledRowHoverActionCellIconWrapper>
);

export const TableRowIconWithTooltip = ({ icon, toolTipTitle, onClick }) => (
  <StyledTooltip title={toolTipTitle} arrow placement="top" p="6px 8px" maxWidth="auto" onClick={onClick}>
    {icon}
  </StyledTooltip>
);

export const rowHoverActionColumnProps = () => ({
  muiTableHeadCellProps: {
    sx: ({ colors }) => ({
      boxShadow: 'none',
      backgroundColor: 'transparent',
      borderBottom: `1px solid ${colors.primary}`,
      pointerEvents: 'none',
    }),
  },
  muiTableBodyCellProps: {
    sx: ({ colors }) => ({
      boxShadow: 'none',
      backgroundColor: 'transparent',
      '&:hover': {
        borderBottom: `1px solid ${colors.dividerColor}`,
      },
    }),
  },
  size: 88,
  enableSorting: false,
  enableGlobalFilter: false,
  enableColumnFilter: false,
});

export const rowDragHandleProps = {
  enableSorting: false,
  enableRowOrdering: true,
  displayColumnDefOptions: {
    'mrt-row-drag': {
      header: '',
      size: 88,
    },
  },
  icons: {
    DragHandleIcon: (props) => <DragIndicator {...props} />,
  },
};
