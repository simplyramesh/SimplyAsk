import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import BulkDeleteIcon from '../../../../../../Assets/icons/issues/bulkOperations/delete.svg?component';
import routes from '../../../../../../config/routes';
import { useUser } from '../../../../../../contexts/UserContext';
import { useFilter } from '../../../../../../hooks/useFilter';
import { useTableSortAndFilter } from '../../../../../../hooks/useTableSortAndFilter';
import { getProductOrderCustomersPageable } from '../../../../../../Services/axios/productOrder';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import { useModalToggle } from '../../../../../shared/REDISIGNED/modals/CenterModalFixed/hooks/useModalToggle';
import CustomSidebar from '../../../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import TableV2 from '../../../../../shared/REDISIGNED/table-v2/Table-v2';
import { StyledFlex } from '../../../../../shared/styles/styled';
import { PRODUCT_FILTERS, PRODUCT_GOA_NEW_CUSTOMER_INITIAL_VALUES } from '../../../../constants/productInitialValues';
import { PRODUCT_QUERY_KEYS } from '../../../../constants/productQueryKeys';
import { PRODUCT_ORDER_CUSTOMER_TABLE_PROPS } from '../../../../constants/tableProps';
import RemoveWarningModal from '../../../../Customer/RemoveWarningModal/RemoveWarningModal';
import { GOA_CUSTOMER_COLUMNS } from '../../../../Customer/utils/formatters';
import {
  CUSTOMER_SIDE_FILTER_KEY,
  GOA_CUSTOMERS_INITIAL_VALUES,
  GOA_CUSTOMER_SIDE_FILTER_INITIAL_VALUES,
  goACustomerFormatter,
  goASelectedCustomerFiltersMeta,
} from '../../../../Customer/utils/helpers';
import usePostCustomer from '../../../../hooks/usePostCustomer';
import { getCustomerAddress } from '../../../../utils/helpers';
import GoANewCustomerModal from '../modals/GoANewCustomerModal/GoANewCustomerModal';

import GoACustomerTableFilters from './GoACustomerTableFilters';

const GoACustomerTable = () => {
  const theme = useTheme();

  const [tablePageSize] = useState(25);

  const [editDetails, setEditDetails] = useState({ personal: true, address: true });
  const [customerEdit, setCustomerEdit] = useState(PRODUCT_GOA_NEW_CUSTOMER_INITIAL_VALUES);

  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [selectedCustomerName, setSelectedCustomerName] = useState();

  const [isViewFiltersOpen, setIsViewFiltersOpen] = useState(false);

  const { createCustomer } = usePostCustomer({
    invalidateQueries: PRODUCT_QUERY_KEYS.CUSTOMERS,
    onCreateCustomerSuccess: () => {
      toast.success('Customer created successfully');
    },
  });

  const { open: showCustomerDetailsModal, setOpen: setShowCustomerDetailsModal } = useModalToggle();

  const { open: showDeleteCustomerModal, setOpen: setShowDeleteCustomerModal } = useModalToggle();

  const toggleSidebar = (sidebar = 'filters', value = false) => {
    const stateSelector = {
      filters: setIsViewFiltersOpen,
    };

    stateSelector[sidebar](value);
  };

  const { user } = useUser();

  const navigate = useNavigate();

  const { sourceFilterValue, setFilterFieldValue, submitFilterValue, initialFilterValues } = useFilter({
    formikProps: {
      initialValues: {
        ...GOA_CUSTOMERS_INITIAL_VALUES,
      },
    },
    onSubmit: ({ filterValue, selectedFilters }) => {
      setColumnFilters(filterValue);
      setSelectedFiltersBar(selectedFilters);
    },
    formatter: goACustomerFormatter,
    selectedFiltersMeta: goASelectedCustomerFiltersMeta,
  });

  const {
    setColumnFilters,
    setSearchText,
    pagination,
    setPagination,
    sorting,
    setSorting,
    data,
    isFetching,
    selectedFiltersBar,
    setSelectedFiltersBar,
  } = useTableSortAndFilter({
    queryFn: (params) => {
      const query = Object.fromEntries(new URLSearchParams(params));

      return getProductOrderCustomersPageable(query);
    },
    queryKey: PRODUCT_QUERY_KEYS.CUSTOMERS,
    initialFilters: initialFilterValues,
    initialSorting: [
      {
        desc: true,
      },
    ],
    pageSize: tablePageSize,
  });

  const handleBulkDelete = () => {
    if (selectedCustomerIds.length === 1) {
      const customer = data?.content.find((customer) => Number(selectedCustomerIds[0]) === customer?.id);
      setSelectedCustomerName(customer?.name);
    }
    setShowDeleteCustomerModal(true);
  };

  const handleViewCustomer = (customer) => {
    navigate(`${routes.CUSTOMER_MANAGER}/${customer.id}`);
  };

  const handleSingleDelete = (customerToDelete) => {
    setSelectedCustomerIds([customerToDelete.id]);
    setSelectedCustomerName(customerToDelete.name);
    setShowDeleteCustomerModal(true);
  };

  const setAddressChangeOpen = (data, type) => {
    setEditDetails({ personal: false, address: true, addressType: type });
    setCustomerEdit({ ...data });
    setShowCustomerDetailsModal(true);
  };

  const tableMeta = {
    handleSingleDelete,
    handleViewCustomer,
    setAddressChangeOpen,
    user,
    theme,
  };

  const onCustomerCreate = (customerData) => {
    setShowCustomerDetailsModal(false);
    setEditDetails({ personal: true, address: true });

    const goACustomerRequestData = Object.entries(customerData).reduce((acc, [key, value]) => {
      if (key === PRODUCT_FILTERS.SHIPPING_ADDRESS_ROLE || key === PRODUCT_FILTERS.BILLING_ADDRESS_ROLE) {
        if (!editDetails.address) return acc;

        const customerAddress = getCustomerAddress(value, key, true);
        return {
          ...acc,
          place: [
            ...(acc?.place || []),
            {
              ...(customerAddress || {}),
              role: key,
            },
          ],
        };
      }

      return {
        ...localStorage?.relatedParty?.[0],
        ...acc,
        ...(editDetails.personal ? { [key]: value } : {}),
      };
    }, {});

    createCustomer(goACustomerRequestData);
  };

  const handleSorting = (old) => {
    const { id, desc } = old()[0];

    setFilterFieldValue(
      CUSTOMER_SIDE_FILTER_KEY,
      { ...sourceFilterValue[CUSTOMER_SIDE_FILTER_KEY], [`${id}Sort`]: `${!desc}` },
      false
    );
    setSorting(old);
    submitFilterValue();
  };

  const tableBulkActions = [
    {
      text: 'Delete',
      icon: <BulkDeleteIcon />,
      callback: () => {
        handleBulkDelete();
      },
    },
  ];

  const renderTableActions = () => (
    <StyledFlex direction="column" alignItems="right">
      <StyledButton variant="contained" onClick={() => setShowCustomerDetailsModal(true)} secondary>
        Create Customer
      </StyledButton>
    </StyledFlex>
  );

  const handleClearAll = () => {
    setFilterFieldValue(CUSTOMER_SIDE_FILTER_KEY, GOA_CUSTOMER_SIDE_FILTER_INITIAL_VALUES);
    submitFilterValue();
  };

  const handleClearFilterField = (key) => {
    setFilterFieldValue(CUSTOMER_SIDE_FILTER_KEY, {
      ...sourceFilterValue[CUSTOMER_SIDE_FILTER_KEY],
      [key]: GOA_CUSTOMER_SIDE_FILTER_INITIAL_VALUES[key],
    });
    submitFilterValue();
  };

  return (
    <>
      <RemoveWarningModal
        open={showDeleteCustomerModal}
        onClose={() => setShowDeleteCustomerModal(false)}
        selectedCustomerName={selectedCustomerName}
        selectedCustomers={selectedCustomerIds.length}
      />
      <GoANewCustomerModal
        customer={customerEdit}
        open={showCustomerDetailsModal}
        onClose={() => {
          setCustomerEdit(undefined);
          setEditDetails({ personal: true, address: true });
          setShowCustomerDetailsModal(false);
        }}
        onSubmit={onCustomerCreate}
      />
      <TableV2
        data={data}
        columns={GOA_CUSTOMER_COLUMNS}
        searchPlaceholder="Search Customer Names..."
        onSearch={(e) => setSearchText(e.target.value)}
        onShowFilters={() => toggleSidebar('filters', true)}
        selectedFilters={selectedFiltersBar}
        onClearAllFilters={handleClearAll}
        onClearFilter={handleClearFilterField}
        isLoading={isFetching}
        sorting={sorting}
        onRowClick={handleViewCustomer}
        setSorting={handleSorting}
        onSelectionChange={setSelectedCustomerIds}
        selectBarActions={tableBulkActions}
        headerActions={renderTableActions()}
        pagination={pagination}
        setPagination={setPagination}
        emptyTableDescription="There are currently no Customers"
        meta={tableMeta}
        entityName="Customers"
        enableEditing
        pinColumns={['name']}
        enablePageSizeChange
        enableRowSelection={false} // NOTE: To enable row selection for deleting customer, remove this prop
        tableProps={PRODUCT_ORDER_CUSTOMER_TABLE_PROPS}
      />
      <CustomSidebar open={isViewFiltersOpen} onClose={() => toggleSidebar('filters', false)} headStyleType="filter">
        {({ customActionsRef }) =>
          isViewFiltersOpen && (
            <GoACustomerTableFilters
              sidebarActionsRef={customActionsRef}
              initialValues={sourceFilterValue[CUSTOMER_SIDE_FILTER_KEY]}
              onApplyFilters={(sideFilter) => {
                toggleSidebar('filters', false);
                setFilterFieldValue(CUSTOMER_SIDE_FILTER_KEY, sideFilter);
                submitFilterValue();
              }}
              isOpen={isViewFiltersOpen}
            />
          )
        }
      </CustomSidebar>
    </>
  );
};

export default GoACustomerTable;
