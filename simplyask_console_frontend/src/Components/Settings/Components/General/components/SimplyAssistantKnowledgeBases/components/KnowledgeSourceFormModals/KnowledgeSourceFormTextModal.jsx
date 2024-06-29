import React from 'react'
import { StyledFlex, StyledTextField } from '../../../../../../../shared/styles/styled'
import InputLabel from '../../../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel'
import FormErrorMessage from '../../../../../../AccessManagement/components/FormErrorMessage/FormErrorMessage'

const KnowledgeSourceFormTextModal = ({
  values,
  setFieldValue,
  handleBlur,
  errors,
  touched
}) => {

  const isTextInvalid = errors.source?.plainText && touched.source?.plainText

  return (
    <StyledFlex>
      <InputLabel size={16} label="Text" />
      <StyledTextField
        id="source.plainText"
        name="source.plainText"
        placeholder="Enter text..."
        variant="standard"
        value={values.source.plainText}
        onChange={(e) => setFieldValue("source.plainText", e.target.value)}
        invalid={isTextInvalid}
        onBlur={handleBlur}
        minRows={3}
        multiline
      />
      {isTextInvalid && <FormErrorMessage>{errors.source?.plainText}</FormErrorMessage>}
    </StyledFlex>
  )
}

export default KnowledgeSourceFormTextModal