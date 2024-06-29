import { useTheme } from "@mui/material";
import BaseTextInput from "../../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput";
import { StyledButton } from "../../../../../shared/REDISIGNED/controls/Button/StyledButton";
import { StyledFlex, StyledText } from "../../../../../shared/styles/styled";
import EmptyTable from "../../../../AccessManagement/components/EmptyTable/EmptyTable";
import { VALIDATION_TYPE_LABELS } from "../../../../../PublicFormPage/constants/validationTypes";
import { memo, useEffect } from "react";
import { useFormik } from "formik";

const OverridableParameters = ({ environment, params, onChange }) => {
  const { colors }= useTheme();

  const getOverridenValue = (param) =>
    environment.overwrittenValues.find((overrideParam) => overrideParam.name === param.name)?.value;

  const getValue = (param) => getOverridenValue(param) ?? param.value;

  const isOverriden = (param) => getOverridenValue(param) !== undefined;

  const getParamState = () => params.map((param) => ({
    ...param,
    value: getValue(param),
  }));

  const removeNotOverridenParams = (overridenParams) => overridenParams.filter((param) => {
    const originalParam = params.find((originalParam) => originalParam.name === param.name);

    return originalParam.value !== param.value;
  });

  const { values, setFieldValue, submitForm } = useFormik({
    initialValues: {
      params: getParamState(),
    },
    onSubmit: (values) => {
      const overridenParams = removeNotOverridenParams(values.params);

      onChange(overridenParams);
    },
  });

  useEffect(() => {
    if (params.length > 0) {
      setFieldValue('params', getParamState());
    }
  }, [params]);

  const onParamChange = (paramName, value) => setFieldValue(
    'params',
    values.params.map((prevParam) =>
      prevParam.name === paramName ? { ...prevParam, value } : prevParam
    )
  );

  const setDefaultValue = (paramToDefault) => {
    setFieldValue(
      'params',
      values.params.map((overridenParam) => {
        const originalParam = params.find((originalParam) => originalParam.name === overridenParam.name);

        return paramToDefault.name === originalParam.name ? originalParam : overridenParam
      })
    );

    submitForm();
  };

  const overridenParameterCellProps = {
    p: '0 20px',
    height: '100%',
    direction: 'row',
    alignItems: 'center',
  };

  const overridenParametersHeaderCellProps = {
    ...overridenParameterCellProps,
    height: '52px',
  };

  if (params.length === 0) {
    return (
      <EmptyTable
        hideTitle
        message="There Are No Parameters. You Can Create Some in the “Default Parameters” Table"
      />
    )
  }

  return (
    <StyledFlex pl="6vw">
      <StyledFlex direction="row" borderBottom="1px solid" borderColor={colors.primary}>
        <StyledFlex {...overridenParametersHeaderCellProps} width="330px">
          <StyledText size={15} weight={600}>
            Parameter Name
          </StyledText>
        </StyledFlex>
        <StyledFlex {...overridenParametersHeaderCellProps} width="350px">
          <StyledText size={15} weight={600}>
            Data Type
          </StyledText>
        </StyledFlex>
        <StyledFlex {...overridenParametersHeaderCellProps} flex={1}>
          <StyledText size={15} weight={600}>
            Value
            <StyledText
              size={15}
              weight={600}
              color={colors.information}
              display="inline-block"
            >
              &nbsp;(Optional)
            </StyledText>
          </StyledText>
        </StyledFlex>
      </StyledFlex>
      <StyledFlex>
        { values.params.map((param, index) => (
          <StyledFlex height="85px" direction="row" alignItems="center" key={index}>
            <StyledFlex {...overridenParameterCellProps} width="330px">
              <StyledFlex gap="4px">
                <StyledText size={15}>{param.name}</StyledText>
                { isOverriden(param) && <StyledText size={15} color={colors.validationError}>Overwritten</StyledText>}
              </StyledFlex>
            </StyledFlex>

            <StyledFlex {...overridenParameterCellProps} width="350px">
              <StyledText size={15}>{VALIDATION_TYPE_LABELS[param.type]}</StyledText>
            </StyledFlex>

            <StyledFlex {...overridenParameterCellProps} flex={1}>
              <StyledFlex pt={2} direction="column" height="100%" alignItems="flex-end" width="100%" gap="6px">
                <StyledFlex width="100%">
                  <BaseTextInput
                    inputHeight="38px"
                    value={param.value}
                    onChange={(e) => onParamChange(param.name, e.target.value)}
                    name={`params[${index}].value`}
                    onBlur={submitForm}
                  ></BaseTextInput>
                </StyledFlex>

                <StyledButton
                  variant="text"
                  size="small"
                  disabled={!isOverriden(param)}
                  onClick={() => setDefaultValue(param)}
                >
                  Use Default Value
                </StyledButton>
              </StyledFlex>
            </StyledFlex>
          </StyledFlex>
        ))}
      </StyledFlex>
    </StyledFlex>
  )
};

export default memo(OverridableParameters);