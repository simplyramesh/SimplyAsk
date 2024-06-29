import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useLocalStorage } from '../../../../../../hooks/useLocalStorage';
import FormErrorMessage from '../../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomTableIcons from '../../../../../shared/REDISIGNED/icons/CustomTableIcons';
import { StyledTooltip } from '../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import Spinner from '../../../../../shared/Spinner/Spinner';
import { StyledFlex, StyledText, StyledTextField } from '../../../../../shared/styles/styled';
import { getProductConfiguration } from '../../../../utils/helpers';

const ProductOfferingsCheckoutProductConfigurations = ({
  productDetails, isLoading, isConfigEditable, selectedProduct, handleSubmit,
}) => {
  const [localStorage] = useLocalStorage('cart');
  const productConfigDynamicFields = productDetails?.[0]?.productSpecification?.productSpecCharacteristic || [];

  const getInitialValues = () => {
    const initialValues = {};
    const localStorageConfigurations = getProductConfiguration(localStorage)?.product?.productCharacteristic;
    const configKeys = localStorageConfigurations?.map((item) => item.name) || [];

    productConfigDynamicFields?.forEach((item) => {
      if (configKeys?.includes(item.name)) {
        const fieldValue = localStorageConfigurations?.find((obj) => obj.name === item.name);
        initialValues[item.name] = fieldValue?.value || '';
      }

      if (!initialValues[item.name]?.length > 0) {
        initialValues[item.name] = item?.productSpecCharacteristicValue?.[0]?.value || '';
      }
    });

    return initialValues;
  };

  const getValidationSchema = () => {
    const schema = {};
    const MIN_CARDINALITY_FOR_REQUIRED_FIELD = 1;

    productConfigDynamicFields?.forEach((item) => {
      if (item.minCardinality < MIN_CARDINALITY_FOR_REQUIRED_FIELD) return;

      schema[item.name] = Yup.string()
        .required(`${item.name} is required`);
    });

    return Yup.object(schema);
  };

  const {
    values, setFieldValue, submitForm, errors, touched,
  } = useFormik({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    validationSchema: getValidationSchema(),
    onSubmit: (val, meta) => {
      meta.resetForm({ val });
      handleSubmit(val);
    },
  });

  const renderLabelWithTooltip = (labelTitle, tooltipTitle) => (
    <StyledFlex direction="row">
      <StyledText size={16} weight={600} lh={24}>{labelTitle}</StyledText>
      <StyledTooltip title={tooltipTitle} arrow placement="top" size="12px" lh="1.5" weight="500" radius="67px">
        <CustomTableIcons icon="INFO" width={16} display="inline" margin="4px 0 0 10px" style={{ zIndex: 0 }} />
      </StyledTooltip>
    </StyledFlex>
  );

  const renderTextInputWithLabel = (item, toolTipTitle = 'Lorum Ipsum') => (
    <StyledFlex gap="10px" width="100%" key={item.id}>
      {renderLabelWithTooltip(item.name, toolTipTitle)}
      <StyledFlex position="relative" flex="auto">
        {isConfigEditable
          ? (
            <>
              <StyledTextField
                name={item.name}
                placeholder={`Enter ${item.name}...`}
                value={values[item.name] || ''}
                onChange={(e) => setFieldValue(item.name, e.target.value)}
                variant="standard"
                isDisabled={!item.configurable}
                invalid={errors[item.name] && touched[item.name]}
              />
              {(errors[item.name] && touched[item.name]) && <FormErrorMessage>{errors[item.name]}</FormErrorMessage>}
            </>

          ) : <StyledText size={16} lh={24}>{values[item.name]}</StyledText>}
      </StyledFlex>
    </StyledFlex>
  );

  const productFieldsLength = productConfigDynamicFields?.length;

  const isEvenNumberFields = productFieldsLength % 2 === 0;

  const getLastField = () => [productConfigDynamicFields?.[productFieldsLength - 1]] || [];

  return (
    <StyledFlex direction="column" gap="30px">
      {isLoading ? <Spinner inline /> : (
        <>
          <StyledFlex direction="row">
            <StyledText size={19} weight={600} lh={24}>Plan Name:</StyledText>
            <StyledText size={19} lh={24} ml={7}>{selectedProduct?.productOffering?.name}</StyledText>
          </StyledFlex>

          {isEvenNumberFields
            ? (
              <StyledFlex gap="25px" display="grid" gridTemplateColumns={isConfigEditable ? '1fr 1fr' : '1fr'}>
                {productConfigDynamicFields?.map(((item) => (
                  renderTextInputWithLabel(item)
                )))}
              </StyledFlex>
            ) : (
              <>
                <StyledFlex gap="25px" display="grid" gridTemplateColumns={isConfigEditable ? '1fr 1fr' : '1fr'}>
                  {productConfigDynamicFields?.slice(0, productFieldsLength - 1)?.map(((item) => (
                    renderTextInputWithLabel(item)
                  )))}
                </StyledFlex>
                {getLastField()?.map(((item) => (
                  renderTextInputWithLabel(item)
                )))}
              </>
            )}

          <StyledFlex alignItems="flex-start">
            {isConfigEditable && (
              <StyledButton
                secondary
                variant="contained"
                onClick={submitForm}
              >
                Save and Continue
              </StyledButton>
            )}
          </StyledFlex>
        </>
      )}
    </StyledFlex>
  );
};
export default ProductOfferingsCheckoutProductConfigurations;
