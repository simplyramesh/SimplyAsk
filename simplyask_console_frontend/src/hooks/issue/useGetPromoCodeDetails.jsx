import { useQuery } from '@tanstack/react-query';

import { getPromoCodeDetails } from '../../Services/axios/authAxios';

const GET_PROMO_CODE_DETAILS_KEY = 'getPromoOfferName';
export const useGetPromoCodeDetails = (promoOfferName) => {
  const { data: offer, isLoading: isPromoCodeDetailsLoading } = useQuery({
    queryKey: [GET_PROMO_CODE_DETAILS_KEY],
    queryFn: () => getPromoCodeDetails(promoOfferName),
    enabled: !!promoOfferName,
  });

  return {
    offer,
    isPromoCodeDetailsLoading,
  };
};
