import { useTheme } from '@mui/material/styles';

import { memo } from 'react';
import { StyledFlex, StyledText } from '../../../../styles/styled';
import CustomTableIcons from '../../../icons/CustomTableIcons';

const SORT_OPTIONS = {
  ASC: 'asc',
  DESC: 'desc',
};

const HeaderCell = ({ column }) => {
  const { toggleSorting, getIsSorted, getCanSort } = column;

  const isSorted = getCanSort() && getIsSorted();
  const { colors } = useTheme();

  const isAsc = isSorted === SORT_OPTIONS.ASC;
  const isDesc = isSorted === SORT_OPTIONS.DESC;
  const isNoSort = isSorted === false;

  // NOTE: The handle sort function only applies when the manual sorting is false
  const handleSort = () => {
    if (!isSorted) return;

    if (isAsc) toggleSorting(SORT_OPTIONS.DESC);
    if (isDesc) toggleSorting(SORT_OPTIONS.ASC);
    if (isNoSort) toggleSorting(SORT_OPTIONS.ASC);
  };

  return (
    <StyledFlex direction="row" alignItems="center" display="inline-flex" onClick={handleSort}>
      <StyledText size={15} lh={18} weight={600}>
        {column.columnDef.header}

        {column.columnDef.isOptional && (
          <StyledText display="inline" size={15} lh={18} weight={600} color={colors.information}>
            &nbsp;(Optional)
          </StyledText>
        )}
      </StyledText>

      {getCanSort() && (
        <StyledFlex ml={0.5} opacity={isNoSort ? 0.35 : 1}>
          {isNoSort && <CustomTableIcons icon="SORT" width={16} color={colors.primary} />}
          {isAsc && <CustomTableIcons icon="SORT_ASC" width={12} color={colors.secondary} />}
          {isDesc && <CustomTableIcons icon="SORT_DESC" width={12} color={colors.secondary} />}
        </StyledFlex>
      )}
    </StyledFlex>
  );
};

export default memo(HeaderCell);
