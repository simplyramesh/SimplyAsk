import { atom } from 'recoil';

export const globalState = atom({
  key: 'globalState',
  default: {
    pages: null,
    currentPageId: null,
    permissions: null,
    recentlyViewedPages: [],
  },
});

export const defaultUsers = atom({
  key: 'defaultUsers',
  default: [],
});

export const featureFlags = atom({
  key: 'featureFlags',
  default: {
    featureFlags: [],
  },
});

export const organizationProcessTypes = atom({
  key: 'processTypes',
  default: [],
});

export const issuesCategories = atom({
  key: 'issuesCategories',
  default: [],
});

export const modifiedCurrentPageDetails = atom({
  key: 'modifiedCurrentPageDetails',
  default: {
    pageUrlPath: null,
    pageName: null,
    breadCrumbLabel: null,
    manualBreadCrumbLastEntry: null,
    clickableId: null,
    disableBreadCrumbLoading: false,
  },
});
