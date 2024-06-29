import { INITIATE_API_KEY, TAGS_KEY } from '../Components/shared/constants/core';

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'token',
  CART: 'cart',
};

export const ALL_TABS = {
  ALL_TEST_SUITES: 1,
  FAVORITES: 2,
  ARCHIVED: 3,
};

export const ADD_NEW_MODAL_TITLES = {
  headerTitle: 'New Test Suite',
  elementTitleName: 'Test Suite Name',
  descriptionTitleName: 'Test Suite Description',
  tagsTitleName: 'Test Suite Tags',
};

export const ADD_NEW_TEST_CASE_MODAL_TITLES = {
  headerTitle: 'New Test Case',
  elementTitleName: 'Test Case Name',
  descriptionTitleName: 'Test Case Description',
};

export const ADD_NEW_TEST_CASE_KEYS = {
  name: 'displayName',
  description: 'description',
  fetchData: 'fetchData',
  initiateApi: INITIATE_API_KEY,
};

export const ADD_NEW_TEST_SUITE_KEYS = {
  testName: 'testName',
  testDescription: 'testDescription',
  tags: TAGS_KEY,
  initiateApi: INITIATE_API_KEY,
  TEST_CASE_ID: 'testCaseId',
};

const SIMPLIASK_DOCS_BASE_URL = 'https://docs.symphona.ai';

export const WEBHOOK_DOCUMENTATION_URL = `${SIMPLIASK_DOCS_BASE_URL}/flow/executing-processes/webhooks`;
export const PAYLOAD_MAPPING_URL = `${SIMPLIASK_DOCS_BASE_URL}/general/expressions/defining-webhook-payload-mappings`;
export const FILTER_EXPRESSION_URL = `${SIMPLIASK_DOCS_BASE_URL}/general/expressions/defining-webhook-filter-expressions`;
