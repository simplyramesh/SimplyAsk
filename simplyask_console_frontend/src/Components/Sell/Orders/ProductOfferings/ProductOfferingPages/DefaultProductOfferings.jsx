import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import CustomScrollbar from 'react-custom-scrollbars-2';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import CartIcon from '../../../../../Assets/icons/cartIcon.svg?component';
import { useLocalStorage } from '../../../../../hooks/useLocalStorage';
import { usePopoverToggle } from '../../../../../hooks/usePopoverToggle';
import useTabs from '../../../../../hooks/useTabs';
import { ContextMenu, ContextMenuItem } from '../../../../Managers/shared/components/ContextMenus/StyledContextMenus';
import NavTabs from '../../../../shared/NavTabs/NavTabs';
import TabPanel from '../../../../shared/NavTabs/TabPanel';
import SearchIcon from '../../../../shared/REDISIGNED/icons/svgIcons/SearchIcon';
import PageLayout from '../../../../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import Spinner from '../../../../shared/Spinner/Spinner';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import {
  NAV_TAB_LABELS,
  PLANS,
  PRODUCT_CATEGORY_FILTER_HEADINGS,
  PRODUCT_OFFERINGS,
  PRODUCT_ORDER_TOAST_OPTIONS,
  SORT_OPTIONS,
} from '../../../constants/constants';
import { PRODUCT_FILTERS, PRODUCT_OFFERINGS_INITIAL_VALUES } from '../../../constants/productInitialValues';
import { PRODUCT_QUERY_KEYS } from '../../../constants/productQueryKeys';
import useAddProductCart from '../../../hooks/useAddProductCart';
import useGetProductOffers from '../../../hooks/useGetProductOffers';
import { StyledProductOfferingSearch, StyledSearchIndicator } from '../../../StyledSellManagerContent';
import {
  filterOrderItemsById,
  filterReqByProductId,
  findCategoryName,
  findIndexByProperty,
  getDefaultCategoryData,
  productsSelectedFiltersFormatter,
  transformData,
} from '../../../utils/helpers';
import OfferDetailsModal from '../Details/OfferDetailsModal';
import EmptyProductOfferings from '../EmptyProductOfferings';
import ProductOfferingsAddCartToast from '../ProductOfferingsAddCartToast/ProductOfferingsAddCartToast';
import ProductOfferingsBanner from '../ProductOfferingsBanners/ProductOfferingsBanner/ProductOfferingsBanner';
import ProductOffersCategoriesBanner from '../ProductOfferingsBanners/ProductOffersCategoriesBanner/ProductOffersCategoriesBanner';
import ProductOffersLandingSection from '../ProductOfferingsLanding/ProductOffersLandingSection/ProductOffersLandingSection';
import ProductOfferingsPlanFilter from '../ProductOfferingsPlans/ProductOfferingsPlanFilters/ProductOfferingsPlanFilter';
import ProductOfferingsPlans from '../ProductOfferingsPlans/ProductOfferingsPlans';
import ProductOfferingsBundleCard from '../ProductOffersCard/ProductOfferingsBundleCard/ProductOfferingsBundleCard';
import ProductOfferingsInternetCard from '../ProductOffersCard/ProductOfferingsInternetCard/ProductOfferingsInternetCard';
import ProductOfferingsTvCard from '../ProductOffersCard/ProductOfferingsTvCard/ProductOfferingsTvCard';
import ShoppingCart from '../ShoppingCart/ShoppingCart';
import { StyledCartButton, StyledProductOfferToastContainer } from '../StyledProductOffers';

const DefaultProductOfferings = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { tabValue: tabIndex, onTabChange } = useTabs(3);

  const [isHovered, setIsHovered] = useState(false);

  const [filterOptions, setFilterOptions] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [sortOptionValue, setSortOptionValue] = useState(SORT_OPTIONS[0]);
  const [offerDetailsModal, setOfferDetailsModal] = useState(null);
  const [localStorage, setLocalStorage] = useLocalStorage('cart', null);

  const { values, setFieldValue, handleReset } = useFormik({
    enableReinitialize: true,
    initialValues: PRODUCT_OFFERINGS_INITIAL_VALUES,
  });

  // TODO: Integrate Categories API: SO-93 - with useGetCategories hook

  const { products, unfilteredProducts, isFetching } = useGetProductOffers({
    queryKey: PRODUCT_QUERY_KEYS.OFFERINGS,
    filterParams: values,
    options: {
      select: (data) => ({
        data,
        [PRODUCT_OFFERINGS.BUNDLES]: transformData(data),
        [PRODUCT_OFFERINGS.INTERNET]: getDefaultCategoryData(data, PRODUCT_OFFERINGS.INTERNET.toLowerCase()),
        [PRODUCT_OFFERINGS.TV]: getDefaultCategoryData(data, PRODUCT_OFFERINGS.TV.toLowerCase()),
      }),
    },
  });

  const { addProductCart, isLoading: isAddProductCartLoading } = useAddProductCart({
    onAddProductSuccess: (data, variables) => {
      setLocalStorage({ ...localStorage, data: { ...localStorage?.data, ...data }, req: variables });
    },
  });

  const {
    id: sortId,
    open: isSortOpen,
    anchorEl: sortAnchorEl,
    handleClick: onSortOpen,
    handleClose: onSortOptionsClose,
  } = usePopoverToggle('products-sort-by');

  const productTabParam = searchParams.get('product');
  const orderTabParam = searchParams.get('order');

  const isRenderLandingPage = products?.data?.length > 0 && !orderTabParam;
  const isRenderShoppingCart = !!orderTabParam;
  const numOfCartItems = localStorage?.req?.productOrderItem?.length || 0;

  const toggleIsHovered = (val = null) => setIsHovered((prev) => val || !prev);

  const handleResetFilters = () => {
    setFilterOptions(null);
    setSelectedFilters([]);
    handleReset();
    toggleIsHovered(null);
  };

  const handleClearSearchBar = () => {
    onTabChange(null, 3);
    handleResetFilters();
  };

  useEffect(() => {
    if (!productTabParam) handleClearSearchBar();

    const selectedTabIndex = findIndexByProperty(NAV_TAB_LABELS, 'title', productTabParam);
    if (selectedTabIndex >= 0) {
      onTabChange(null, selectedTabIndex);
    }
  }, [productTabParam]);

  const handleProductTabChange = (e, newTabIndex) => {
    setSearchParams({ product: NAV_TAB_LABELS[newTabIndex].title });
    onTabChange(e, newTabIndex);
    handleResetFilters();
    setSortOptionValue(SORT_OPTIONS[0]);
    toggleIsHovered(false);
  };

  const handleSearchBarChange = (selectedOption) => {
    if (!selectedOption) {
      setSearchParams({});
      handleResetFilters();
      toggleIsHovered(false);
      return;
    }

    setSelectedFilters([{ label: PRODUCT_CATEGORY_FILTER_HEADINGS.NAME, value: selectedOption?.name }]);
    setFieldValue(PRODUCT_FILTERS.NAME_REGEX, selectedOption?.name);

    const newSearchParams =
      selectedOption?.categories.length > 0
        ? {
            product: NAV_TAB_LABELS.find(
              (navTab) => navTab.title.split(' ')[0].toLowerCase() === selectedOption?.categories[0]?.name
            )?.title,
          }
        : {};

    setSearchParams(newSearchParams);
  };

  const handleInputChange = (value) => {
    if (value) {
      toggleIsHovered(true);
      setFieldValue(PRODUCT_FILTERS.NAME_REGEX, value);
    }
  };

  const handleSortOption = (sortOption) => {
    // TODO: Add API request when BE is updated
    setSortOptionValue(sortOption);
    onSortOptionsClose();
  };

  const handleViewShoppingCart = (payload) => {
    setSearchParams({ order: 'Shopping Cart' });
    addProductCart(payload);
  };

  const handleAddToCart = (value, category) => {
    const prevCategories = localStorage?.categories || [];
    const isCategoryAdded = prevCategories.includes(category) || false;

    if (isCategoryAdded) return;

    const currProductOrderItem = unfilteredProducts?.data?.find((product) => product.id === value);
    const currItemPrice = currProductOrderItem?.productOfferingPrice?.[0]?.price?.dutyFreeAmount || {
      unit: 'month',
      value: 0,
    };
    const prevItemsTotal = localStorage?.subtotal || 0;

    const prevProductOrderItems = localStorage?.req?.productOrderItem || [];

    const payload = {
      productOrderItem: [
        ...prevProductOrderItems,
        {
          action: 'ADD',
          productOffering: {
            id: value,
          },
        },
      ],
    };

    setLocalStorage({
      ...localStorage,
      req: payload,
      categories: [...prevCategories, category],
      subtotal: currItemPrice.value + prevItemsTotal,
      products: unfilteredProducts,
    });

    toast.dismiss();
    toast(
      (props) => (
        <ProductOfferingsAddCartToast
          name={currProductOrderItem?.name || ''}
          category={category}
          price={currItemPrice}
          subtotal={currItemPrice.value + prevItemsTotal}
          numOfCartItems={numOfCartItems + 1}
          onViewCart={(addedItems) => handleViewShoppingCart(addedItems)}
          {...props}
        />
      ),
      PRODUCT_ORDER_TOAST_OPTIONS
    );
  };

  const handleRemoveFilter = (filterKey, filterValue) => {
    const updatedFilterValues = values[filterKey]
      .split('|')
      .filter((filter) => filter !== filterValue)
      .join('|');

    setFieldValue(filterKey, updatedFilterValues);
    setIsHovered(false);
    setSelectedFilters((prev) => prev.filter((filter) => filter.value !== filterValue));
  };

  const renderSearchBar = () => (
    <StyledFlex width={523}>
      <CustomSelect
        autoFocus
        options={unfilteredProducts?.data || []}
        name="products"
        placeholder="Search Products ..."
        onInputChange={handleInputChange}
        onChange={handleSearchBarChange}
        components={{
          DropdownIndicator: StyledSearchIndicator,
        }}
        getOptionLabel={(option) => option.name}
        getOptionValue={(option) => option.name}
        minMenuHeight={560}
        maxMenuHeight={600}
        defaultQuickValueIndex={10}
        closeMenuOnSelect
        isClearable
        alignMenu="right"
        minWidth={200}
        mb={0}
      />
    </StyledFlex>
  );

  const renderHoverableSearchArea = () => (
    <StyledCartButton variant="text" startIcon={<SearchIcon />}>
      Search Products
    </StyledCartButton>
  );

  const renderAction = () => (
    <StyledFlex>
      <StyledFlex alignItems="center" direction="row" justifyContent="space-between" gap="20px">
        <StyledProductOfferingSearch
          onClick={() => toggleIsHovered(true)}
          onBlur={() => toggleIsHovered(!!values[PRODUCT_FILTERS.NAME_REGEX])}
        >
          {!isHovered ? renderHoverableSearchArea() : renderSearchBar()}
        </StyledProductOfferingSearch>
        <StyledCartButton
          direction="row"
          startIcon={<CartIcon />}
          onClick={() => handleViewShoppingCart(localStorage?.req)}
        >
          {numOfCartItems}
        </StyledCartButton>
      </StyledFlex>
    </StyledFlex>
  );

  const renderProductCards = (data, category, CardComponent, onAddToCart) =>
    data?.[category]?.length > 0 ? (
      data?.[category]?.map((product) => (
        <CardComponent
          key={product?.product?.id}
          title={product?.title}
          price={product?.pricePerUnit?.price}
          unit={product?.pricePerUnit?.unit || 'month'}
          offerExpires={product?.expiryDate}
          description={product?.description}
          onLearnMore={() => {
            setOfferDetailsModal(product);
          }}
          bundledOffers={product?.bundledOffers}
          strikeThrough={{
            price: 85,
            unit: 'month',
          }}
          savings={{
            price: 25,
            unit: 'month'.toUpperCase(),
          }}
          onAddToCart={
            localStorage?.categories?.includes(category.toLowerCase())
              ? null
              : () => onAddToCart(product?.product?.id, product?.product?.categories?.[0]?.name)
          }
        />
      ))
    ) : (
      <EmptyProductOfferings />
    );

  const renderPageSection = ({ isPlan = false, data, title, category, CardComponent, onAddToCart }) =>
    isPlan ? (
      <CustomScrollbar>
        <ProductOfferingsPlans
          title={title}
          isSortOpen={isSortOpen}
          onSortOpen={onSortOpen}
          sortOptionValue={sortOptionValue}
          isFilterOpen={!!filterOptions}
          onFilterOpen={() => {
            setFilterOptions([
              {
                heading: PRODUCT_CATEGORY_FILTER_HEADINGS.NAME,
                content: unfilteredProducts?.[category]?.map((product) => product?.title),
              },
            ]);
          }}
          selectedFilters={selectedFilters}
          onClearFilterField={(removedFilter) => handleRemoveFilter(PRODUCT_FILTERS.NAME_REGEX, removedFilter)}
          numOfResults={products?.[category]?.length}
        >
          {renderProductCards(data, category, CardComponent, onAddToCart)}
        </ProductOfferingsPlans>
      </CustomScrollbar>
    ) : (
      <ProductOffersLandingSection
        title={title}
        onViewAll={() => handleProductTabChange(null, findIndexByProperty(NAV_TAB_LABELS, 'title', title))}
      >
        {renderProductCards(data, category, CardComponent, onAddToCart)}
      </ProductOffersLandingSection>
    );

  return (
    <PageLayout
      top={
        <NavTabs
          className="sell"
          flexWrap="nowrap"
          labels={NAV_TAB_LABELS}
          value={tabIndex}
          onChange={handleProductTabChange}
          action={renderAction()}
        />
      }
    >
      <>
        <TabPanel value={tabIndex} index={0}>
          {renderPageSection({
            isPlan: true,
            data: products,
            title: PLANS.INTERNET,
            category: PRODUCT_OFFERINGS.INTERNET,
            CardComponent: ProductOfferingsInternetCard,
            onAddToCart: handleAddToCart,
          })}
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          {renderPageSection({
            isPlan: true,
            data: products,
            title: PLANS.TV,
            category: PRODUCT_OFFERINGS.TV,
            CardComponent: ProductOfferingsTvCard,
            onAddToCart: handleAddToCart,
          })}
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          {renderPageSection({
            isPlan: true,
            data: products,
            title: PLANS.BUNDLES,
            category: PRODUCT_OFFERINGS.BUNDLES,
            CardComponent: ProductOfferingsBundleCard,
            onAddToCart: handleAddToCart,
          })}
        </TabPanel>
        <TabPanel value={tabIndex} index={3}>
          {isFetching || isAddProductCartLoading ? (
            <Spinner inline />
          ) : (
            <>
              {isRenderShoppingCart && (
                <ShoppingCart
                  subtotal={localStorage?.data?.orderTotalPrice?.[0]?.price?.dutyFreeAmount?.value}
                  orderItems={localStorage?.data?.productOrderItem}
                  onRemoveItem={(orderItemId, productId) => {
                    const updatedOrderItems = filterOrderItemsById(localStorage?.data?.productOrderItem, orderItemId);
                    const updatedReq = filterReqByProductId(localStorage?.req?.productOrderItem, productId);
                    const categoryNames = updatedOrderItems?.map((item) =>
                      findCategoryName(unfilteredProducts, item.productOffering.id)
                    );

                    setLocalStorage({
                      ...localStorage,
                      req: { productOrderItem: updatedReq },
                      data: { ...localStorage?.data, productOrderItem: updatedOrderItems },
                      categories: categoryNames,
                    });
                  }}
                  onRemoveAll={() => setLocalStorage(null)}
                />
              )}
              {isRenderLandingPage && (
                <CustomScrollbar>
                  <ProductOfferingsBanner />
                  <ProductOffersCategoriesBanner
                    onTabChange={(category) =>
                      handleProductTabChange(null, findIndexByProperty(NAV_TAB_LABELS, 'title', category))
                    }
                  />
                  {renderPageSection({
                    data: products,
                    title: PLANS.INTERNET,
                    category: PRODUCT_OFFERINGS.INTERNET,
                    CardComponent: ProductOfferingsInternetCard,
                    onAddToCart: handleAddToCart,
                  })}
                  {renderPageSection({
                    data: products,
                    title: PLANS.TV,
                    category: PRODUCT_OFFERINGS.TV,
                    CardComponent: ProductOfferingsTvCard,
                    onAddToCart: handleAddToCart,
                  })}
                  {renderPageSection({
                    data: products,
                    title: PLANS.BUNDLES,
                    category: PRODUCT_OFFERINGS.BUNDLES,
                    CardComponent: ProductOfferingsBundleCard,
                    onAddToCart: handleAddToCart,
                  })}
                </CustomScrollbar>
              )}
              {products?.data?.length === 0 && <EmptyProductOfferings />}
            </>
          )}
        </TabPanel>
        <ContextMenu
          key={sortId}
          open={isSortOpen}
          onClose={onSortOptionsClose}
          anchorEl={sortAnchorEl}
          maxWidth="-webkit-fill-available"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          marginTop="4px"
        >
          {SORT_OPTIONS.reduce(
            (acc, sortOption) =>
              sortOption === sortOptionValue
                ? acc
                : [
                    ...acc,
                    <ContextMenuItem key={sortOption} onClick={() => handleSortOption(sortOption)}>
                      <StyledText lh={20} textAlign="center" wrap="nowrap">
                        {sortOption}
                      </StyledText>
                    </ContextMenuItem>,
                  ],
            []
          )}
        </ContextMenu>
        <ProductOfferingsPlanFilter
          filterOptions={filterOptions}
          onClose={() => setFilterOptions(null)}
          onConfirm={(filters) => {
            const fieldsArray = productsSelectedFiltersFormatter(filters);

            const newSelectedFilters = fieldsArray.reduce((filters, field) => {
              const fieldOptions = field.fieldValue.map((filter) => ({ label: field.fieldName, value: filter }));
              return [...filters, ...fieldOptions];
            }, []);

            const newFilterValues = fieldsArray.reduce((values, field) => {
              const fieldRegexList = field.fieldValue.join('|');
              // TODO: This will need to be updated when more filter options are available from the BE
              return { ...values, [`${PRODUCT_FILTERS[field.fieldName.toUpperCase()]}Regex`]: fieldRegexList };
            }, {});

            toggleIsHovered(false);
            setFieldValue(PRODUCT_FILTERS.NAME_REGEX, newFilterValues[PRODUCT_FILTERS.NAME_REGEX]);
            setSelectedFilters(newSelectedFilters);
          }}
        />
        <OfferDetailsModal
          open={!!offerDetailsModal}
          closeFunction={() => setOfferDetailsModal(null)}
          product={offerDetailsModal}
        />
        <StyledProductOfferToastContainer enableMultiContainer containerId={PRODUCT_ORDER_TOAST_OPTIONS.containerId} />
      </>
    </PageLayout>
  );
};

export default DefaultProductOfferings;
