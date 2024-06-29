import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import routes from '../../../../config/routes';
import { useGetCurrentUser } from '../../../../hooks/useGetCurrentUser';
import { modifiedCurrentPageDetails } from '../../../../store';
import { generateDummyBreadCrumb } from '../../../AppLayout/utils/helpers';

import DefaultProductOfferings from './ProductOfferingPages/DefaultProductOfferings';
import GovOfAlbertaProductOfferings from './ProductOfferingPages/GovOfAlbertaProductOfferings';

export const GOVERNMENT_OF_ALBERTA = 'Government of Alberta';

const ProductOfferings = () => {
  const setCurrentPageDetailsState = useSetRecoilState(modifiedCurrentPageDetails);

  const { currentUser } = useGetCurrentUser();
  const [urlSearchParams] = useSearchParams();

  useEffect(() => {
    if (urlSearchParams) {
      const productFilterType = urlSearchParams.get('product');
      const orderFilterType = urlSearchParams.get('order');

      setCurrentPageDetailsState({
        pageUrlPath: routes.PRODUCT_OFFERINGS,
        pageName: orderFilterType || productFilterType || 'Product Offerings',
        ...(productFilterType && { manualBreadCrumbLastEntry: generateDummyBreadCrumb(productFilterType) }),
        ...(orderFilterType && { manualBreadCrumbLastEntry: generateDummyBreadCrumb(orderFilterType) }),
      });
    }
  }, [urlSearchParams]);

  const getProductOfferingsPage = (org) => {
    switch (org) {
      case GOVERNMENT_OF_ALBERTA:
        return <GovOfAlbertaProductOfferings />;
      default:
        return <DefaultProductOfferings />;
    }
  };

  return getProductOfferingsPage(currentUser?.organization?.name);
};

export default ProductOfferings;
