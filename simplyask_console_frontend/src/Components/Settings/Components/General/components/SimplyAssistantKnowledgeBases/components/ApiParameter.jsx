import { StyledButton } from "../../../../../../shared/REDISIGNED/controls/Button/StyledButton";
import InputLabel from "../../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel";
import { StyledFlex, StyledIconButton, StyledText, StyledTextField } from "../../../../../../shared/styles/styled";
import { AddRounded } from '@mui/icons-material';
import TrashBinIcon from "../../../../../../shared/REDISIGNED/icons/svgIcons/TrashBinIcon";
import FormErrorMessage from "../../../../../AccessManagement/components/FormErrorMessage/FormErrorMessage";

const ApiParameter = ({
  parameterType,
  values,
  fieldName,
  setFieldValue,
  emptyParametersTitle,
  isOptional = true,
  handleBlur,
  errors,
  touched
}) => {
  const getIsParameterFieldInvalid = (idx, parameterFieldName) => errors?.[fieldName]?.[idx]?.[parameterFieldName] && touched?.[fieldName]?.[idx]?.[parameterFieldName];

  const handleAddNewParameter = () => {
    setFieldValue(fieldName, [...values[fieldName], { parameterName: '', parameterValue: '' }])
  }

  const handleParameterNameOrValueChange = (e, idx, isName) => {
    const FIELD_NAME = isName ? 'parameterName' : 'parameterValue';
    setFieldValue(
      fieldName,
      values[fieldName].map(
        (val, index) => idx === index ? { ...val, [FIELD_NAME]: e.target.value } : val
      )
    )
  }

  const handleDeleteParameter = (idx) => {
    setFieldValue(fieldName, values[fieldName].filter((val, index) => index !== idx));
  }

  return (
    <StyledFlex gap="12px">
      <StyledFlex justifyContent="space-between" display="flex" flexDirection="row">
        <StyledFlex flexDirection="row" gap="10px" alignItems="center">
          <InputLabel size={16} label={parameterType} mb={0} isOptional={isOptional} />
        </StyledFlex>
        <StyledButton
          startIcon={<AddRounded />}
          variant="text"
          onClick={handleAddNewParameter}
        >
          Add Parameter
        </StyledButton>
      </StyledFlex>
      <StyledFlex gap="10px">
        {
          values[fieldName]?.map((param, idx) => (
            <StyledFlex flexDirection="row" gap="10px" alignItems="center">
              <StyledFlex width="100%">
                <StyledTextField
                  id={idx}
                  name={fieldName}
                  placeholder="Enter Parameter Name..."
                  variant="standard"
                  value={param.parameterName}
                  onChange={(e) => handleParameterNameOrValueChange(e, idx, true)}
                  invalid={getIsParameterFieldInvalid(idx, 'parameterName')}
                  onBlur={handleBlur}
                />
                {getIsParameterFieldInvalid(idx, 'parameterName') && <FormErrorMessage>{errors?.[fieldName]?.[idx]?.parameterName}</FormErrorMessage>}
              </StyledFlex>
              <StyledFlex width="100%">
                <StyledTextField
                  id={idx}
                  name={fieldName}
                  placeholder="Enter Parameter Value..."
                  variant="standard"
                  value={param.parameterValue}
                  onChange={(e) => handleParameterNameOrValueChange(e, idx)}
                  invalid={getIsParameterFieldInvalid(idx, 'parameterValue')}
                  onBlur={handleBlur}
                />
                {getIsParameterFieldInvalid(idx, 'parameterValue') && <FormErrorMessage>{errors?.[fieldName]?.[idx]?.parameterValue}</FormErrorMessage>}
              </StyledFlex>
              <StyledIconButton
                size="34px"
                iconSize="18px"
                onClick={() => handleDeleteParameter(idx)}
              >
                <TrashBinIcon />
              </StyledIconButton>
            </StyledFlex>
          ))}
        {
          !!values[fieldName]?.length || (
            <StyledFlex alignItems="center" mt="30px">
              <StyledText
                weight={500}
                width="354px"
                textAlign="center"
              >
                {emptyParametersTitle}
              </StyledText>
            </StyledFlex>
          )
        }
      </StyledFlex>
    </StyledFlex>
  )
}

export default ApiParameter;