import { endOfDay } from 'date-fns';
import { useFormik } from 'formik';
import { cloneDeep } from 'lodash';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import routes from '../../../../../config/routes';
import { useGetCurrentUser } from '../../../../../hooks/useGetCurrentUser';
import { useLocalStorage } from '../../../../../hooks/useLocalStorage';
import { StyledButton, StyledLoadingButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomTableIcons from '../../../../shared/REDISIGNED/icons/CustomTableIcons';
import OpenIcon from '../../../../shared/REDISIGNED/icons/svgIcons/OpenIcon';
import ConfirmationModal from '../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StyledFlex } from '../../../../shared/styles/styled';
import useGetProductOfferById from '../../../hooks/useGetProductOfferById';
import useProductCheckout from '../../../hooks/useProductCheckout';
import {
  getIsGoaProductConfigurationsEnabled,
  mapWithCustomerAndPlace,
  filterOrderItemsById, filterReqByProductId, findCategoryName, generateRandomIntegerId,
  getProductConfiguration,
  updateProductConfiguration,
} from '../../../utils/helpers';
import GoAShoppingCartOrderSummary from '../../govOfAlberta/components/GoAShoppingCartOrderSummary';
import OrderingLayout from '../OrderingLayout';
import { GOVERNMENT_OF_ALBERTA } from '../ProductOfferings';
import ProductOfferingCartBanner from '../ProductOfferingsBanners/ProductOfferingCartBanner/ProductOfferingCartBanner';
import ShoppingCartOrderSummary from '../ShoppingCart/ShoppingCartOrderSummary/ShoppingCartOrderSummary';

import AccordionCheckout from './AccordianCheckout';
import ProductOfferingsCheckoutCustomer from './ProductOfferingsCheckoutCustomer/ProductOfferingsCheckoutCustomer';
import ProductOfferingsCheckoutOrderConfigurations from './ProductOfferingsCheckoutOrderConfig/ProductOfferingsCheckoutOrderConfigurations';
import ProductOfferingsCheckoutProductConfigurations from './ProductOfferingsCheckoutProductConfig/ProductOfferingsCheckoutProductConfigurations';
import ProductOfferingsCheckoutProductReview from './ProductOfferingsCheckoutProductReview/ProductOfferingsCheckoutProductReview';
// TODO: ConfirmationModal should show up when user go back to cart without saving
const ProductOfferingsCheckout = () => {
  const { currentUser } = useGetCurrentUser();
  const navigate = useNavigate();

  const [localStorage, setLocalStorage] = useLocalStorage('cart', null);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [productConfigurations, setProductConfigurations] = useState(false);

  const isGoACustomer = currentUser?.organization?.name === GOVERNMENT_OF_ALBERTA;
  const isProductConfigEnabled = getIsGoaProductConfigurationsEnabled(isGoACustomer, localStorage?.categories);

  const formik = useFormik({
    initialValues: {
      requestedStartDate: endOfDay(new Date()),
      orderDate: endOfDay(new Date()),
      reason: '',
      description: '',
    },
    onSubmit: (values, meta) => {
      meta.resetForm({ values });
      setLocalStorage({
        ...localStorage,
        orderConfig: {
          requestedStartDate: values.requestedStartDate,
          orderDate: values.orderDate,
          description: values.description,
          reason: values.reason,
        },
      });
    },
  });
  const selectedProduct = getProductConfiguration(localStorage);

  const { product: productDetails, isFetching: isProductDetailsFetching } = useGetProductOfferById({
    ids: selectedProduct?.productOffering?.id,
    select: (data) => data,
    options: {
      enabled: isGoACustomer && !!selectedProduct?.productOffering?.id,
    },
  });

  const { checkout, isLoading: isCheckoutLoading } = useProductCheckout({
    onCheckoutSuccess: (data, variables) => {
      setLocalStorage({
        placeOrder: data,
        relatedParty: variables?.relatedParty,
        data: variables,
        productDetails,
        placedOrderCategories: localStorage?.categories,
      });
      navigate(routes.PRODUCT_OFFERINGS_CONFIRMATION, { replace: true });
    },
  });

  const handleConfirmEdit = (newValue) => setLocalStorage({ ...localStorage, ...newValue });

  const renderShoppingCartOrderSummary = () => (
    <StyledFlex pl={{ sm: '36px', md: '0px' }} backgroundColor="transparent">
      {isGoACustomer
        ? <GoAShoppingCartOrderSummary orderItems={localStorage?.data?.productOrderItem} hideProceedToCheckout />
        : <ShoppingCartOrderSummary orderItems={localStorage?.data?.productOrderItem} hideProceedToCheckout />}
    </StyledFlex>
  );

  const handleRemoveItem = (orderItemId, productId) => {
    const updatedOrderItems = filterOrderItemsById(localStorage?.data?.productOrderItem, orderItemId);
    const updatedReq = filterReqByProductId(localStorage?.req?.productOrderItem, productId);
    const categoryNames = updatedOrderItems?.map((item) => findCategoryName(localStorage?.products, item.productOffering.id));

    setLocalStorage({
      ...localStorage,
      req: { productOrderItem: updatedReq },
      data: { ...localStorage?.data, productOrderItem: updatedOrderItems },
      categories: categoryNames,
    });
  };

  const handleQuantitySelect = (quantity, orderItemId) => {
    const oldOrderItems = localStorage.data.productOrderItem || [];

    const updatedOrderItems = oldOrderItems.map((item) => (item.id === orderItemId ? { ...item, quantity } : item));

    const newLocalStorage = {
      ...localStorage,
      data: { ...localStorage?.data, productOrderItem: updatedOrderItems },
    };

    setLocalStorage(newLocalStorage);
  };

  const removeEmptyObjectValues = (obj) => Object.keys(obj).reduce((acc, key) => {
    if (obj[key]) {
      return { ...acc, [key]: obj[key] };
    }
    return acc;
  }, {});

  const handlePlaceOrder = (data) => {
    const payload = {
      id: generateRandomIntegerId(1, 99999), // TODO: BE should generate this
      externalId: data.data.externalId,
      requestedStartDate: data.orderConfig.requestedStartDate,
      orderDate: data.orderConfig.orderDate,
      productOrderItem: mapWithCustomerAndPlace(data.data.productOrderItem, data.relatedParty),
      billingAccount: {}, // TBD
      state: data.data.state,
    };

    checkout(removeEmptyObjectValues(payload));
  };

  const handleViewProfile = (customerId) => window.open(`${routes.CUSTOMER_MANAGER}/${customerId}`, '_blank');

  const onProductConfigurationSubmit = (val) => {
    const localStorageDuplicate = cloneDeep(localStorage);

    updateProductConfiguration(localStorageDuplicate, val);

    setLocalStorage(localStorageDuplicate);
    setProductConfigurations(val);
  };

  const isProductReviewExpanded = !!localStorage?.relatedParty && !!localStorage?.orderConfig;

  const renderActionBtn = (onEdit, onViewProfile) => (
    <StyledFlex direction="row" gap="0 10px" alignItems="center">
      {!!onViewProfile && (
        <StyledButton
          variant="contained"
          tertiary
          startIcon={<OpenIcon />}
          onClick={onViewProfile}
        >
          View Profile
        </StyledButton>
      )}
      <StyledButton
        variant="contained"
        tertiary
        onClick={onEdit}
        startIcon={(
          <CustomTableIcons
            icon="EDIT_OUTLINED_PENCIL"
          />
        )}
      >
        Edit
      </StyledButton>
    </StyledFlex>
  );

  const renderCheckoutDetails = () => (
    <StyledFlex pt="36px" gap="30px">
      <AccordionCheckout
        step={1}
        title="Customer"
        actionSlot={localStorage?.relatedParty
          ? (
            <>
              {renderActionBtn(
                () => {
                  formik?.dirty
                    ? setShowConfirmationModal(formik.dirty)
                    : handleConfirmEdit({ relatedParty: null });
                },
                () => handleViewProfile(localStorage?.relatedParty?.[0]?.id),
              )}
            </>
          )
          : null}
        expanded
      >
        <ProductOfferingsCheckoutCustomer
          onSaveCustomer={() => setLocalStorage({ ...localStorage, relatedParty: [selectedCustomer] })}
          onAddCustomer={(customer) => setSelectedCustomer(customer)}
          selectedCustomer={localStorage?.relatedParty?.[0] || selectedCustomer}
          onViewProfile={(customerId) => handleViewProfile(customerId)}
        />
      </AccordionCheckout>
      {isProductConfigEnabled
      && (
        <AccordionCheckout
          step={2}
          title="Product Configurations"
          actionSlot={productConfigurations
            ? renderActionBtn(
              () => {
                setProductConfigurations(null);
              },
            )
            : null}
          expanded={!!localStorage?.relatedParty}
        >
          <ProductOfferingsCheckoutProductConfigurations
            isLoading={isProductDetailsFetching}
            productDetails={productDetails}
            isConfigEditable={!productConfigurations}
            selectedProduct={selectedProduct}
            handleSubmit={onProductConfigurationSubmit}
            storedData={localStorage}
          />
        </AccordionCheckout>
      )}
      <AccordionCheckout
        step={isProductConfigEnabled ? 3 : 2}
        title="Order Configurations"
        actionSlot={localStorage?.orderConfig
          ? renderActionBtn(
            () => {
              handleConfirmEdit({ orderConfig: null });
              setShowConfirmationModal(formik.dirty);
            },
          )
          : null}
        expanded={isProductConfigEnabled ? !!productConfigurations : !!localStorage?.relatedParty}
      >
        <ProductOfferingsCheckoutOrderConfigurations
          isConfigEditable={!localStorage?.orderConfig}
          orderConfig={formik.values}
          setFieldValue={formik.setFieldValue}
          handleSubmit={formik.handleSubmit}
        />
      </AccordionCheckout>
      <AccordionCheckout
        step={isProductConfigEnabled ? 4 : 3}
        title="Product Review"
        expanded={isProductConfigEnabled
          ? (isProductReviewExpanded && !!productConfigurations)
          : isProductReviewExpanded}
      >
        <ProductOfferingsCheckoutProductReview
          title="Review the products in your cart before placing the order"
          orderItems={localStorage?.data?.productOrderItem}
          onRemoveItem={handleRemoveItem}
          onQuantitySelect={handleQuantitySelect}
        />
      </AccordionCheckout>
      <StyledLoadingButton
        variant="contained"
        secondary
        onClick={() => handlePlaceOrder(localStorage)}
        disabled={!localStorage?.relatedParty || !localStorage?.orderConfig}
        loading={isCheckoutLoading}
      >
        Place Order
      </StyledLoadingButton>
    </StyledFlex>
  );

  return (
    <>
      <ProductOfferingCartBanner />
      <OrderingLayout
        leftSlot={renderCheckoutDetails()}
        rightSlot={renderShoppingCartOrderSummary()}
        scrollableMaxWidth="987px"
      />
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onCloseModal={() => {
          setShowConfirmationModal(false);
        }}
        onSuccessClick={() => {
          formik.resetForm();
          setSelectedCustomer(null);
          handleConfirmEdit({ relatedParty: null });
          setShowConfirmationModal(false);
        }}
        alertType="WARNING"
        title="Are You Sure?"
        text="You have unsaved changes that will be lost if you switch steps. Are you sure you want to proceed?"
      />
    </>
  );
};
export default ProductOfferingsCheckout;
