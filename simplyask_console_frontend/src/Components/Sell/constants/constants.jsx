import { toast } from 'react-toastify';

export const PRODUCT_OFFERINGS = {
  INTERNET: 'Internet',
  TV: 'TV',
  BUNDLES: 'Bundles',
};

export const PLANS = {
  INTERNET: `${PRODUCT_OFFERINGS.INTERNET} Plans`,
  TV: `${PRODUCT_OFFERINGS.TV} Plans`,
  BUNDLES: `${PRODUCT_OFFERINGS.INTERNET} + ${PRODUCT_OFFERINGS.TV} Bundles`,
};

// TODO: Update in SO-93
export const NAV_TAB_LABELS = [
  { title: PLANS.INTERNET },
  { title: PLANS.TV },
  { title: PLANS.BUNDLES },
  { title: '' }, // NOTE: Last so it doesn't cause indentation in the tab bar
];

export const COMPANIES = {
  TELUS: { name: 'Telus', colorKey: 'telus' },
  SYMPHONA: { name: 'Symphona', colorKey: 'symphona' },
  GOVT_OF_ALBERTA: { name: 'Government of Alberta', colorKey: 'govtOfAlberta' },
};

export const SORT_OPTIONS = [
  'Relevance',
  'Best Match',
  'Alphabetical (A-Z)',
  'Alphabetical (Z-A)',
  'Price: Low to High',
  'Price: High to Low',
];

export const QUANTITIES = Array.from({ length: 10 }, (_, i) => i + 1);

export const CAROUSEL_REDUCER_ACTIONS = {
  NEXT: 'NEXT',
  PREVIOUS: 'PREVIOUS',
};

export const PRODUCT_CATEGORY_FILTER_HEADINGS = {
  NAME: 'Name',
  DESCRIPTION: 'Description',
  PRODUCT_OFFERING_ID: 'Product Offering ID',
  VALID_FROM: 'Valid From',
  VALID_TO: 'Valid To',
};

export const PRODUCT_ORDER_TOAST_OPTIONS = {
  autoClose: 6000,
  delay: 100,
  pauseOnFocusLoss: false,
  draggable: false,
  hideProgressBar: true,
  position: toast.POSITION.TOP_RIGHT,
  pauseOnHover: true,
  closeButton: false,
  closeOnClick: false,
  containerId: 'product-order-cart',
};

export const PRODUCT_ORDER_STATUS = {
  IN_PROGRESS: 'INPROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
};

export const PRODUCT_INVENTORY_STATUS_LABELS = {
  Active: 'Active',
  Suspended: 'Suspended',
  Ceased: 'Ceased',
};

export const PRODUCT_INVENTORY_STATUS = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  PENDING_ACTIVE: 'PENDING_ACTIVE',
  CANCELLED: 'CANCELLED',
  PENDING_TERMINATE: 'PENDINGTERMINATE',
  TERMINATED: 'TERMINATED',
  ABORTED: 'ABORTED',
  CREATED: 'CREATED',
};

export const PRODUCT_INVENTORY_STATUS_LABELS_REVERSE_MAP = {
  [PRODUCT_INVENTORY_STATUS.ACTIVE]: 'active',
  [PRODUCT_INVENTORY_STATUS.PENDING_ACTIVE]: 'pendingActive',
  [PRODUCT_INVENTORY_STATUS.CREATED]: 'created',
  [PRODUCT_INVENTORY_STATUS.PENDING_TERMINATE]: 'pendingTerminate',
  [PRODUCT_INVENTORY_STATUS.SUSPENDED]: 'suspended',
  [PRODUCT_INVENTORY_STATUS.TERMINATED]: 'terminated',
  [PRODUCT_INVENTORY_STATUS.ABORTED]: 'aborted',
  [PRODUCT_INVENTORY_STATUS.CANCELLED]: 'cancelled',
};

export const PRODUCT_INVENTORY_STATUS_REVERSE_MAP = (status) => {
  switch (status) {
    case PRODUCT_INVENTORY_STATUS_LABELS.Active:
      return [
        PRODUCT_INVENTORY_STATUS_LABELS_REVERSE_MAP[PRODUCT_INVENTORY_STATUS.ACTIVE],
        PRODUCT_INVENTORY_STATUS_LABELS_REVERSE_MAP[PRODUCT_INVENTORY_STATUS.PENDING_ACTIVE],
        PRODUCT_INVENTORY_STATUS_LABELS_REVERSE_MAP[PRODUCT_INVENTORY_STATUS.CREATED],
      ];
    case PRODUCT_INVENTORY_STATUS_LABELS.Suspended:
      return [
        PRODUCT_INVENTORY_STATUS_LABELS_REVERSE_MAP[PRODUCT_INVENTORY_STATUS.PENDING_TERMINATE],
        PRODUCT_INVENTORY_STATUS_LABELS_REVERSE_MAP[PRODUCT_INVENTORY_STATUS.SUSPENDED],
      ];
    case PRODUCT_INVENTORY_STATUS_LABELS.Ceased:
      return [
        PRODUCT_INVENTORY_STATUS_LABELS_REVERSE_MAP[PRODUCT_INVENTORY_STATUS.TERMINATED],
        PRODUCT_INVENTORY_STATUS_LABELS_REVERSE_MAP[PRODUCT_INVENTORY_STATUS.ABORTED],
        PRODUCT_INVENTORY_STATUS_LABELS_REVERSE_MAP[PRODUCT_INVENTORY_STATUS.CANCELLED],
      ];
    default:
      return [];
  }
};

export const PRODUCT_INVENTORY_STATUS_MAPPED_LABELS = (status) => {
  switch (status) {
    case PRODUCT_INVENTORY_STATUS.ACTIVE:
    case PRODUCT_INVENTORY_STATUS.PENDING_ACTIVE:
    case PRODUCT_INVENTORY_STATUS.CREATED:
      return PRODUCT_INVENTORY_STATUS_LABELS.Active;
    case PRODUCT_INVENTORY_STATUS.PENDING_TERMINATE:
    case PRODUCT_INVENTORY_STATUS.SUSPENDED:
      return PRODUCT_INVENTORY_STATUS_LABELS.Suspended;
    case PRODUCT_INVENTORY_STATUS.TERMINATED:
    case PRODUCT_INVENTORY_STATUS.ABORTED:
    case PRODUCT_INVENTORY_STATUS.CANCELLED:
      return PRODUCT_INVENTORY_STATUS_LABELS.Ceased;
    default:
      return '';
  }
};

export const PRODUCT_ORDER_STATUS_LABELS = {
  [PRODUCT_ORDER_STATUS.IN_PROGRESS]: 'In Progress',
  [PRODUCT_ORDER_STATUS.COMPLETED]: 'Completed',
  [PRODUCT_ORDER_STATUS.FAILED]: 'Failed',
};

export const PRODUCT_ORDER_STATUS_COLORS = (statusColors) => ({
  [PRODUCT_ORDER_STATUS.IN_PROGRESS]: statusColors.blue,
  [PRODUCT_ORDER_STATUS.COMPLETED]: statusColors.green,
  [PRODUCT_ORDER_STATUS.FAILED]: statusColors.red,
});

export const PRODUCT_INVENTORY_STATUS_COLORS = (statusColors) => ({
  [PRODUCT_INVENTORY_STATUS.ACTIVE]: statusColors.green,
  [PRODUCT_INVENTORY_STATUS.PENDING_ACTIVE]: statusColors.green,
  [PRODUCT_INVENTORY_STATUS.CREATED]: statusColors.green,
  [PRODUCT_INVENTORY_STATUS.PENDING_TERMINATE]: statusColors.yellow,
  [PRODUCT_INVENTORY_STATUS.SUSPENDED]: statusColors.yellow,
  [PRODUCT_INVENTORY_STATUS.TERMINATED]: statusColors.blue,
  [PRODUCT_INVENTORY_STATUS.ABORTED]: statusColors.blue,
  [PRODUCT_INVENTORY_STATUS.CANCELLED]: statusColors.blue,
});

export const CUSTOMER_ROLE = 'customer';

export const ORDER_DETAILS_RECEIPT_IDS = {
  MAIN: 'order-details-view-main',
  SIDE: 'order-details-side',
};
