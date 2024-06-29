import { memo } from "react";
import { DEFAULT_RETURN_VALUE } from "../../../../../../utils/helperFunctions";
import { StyledText } from "../../../../styles/styled";

const TextCell = ({ cell, maxLines, defaultValue = DEFAULT_RETURN_VALUE }) => (
  <StyledText
    size={15}
    lh={21}
    maxLines={maxLines}
  >
    {cell.getValue() ?? defaultValue}
  </StyledText>
)

export default memo(TextCell);