import { useTheme } from '@emotion/react';
import { Fragment, useEffect, useState } from 'react';

import { StyledDivider, StyledFlex, StyledText } from '../../../styles/styled';
import { StyledButton } from '../../controls/Button/StyledButton';
import Checkbox from '../../controls/Checkbox/Checkbox';
import { StyledTooltip } from '../../tooltip/StyledTooltip';

const TableSelectedToolbar = ({
  title, rowSelection, setRowSelection, data, getRowId, selectedFilters, selectBarActions,
}) => {
  const { colors } = useTheme();
  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState([]);
  const [filtersTooltipText, setFiltersTooltipText] = useState();

  useEffect(() => {
    const filtersToShow = selectedFilters ? Object.keys(selectedFilters)
      .filter((key) => selectedFilters[key].value)
      .map((key) => selectedFilters[key])
      .map(({ label, value }) => (Array.isArray(value) ? value.map((v) => ({ label, value: v })) : { label, value }))
      .flat() : [];

    setFilters(filtersToShow);

    if (filtersToShow?.length) {
      const tooltipText = filtersToShow.map(({ label, value }) => `${label}: ${value}`).join(', ');

      setFiltersTooltipText(tooltipText);
    }
  }, [selectedFilters]);

  useEffect(() => {
    if (data) {
      setTotalCount(data.numberOfElements);
    }
  }, [data]);

  useEffect(() => {
    const selectedIds = rowSelection ? Object.keys(rowSelection) : [];

    setSelectedCount(selectedIds.length);
    setSelectedIds(selectedIds);
  }, [rowSelection]);

  const selectAllRows = () => {
    const rowIds = data.content.map(getRowId);
    setRowSelection(rowIds.reduce((acc, current) => ({ ...acc, [current]: true }), {}));
  };

  const onCheckboxClick = () => {
    if (totalCount === selectedCount) {
      setRowSelection({});
    } else {
      selectAllRows();
    }
  };

  const Separator = () => (<StyledDivider borderWidth={2} orientation="vertical" m="0 20px" height="30px" />);

  return (
    <StyledFlex direction="row" p="4px 20px" alignItems="center" bgcolor={colors.bgColorOptionTwo} sx={{ borderRadius: '10px' }}>
      <StyledFlex>
        <Checkbox
          checkValue={totalCount === selectedCount}
          indeterminate={totalCount !== selectedCount && selectedCount !== 0}
          onChange={onCheckboxClick}
        />
      </StyledFlex>
      <Separator />
      <StyledFlex direction="row" gap={2.25} alignItems="center">
        <StyledFlex direction="row" gap="4px">
          <StyledText weight={600} size={14}>{selectedCount}</StyledText>
          <StyledText size={14}>selected</StyledText>
        </StyledFlex>
        <StyledFlex>
          {totalCount !== selectedCount &&
            <StyledButton variant="text" disableRipple size="medium" onClick={selectAllRows}>
              Select All
              {' '}
              {totalCount}
              {' '}
              {title}
            </StyledButton>}
        </StyledFlex>
      </StyledFlex>
      {!!filters.length && (
        <>
          <Separator />
          <StyledTooltip
            title={(
              <StyledFlex alignItems="center" gap={0.25}>
                <StyledText size={14} lh={20} textAlign="center" color={colors.white}>{filtersTooltipText}</StyledText>
                <StyledText size={12} lh={15} color={colors.tooltipSecondary}>
                  To modify filters, first deselect the selection
                </StyledText>
              </StyledFlex>
            )}
            arrow
            placement="top"
            maxWidth="320px"
          >
            <StyledFlex>
              <StyledText size={14} textDecoration="underline">
                {filters.length}
                {' '}
                Applied Filters
              </StyledText>
            </StyledFlex>
          </StyledTooltip>
        </>
      )}
      <StyledFlex />

      {selectBarActions?.length > 0
        && (
          <StyledFlex ml="auto" direction="row">
            {selectBarActions.map(({ text, callback, icon }, index) => (
              <Fragment key={index}>
                {index > 0 && <Separator />}

                <StyledButton
                  key={index}
                  onClick={() => callback(selectedIds)}
                  variant="text"
                  startIcon={icon}
                  color="primary"
                  disableRipple
                  size="medium"
                >
                  {text}
                </StyledButton>
              </Fragment>
            ))}
          </StyledFlex>
        )}
    </StyledFlex>
  );
};

export default TableSelectedToolbar;
