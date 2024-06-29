import { useTheme } from '@emotion/react';
import { IosShareRounded } from '@mui/icons-material';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import routes from '../../../config/routes';
import { useFilter } from '../../../hooks/useFilter';
import { useGetCurrentUser } from '../../../hooks/useGetCurrentUser';
import { usePopoverToggle } from '../../../hooks/usePopoverToggle';
import { useTableSortAndFilter } from '../../../hooks/useTableSortAndFilter';
import { getProductOrderPageable } from '../../../Services/axios/productOrder';
import { BASE_DATE_FORMAT, getInFormattedUserTimezone } from '../../../utils/timeUtil';
import { ContextMenu } from '../../Managers/shared/components/ContextMenus/StyledContextMenus';
import { StyledButton } from '../../shared/REDISIGNED/controls/Button/StyledButton';
import CSVIcon from '../../shared/REDISIGNED/icons/svgIcons/CSVIcon';
import { useModalToggle } from '../../shared/REDISIGNED/modals/CenterModalFixed/hooks/useModalToggle';
import TableV2 from '../../shared/REDISIGNED/table-v2/Table-v2';
import { StyledTooltip } from '../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledFlex, StyledIconButton, StyledText } from '../../shared/styles/styled';
import {
  PRODUCT_FILTERS,
  PRODUCT_ORDERS_FILTER_KEY,
  PRODUCT_ORDERS_INITIAL_VALUES,
  PRODUCT_ORDERS_SIDE_FILTER_INITIAL_VALUES,
} from '../constants/productInitialValues';
import { PRODUCT_QUERY_KEYS } from '../constants/productQueryKeys';
import { PRODUCT_ORDER_HISTORY_TABLE_PROPS } from '../constants/tableProps';
import { PRODUCT_ORDER_HISTORY } from '../utils/formatters';
import { csvOptions, orderHistoryFormatter, selectedOrderHistoryFiltersMeta } from '../utils/helpers';

import OrderManagerFilters from './OrderManagerFilters/OrderManagerFilters';

const OrderManager = () => {
  const navigate = useNavigate();

  const theme = useTheme();

  const { currentUser } = useGetCurrentUser();

  const orderHistoryTableRef = useRef(null);

  const {
    id: exportId,
    open: isExportBtnOpen,
    anchorEl: exportAnchorEl,
    handleClick: onExportOpen,
    handleClose: onExportClose,
  } = usePopoverToggle('export-popover');

  const { open: isOrderHistoryFiltersOpen, setOpen: setIsOrderHistoryFilterOpen } = useModalToggle();

  const { sourceFilterValue, setFilterFieldValue, submitFilterValue, initialFilterValues } = useFilter({
    formikProps: {
      initialValues: { ...PRODUCT_ORDERS_INITIAL_VALUES },
    },
    onSubmit: ({ filterValue, selectedFilters }) => {
      setColumnFilters(filterValue);
      setSelectedFiltersBar(selectedFilters);
    },
    formatter: orderHistoryFormatter,
    selectedFiltersMeta: selectedOrderHistoryFiltersMeta,
  });
  const {
    setColumnFilters,
    setSearchText,
    pagination,
    setPagination,
    data,
    isFetching,
    selectedFiltersBar,
    setSelectedFiltersBar,
    refetch,
  } = useTableSortAndFilter({
    queryFn: (params) => {
      const query = Object.fromEntries(new URLSearchParams(params));

      return getProductOrderPageable(query);
    },
    queryKey: PRODUCT_QUERY_KEYS.ORDERS,
    initialFilters: initialFilterValues,
    initialSorting: [
      {
        id: 'requestedStartDate',
        desc: true,
      },
    ],
    pageSize: 25,
  });

  const handleClearAll = () => {
    setFilterFieldValue(PRODUCT_ORDERS_FILTER_KEY, PRODUCT_ORDERS_SIDE_FILTER_INITIAL_VALUES);
    submitFilterValue();
  };

  const handleClearFilterField = (key) => {
    setFilterFieldValue(PRODUCT_ORDERS_FILTER_KEY, {
      ...sourceFilterValue[PRODUCT_ORDERS_FILTER_KEY],
      [key]: PRODUCT_ORDERS_SIDE_FILTER_INITIAL_VALUES[key],
    });
    submitFilterValue();
  };

  const handleExportToCSV = (table) => {
    const mergeData = (rows, columnIds) =>
      rows.map((row) =>
        columnIds.reduce(
          (acc, id) => ({
            ...acc,
            [id]:
              id === PRODUCT_FILTERS.ORDER_DATE
                ? getInFormattedUserTimezone(row.getValue(id), currentUser?.timezone)
                : row.getValue(id),
          }),
          {}
        )
      );

    const rows = table.getRowModel().flatRows;
    const columnIds = PRODUCT_ORDER_HISTORY.map((column) => column.id);
    const formattedCurrentDate = getInFormattedUserTimezone(
      new Date().toISOString(),
      currentUser?.timezone,
      BASE_DATE_FORMAT
    );
    const exportFilename = `Order History-${formattedCurrentDate}`;

    const csvConfiguration = mkConfig(csvOptions(PRODUCT_ORDER_HISTORY, exportFilename));
    const csvGenerator = generateCsv(csvConfiguration);

    const csvContent = csvGenerator(mergeData(rows, columnIds));

    download(csvConfiguration)(csvContent);
  };

  const renderTableActions = () => (
    <StyledFlex direction="row" gap="0 15px">
      <StyledButton variant="contained" onClick={() => navigate(routes.PRODUCT_OFFERINGS)} secondary>
        Create Order
      </StyledButton>
      <StyledTooltip title="Export Orders" arrow placement="top" p="10px 15px" maxWidth="auto">
        <StyledIconButton size="40px" iconSize="20px" borderRadius="7px" onClick={onExportOpen}>
          <IosShareRounded fontSize="inherit" />
        </StyledIconButton>
      </StyledTooltip>
      <ContextMenu
        key={exportId}
        open={isExportBtnOpen}
        onClose={onExportClose}
        anchorEl={exportAnchorEl}
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
        <StyledFlex
          cursor="pointer"
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          onClick={() => {
            handleExportToCSV(orderHistoryTableRef?.current);
            onExportClose();
          }}
        >
          <StyledIconButton
            iconSize="24px"
            size="100%"
            bgColor="transparent"
            hoverBgColor={theme.colors.tableEditableCellBg}
            onClick={() => {}}
            borderRadius="0"
          >
            <CSVIcon />
            <StyledText ml={10} size={16} lh={16}>
              CSV
            </StyledText>
          </StyledIconButton>
        </StyledFlex>
      </ContextMenu>
    </StyledFlex>
  );

  return (
    <>
      <TableV2
        data={data}
        columns={PRODUCT_ORDER_HISTORY}
        tableName="Orders"
        searchPlaceholder="Search Order IDs..."
        pagination={pagination}
        setPagination={setPagination}
        isLoading={isFetching}
        enableStickyHeader
        enablePageSizeChange
        enableRowSelection={false}
        meta={{
          timezone: currentUser?.timezone,
          theme,
          onOrderHistory: (row) => {
            navigate(`${routes.ORDER_MANAGER}/${row.id}`);
          },
        }}
        tableProps={PRODUCT_ORDER_HISTORY_TABLE_PROPS}
        onSearch={(e) => setSearchText(e.target.value)}
        onShowFilters={() => setIsOrderHistoryFilterOpen(true)}
        selectedFilters={selectedFiltersBar}
        onClearAllFilters={handleClearAll}
        onClearFilter={handleClearFilterField}
        emptyTableDescription="There are currently no Orders."
        headerActions={renderTableActions()}
        entityName="Orders"
        pinColumns={[PRODUCT_FILTERS.ID]}
        tableRef={orderHistoryTableRef}
        onTableRefresh={refetch}
      />
      {isOrderHistoryFiltersOpen ? (
        <OrderManagerFilters
          isOpen={isOrderHistoryFiltersOpen}
          onClose={() => setIsOrderHistoryFilterOpen(false)}
          initialValues={sourceFilterValue[PRODUCT_ORDERS_FILTER_KEY]}
          onApplyFilters={(sideFilter) => {
            setIsOrderHistoryFilterOpen(false);
            setFilterFieldValue(PRODUCT_ORDERS_FILTER_KEY, sideFilter);
            submitFilterValue();
          }}
        />
      ) : null}
    </>
  );
};

export default OrderManager;
