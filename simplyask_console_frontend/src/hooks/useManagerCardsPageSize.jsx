import { useEffect, useState } from 'react';

import useWindowSize from './useWindowSize';

const PAGE_SIZE_WIDTHS = {
  FOUR_CARD_ROWS: 1849,
  THREE_CARD_ROWS: 1449,
  TWO_CARD_ROWS: 1009,
  ONE_CARD_ROWS: 500,
};

const PAGE_SIZE_DATASET = [
  {
    PAGE_SIZE: 24,
    PAGE_WIDTH: PAGE_SIZE_WIDTHS.FOUR_CARD_ROWS,
  },
  {
    PAGE_SIZE: 18,
    PAGE_WIDTH: PAGE_SIZE_WIDTHS.THREE_CARD_ROWS,
  },
  {
    PAGE_SIZE: 12,
    PAGE_WIDTH: PAGE_SIZE_WIDTHS.TWO_CARD_ROWS,
  },
  {
    PAGE_SIZE: 6,
    PAGE_WIDTH: PAGE_SIZE_WIDTHS.ONE_CARD_ROWS,
  },
];
function useManagerCardsPageSize() {
  const [pageSize, setPageSize] = useState();
  const size = useWindowSize();

  useEffect(() => {
    const setPageSizeUsingDataSet = () => {
      const findDataSet = PAGE_SIZE_DATASET?.find((item) => size.width > item.PAGE_WIDTH);
      setPageSize(() => findDataSet.PAGE_SIZE);
    };

    if (size?.width) {
      setPageSizeUsingDataSet();
    }
  }, [size?.width]);

  return pageSize;
}

export default useManagerCardsPageSize;
