import { memo } from "react";
import { BASE_DATE_FORMAT, BASE_TIME_FORMAT, getInFormattedUserTimezone } from "../../../../../../utils/timeUtil";
import { StyledFlex, StyledText } from "../../../../styles/styled";

const DateTimeCell = ({ cell, table }) => {
  const time = cell.getValue();
  const timezone = table.options.meta.user?.timezone;

  return (
    <StyledText
      size={15}
      weight={400}
      lh={22}
    >
      <StyledFlex>{getInFormattedUserTimezone(time, timezone, BASE_DATE_FORMAT)}</StyledFlex>
      <StyledFlex>{getInFormattedUserTimezone(time, timezone, BASE_TIME_FORMAT)}</StyledFlex>
    </StyledText>
  );
}

export default memo(DateTimeCell);