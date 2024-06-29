import { useState } from 'react';
import { toast } from 'react-toastify';

import { useGetCurrentUser } from '../../../../../../hooks/useGetCurrentUser';
import { useLocalStorage } from '../../../../../../hooks/useLocalStorage';
import { useTableSortAndFilter } from '../../../../../../hooks/useTableSortAndFilter';
import { getProductOrderCustomers } from '../../../../../../Services/axios/productOrder';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CenterModalFixed from '../../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import { useModalToggle } from '../../../../../shared/REDISIGNED/modals/CenterModalFixed/hooks/useModalToggle';
import { StyledFlex } from '../../../../../shared/styles/styled';
import { PRODUCT_ORDER_TOAST_OPTIONS } from '../../../../constants/constants';
import { PRODUCT_FILTERS } from '../../../../constants/productInitialValues';
import { PRODUCT_SEARCH_BY_OPTIONS } from '../../../../constants/productOptions';
import { PRODUCT_QUERY_KEYS } from '../../../../constants/productQueryKeys';
import usePostCustomer from '../../../../hooks/usePostCustomer';
import { getCustomerAddress } from '../../../../utils/helpers';
import GoANewCustomerModal from '../../../govOfAlberta/components/modals/GoANewCustomerModal/GoANewCustomerModal';
import { GOVERNMENT_OF_ALBERTA } from '../../ProductOfferings';
import AdvancedCustomerSearchModal from '../../ShoppingCart/AdvancedCustomerSearchModal';

import OrderCheckoutCustomerDetails from './OrderCheckoutCustomerDetails/OrderCheckoutCustomerDetails';
import OrderCheckoutCustomerEditModal from './OrderCheckoutCustomerEditModal/OrderCheckoutCustomerEditModal';
import OrderCheckoutCustomerSearch from './OrderCheckoutCustomerSearch/OrderCheckoutCustomerSearch';
import OrderCheckoutCustomerTable from './OrderCheckoutCustomerTable/OrderCheckoutCustomerTable';

const ProductOfferingsCheckoutCustomer = ({
  selectedCustomer = null,
  onAddCustomer,
  onSaveCustomer,
  onViewProfile,
}) => {
  const { currentUser } = useGetCurrentUser();
  const [localStorage, setLocalStorage] = useLocalStorage('cart', null);

  const [customerSearchInput, setCustomerSearchInput] = useState('');
  const [selectSearchBy, setSelectSearchBy] = useState(PRODUCT_SEARCH_BY_OPTIONS[0]);

  const [customer, setCustomer] = useState(localStorage?.relatedParty?.[0] || selectedCustomer);
  const [editDetails, setEditDetails] = useState({ personal: true, address: true });

  const isGoA = currentUser?.organization?.name === GOVERNMENT_OF_ALBERTA;

  const {
    open: showAdvancedSearchModal,
    setOpen: setShowAdvancedSearchModal,
    openId: advancedSearchModalOpenId,
  } = useModalToggle();

  const {
    open: isSearchModalOpen,
    setOpen: setIsSearchModalOpen,
  } = useModalToggle();

  const {
    open: showDefaultCustomerDetailsModal,
    setOpen: setShowDefaultCustomerDetailsModal,
  } = useModalToggle();

  const {
    open: showGoACustomerDetailsModal,
    setOpen: setShowGoACustomerDetailsModal,
  } = useModalToggle();

  const {
    setColumnFilters,
    sorting,
    setSorting,
    data,
    isFetching,
  } = useTableSortAndFilter({
    queryFn: getProductOrderCustomers,
    queryKey: PRODUCT_QUERY_KEYS.CUSTOMERS,
    initialFilters: {
      id: '', // Customer ID
      name: '',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
    },
    initialSorting: [{
      id: 'createTimeStamp',
      desc: true,
    }],
    options: {
      enabled: isSearchModalOpen,
    },
  });

  const toggleCreateCustomerModal = (b) => {
    const toggleFn = isGoA ? setShowGoACustomerDetailsModal : setShowDefaultCustomerDetailsModal;

    toggleFn((prev) => b || !prev);
  };

  const { createCustomer, isLoading } = usePostCustomer({
    invalidateQueries: PRODUCT_QUERY_KEYS.CUSTOMERS,
    onCreateCustomerSuccess: (data) => {
      toast.success('Customer created successfully', PRODUCT_ORDER_TOAST_OPTIONS);
      setColumnFilters({ [PRODUCT_FILTERS.EMAIL]: data[PRODUCT_FILTERS.EMAIL] });
    },
  });

  const onAdvanceSearch = async (searchData) => {
    setShowAdvancedSearchModal(false);
    setColumnFilters(searchData);
  };

  const onCustomerCreate = async (customerData) => {
    toggleCreateCustomerModal(false);
    setEditDetails({ personal: true, address: true });

    const places = [];
    places.push(getCustomerAddress(customerData[PRODUCT_FILTERS.BILLING_ADDRESS_ROLE], PRODUCT_FILTERS.BILLING_ADDRESS_ROLE, true));
    places.push(getCustomerAddress(customerData[PRODUCT_FILTERS.SERVICE_ADDRESS_ROLE], PRODUCT_FILTERS.SERVICE_ADDRESS_ROLE, true));
    places.push(getCustomerAddress(customerData[PRODUCT_FILTERS.SHIPPING_ADDRESS_ROLE], PRODUCT_FILTERS.SHIPPING_ADDRESS_ROLE, true));

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

    const customerRequestData = {
      ...localStorage?.relatedParty?.[0],
      ...(editDetails.personal && {
        [PRODUCT_FILTERS.FIRST_NAME]: customerData?.[PRODUCT_FILTERS.FIRST_NAME],
        [PRODUCT_FILTERS.LAST_NAME]: customerData?.[PRODUCT_FILTERS.LAST_NAME],
        [PRODUCT_FILTERS.PHONE_NUMBER]: customerData?.[PRODUCT_FILTERS.PHONE_NUMBER],
        [PRODUCT_FILTERS.EMAIL]: customerData?.[PRODUCT_FILTERS.EMAIL],
      }),
      ...(editDetails.address && { place: places }),
    };

    const requestData = isGoA ? goACustomerRequestData : customerRequestData;

    createCustomer(requestData);
  };

  const renderTableActions = () => (
    <StyledFlex direction="row" gap="0 20px">
      <StyledButton
        tertiary
        variant="contained"
        onClick={() => {
          setCustomer(null);
          setIsSearchModalOpen(false);
        }}
      >
        Close
      </StyledButton>
      <StyledButton
        secondary
        variant="contained"
        onClick={() => {
          if (customer) {
            setSelectSearchBy(PRODUCT_SEARCH_BY_OPTIONS[0]);
            setCustomerSearchInput('');
            onAddCustomer?.(customer);
            setIsSearchModalOpen(false);
          } else {
            toast.error('Could not add, as a customer was not selected.', {
              position: 'top-right',
              autoClose: 10000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: false,
              progress: undefined,
              theme: 'light',
            });
          }
        }}
      >
        Add
      </StyledButton>
    </StyledFlex>
  );

  return (
    <>
      <StyledFlex gap="15px">
        {localStorage?.relatedParty || customer
          ? (
            <OrderCheckoutCustomerDetails
              onViewProfile={() => onViewProfile(customer?.id)}
              onRemove={() => {
                setEditDetails({ personal: true, address: true });
                setCustomer(null);
                setLocalStorage({ ...localStorage, relatedParty: null });
              }}
              isSaved={!!localStorage?.relatedParty}
              customer={localStorage?.relatedParty?.[0] || customer}
              place={localStorage?.relatedParty?.[0]?.place || customer?.place}
              onEditDetails={() => {
                toggleCreateCustomerModal(true);
                setEditDetails({ ...editDetails, address: false });
              }}
              onEditAddresses={() => {
                toggleCreateCustomerModal(true);
                setEditDetails({ ...editDetails, personal: false });
              }}
            />
          )
          : (
            <OrderCheckoutCustomerSearch
              searchValue={customerSearchInput}
              onSearchValue={(e) => setCustomerSearchInput(e.target.value)}
              searchByValue={selectSearchBy}
              onSearchBy={(option) => setSelectSearchBy(option)}
              onSearch={(v) => {
                setColumnFilters(v);
                setIsSearchModalOpen(true);
              }}
              onAdvancedSearchOpen={() => setShowAdvancedSearchModal(true)}
            />
          )}
        {!localStorage?.relatedParty && (
          <StyledFlex alignItems="flex-start" mt="15px">
            <StyledButton
              variant="contained"
              secondary
              onClick={onSaveCustomer}
              disabled={!customer}
            >
              Save and Continue
            </StyledButton>
          </StyledFlex>
        )}
      </StyledFlex>
      <CenterModalFixed
        key={advancedSearchModalOpenId + 1}
        open={isSearchModalOpen}
        onClose={() => {
          setCustomer(null);
          setIsSearchModalOpen(false);
        }}
        actions={renderTableActions()}
        maxWidth="1150px"
      >
        <OrderCheckoutCustomerTable
          sortAndFilter={{
            data,
            sorting,
            setSorting,
            isFetching: isFetching || isLoading,
          }}
          customerSearchInput={customerSearchInput}
          setCustomerSearchInput={setCustomerSearchInput}
          selectSearchBy={selectSearchBy}
          setSelectSearchBy={setSelectSearchBy}
          setShowAdvancedSearchModal={setShowAdvancedSearchModal}
          setCustomer={setCustomer}
          onSearch={(v) => setColumnFilters(v)}
          onNewCustomer={() => toggleCreateCustomerModal(true)}
        />
      </CenterModalFixed>
      <OrderCheckoutCustomerEditModal
        customer={localStorage?.relatedParty?.[0] || customer}
        open={showDefaultCustomerDetailsModal}
        closeFunction={() => {
          setEditDetails({ personal: true, address: true });
          toggleCreateCustomerModal(false);
        }}
        isEditPersonalInformation={editDetails.personal}
        isEditAddress={editDetails.address}
        submit={onCustomerCreate}
      />
      <GoANewCustomerModal
        customer={localStorage?.relatedParty?.[0] || customer}
        open={showGoACustomerDetailsModal}
        onClose={() => {
          setEditDetails({ personal: true, address: true });
          toggleCreateCustomerModal(false);
        }}
        onSubmit={onCustomerCreate}
      />

      <AdvancedCustomerSearchModal
        key={advancedSearchModalOpenId}
        open={showAdvancedSearchModal}
        onClose={() => setShowAdvancedSearchModal(false)}
        onSubmit={onAdvanceSearch}
      />
    </>
  );
};
export default ProductOfferingsCheckoutCustomer;
