import { useFormik } from 'formik';
import { Fragment, useEffect, useState } from 'react';
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
  COMPANIES,
  PRODUCT_CATEGORY_FILTER_HEADINGS,
  PRODUCT_ORDER_TOAST_OPTIONS,
  SORT_OPTIONS,
} from '../../../constants/constants';
import { PRODUCT_FILTERS, DYNAMIC_PRODUCT_OFFERINGS_INITIAL_VALUES } from '../../../constants/productInitialValues';
import { PRODUCT_QUERY_KEYS } from '../../../constants/productQueryKeys';
import useAddProductCart from '../../../hooks/useAddProductCart';
import useGetDynamicProductOffers from '../../../hooks/useGetDynamicProductOffers';
import useGetProductCategories from '../../../hooks/useGetProductCategories';
import useGetProductOffers from '../../../hooks/useGetProductOffers';
import { StyledProductOfferingSearch, StyledSearchIndicator } from '../../../StyledSellManagerContent';
import {
  extractGoAProductBodyData,
  findIndexByProperty,
  getCategoryData,
  productsSelectedFiltersFormatter,
  subtotalCalculation,
} from '../../../utils/helpers';
import GoACategoriesBanner from '../../govOfAlberta/components/GoACategoriesBanner/GoACategoriesBanner';
import GoABundleCard from '../../govOfAlberta/components/GoAProductOfferCards/GoABundleCard';
import GoAShoppingCart from '../../govOfAlberta/components/GoAShoppingCart';
import GoAOfferDetailsModal from '../../govOfAlberta/components/modals/GoAOfferDetailsModal';
import GoAProductOfferingToast from '../../govOfAlberta/components/modals/GoAProductOfferingToast';
import GoABanner from '../../govOfAlberta/components/ProductOfferingsBanner/GoABanner';
import EmptyProductOfferings from '../EmptyProductOfferings';
import ProductOffersLandingSection from '../ProductOfferingsLanding/ProductOffersLandingSection/ProductOffersLandingSection';
import ProductOfferingsPlanFilter from '../ProductOfferingsPlans/ProductOfferingsPlanFilters/ProductOfferingsPlanFilter';
import ProductOfferingsPlans from '../ProductOfferingsPlans/ProductOfferingsPlans';
import { StyledCartButton, StyledProductOfferToastContainer } from '../StyledProductOffers';

const GovOfAlbertaProductOfferings = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { categories, isFetching: isFetchingCategories } = useGetProductCategories({
    filterParams: {},
    options: {
      select: (data) => ({
        data,
        tabs: [
          ...(data?.map((category) => ({ title: category?.description, categoryName: category.name })) || []),
          { title: '' },
        ],
      }),
    },
  });

  const { tabValue: tabIndex, onTabChange } = useTabs(0);

  const [isHovered, setIsHovered] = useState(false);

  const [filterOptions, setFilterOptions] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [sortOptionValue, setSortOptionValue] = useState(SORT_OPTIONS[0]);
  const [offerDetailsModal, setOfferDetailsModal] = useState(null);
  const [localStorage, setLocalStorage] = useLocalStorage('cart', null);

  const productTabParam = searchParams.get('product');
  const orderTabParam = searchParams.get('order');

  const { values, setFieldValue, handleReset } = useFormik({
    enableReinitialize: true,
    initialValues: DYNAMIC_PRODUCT_OFFERINGS_INITIAL_VALUES,
  });

  const { products: categoryProducts } = useGetProductOffers({
    filterParams: {
      ...values,
      [PRODUCT_FILTERS.LIMIT]: 100,
      [PRODUCT_FILTERS.CATEGORY]: categories?.data?.find((c) => c?.description === productTabParam)?.name,
    },
    options: {
      select: (data) => getCategoryData(data, categories?.data?.find((c) => c?.description === productTabParam)?.name),
      enabled: !!productTabParam,
    },
  });

  const { products, unfilteredProducts, isFetching } = useGetDynamicProductOffers({
    queryKey: PRODUCT_QUERY_KEYS.OFFERINGS,
    filterParams: values,
    categories: categories?.data,
    select: (data, category) => ({
      [category?.name]: getCategoryData(data, category?.name),
    }),
    options: {
      enabled: categories?.data?.length > 0,
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

  const isRenderLandingPage = Object.keys(products)?.length > 0 && !orderTabParam;
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
    onTabChange(null, categories?.tabs?.length - 1);
    handleResetFilters();
  };

  useEffect(() => {
    if (isFetchingCategories) return;
    if (!productTabParam) handleClearSearchBar();

    const selectedTabIndex = findIndexByProperty(categories?.tabs || [], 'title', productTabParam);
    if (selectedTabIndex >= 0) {
      onTabChange(null, selectedTabIndex);
    }
  }, [productTabParam, isFetchingCategories]);

  const handleProductTabChange = (e, newTabIndex) => {
    setSearchParams({ product: categories?.tabs?.[newTabIndex].title });
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
            product: categories?.tabs?.find(
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
    const currProductOrderItem = value;
    const currItemPrice = currProductOrderItem?.pricePerUnit || { unit: 'month', price: 0 };
    const totalPrice = currProductOrderItem?.product?.productOfferingPrice?.reduce(
      (acc, price) => subtotalCalculation(price) + +acc,
      0
    );
    const otherCostsStr = extractGoAProductBodyData(currProductOrderItem?.product?.productOfferingPrice);
    const prevItemsTotal = localStorage?.subtotal || 0;

    const prevProductOrderItems = localStorage?.req?.productOrderItem || [];

    const payload = {
      productOrderItem: [
        ...prevProductOrderItems,
        {
          action: 'ADD',
          productOffering: {
            id: value?.product?.id,
          },
        },
      ],
    };

    setLocalStorage({
      ...localStorage,
      req: payload,
      categories: [...prevCategories, category],
      subtotal: +currItemPrice.price + +prevItemsTotal,
      products: { data: [...(localStorage?.products || []), value.product] },
    });

    toast.dismiss();
    toast(
      (props) => (
        <GoAProductOfferingToast
          name={currProductOrderItem?.title || ''}
          category={currProductOrderItem?.product?.categories?.[0]?.description || ''}
          price={currItemPrice}
          subtotal={(+totalPrice + +prevItemsTotal).toFixed(2)}
          numOfCartItems={+numOfCartItems + 1}
          onViewCart={(addedItems) => handleViewShoppingCart(addedItems)}
          otherCosts={otherCostsStr}
          onUndo={() => setLocalStorage(null)}
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
    data?.length > 0 ? (
      data?.map((product) => (
        <CardComponent
          key={product?.product?.id}
          title={product?.title}
          price={product?.pricePerUnit?.price}
          unit={product?.pricePerUnit?.unit || 'month'}
          offerExpires={product?.expiryDate}
          description={product?.description}
          body={product?.body}
          isBundle={product?.product?.isBundle}
          onLearnMore={() => {
            setOfferDetailsModal(product);
          }}
          bundledOffers={product?.bundledOffers}
          onAddToCart={localStorage?.categories?.length > 0 ? null : () => onAddToCart(product, category)}
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
        onViewAll={() => handleProductTabChange(null, findIndexByProperty(categories?.tabs || [], 'title', title))}
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
          labels={categories?.tabs || []}
          value={tabIndex}
          onChange={handleProductTabChange}
          action={renderAction()}
        />
      }
    >
      <>
        {categories?.data?.map((category, index) => (
          <TabPanel key={category?.name} value={tabIndex} index={index}>
            {renderPageSection({
              isPlan: true,
              data: categoryProducts || {},
              title: category?.description,
              category: category?.name,
              CardComponent: GoABundleCard,
              onAddToCart: handleAddToCart,
            })}
          </TabPanel>
        ))}
        <TabPanel value={tabIndex} index={categories?.tabs?.length - 1}>
          {isFetchingCategories || isFetching || isAddProductCartLoading ? (
            <Spinner inline />
          ) : (
            <>
              {isRenderShoppingCart && (
                <GoAShoppingCart
                  subtotal={localStorage?.data?.orderTotalPrice?.[0]?.price?.dutyFreeAmount?.value}
                  orderItems={localStorage?.data?.productOrderItem}
                  onRemoveItem={() => setLocalStorage(null)}
                  onRemoveAll={() => setLocalStorage(null)}
                />
              )}
              {isRenderLandingPage ? (
                <CustomScrollbar>
                  <GoABanner company={COMPANIES.GOVT_OF_ALBERTA} />
                  <GoACategoriesBanner
                    tabs={categories?.tabs || []}
                    onTabChange={(category) =>
                      handleProductTabChange(null, findIndexByProperty(categories?.tabs || [], 'title', category))
                    }
                  />
                  {categories?.data.map((category, index) => (
                    <Fragment key={index}>
                      {renderPageSection({
                        data: products?.[category?.name],
                        title: category?.description,
                        category: category?.name,
                        CardComponent: GoABundleCard,
                        onAddToCart: handleAddToCart,
                      })}
                    </Fragment>
                  ))}
                </CustomScrollbar>
              ) : null}
              {Object.keys(products)?.length === 0 ? <EmptyProductOfferings /> : null}
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

            const newSelectedFilters = fieldsArray.reduce((accFilters, field) => {
              const fieldOptions = field.fieldValue.map((filter) => ({ label: field.fieldName, value: filter }));
              return [...accFilters, ...fieldOptions];
            }, []);

            const newFilterValues = fieldsArray.reduce((accValues, field) => {
              const fieldRegexList = field.fieldValue.join('|');
              // TODO: This will need to be updated when more filter options are available from the BE
              return { ...accValues, [`${PRODUCT_FILTERS[field.fieldName.toUpperCase()]}Regex`]: fieldRegexList };
            }, {});

            toggleIsHovered(false);
            setFieldValue(PRODUCT_FILTERS.NAME_REGEX, newFilterValues[PRODUCT_FILTERS.NAME_REGEX]);
            setSelectedFilters(newSelectedFilters);
          }}
        />
        <GoAOfferDetailsModal
          open={!!offerDetailsModal}
          closeFunction={() => setOfferDetailsModal(null)}
          product={offerDetailsModal}
        />
        <StyledProductOfferToastContainer enableMultiContainer containerId={PRODUCT_ORDER_TOAST_OPTIONS.containerId} />
      </>
    </PageLayout>
  );
};

export default GovOfAlbertaProductOfferings;
