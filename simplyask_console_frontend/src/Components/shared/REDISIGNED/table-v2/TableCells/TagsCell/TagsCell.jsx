import { memo } from 'react';

import { DEFAULT_RETURN_VALUE } from '../../../../../../utils/helperFunctions';
import { StyledFlex, StyledStatus, StyledText } from '../../../../styles/styled';

const Tag = ({ tag, theme }) => (
  <StyledStatus maxWidth="100px" key={tag} bgColor={theme.colors.athensGray} height="36px" minWidth="0">
    <StyledText ellipsis size={13} weight={400} lh={18}>{tag}</StyledText>
  </StyledStatus>
);

const TagsCell = ({ cell, table }) => {
  const { tags, limit } = cell.getValue();

  if (!tags?.length) {
    return <StyledText>{DEFAULT_RETURN_VALUE}</StyledText>;
  }

  const defaultTags = tags.length > limit ? tags.slice(0, limit) : tags;
  const extraTags = tags.length > limit ? tags.slice(limit) : [];
  const { theme } = table.options.meta;

  return (
    <StyledFlex direction="row" gap="12px">
      {defaultTags.map((tag, index) => <Tag key={index} tag={tag} theme={theme} />)}
      {extraTags.length > 0 && <Tag tag={`+ ${extraTags.length}`} theme={theme} />}
    </StyledFlex>
  );
};

export default memo(TagsCell);
