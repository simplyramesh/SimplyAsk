import { selector, selectorFamily } from 'recoil';

import { ISSUE_CATEGORIES, ISSUE_SERVICE_TICKET_TASKS_STATUSES } from '../Components/Issues/constants/core';
import { globalState, issuesCategories, modifiedCurrentPageDetails } from './index';

export const mappedGrantedPagesSelector = selector({
  key: 'mappedGrantedPages',
  get: ({ get }) => {
    const state = get(globalState);

    const {
      pages: { topMenuItems, grantedPages },
      currentPageId,
    } = state;

    const currentPageInfo = grantedPages?.find((page) => page.pageId === currentPageId);

    const { pageId, parentPageId } = currentPageInfo || {};

    return grantedPages?.map((page) => {
      const relatedTopPage = topMenuItems?.find((topPage) => topPage.topMenuItemId === page.topMenuItemId);

      const isActive = (page) => page.pageId === pageId || page.pageId === parentPageId;

      const subMenu = grantedPages
        ?.filter((p) => p.parentPageId === page.pageId)
        .map((p) => ({ ...p, isActive: isActive(p) }));

      const subPages = subMenu?.sort((a, b) => a.subMenuItemOrder - b.subMenuItemOrder);

      return {
        ...page,
        ...relatedTopPage,
        subPages,
        isActive: isActive(page),
      };
    });
  },
});

export const currentPageInfoSelector = selector({
  key: 'currentPageInfo',
  get: ({ get }) => {
    const { currentPageId } = get(globalState);
    const grantedPages = get(mappedGrantedPagesSelector);

    return grantedPages?.find((page) => page.pageId === currentPageId);
  },
});

export const recentlyViewedPagesSelector = selector({
  key: 'recentlyViewedPagesSelector',
  get: ({ get }) => get(globalState).recentlyViewedPages,
  set: ({ set }, newValue) =>
    set(globalState, (prevValue) => ({
      ...prevValue,
      recentlyViewedPages: newValue,
    })),
  dangerouslyAllowMutability: true,
});

export const getFalloutTicketsCategory = selector({
  key: 'falloutTicketsCategory',
  get: ({ get }) => {
    const issueCategoriesConfig = get(issuesCategories);

    return issueCategoriesConfig?.find((category) => category.name === ISSUE_CATEGORIES.FALLOUT_TICKET);
  },
});

export const getFalloutTicketsType = selector({
  key: 'falloutTicketsType',
  get: ({ get }) => {
    const falloutTicketsCategory = get(getFalloutTicketsCategory);

    return falloutTicketsCategory?.types?.find((type) => type.name === ISSUE_CATEGORIES.FALLOUT_TICKET);
  },
});

export const getFalloutTicketsStatuses = selector({
  key: 'falloutTicketsStatuses',
  get: ({ get }) => {
    const falloutTicketsType = get(getFalloutTicketsType);

    return falloutTicketsType.statuses;
  },
});

export const getServiceTicketsCategory = selector({
  key: 'serviceTicketsCategory',
  get: ({ get }) => {
    const issueCategoriesConfig = get(issuesCategories);

    return issueCategoriesConfig?.find((category) => category.name === ISSUE_CATEGORIES.SERVICE_TICKET);
  },
});

export const getServiceTicketsTypes = selector({
  key: 'serviceTicketsType',
  get: ({ get }) => {
    const serviceTicketsCategory = get(getServiceTicketsCategory);

    return serviceTicketsCategory?.types;
  },
});

export const getServiceTicketsStatuses = selector({
  key: 'serviceTicketsStatuses',
  get: ({ get }) => {
    const serviceTicketsTypes = get(getServiceTicketsTypes);

    return serviceTicketsTypes.map((type) => type.statuses).flat();
  },
});

export const getServiceTicketTasksCategory = selector({
  key: 'serviceTicketTasksCategory',
  get: ({ get }) => {
    const issueCategoriesConfig = get(issuesCategories);

    return issueCategoriesConfig?.find((category) => category.name === ISSUE_CATEGORIES.SERVICE_TICKET_TASK);
  },
});

export const getServiceTaskStatusesByType = selectorFamily({
  key: 'serviceTaskStatusesByType',
  get:
    ({ relatedTypeName }) =>
    ({ get }) => {
      const serviceTicketTasksCategory = get(getServiceTicketTasksCategory);

      return serviceTicketTasksCategory?.types?.find((type) => type.name === relatedTypeName)?.statuses || [];
    },
});

export const getServiceTaskAllStatuses = selector({
  key: 'serviceTaskStatusesByType',
  get: ({ get }) => {
    const serviceTicketTasksCategory = get(getServiceTicketTasksCategory);

    return serviceTicketTasksCategory?.types?.map((type) => type.statuses)?.flat() || [];
  },
});

export const getServiceTaskIncompleteStatuses = selector({
  key: 'serviceTaskIncompleteStatuses',
  get: ({ get }) => {
    const serviceTicketTasksStatuses = get(getServiceTaskAllStatuses);

    return serviceTicketTasksStatuses?.filter(
      (status) => status.name === ISSUE_SERVICE_TICKET_TASKS_STATUSES.INCOMPLETE
    );
  },
});

export const getServiceTaskTypes = selector({
  key: 'serviceTicketTasksTypes',
  get: ({ get }) => {
    const serviceTicketTasksCategory = get(getServiceTicketTasksCategory);

    return serviceTicketTasksCategory.types;
  },
});

export const modifiedCurrentPageDetailsSelector = selector({
  key: 'modifiedCurrentPageSelector',
  get: ({ get }) => get(modifiedCurrentPageDetails),
  set: (
    { set },
    { pageUrlPath, pageName, breadCrumbLabel, manualBreadCrumbLastEntry, clickableId, disableBreadCrumbLoading }
  ) =>
    set(modifiedCurrentPageDetails, {
      pageUrlPath,
      pageName,
      breadCrumbLabel,
      manualBreadCrumbLastEntry,
      clickableId,
      disableBreadCrumbLoading,
    }),
});
