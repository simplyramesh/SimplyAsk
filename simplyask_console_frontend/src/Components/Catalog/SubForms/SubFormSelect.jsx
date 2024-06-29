import Agreement from './Agreement';
import Attachment from './Attachment';
import BundledPopRelationship from './BundledPopRelationship';
import BundledProductOffering from './BundledProductOffering';
import Category from './Category';
import Channel from './Channel';
import Constraint from './Constraint';
import MarketSegment from './MarketSegment';
import Place from './Place';
import PopRelationship from './PopRelationship';
import PricingLogicAlgorithm from './PricingLogicAlgorithm';
import ProdSpecCharValueUse from './ProdSpecCharValueUse';
import ProductOffering from './ProductOffering';
import ProductOfferingPrice from './ProductOfferingPrice';
import ProductOfferingTerm from './ProductOfferingTerm';
import Tax from './Tax';

const getSubForm = (formInput, setFormInput, form) => {
  switch (form) {
  case 'agreement':
    return <Agreement formInput={formInput} setFormInput={setFormInput} />;
  case 'attachment':
    return <Attachment formInput={formInput} setFormInput={setFormInput} />;
  case 'bundledProductOffering':
    return <BundledProductOffering formInput={formInput} setFormInput={setFormInput} />;
  case 'bundledPopRelationship':
    return <BundledPopRelationship formInput={formInput} setFormInput={setFormInput} />;
  case 'category':
    return <Category formInput={formInput} setFormInput={setFormInput} />;
  case 'subCategory':
    return <Category formInput={formInput} setFormInput={setFormInput} isSubCategory />;
  case 'channel':
    return <Channel formInput={formInput} setFormInput={setFormInput} />;
  case 'constraint':
    return <Constraint formInput={formInput} setFormInput={setFormInput} />;
  case 'marketSegment':
    return <MarketSegment formInput={formInput} setFormInput={setFormInput} />;
  case 'place':
    return <Place formInput={formInput} setFormInput={setFormInput} />;
  case 'popRelationship':
    return <PopRelationship formInput={formInput} setFormInput={setFormInput} />;
  case 'pricingLogicAlgorithm':
    return <PricingLogicAlgorithm formInput={formInput} setFormInput={setFormInput} />;
  case 'productOffering':
    return <ProductOffering formInput={formInput} setFormInput={setFormInput} />;
  case 'prodSpecCharValueUse':
    return <ProdSpecCharValueUse formInput={formInput} setFormInput={setFormInput} />;
  case 'productOfferingPrice':
    return <ProductOfferingPrice formInput={formInput} setFormInput={setFormInput} />;
  case 'productOfferingTerm':
    return <ProductOfferingTerm formInput={formInput} setFormInput={setFormInput} />;
  case 'tax':
    return <Tax formInput={formInput} setFormInput={setFormInput} />;
  default:
  }
};

export default getSubForm;
