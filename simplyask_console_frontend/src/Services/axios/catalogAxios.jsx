import { CATALOG_API as axios } from './AxiosInstance';

export const getProductOffering = async (id) => {
  return axios.get(`/productOffering/${id}`);
};

export const saveProductOffering = async (productOffering) => {
  return axios.post('/productOffering', productOffering);
};

export const updateProductOffering = async (id, productOffering) => {
  return axios.patch(`/productOffering/${id}`, productOffering);
};

export const getProductOfferingPrice = async (id) => {
  return axios.get(`/productOfferingPrice/${id}`);
};

export const saveProductOfferingPrice = async (productOfferingPrice) => {
  return axios.post('/productOfferingPrice', productOfferingPrice);
};

export const updateProductOfferingPrice = async (id, productOfferingPrice) => {
  return axios.patch(`/productOfferingPrice/${id}`, productOfferingPrice);
};

export const getCategoryById = async (id) => {
  return axios.get(`/category/${id}`);
};

export const saveCategory = async (category) => {
  return axios.post('/category', category);
};

export const updateCategory = async (id, category) => {
  return axios.patch(`/category/${id}`, category);
};

export const getImportJobById = async (id) => {
  return axios.get(`/importJob/${id}`);
};

export const saveImportJob = async (importJob) => {
  return axios.post('/importJob', importJob);
};

export const updateImportJob = async (id, importJob) => {
  return axios.patch(`/importJob/${id}`, importJob);
};

export const getExportJob = async (id) => {
  return axios.get(`/exportJob/${id}`);
};

export const saveExportJob = async (exportJob) => {
  return axios.post('/exportJob', exportJob);
};

export const updateExportJob = async (id, exportJob) => {
  return axios.patch(`/exportJob/${id}`, exportJob);
};

export const saveAgreementRef = async (agreementRef) => {
  return axios.post('/CTLG_AgreementRef', agreementRef);
};

export const saveAttachmentRefOrValue = async (attachmentRefOrValue) => {
  return axios.post('/CTLG_AttachmentRefOrValue', attachmentRefOrValue);
};

export const saveProductOfferingRef = async (productOfferingRef) => {
  return axios.post('/CTLG_ProductOfferingRef', productOfferingRef);
};

export const saveBundledProductOffering = async (bundledProductOffering) => {
  return axios.post('/CTLG_BundledProductOffering', bundledProductOffering);
};

export const saveBundledPopRelationship = async (bundledPopRelationship) => {
  return axios.post('/CTLG_BundledProductOfferingPriceRelationship', bundledPopRelationship);
};

export const saveCategoryRef = async (category) => {
  return axios.post('/CTLG_CategoryRef', category);
};

export const saveChannel = async (channel) => {
  return axios.post('/CTLG_ChannelRef', channel);
};

export const saveConstraint = async (constraint) => {
  return axios.post('/CTLG_ConstraintRef', constraint);
};

export const saveMarketSegment = async (marketSegment) => {
  return axios.post('/CTLG_MarketSegmentRef', marketSegment);
};

export const savePlace = async (place) => {
  return axios.post('/CTLG_PlaceRef', place);
};

export const savePricingLogicAlgorithm = async (pricingLogicAlgorithm) => {
  return axios.post('/CTLG_PricingLogicAlgorithm', pricingLogicAlgorithm);
};

export const savePopRelationship = async (popRelationship) => {
  return axios.post('/CTLG_ProductOfferingPriceRelationship', popRelationship);
};

export const saveProdSpecCharValueUse = async (prodSpecCharValueUse) => {
  return axios.post('/CTLG_ProductSpecificationCharacteristicValueUse', prodSpecCharValueUse);
};

export const saveProductOfferingTerm = async (productOfferingTerm) => {
  return axios.post('/CTLG_ProductOfferingTerm', productOfferingTerm);
};

export const getCatalogById = async (id) => {
  return axios.get(`/catalog/${id}`);
};

export const saveCatalog = async (catalog) => {
  return axios.post('/catalog', catalog);
};

export const updateCatalog = async (id, catalog) => {
  return axios.put(`/catalog/${id}`, catalog);
};

export const getProductSpecificationById = async (id) => {
  return axios.get(`/productSpecification/${id}`);
};

export const saveProductSpecification = async (catalog) => {
  return axios.post('/productSpecification', catalog);
};

export const updateProductSpecification = async (id, catalog) => {
  return axios.put(`/productSpecification/${id}`, catalog);
};
export const saveTax = async (tax) => {
  return axios.post('/CTLG_TaxItem', tax);
};
